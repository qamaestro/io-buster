/* Global */

/**
 * @memberof utils
 * @type {object} 
 * @namespace utils.error 
 */

utils.error = {}

/**
 * Throw a critical exception to stop this test run.
 *  - Print out an error message in "flow.log"
 *  - Stop this test run.
 *  - Show the error message on "test status" result of Coordinator
 * 
 * @param {bool} condition - true=okay, false=error
 * @param {string} errMsg - error message
 * 
 * @function assertCritical
 * @memberof utils.error
 */
utils.error.assertCritical = function(condition, errMsg) {
    if(condition == false){
        logger.log("FLOW", `[Fail Stop] ${errMsg}`)
        throw new Error(errMsg)        
    }    
}

/**
 * Notice a warning message not to stop this test run.
 *  - Print out a warning message in "flow.log"
 * 
 * @param {bool} condition - true=okay, false=warning
 * @param {string} warnMsg - warning message
 * 
 * @function assertWarning
 * @memberof utils.error
 */
utils.error.assertWarning = function(condition, warnMsg) {
    if(condition == false){
        logger.log("FLOW", `[Warning] ${warnMsg}`)        
    }    
}