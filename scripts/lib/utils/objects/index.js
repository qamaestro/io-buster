/* Global */

/**
 * @memberof utils
 * @type {object} 
 * @namespace utils.object
 */

utils.object = {}

/**
 * Deepcopy all properies to a new object
 * 
 * @returns {object} - copied new object
 * 
 * @param {object} obj - source objet 
 * 
 * @function deepCopyObject
 * @memberof utils.error
 */
utils.object.deepCopyObject = function(obj)
{
    let clone = {};
    for(let i in obj) {
        if(obj[i] != null &&  typeof(obj[i])=="object")
            clone[i] = this.deepCopyObject(obj[i]);
        else
            clone[i] = obj[i];
    }
    return clone;
}