/* Global */

/**
 * @namespace chamber
 * @type {object}
 */
const chamber = {}

/**
 * Open a remote control connection
 *  - You must write a proper scan algorithm for your chamber
 *
 * @returns {Number} - chamber connection handler
 * 
 * @param {String} ip - IP address of a target chamber 
 * 
 * @function openConnection
 * @memberof chamber 
*/
chamber.openConnection = undefined

/**
 * Get a current temperature of a target chamber 
 *  - You must write a proper scan algorithm for your chamber
 *
 * @returns {Number} - a current temperature(Celsius degree)
 *  
 * @param {Number} handler - chamber connection handler
 *
 * @function getTemperature
 * @memberof chamber                                   
*/
chamber.getTemperature = undefined

/**
 * Set a temperature to a target chamber 
 *  - You must write a proper scan algorithm for your chamber
 *
 * @returns {Bool} - true : setting success / false : setting failure 
 * 
 * @param {Number} handler - chamber connection handler
 * @param {Number} temp - target temperature
 *
 * @function setTemperature
 * @memberof chamber
 *                                   
*/
chamber.setTemperature = undefined

/**
 * Program a temperature scenario
 *  - You must write a proper scan algorithm for your chamber
 *
 * @returns {Bool} - true : setting success / false : setting failure 
 * 
 * @param {Number} handler - chamber connection handler
 * @param {Array} tempScenario - array of objects to have temp control conditions
 *                             - {temp:{Number}, time:{Number}, soakTime:{Number}}
 *                             - temp : a target temperature at that phase
 *                             - time : temperature keeping time at that phase, minute unit
 *                             - soakTime : soaking time after changing temperature, not includes in 'time'                
 *
 * @function programTemperatureScenario
 * @memberof chamber
 *                                   
*/
chamber.programTemperatureScenario = undefined