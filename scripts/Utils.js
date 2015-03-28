/**
 * Created by adamdill on 3/24/15.
 */

(function(window) {

    var Utils = function() {
        var self = this;

        this.shallowArrayCopy = function(arr) /*Array*/ {
            var returnValue = [];
            var len = arr.length;
            for(var i = 0; i < len; i++) {
                returnValue.push(arr[i]);
            }
            return returnValue;
        };

        this.gettype = function(obj) /*String*/ {
            if(obj instanceof String)      { return "string"; }
            else if(obj instanceof Array)  { return "array"; }
            else if(obj instanceof Object) { return "object"; }
            else                           { return typeof(obj); }
        }

    };


    // NAMESPACE
    if(window.Sudoku === undefined) {
        window.Sudoku = {};
    }

    window.Sudoku.Utils = new Utils();


})(window);