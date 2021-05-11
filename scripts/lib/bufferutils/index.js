/* global logger */

const bufferutils = {};

bufferutils.oneBitCountArray = [
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

bufferutils.printBufferContents = function (
  message,
  targetBuffer,
  startOffset,
  byteSize,
  logname
) {
  var lastBufferOffset = startOffset + byteSize
  var outputString = ''

  outputString =
    '=============================================================================='
  logger.log(logname, outputString)
  logger.log(logname, message)
  logger.log(logname, outputString)

  var isFirstLine = true

  for (var bufIdx = startOffset; bufIdx < lastBufferOffset; bufIdx++) {
    if (bufIdx % 16 === 0) {
      if (bufIdx > 0) logger.log(logname, outputString)
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

  logger.log(logname, outputString)
}

bufferutils.fillBuffer = function (targetBuffer, patternOption) {
  switch (patternOption) {
    case 'RANDOM':
      var MaxLoopIdx = targetBuffer.length / 4
      var mulFactor = Math.pow(2, 32)
      for (var Uint32Idx = 0; Uint32Idx < MaxLoopIdx; Uint32Idx++) {
        targetBuffer.writeUInt32LE(
          Math.floor(Math.random() * mulFactor),
          Uint32Idx * 4
        )
      }
      break

    case 'ADDRESS':
      for (var colAdr = 0; colAdr < targetBuffer.length; colAdr++) {
        targetBuffer.writeUInt8(colAdr & 0xff, colAdr)
      }
      break

    default:
      targetBuffer.fill(patternOption)
      break
  }

  return targetBuffer
}

bufferutils.countOneBitsInBuffer = function (TgtBuf) {
  var counter = 0

  for (var i = 0; i < TgtBuf.length; i++) {
    counter += bufferutils.oneBitCountArray[TgtBuf[i]]
  }

  return counter
}

bufferutils.compareTwoBuffers = function (buff1, buff2, compOffset, compSize) {
  if (buff1.length !== buff2.length) return -1

  const diffResult = {}

  let buff1Data = 0
  let buff2Data = 0
  let xorResult = 0
  let xorBit = 0

  const totalCompSize = compOffset + compSize

  // DiffResult.XorResult    = new Buffer(Buff1.length);
  diffResult.IoDependency = [0, 0, 0, 0, 0, 0, 0, 0]
  diffResult.DiffItem = []

  for (let bufOffset = compOffset; bufOffset < totalCompSize; bufOffset++) {
    buff1Data = buff1.readUInt8(bufOffset)
    buff2Data = buff2.readUInt8(bufOffset)

    xorResult = buff1Data ^ buff2Data

    // DiffResult.XorResult.writeUInt8(XorResult, BufOffset);

    if (buff1Data !== buff2Data) {
      const newDiff = {}

      newDiff.Offset = bufOffset
      newDiff.Data = [buff1Data, buff2Data]
      newDiff.BitPos = []

      for (let bitIdx = 0; bitIdx < 8; bitIdx++) {
        xorBit = (xorResult >> bitIdx) & 0x1

        if (xorBit === 1) {
          const oriBit = (buff1Data >> bitIdx) & 0x1
          oriBit === 1 ? newDiff.BitPos.push('O') : newDiff.BitPos.push('Z')
          diffResult.IoDependency[bitIdx]++
        } else {
          newDiff.BitPos.push('.')
        }
      }
      diffResult.DiffItem.push(newDiff)
    }
  }
  return diffResult
}
