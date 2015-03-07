/**
 * Created by adamdill on 2/23/15.
 */
(function(window) {

    var Sudoku = function() {
        var self = this;

        //
        //  SOLVE
        //
        this.solve = function(arr, debugFunction) {
            trace("Starting Solve...");

            // early exit if not a valid size
            if(!validateSize(arr.length)) { return arr; }


            var returnValue;
            var cells = createCellsFromArray(arr);
            var generatedArray = [];


            // loop as long as our last iteration created a change, and the puzzle is not solved
            var hasChanged = true;
            var notSolved = true;
            var len = cells.length;
            while(hasChanged && notSolved) {
                var iterativeChange = false;
                for(var i = 0; i < len; i++) {
                    var cell = cells[i];
                    var prevValue = cell.getValue();
                    if(prevValue === 0 && cell.getPossiblesLength() === 1) {
                        cell.setValue(cell.getPossiblesValue(0));

                        if(debugFunction !== undefined) {
                            var debugArr = createArrayFromCells(cells);
                            debugFunction(debugArr);
                        }
                    }
                    // TODO: only reduce on value during the first iteration and when the value has changed
                    if(cell.getValue() !== 0) {
                        var result = cell.reduceGroups();
                        if(result) {
                            iterativeChange = result;
                        }
                    }
                }
                hasChanged = iterativeChange;

                // we could be solved at this point.
                generatedArray = createArrayFromCells(cells);
                if(isSolved(generatedArray)) {
                    notSolved = false;
                }
            }

            // make sure we are solved, or else send back the original array
            if(notSolved) {
                returnValue = arr;
            } else {
                returnValue = generatedArray;
            }

            return returnValue;
        };




        //
        //  GENERATE
        //
        // TODO: generate is broken
        this.generate = function(debugFunction) {
            trace("Starting Generate...");

            var size = 81; // hard-coded for a 9x9 puzzle

            // Create the initial values
            var initialValues = [];
            // Keep track of the cells still available to be set
            var availableIndicies = [];
            for(var i = 0; i < size; i++) {
                initialValues.push(0);
                availableIndicies.push(i);
            }

            var cells = createCellsFromArray(initialValues);
            var generatedArray;

            // Loop
            var notSolved = true;
            while(notSolved) {
                // get a random index from the list
                var randomAvailableIndex = availableIndicies.splice( Math.floor(Math.random() * availableIndicies.length), 1 )[0];
                var cell = cells[randomAvailableIndex];

                var possibleIndex = Math.floor(Math.random() * cell.getPossiblesLength());
                var randomPossibleValue = cell.getPossiblesValue( possibleIndex );
                cell.setValue(randomPossibleValue);
                cell.reduceGroups();

                var debugArr = createArrayFromCells(cells);
                debugFunction(debugArr);

                // we could be solved at this point.
                generatedArray = createArrayFromCells(cells);
                var solvedArray = self.solve(generatedArray);

                // TODO: remove the availableIndicies length being zero. That is if the generator did not create a puzzle.
                if(isSolved(solvedArray) || availableIndicies.length === 0) {
                    notSolved = false;
                }
            }


            return generatedArray;
        };
    };

    var trace = function(message) {
        console.log(message);
    };

    /////////////////////////////////
    //
    //  Cell Class
    //
    /////////////////////////////////
    var Cell = function() {

        var self = this;

        /** Used for identification/debugging */
        this.index = 0;
        this.x = 0;
        this.y = 0;


        /** The Row Group this cell belongs to. */
        var _row;

        /**  The Column Group this Cell belongs to. */
        var _column;

        /** The Block Group this Cell belongs to. */
        var _block;

        /**
         * The value of the cell
         * @type {number}
         * @private
         */
        var _value = 0;
        this.debugValue = 0;
        this.getValue = function() { return _value; };
        this.setValue = function(value) {
            _value = value;
            self.debugValue = value;
        };

        /** The available values that this Cell can be set to. */
        var _possibleValues = [];
        this.debugPossibles = _possibleValues;

        /**
         * Initialize the Cell with value and mapping
         * @param value
         * @param row:Group
         * @param column:Group
         * @param block:Group
         */
        this.init = function(value, row, column, block, size) {
            _value = value;
            self.debugValue = value;
            _row = row;
            _column = column;
            _block = block;

            // Create the possibles based on the size of the board (one dimension).
            _possibleValues = [];
            for(var i = 0; i < size; i++) {
                _possibleValues.push(i+1);
            }
        };

        /**
         * Starts off the Group.reduce calls with the Cells current value
         * @returns {boolean} TRUE if a change has occurred. FALSE if no change has occurred.
         */
        this.reduceGroups = function() {
            var hasReduced = false;
            if(_row.reduce(self, _value)) {
                hasReduced = true;
            }
            if(_column.reduce(self, _value)) {
                hasReduced = true;
            }
            if(_block.reduce(self, _value)) {
                hasReduced = true;
            }
            return hasReduced;
        };

        this.getPossiblesLength = function() { return _possibleValues.length; };
        this.getPossiblesValue = function(index) { return _possibleValues[index]; };

        /**
         * Removes a possible value
         * @param value:Number - the possible value to remove
         * @returns {boolean} TRUE if a change has occurred. FALSE if no change has occurred.
         */
        this.removePossible = function(value) {
            var hasChanged = false;
            var index = _possibleValues.indexOf(value);
            if(index !== -1) {
                if(_possibleValues.length === 1) {
                    //trace("ERROR: CELL " + self.index + " ["+ self.x + "-" + self.y+ "] we are attempting to reduce our last possible value [" + _possibleValues[0] + "].");
                } else {
                    _possibleValues.splice(index, 1);
                    hasChanged = true;
                }

            }
            // if we are down to one possible value, reduce other Cells in the group
            // so they don't accidentally use it.
            if(hasChanged && _possibleValues.length === 1) {
                _row.reduce(self, _possibleValues[0]);
                _column.reduce(self, _possibleValues[0]);
                _block.reduce(self, _possibleValues[0]);
            }
            return hasChanged;
        };

        /**
         * Determine if any cell in this Cells group contains the same value. This would
         * mean the puzzle is not really solved.
         * @returns {boolean} TRUE if any other cell in the group contains the same value. FALSE
         *                    if no other cell contains the same value.
         */
        this.groupsContainDuplicate = function() {
            return (_row.contains(self, _value) ||
                    _column.contains(self, _value) ||
                    _block.contains(self, _value));
        };
    };


    /////////////////////////////////
    //
    //  Group Class
    //
    /////////////////////////////////
    var Group = function() {
        /** The Cells in this groups */
        var _cells = [];

        /**
         * Add a Cell to the list.
         * @param cell:Cell - the Cell to add to the list.
         */
        this.addCell = function(cell) {
            _cells.push(cell);
        };

        /**
         * Removes a possible value from all Cells except for the caller
         * @param caller:Cell - the Cell making the call
         * @param value:Number - the value to remove from each Cells possible value
         * @returns {boolean} TRUE if a change has occurred. FALSE if no change has occurred.
         */
        this.reduce = function(caller, value) {
            var hasChanged = false;
            var len = _cells.length;
            for(var i = 0; i < len; i++) {
                var cell = _cells[i];
                if(cell !== caller) {
                    var result = cell.removePossible(value);
                    if(result) {
                        hasChanged = result;
                    }
                }
            }
            return hasChanged;
        };

        /**
         * Determine if any Cell, with the exception of the caller, is set to the given value.
         * @param caller:Cell - the Cell make the call (will be exempt from the check.
         * @param value:Number - the value to check for
         * @returns {boolean} TRUE if a Cell is set to the value. FALSE if no Cell is set to the value.
         */
        this.contains = function(caller, value) {
            var returnValue = false;
            if(value !== 0) {
                var len = _cells.length;
                for (var i = 0; i < len; i++) {
                    var cell = _cells[i];
                    if (caller !== cell && cell.getValue() === value) {
                        returnValue = true;
                        break;
                    }
                }
            }
            return returnValue;
        }
    };


    /////////////////////////////////
    //
    //  Utility Methods
    //
    /////////////////////////////////
    /**
     * Map the objects based on a one-dimentional array of integers
     * @param arr - an array of integers representing the board
     * @returns {Array} - an Array of Cells with correct internals
     */
    var createCellsFromArray = function(arr) {
        // Puzzle Pieces
        var _blocks = [];
        var _rows = [];
        var _columns = [];
        var _cells = [];

        var len = arr.length;
        var divisor = Math.sqrt(len);

        // Start creating the objects
        for (var i = 0; i < len; i++) {

            // Create the Cell
            var cell = new Cell();

            // create the row
            var colIndex = i % divisor;
            if (colIndex === 0) {
                var rowGroup = new Group();
                _rows.push(rowGroup);
            }




            // create the column
            if(_columns.length < divisor) {
                var columnGroup = new Group();
                _columns.push(columnGroup);
            }
            var colIndex = i % divisor;



            // create the block
            var blockX = Math.ceil((colIndex + 1) / 3);
            var blockY = Math.ceil(_rows.length / 3);

            if(_blocks.length < blockY) {
                _blocks.push([]);
            }
            if(_blocks[blockY-1].length < blockX) {
                var blockGroup = new Group();
                _blocks[blockY-1][blockX-1] = blockGroup;
            }



            var currentRow = _rows[_rows.length - 1];
            var currentColumn = _columns[colIndex];
            var currentBlock = _blocks[blockY-1][blockX-1];

            // just for debugging
            cell.index = i;
            cell.x = colIndex;
            cell.y = _rows.length - 1;

            currentRow.addCell(cell);
            currentColumn.addCell(cell);
            currentBlock.addCell(cell);

            cell.init(arr[i], currentRow, currentColumn, currentBlock, divisor);

            _cells.push(cell);
        }


        return _cells;
    };

    /**
     * Create an Array of integers from an Array of Cells.
     * @param arr:Array - an Array of Cells
     * @returns {Array} an Array of integers representing the values of the provided Cells.
     */
    var createArrayFromCells = function(arr) {
        var returnValue = [];
        var len = arr.length;
        for(var i = 0; i < len; i++) {
            var cell = arr[i];
            returnValue.push(cell.getValue());
        }
        return returnValue;
    };

    /**
     * Ensure the square root of the size of the puzzle is divisible by three.
     * @param size - the size of the puzzle
     * @returns {boolean} TRUE if it is a valid size. FALSE if it is not a valid size.
     */
    var validateSize = function(size) {
        var isValid = true;
        var sqrRoot = Math.sqrt(size);
        return sqrRoot === 9;
        /*
        var divided = sqrRoot % 3;
        if(divided !== 0) {
            trace("ERROR: square root of the size needs to be divisible by three. EG. 9x9, 12x12, etc.");
            isValid = false;
        }
        return isValid;
        */
    };

    /**
     * Determine if an array is a solved puzzle. The list should not contain
     * a zero (0).
     * @param arr - an array of integers that represent the values of a puzzle
     * @returns {boolean} TRUE if the puzzle is solved. FALSE if the puzzle is not solved.
     */
    var isSolved = function(arr) {
        var returnValue = (arr.indexOf(0) === -1);
        /*
        if(returnValue) {
            // TODO: make sure the groups don't contain duplicate values
            var cells = createCellsFromArray(arr);
            var len = cells.length;
            for(var i = 0; i < len; i++) {
                var cell = cells[i];
                if(cell.groupsContainDuplicate()) {
                    returnValue = false;
                    break;
                }
            }
        }
           */
        return returnValue;
    };

    if(window.Sudoku === undefined) {
        window.Sudoku = new Sudoku();
    }

})(window);