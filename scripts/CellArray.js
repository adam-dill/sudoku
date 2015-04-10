/**
 * Created by adamdill on 3/24/15.
 */



(function(window) {

    /**
     * Create a linked CellArray from an Array of Numbers
     * @param arr
     * @constructor
     */
    var CellArray = function(initial) {
        var self = this;

        //////////////////////////////////////
        //
        //  Public Members
        //
        //////////////////////////////////////
        this.cellsArray = [];


        //////////////////////////////////////
        //
        //  Public Methods
        //
        //////////////////////////////////////

        /**
         * Populate the cellsArray list with a linked list of Cells.
         * @param arr - an Array of Numbers representing the puzzle
         * @returns {Array} - an Array of Cells linked for Sudoku
         */
        this.fromArray = function(arr) /* Array */ {

            // Early Exit
            if(arr === undefined || arr.length === 0) { return; }

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
                var cell = new Sudoku.Cell();

                // create the row
                var colIndex = i % divisor;
                if (colIndex === 0) {
                    var rowGroup = new Sudoku.Group();
                    _rows.push(rowGroup);
                }




                // create the column
                if(_columns.length < divisor) {
                    var columnGroup = new Sudoku.Group();
                    _columns.push(columnGroup);
                }



                // create the block
                var blockX = Math.ceil((colIndex + 1) / 3);
                var blockY = Math.ceil(_rows.length / 3);

                if(_blocks.length < blockY) {
                    _blocks.push([]);
                }
                if(_blocks[blockY-1].length < blockX) {
                    var blockGroup = new Sudoku.Group();
                    _blocks[blockY-1][blockX-1] = blockGroup;
                }



                var currentRow = _rows[_rows.length - 1];
                var currentColumn = _columns[colIndex];
                var currentBlock = _blocks[blockY-1][blockX-1];

                // Adding the Cell to the Groups
                currentRow.cellsArray.push(cell);
                currentColumn.cellsArray.push(cell);
                currentBlock.cellsArray.push(cell);

                // Setup
                cell.index = i;
                cell.value  = arr[i];
                cell.row    = currentRow;
                cell.column = currentColumn;
                cell.block  = currentBlock;

                _cells.push(cell);
            }


            return _cells;
        };

        this.toArray = function()/* Array<Number> */ {
            var returnValue = [];
            var len = self.cellsArray.length;
            for(var i = 0; i < len; i++) {
                var cell = self.cellsArray[i];
                returnValue.push(cell.value);
            }
            return returnValue;
        };

        this.reduce = function() /* ReduceRequestType */ {
            var returnValue = Sudoku.Enums.ReduceRequestType.NONE;
            var hasChanged;
            do {
                hasChanged = false;
                var len = self.cellsArray.length;
                for(var i = 0; i < len; i++) {
                    if(self.cellsArray[i].reduce() === true) {
                        hasChanged = true;
                    }
                }
            } while(hasChanged);

            if(hasConflicts() === true) {
                returnValue = Sudoku.Enums.ReduceRequestType.FAIL;
            } else if(isSolved() === true) {
                returnValue = Sudoku.Enums.ReduceRequestType.SUCCESS;
            } else if(hasPossibles() === true) {
                returnValue = Sudoku.Enums.ReduceRequestType.STALL;
            }
            return returnValue;
        };

        this.getCellAt = function(index) /* Cell */ {
            var returnValue;
            if(index >= 0 || index < self.cellsArray.length) {
                returnValue = self.cellsArray[index];
            }
            return returnValue;
        };

        this.length = function() /* Number */ {
            return self.cellsArray.length;
        };

        this.clone = function() /* CellArray */ {
            // TODO: There is an issue with cloning Groups and relinking cellsArray. This is really intensive. Attempt to clone manually.
            return new Sudoku.CellArray(self.toArray());
        };

        this.toString = function() /* String */ {
            return "[CellArray] [cellsArray: " + self.cellsArray + "]";
        };


        //////////////////////////////////////
        //
        //  Private Methods
        //
        //////////////////////////////////////

        // TODO: consolidate into a single method for performance

        var hasConflicts = function() /*Boolean*/ {
            var returnValue = false;
            var len = self.cellsArray.length;
            for(var i = 0; i < len; i++) {
                if(self.cellsArray[i].groupsContainDuplicates() === true ||
                    self.cellsArray[i].getPossiblesLength() === 0) {
                    returnValue = true;
                    break;
                }
            }
            return returnValue;
        };

        var isSolved = function() /*Boolean*/ {
            var returnValue = true;
            var len = self.cellsArray.length;
            for(var i = 0; i < len; i++) {
                if(self.cellsArray[i].value === 0) {
                    returnValue = false;
                    break;
                }
            }
            return returnValue;
        };

        var hasPossibles = function() /*Boolean*/ {
            var returnValue = false;
            var len = self.cellsArray.length;
            for(var i = 0; i < len; i++) {
                if(self.cellsArray[i].getPossiblesLength() > 1) {
                    returnValue = true;
                    break;
                }
            }
            return returnValue;
        };


        //////////////////////////////////////
        //
        //  Constructor Arguments
        //
        //////////////////////////////////////

        if(initial !== undefined) {
            self.cellsArray = self.fromArray(initial);
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

    window.Sudoku.CellArray = CellArray;


})(window);