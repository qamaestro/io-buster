/* Global */

/**
 * @memberof utils
 * @type {object} 
 * @namespace utils.time
 */

utils.time = {}

utils.time.globalTestStartTime = 0;
utils.time.taskTestStartTime = 0;

utils.time._isValidTimeType = function(type) {
    if(type != "global" || type != "task") {
        errorutils.assertCritical(
            false, 
            `The time type argument must be "global" or "task".\n
             "global" is to check the elasped time from sonar.setStartTime("global").\n
             "task" is to check the elasped time from sonar.setStartTime("task").`
        )
    }
    return true;
}

utils.time._isValidTimeUnit = function(unit) {
    if(unit != "day" || unit != "hr" || unit != "min" || unit != "ms") {
        errorutils.assertCritical(
            false, 
            `The time unit argument must be among "day", "hr", "min", "ms".\n
            The default time unit(no input) is a second unit.
            `
        )
    }
    return true;
}

/**
 * Set a start time to get the elasped time.
 * 
 * 
 * @param {string} type - timer type\
 *                      - "global" : global timer for the entire test run\
 *                      - "task" : task timer for the specific task run in a test
 * @function setTestStartTime
 * @memberof utils.time
 */
utils.time.setTestStartTime = function (type) {

    this._isValidTimeType(type)

    if(type == "global") {
        this.globalTestStartTime = new Date().getTime()
    } else if(type == "task") {
        this.taskTestStartTime = new Date().getTime()
    }    
}

/**
 * Set a start time to get the elasped time.
 * 
 * @returns {number} - the elasped time with the assigned time unit
 * 
 * @param {string} type - timer type\
 *                      - "global" : global timer for the entire test run\
 *                      - "task" : task timer for the specific task run in a test
 * @param {string} [unit] - timer unit, default = seconds\
 *                      - "day" : day unit return\
 *                      - "hr" : hour unit return\
 *                      - "min" : minute unit return\
 *                      - "ms" : milli-second unit return    
 *  
 * @function getTestElaspedTime
 * @memberof utils.time
 */
utils.time.getTestElaspedTime = function (type, unit) {

    this._isValidTimeType(type)
    this._isValidTimeUnit(unit)

    let curTime = new Date().getTime()
    let diffMs = 0

    if(type == "global") {
        diffMs = curTime -  this.globalTestStartTime
    } else if(type == "task") {
        diffMs = curTime -  this.taskTestStartTime
    }  

    if(unit == "day") {
        return ((diffMs/1000)/3600)/24
    } else if(unit == "hr") {
        return (diffMs/1000)/3600
    } else if(unit == "min") {
        return (diffMs/1000)/60
    } else if(unit == "ms") {
        return diffMs
    }

    // default unit = seconds
    return (curTime - this.taskTestStartTime)/1000
}

/**
 * Check if the elasped time is over
 * 
 * @returns {bool} - true:over , false:not over
 * 
 * @param {string} type - timer type\
 *                      - "global" : global timer for the entire test run\
 *                      - "task" : task timer for the specific task run in a test
 * @param {string} [unit] - timer unit, default = seconds\
 *                      - "day" : day unit return\
 *                      - "hr" : hour unit return\
 *                      - "min" : minute unit return\
 *                      - "ms" : milli-second unit return 
 * @param {number} elaspedTime - elasped time to check if it is over
 * 
 * @function isTestElaspedTimeOver
 * @memberof utils.time
 */
utils.time.isTestElaspedTimeOver = function (type, unit, elaspedTime) {
    this._isValidTimeType(type)
    this._isValidTimeUnit(unit)
    errorutils.assertCritical(
        Number.isInteger(elaspedTime), 
        "The unit of an elasped time must be an integer."
    )

    if( this.getElaspedTime(type, unit) > elaspedTime ) {
        return true
    }

    return false
}