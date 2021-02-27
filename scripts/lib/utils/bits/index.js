/**
 * @memberof utils
 * @type {object} 
 * @namespace utils.bit 
 */
utils.bit = {}

/**
 * Shift a number to right
 * 
 * @returns {number} - right-shifted data of input "data"
 * 
 * @param {number} data         original number
 * @param {number} numShiftBit  number of bits to shift to the right
 * 
 * @function runBitsRightShift
 * @memberof utils.bit
 */

utils.bit.runBitsRightShift = function (data, numShiftBit) {  
  return Math.floor(data / Math.pow(2, numShiftBit))
}

/**
 * Merge an array of 4B integers to one BigInt type
 * 
 * @returns {BigInteger} - merged Big Integer
 * 
 * @param {number[]} numArray - an array of 4B integers 
 * 
 * @function mergeBigInteger
 * @memberof utils.bit
 */
utils.bit.mergeBigInteger = function (numArray) {
  let mergedInt = 0n;

    for(let i = 0n; i < numArray.length ; i++)
    {
        mergedInt |= BigInt(numArray[i]) << (32n * i);
    }

    return mergedInt;
}

/**
 * Convert an array of binary bits to one decimal number
 * 
 * @returns {number} - converted decimal number
 * 
 * @param {array} list - an array of binary bits 
 * 
 * @function convertBitArrayToDec
 * @memberof utils.bit
 */
utils.bit.convertBitArrayToDec = function (list) {
  list.reverse()
  let sumVal = 0
  let curVal = 0
  for (let i = 0; i < list.length; i++) {
    curVal = Math.pow(2, i) * list[i]
    sumVal += curVal
  }
  list.reverse()
  return sumVal
}
