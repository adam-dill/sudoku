/**
 * Created by adamdill on 3/24/15.
 */

(function(window) {

    var Enums = function() {

        /**
         * Results of a Solve process
         *      SUCCESS - the puzzle solved
         *      STALL   - the puzzle ran out of logical moves without guessing
         *      FAIL    - conflicts exist, and the puzzle is unsolvable in its current state
         * @type {{SUCCESS: number, STALL: number, FAIL: number}}
         */
        this.ReduceRequestType = {
            NONE   : 0,
            SUCCESS: 1,
            STALL  : 2,
            FAIL   : 3
        };


    };


    if(window.Sudoku === undefined) {
        window.Sudoku = {};
    }

    window.Sudoku.Enums = new Enums();

})(window);