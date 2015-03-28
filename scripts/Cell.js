/**
 * Created by adamdill on 3/24/15.
 */


(function(window) {

    var Cell = function() {
        var self = this;

        //////////////////////////////////////
        //
        //  Public Members
        //
        //////////////////////////////////////

        this.index = -1;
        this.value = 0;
        this.possibles = [1, 2, 3, 4, 5, 6, 7, 8, 9]; // TODO: dynamically create for other dimensions

        // Groups
        this.row;
        this.column;
        this.block;


        //////////////////////////////////////
        //
        //  Public Methods
        //
        //////////////////////////////////////

        this.reduce = function() /* Boolean */ {
            var result = false;
            if(self.value !== 0) {
                result = self.row.reduce(self) || self.column.reduce(self) || self.block.reduce(self);
            }
            return result;
        };

        this.removePossible = function(value) /* Boolean */ {
            var result = false;
            var index = self.possibles.indexOf(value);
            if(index !== -1) {
                self.possibles.splice(index, 1);
                result = true;

                // TODO: This will cause issue if we ever attempt a generator
                // Setting value to the only possible value and reducing
                if(self.getPossiblesLength() === 1) {
                    self.value = self.possibles[0];
                    self.row.reduce(self);
                    self.column.reduce(self);
                    self.block.reduce(self);
                }
            }
            return result;
        };

        this.getPossiblesLength = function() /* Number */ {
            return self.possibles.length;
        };

        this.groupsContainDuplicates = function() /*Boolean*/ {
            return (self.row.contains(self) ||
                    self.column.contains(self) ||
                    self.block.contains(self));
        };

        this.clone = function() /* Cell */ {
            var cell = new Sudoku.Cell();
            cell.index = self.index;
            cell.value = self.value;
            cell.possibles = Sudoku.Utils.shallowArrayCopy(self.possibles);
            cell.row = self.row.clone();
            cell.column = self.column.clone();
            cell.block = self.block.clone();
        };

        this.toString = function() /* String */ {
            return "[Cell] [index: " + self.index + "] [value: " + self.value + "] [possibles: " + self.possibles + "]";
        };


        //////////////////////////////////////
        //
        //  Private Methods
        //
        /////////////////////////////////////

    };



    //////////////////////////////////////
    //
    //  Namespace
    //
    //////////////////////////////////////

    if(window.Sudoku === undefined) {
        window.Sudoku = {};
    }

    window.Sudoku.Cell = Cell;


})(window);