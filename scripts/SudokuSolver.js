/**
 * Created by adamdill on 2/23/15.
 *
 * Utiltiy to solve Sudoku puzzles
 *
 *      static solve(arr):Array
 *          @param arr:Array - an Array of Numbers (0-9) that are the initial puzzle. Zero (0) means an empty/unknown value.
 *          @returns [Array] an Array of Numbers representing the solved puzzle. Returns NULL if the puzzle is unsolvable.
 *
 */
(function(window) {



    var SudokuSolver = function() {
        var self = this;

        //////////////////////////////////////
        //
        //  Private Members
        //
        //////////////////////////////////////

        /** Store the states while iterating through guesses */
        var ambiguousMemento = [];

        /**
         *   static solve(arr):Array
         *          @param arr:Array - an Array of Numbers (0-9) that are the initial puzzle. Zero (0) means an empty/unknown value.
         *          @returns [Array] an Array of Numbers representing the solved puzzle. Returns NULL if the puzzle is unsolvable.
         */
        this.solve = function(arr) {
            var returnValue = null;

            // kick it off
            var cellArray = new Sudoku.CellArray(arr);
            var result = cellArray.reduce();

            if(result === Sudoku.Enums.ReduceRequestType.STALL) {
                returnValue = enterAmbiguity(cellArray);
            } else if (result === Sudoku.Enums.ReduceRequestType.SUCCESS) {
                returnValue = cellArray.toArray();
            } else if (result === Sudoku.Enums.ReduceRequestType.FAIL) {
                returnValue = null;
            } else {
                console.log("ERROR: something went wrong in SudokuSolver.solve()");
            }

            var path;
            switch(result) {
                case Sudoku.Enums.ReduceRequestType.SUCCESS:
                    path = "SUCCESS";
                    break;
                case Sudoku.Enums.ReduceRequestType.FAIL:
                    path = "FAIL";
                    break;
                case Sudoku.Enums.ReduceRequestType.STALL:
                    path = "STALL/AMBIGUOUS";
                    break;
                default :
                    path = "UNKNOWN!!!";
            }
            console.log("Initial Solve Results (Path taken): " + path);
            return returnValue;
        };

        var enterAmbiguity = function(cellArray) /* Array */ {

            // create a new state
            var state = new Sudoku.State(cellArray);
            ambiguousMemento.push(state);

            do {
                var currentState = ambiguousMemento[ambiguousMemento.length - 1];

                // First check if our current State is solved and bubble out if it is
                if(currentState.currentResult === Sudoku.Enums.ReduceRequestType.SUCCESS) {
                    break;
                }

                currentState.revert();

                // No SUCCESS. Making another guess.
                var cell = currentState.cellsArray.getCellAt(currentState.availableCellsIndices[currentState.currentCellIndex]);
                cell.value = cell.possibles[currentState.currentPossibleIndex];

                currentState.currentResult = currentState.cellsArray.reduce();

                //console.log("[state: " + (ambiguousMemento.length - 1) + "] [state status: " + currentState.currentResult + "] [cell index: " + cell.index + "] [possible: " + state.currentPossibleIndex + "/" + cell.possibles.length + " : " + cell.value);

                if(currentState.currentResult === Sudoku.Enums.ReduceRequestType.STALL) {
                    enterAmbiguity(currentState.cellsArray);
                }

                while(currentState.moveNext() === false) {
                    ambiguousMemento.pop();
                    if(ambiguousMemento.length <= 1) {
                        // All attempted and Failed
                        return null;
                    }
                }
            } while(currentState.currentResult !== Sudoku.Enums.ReduceRequestType.SUCCESS);

            var returnValue = ambiguousMemento[ambiguousMemento.length - 1].cellsArray.toArray();
            return returnValue;
        };
    };


    // NAMESPACE
    if(window.Sudoku === undefined) {
        window.Sudoku = {};
    }

    if(window.SudokuSolver === undefined) {
        window.Sudoku.SudokuSolver = new SudokuSolver();
    }

})(window);