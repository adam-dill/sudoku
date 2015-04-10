/**
 * Created by adamdill on 3/24/15.
 */

(function(window) {

    var State = function(initial) {
        var self = this;

        //////////////////////////////////////
        //
        //  Public Members
        //
        //////////////////////////////////////

        this.currentResult = Sudoku.Enums.ReduceRequestType.NONE;

        /** A copy of the current state of the Puzzle */
        this.cellsArray/* CellArray */;
        var originalArray/* CellArray */;

        /** The indicies of cellsArray that have multiple possible values */
        this.availableCellsIndices = [] /* Number */;

        /** The Cell index we are currently affecting */
        this.currentCellIndex = 0;

        /** The index of the current Cells possible values array we are currently attempting */
        this.currentPossibleIndex = 0;


        //////////////////////////////////////
        //
        //  Public Methods
        //
        //////////////////////////////////////

        /**
         * Increment the currentPossibleIndex or current Cell if needed. Return false if index is at the end of the list.
         * NOTE: this method exits early
         *
         * @return Boolean - FALSE if there are no more moves. TRUE if the move was successful
         */
        this.moveNext = function() /* Boolean */ {
            self.currentPossibleIndex++;

            // initial check
            if(self.currentCellIndex >= self.availableCellsIndices.length) { return false; }

            var cell = self.cellsArray.getCellAt(self.availableCellsIndices[self.currentCellIndex]);
            // out of possibles on this Cell
            if(self.currentPossibleIndex >= cell.possibles.length) {
                self.currentCellIndex++;
                self.currentPossibleIndex = 0;
                // EXIT if out of bounds
                if(self.currentCellIndex >= self.availableCellsIndices.length) { return false; }
            }

            return true;
        };

        /**
         * Return the CellArray to its original state
         */
        this.revert = function() /* Void */ {
            self.cellsArray = originalArray.clone();
        };

        this.toString = function() /* String */ {
            return "[State] [cellsArray: " + self.cellsArray + "] [availableCellsIndices: " + self.availableCellsIndicies + "] [currentPossibleIndex: " + self.currentPossibleIndex + "]";
        };

        //////////////////////////////////////
        //
        //  Private Methods
        //
        //////////////////////////////////////

        var populateAvailableCellIndices = function() /*void*/ {
            var len = self.cellsArray.length();
            if(len !== 0) {
                // find any cell that has more than one possible, and store its index
                for(var i = 0; i < len; i++) {
                    var cell = self.cellsArray.getCellAt(i);
                    if(cell.getPossiblesLength() > 1 && cell.value === 0) {
                        self.availableCellsIndices.push(i);
                    }
                }
            }
        };

        //////////////////////////////////////
        //
        //  Constructor Arguments
        //
        //////////////////////////////////////

        if(initial !== undefined) {
            self.cellsArray = initial.clone();
            originalArray = initial.clone();
            populateAvailableCellIndices();
        } else {
            throw("State requires a CellArray on construction.");
        }

    };

    //////////////////////////////////////
    //
    //  Namespace
    //
    //////////////////////////////////////

    if(window.Sudoku === undefined) {
        window.Sudoku = {};
    }

    window.Sudoku.State = State;

})(window);