/**
 * Created by adamdill on 3/24/15.
 */

(function(window) {

    var Group = function() {
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

        this.reduce = function(caller) /* Boolean */ {
            var result = false;
            var len = self.cellsArray.length;
            for(var i = 0; i < len; i++) {
                var cell = self.cellsArray[i];
                if(cell === caller) {
                    continue;
                }

                var didRemove = cell.removePossible(caller.value);
                if(didRemove) {
                    result = true;
                }
            }
            return result
        };

        this.contains = function(caller) /*Boolean*/ {
            var result = false;
            var len = self.cellsArray.length;
            for(var i = 0; i < len; i++) {
                if(self.cellsArray[i].value !== 0 && self.cellsArray[i] !== caller && self.cellsArray[i].value === caller.value) {
                    result = true;
                    break;
                }
            }
            return result;
        };

        // TODO: get clone functioning while preserving Cell linkage
        this.clone = function() /* Group */ {
            console.log("ERROR: cloning Groups is not working");
            return new Group();
        };

        this.toString = function() /* String */ {
            return "[Group] [cellsArray: " + self.cellsArray + "]";
        };


        //////////////////////////////////////
        //
        //  Private Methods
        //
        //////////////////////////////////////

    };




    //////////////////////////////////////
    //
    //  Namespace
    //
    //////////////////////////////////////

    if(!window.Sudoku) {
        window.Sudoku = {};
    }

    window.Sudoku.Group = Group;


})(window);