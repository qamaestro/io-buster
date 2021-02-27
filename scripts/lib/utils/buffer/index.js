/* Global */

/**
 * @memberof utils
 * @type {object} 
 * @namespace utils.buffer 
 */

utils.buffer = {}

utils.buffer.oneBitCountArray = [
  0, 1, 1, 2, 1, 2, 2, 3, 1, 2, 2, 3, 2, 3, 3, 4,
  1, 2, 2, 3, 2, 3, 3, 4, 2, 3, 3, 4, 3, 4, 4, 5,
  1, 2, 2, 3, 2, 3, 3, 4, 2, 3, 3, 4, 3, 4, 4, 5,
  2, 3, 3, 4, 3, 4, 4, 5, 3, 4, 4, 5, 4, 5, 5, 6,
  1, 2, 2, 3, 2, 3, 3, 4, 2, 3, 3, 4, 3, 4, 4, 5,
  2, 3, 3, 4, 3, 4, 4, 5, 3, 4, 4, 5, 4, 5, 5, 6,
  2, 3, 3, 4, 3, 4, 4, 5, 3, 4, 4, 5, 4, 5, 5, 6,
  3, 4, 4, 5, 4, 5, 5, 6, 4, 5, 5, 6, 5, 6, 6, 7,
  1, 2, 2, 3, 2, 3, 3, 4, 2, 3, 3, 4, 3, 4, 4, 5,
  2, 3, 3, 4, 3, 4, 4, 5, 3, 4, 4, 5, 4, 5, 5, 6,
  2, 3, 3, 4, 3, 4, 4, 5, 3, 4, 4, 5, 4, 5, 5, 6,
  3, 4, 4, 5, 4, 5, 5, 6, 4, 5, 5, 6, 5, 6, 6, 7,
  2, 3, 3, 4, 3, 4, 4, 5, 3, 4, 4, 5, 4, 5, 5, 6,
  3, 4, 4, 5, 4, 5, 5, 6, 4, 5, 5, 6, 5, 6, 6, 7,
  3, 4, 4, 5, 4, 5, 5, 6, 4, 5, 5, 6, 5, 6, 6, 7,
  4, 5, 5, 6, 5, 6, 6, 7, 5, 6, 6, 7, 6, 7, 7, 8
]

/**
 * Print an assigned amount of data in a buffer from a start offset
 * 
 * 
 * @param {string} message - a header message on the top of display
 * @param {buffer} targetBuffer - a buffer to print its data
 * @param {number} startOffset - start offset in a buffer
 * @param {number} byteSize - number of bytes to display
 * @param {string} logFilename 
 * 
 * @function printBufferContents
 * @memberof utils.buffer
 */
utils.buffer.printBufferContents = function (
  message,
  targetBuffer,
  startOffset,
  byteSize,
  logFilename
) {
  var lastBufferOffset = startOffset + byteSize
  var outputString = ''

  outputString =
    '=============================================================================='
  logger.log(logFilename, outputString)
  logger.log(logFilename, message)
  logger.log(logFilename, outputString)

  var isFirstLine = true

  for (var bufIdx = startOffset; bufIdx < lastBufferOffset; bufIdx++) {
    if (bufIdx % 16 === 0) {
      if (bufIdx > 0) logger.log(logFilename, outputString)
      outputString = logger.sprintf('0x%04X | ', bufIdx)
    } else {
      if (isFirstLine) {
        var lineStartOffset = startOffset - (startOffset % 16)
        outputString = logger.sprintf('0x%04X | ', lineStartOffset)
        for (let idx = 0; idx < startOffset % 16; idx++) {
          outputString += logger.sprintf('   ')
        }

        isFirstLine = false
      }
    }

    outputString += logger.sprintf('%02X ', targetBuffer.readUInt8(bufIdx))
  }

  logger.log(logFilename, outputString)
}

/**
 * Print an assigned amount of data in a buffer from a start offset
 * 
 * @param {buffer} targetBuffer - a buffer
 * @param {number|string|object} patternOption - option for write-fill pattern  
 *   - "RANDOM" : full random pattern
 *   - "CHKBD" : checker board pattern(Skip 2 cols : 0xAA, 0xAA, 0x55, 0x55, ... )
 *   - "INCREMENT" : incremental pattern (0x00, 0x01, 0x02, ....) 
 *   - default : fixed solid pattern with a number type input
 * @param {number} [patternOption.rule] - pattern rule
 * @param {number} [patternOption.seedPattern] - 1 byte seed pattern
 * @param {number} [patternOption.ckbdSkipCols] - skipping columns for column bar checker board
 *  
 * @function fillBuffer
 * @memberof utils.buffer
 */
