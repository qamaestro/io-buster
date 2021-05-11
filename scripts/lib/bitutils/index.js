const bitutils = {}

/**
 * bitShiftToRight
 * @param {number} data         original number
 * @param {number} numShiftBit  number of bits to shift to the right
 */

bitutils.runBitsRightShift = function (data, numShiftBit) {
  var ret = Math.floor(data / Math.pow(2, numShiftBit))

  return ret
}

bitutils.mergeBigInteger = function (numArray) {
  let mergedInt = 0n

  for (let i = 0; i < numArray.length; i++) {
    mergedInt |= BigInt(numArray[i] << (32 * i))
  }

  return mergedInt
}

bitutils.convertBitArrayToDec = function (list) {
  list.reverse()
  var sumVal = 0
  var curVal = 0
  for (var i = 0; i < list.length; i++) {
    curVal = Math.pow(2, i) * list[i]
    sumVal += curVal
  }
  list.reverse()
  return sumVal
}