utils.buffer.fillBuffer = function (targetBuffer, patternOption) {

  let patternRule = null
  let patternSeed = 0
  let skipCols = 0

  if(typeof(patternOption) == 'string') {
    patternRule = patternOption
    patternSeed = 0
  } else if (typeof(patternOption) == 'object') {
    patternRule = patternRule.rule
    patternSeed = patternRule.seedPattern
    skipCols = patternRule.ckbdSkipCols
  } else if (typeof(patternOption) == 'number') {
    patternRule = "FIXED"
    patternSeed = patternOption    
  }

  utils.error.assertWarning(
    (patternRule == "RANDOM") 
    || (patternRule == "CHKBD")
    || (patternRule == "INCREMENT")
    || (patternRule == "FIXED"), 
    '[Pattern Fill Fail] not supported pattern type.\
    "RANDOM", "CHKBD", "INCREMENT", "FIXED"')

  switch (patternOption) {    
    case 'RANDOM':
      let MaxLoopIdx = targetBuffer.length / 4
      let mulFactor = Math.pow(2, 32)
      for (let Uint32Idx = 0; Uint32Idx < MaxLoopIdx; Uint32Idx++) {
        targetBuffer.writeUInt32LE(
          Math.floor(Math.random() * mulFactor),
          Uint32Idx * 4
        )
      }
      break

    case 'CHKBD':
      for (let colAdr = 0; colAdr < targetBuffer.length; colAdr++) {
        targetBuffer.writeUInt8(patternSeed, colAdr)
        if(colAdr%skipCols==0 && colAdr>0) {
          patternSeed = ~patternSeed // invert the write pattern
        }
      }
      break

    case 'INCREMENT':
      for (let colAdr = 0; colAdr < targetBuffer.length; colAdr++) {
        targetBuffer.writeUInt8((colAdr+patternSeed) & 0xff, colAdr)
      }
      break

    case 'FIXED':
    default:
      targetBuffer.fill(patternSeed)
      break
  }

  return targetBuffer
}

/**
 * Count '1' bits in a buffer
 *
 * @returns {number} - number of one bits
 * 
 * @param {buffer} targetBuffer - a buffer
 *  
 * @function countOneBitsInBuffer
 * @memberof utils.buffer
 */
utils.buffer.countOneBitsInBuffer = function (targetBuffer) {
  var counter = 0

  for (var i = 0; i < targetBuffer.length; i++) {
    counter += utils.buffer.oneBitCountArray[targetBuffer[i]]
  }

  return counter
}

/**
 * Comparision result of one byte in two buffers
 * 
 * @typedef byteDiffInfo
 * @type {object}
 * @property {number} offset - byte offset of the different pattern in the two buffers
 * @property {number[]} data - different pattern data [buffer1, buffer2]
 * @property {number[]} bitDiff - different bit information in the byte\
 *                              - "O" : zero bit fail, source 1 --> Compare 0\
 *                              - "Z" : one bit fail, source 0 --> Compare 1\
 *                              - "." : identical bit
 * @memberof utils.buffer
 */

 /**
 * Comparision results of all bytes in two buffers
 * 
 * @typedef bufDiffInfo
 * @type {object}
 * @property {number[]} ioDiffCounters - different bit counters per each bit position
 * @property {byteDiffInfo[]} diffInfo - an array of different byte information
 * @memberof utils.buffer
 */

/**
 * Compare data in two buffers
 *
 * @returns {bufDiffInfo} - pattern compare results of two buffers
 * 
 * @param {buffer} srcBuf - original(source) buffer
 * @param {buffer} compBuf - comparing buffer
 * @param {number} compOffset - the offset to start comparing
 * @param {number} compSize - comparing size
 *  
 * @function compareTwoBuffers
 * @memberof utils.buffer
 */
utils.buffer.compareTwoBuffers = function (srcBuf, compBuf, compOffset, compSize) {

  utils.error.assertCritical((srcBuf.length == compBuf.length), 
    '[Pattern Compare Fail] Length of two buffers must be same.')

  const diffResult = {}

  let buff1Data = 0
  let buff2Data = 0
  let xorResult = 0
  let xorBit = 0

  const lastByte = compOffset + compSize
  if(lastByte > srcBuf.length) {
    lastByte = srcBuf.length
  }

  // DiffResult.XorResult    = new Buffer(Buff1.length);
  diffResult.ioDiffCounters = [0, 0, 0, 0, 0, 0, 0, 0]
  diffResult.diffInfo = []

  for (let bufOffset = compOffset; 
    bufOffset < lastByte; 
    bufOffset++) {

    buff1Data = srcBuf.readUInt8(bufOffset)
    buff2Data = compBuf.readUInt8(bufOffset)

    xorResult = buff1Data ^ buff2Data    

    if (buff1Data !== buff2Data) {

      const newDiff = {}

      newDiff.offset = bufOffset
      newDiff.data = [buff1Data, buff2Data]
      newDiff.bitDiff = []

      for (let bitIdx = 0; bitIdx < 8; bitIdx++) {
        xorBit = (xorResult >> bitIdx) & 0x1

        if (xorBit === 1) {
          const oriBit = (buff1Data >> bitIdx) & 0x1
          oriBit === 1 ? newDiff.bitDiff.push('O') : newDiff.bitDiff.push('Z')
          diffResult.ioDiffCounters[bitIdx]++
        } else {
          newDiff.bitDiff.push('.')
        }
      }
      diffResult.diffInfo.push(newDiff)
    }
  }
  return diffResult
}
