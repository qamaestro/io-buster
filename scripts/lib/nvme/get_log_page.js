/* global nvme 
   This extends existing nvme library
*/

const logIdentifier = {
  ERROR_INFO: 0x01,
  SMART: 0x02,
  LOG_0xCA: 0xca, // Addtional SMART of Intel
  FIRMWARE_SLOT_INFO: 0x03,
  DRIVE_SELF_TEST: 0x06
}

/**
 * @typedef logPageCmd
 * @type {object}
 * @property {number} LID - Log Page Identifier
 *                        - This field specifies the identifier of the log page to retrieve.
 * @property {number} LSP - Log Specific Field
 *                        - If not defined for the log specified by the Log Page Identifier field, this field is reserved.
 * @property {number} RAE - Retain Asynchronous Event
 *                        - This bit specifies when to retain or clear an Asynchronous Event.
 *                          If this bit is cleared to ‘0’, the corresponding Asynchronous Event is cleared
 *                          after the command completes successfully.
 *                          If this bit is set to ‘1’, the corresponding Asynchronous Event is retained (i.e., not cleared)
 *                          after the command completes successfully.
 * @property {number} NUMDL - Number of Dwords Lower
 *                          - This field specifies the lower 16 bits of the number of dwords to return.
 *                            If host software specifies a size larger than the log page requested, the controller
 *                            returns the complete log page with undefined results for dwords beyond the end of the log page.
 *                            The combined NUMDL and NUMDU fields form a 0’s based value.
 * @property {number} NUMDU - Number of Dwords Upper
 *                          - This field specifies the upper 16 bits of the number of dwords to return.
 * @property {number} LSI - Log Specific Identifier
 *                          -This field specifies an identifier that is required for a particular log page.
 *                          The log pages that require a log specific identifier are indicated in the table below.
 * @property {number} LPOL - Log Page Offset Lower
 *                         - The log page offset specifies the location within a log page to start returning data from.
 *                           This field specifies the lower 32 bits of the log page offset.
 *                           The offset shall be dword aligned, indicated by bits 1:0 being cleared to 00b.
 * @property {number} LPOU - Log Page Offset Upper
 * @property {number} UUID - UUID index
 * @memberof nvme
 */

/**
 * Get a log page
 *
 * @param {logPageCmd} logPageCmd - array of trim ranges
 * @param {number} nsid - Namespace ID
 *
 * @function getLogPage
 * @memberof nvme
 */
nvme.getLogPage = function (logPageCmd, nsid) {
  const cmd = {}
  cmd.opc = nvme.opcode.admin.GET_LOG_PAGE
  cmd.nsid = nsid
  cmd.cdw10 =
    (logPageCmd.LID & 0xff) |
    ((logPageCmd.LSP & 0xf) << 8) |
    ((logPageCmd.RAE & 0x1) << 15) |
    ((logPageCmd.NUMD & 0xffff) << 16)

  cmd.cdw11 =
    ((logPageCmd.NUMD >> 16) & 0xffff) | ((logPageCmd.LSI & 0xffff) < 16)
  cmd.cdw12 = logPageCmd.LPOL
  cmd.cdw13 = logPageCmd.LPOU
  cmd.cdw14 = logPageCmd.UUID & 0x7f // UUID
  cmd.cdw15 = 0 // Reserved

  const readBuf = Buffer.alloc(4096)
  nvme.sendAdminCommand(cmd, readBuf, false)

  return readBuf
}

/**
 * @typedef smartLog
 * @type {object}
 * @property {number} criticalWarning
 * @property {number} compositeTemperature
 * @property {number} availableSpare
 * @property {number} availableSpareThreshold
 * @property {number} percentageUsed
 * @property {number} enduranceGroupCritical
 * @property {BigInt} dataUnitRead
 * @property {BigInt} dataUnitWritten
 * @property {BigInt} numHostReadCmd
 * @property {BigInt} numHostWriteCmd
 * @property {BigInt} controllerBusyTime
 * @property {BigInt} numPowerCycles
 * @property {BigInt} hoursPowerOn
 * @property {BigInt} numUnsafeShutdown
 * @property {BigInt} numUnrecoveredIntegrity
 * @property {BigInt} numErrLifecycle
 * @property {number} warningCompositeTempTime
 * @property {number} criticalCompositeTempTime
 * @memberof nvme
 */

/**
 * Get a curret SMART log
 *
 * @returns {smartLog} - SMART log
 *
 * @function getSmartLog
 * @memberof nvme
 */
nvme.getSmartLog = function () {
  const rawSmartLog = nvme.getLogPage(
    {
      LID: logIdentifier.SMART,
      LSP: 0,
      RAE: 0,
      NUMD: 128,
      LSI: 0,
      LPOL: 0,
      LPOU: 0,
      UUID: 0
    },
    0xffffffff
  )

  const smartLog = {}
  smartLog.criticalWarning = rawSmartLog.readUInt8(0)
  smartLog.compositeTemperature = rawSmartLog.readUInt16LE(1)
  smartLog.availableSpare = rawSmartLog.readUInt8(3)
  smartLog.availableSpareThreshold = rawSmartLog.readUInt8(4)
  smartLog.percentageUsed = rawSmartLog.readUInt8(5)
  smartLog.enduranceGroupCritical = rawSmartLog.readUInt8(6)

  smartLog.dataUnitRead = utils.bit
    .mergeBigInteger([
      rawSmartLog.readUInt32LE(32),
      rawSmartLog.readUInt32LE(36),
      rawSmartLog.readUInt32LE(40),
      rawSmartLog.readUInt32LE(44)
    ])
    .toString()

  smartLog.dataUnitWritten = utils.bit
    .mergeBigInteger([
      rawSmartLog.readUInt32LE(48),
      rawSmartLog.readUInt32LE(52),
      rawSmartLog.readUInt32LE(56),
      rawSmartLog.readUInt32LE(60)
    ])
    .toString()

  smartLog.numHostReadCmd = utils.bit
    .mergeBigInteger([
      rawSmartLog.readUInt32LE(64),
      rawSmartLog.readUInt32LE(68),
      rawSmartLog.readUInt32LE(72),
      rawSmartLog.readUInt32LE(76)
    ])
    .toString()

  smartLog.numHostWriteCmd = utils.bit
    .mergeBigInteger([
      rawSmartLog.readUInt32LE(80),
      rawSmartLog.readUInt32LE(84),
      rawSmartLog.readUInt32LE(88),
      rawSmartLog.readUInt32LE(92)
    ])
    .toString()

  smartLog.controllerBusyTime = utils.bit
    .mergeBigInteger([
      rawSmartLog.readUInt32LE(96),
      rawSmartLog.readUInt32LE(100),
      rawSmartLog.readUInt32LE(104),
      rawSmartLog.readUInt32LE(108)
    ])
    .toString()

  smartLog.numPowerCycles = utils.bit
    .mergeBigInteger([
      rawSmartLog.readUInt32LE(112),
      rawSmartLog.readUInt32LE(116),
      rawSmartLog.readUInt32LE(120),
      rawSmartLog.readUInt32LE(124)
    ])
    .toString()

  smartLog.hoursPowerOn = utils.bit
    .mergeBigInteger([
      rawSmartLog.readUInt32LE(128),
      rawSmartLog.readUInt32LE(132),
      rawSmartLog.readUInt32LE(136),
      rawSmartLog.readUInt32LE(140)
    ])
    .toString()

  smartLog.numUnsafeShutdown = utils.bit
    .mergeBigInteger([
      rawSmartLog.readUInt32LE(144),
      rawSmartLog.readUInt32LE(148),
      rawSmartLog.readUInt32LE(152),
      rawSmartLog.readUInt32LE(156)
    ])
    .toString()

  smartLog.numUnrecoveredIntegrity = utils.bit
    .mergeBigInteger([
      rawSmartLog.readUInt32LE(160),
      rawSmartLog.readUInt32LE(164),
      rawSmartLog.readUInt32LE(168),
      rawSmartLog.readUInt32LE(172)
    ])
    .toString()

  smartLog.numErrLifecycle = utils.bit
    .mergeBigInteger([
      rawSmartLog.readUInt32LE(176),
      rawSmartLog.readUInt32LE(180),
      rawSmartLog.readUInt32LE(184),
      rawSmartLog.readUInt32LE(188)
    ])
    .toString()

  smartLog.warningCompositeTempTime = rawSmartLog.readUInt32LE(192)
  smartLog.criticalCompositeTempTime = rawSmartLog.readUInt32LE(196)

  return smartLog
}

/**
 * @typedef subCaLog1
 * @type {object}
 * @property {number} id
 * @property {number} normalized
 * @property {BigInt} raw
 * @memberof nvme
 */

/**
 * @typedef subCaLog2
 * @type {object}
 * @property {number} id
 * @property {number} normalized
 * @property {number} raw_min
 * @property {number} raw_max
 * @property {number} raw_ave
 * @memberof nvme
 */

/**
 * @typedef subCaLog3
 * @type {object}
 * @property {number} id
 * @property {number} normalized
 * @property {number} percentage
 * @property {number} eventCount
 * @memberof nvme
 */

/**
 * @typedef caLog
 * @type {object}
 * @property {subCaLog1} programFailCount
 * @property {subCaLog1} eraseFailCount
 * @property {subCaLog2} wearLevelingCount
 * @property {subCaLog1} endToEndErrorCount
 * @property {subCaLog1} crcErroCount
 * @property {subCaLog1} workloadMediaWear
 * @property {subCaLog1} workloadHostRead
 * @property {subCaLog1} workloadTimer
 * @property {subCaLog3} thermalThrottle
 * @property {subCaLog1} retryBufferOverflow
 * @property {subCaLog1} pllLockLoss
 * @property {subCaLog1} nandByteWritten
 * @property {subCaLog1} hostByteWritten
 * @memberof nvme
 */

/**
 * Get a curret 0xCA log
 *
 * @returns {caLog} - Intel 0xCA log
 *
 * @function getLogPage0xCA
 * @memberof nvme
 */
nvme.getLogPage0xCA = function () {
  let RawSmartLog = nvme.getLogPage(
    {
      LID: logIdentifier.LOG_0xCA,
      LSP: 0,
      RAE: 0,
      NUMD: 128,
      LSI: 0,
      LPOL: 0,
      LPOU: 0,
      UUID: 0
    },
    0xffffffff
  )

  let addSmartLog = {}
  addSmartLog.programFailCount = {}
  addSmartLog.programFailCount.id = RawSmartLog.readUInt8(0)
  addSmartLog.programFailCount.normalized = RawSmartLog.readUInt8(3)
  addSmartLog.programFailCount.raw = utils.bit
    .mergeBigInteger([RawSmartLog.readUInt32LE(5), RawSmartLog.readUInt16LE(9)])
    .toString()

  addSmartLog.eraseFailCount = {}
  addSmartLog.eraseFailCount.id = RawSmartLog.readUInt8(12)
  addSmartLog.eraseFailCount.normalized = RawSmartLog.readUInt8(15)
  addSmartLog.eraseFailCount.raw = utils.bit
    .mergeBigInteger([
      RawSmartLog.readUInt32LE(17),
      RawSmartLog.readUInt16LE(21)
    ])
    .toString()

  addSmartLog.wearLevelingCount = {}
  addSmartLog.wearLevelingCount.id = RawSmartLog.readUInt8(24)
  addSmartLog.wearLevelingCount.normalized = RawSmartLog.readUInt8(27) // decrements from 100 to 0
  addSmartLog.wearLevelingCount.raw_min = RawSmartLog.readUInt16LE(29)
  addSmartLog.wearLevelingCount.raw_max = RawSmartLog.readUInt16LE(31)
  addSmartLog.wearLevelingCount.raw_ave = RawSmartLog.readUInt16LE(33)

  addSmartLog.endToEndErrorCount = {}
  addSmartLog.endToEndErrorCount.id = RawSmartLog.readUInt8(36)
  addSmartLog.endToEndErrorCount.normalized = RawSmartLog.readUInt8(39) // always 100
  addSmartLog.endToEndErrorCount.raw = utils.bit
    .mergeBigInteger([
      RawSmartLog.readUInt32LE(41),
      RawSmartLog.readUInt16LE(45)
    ])
    .toString()
  addSmartLog.crcErroCount = {}
  addSmartLog.crcErroCount.id = RawSmartLog.readUInt8(48)
  addSmartLog.crcErroCount.normalized = RawSmartLog.readUInt8(51) // always 100
  addSmartLog.crcErroCount.raw = utils.bit
    .mergeBigInteger([
      RawSmartLog.readUInt32LE(53),
      RawSmartLog.readUInt16LE(57)
    ])
    .toString()

  addSmartLog.workloadMediaWear = {}
  addSmartLog.workloadMediaWear.id = RawSmartLog.readUInt8(48)
  addSmartLog.workloadMediaWear.normalized = RawSmartLog.readUInt8(51) // always 100
  addSmartLog.workloadMediaWear.raw = utils.bit
    .mergeBigInteger([
      RawSmartLog.readUInt32LE(53),
      RawSmartLog.readUInt16LE(57)
    ])
    .toString()

  addSmartLog.workloadHostRead = {}
  addSmartLog.workloadHostRead.id = RawSmartLog.readUInt8(72)
  addSmartLog.workloadHostRead.normalized = RawSmartLog.readUInt8(75) // always 100
  addSmartLog.workloadHostRead.raw = utils.bit
    .mergeBigInteger([
      RawSmartLog.readUInt32LE(77),
      RawSmartLog.readUInt16LE(81)
    ])
    .toString()

  addSmartLog.workloadTimer = {}
  addSmartLog.workloadTimer.id = RawSmartLog.readUInt8(84)
  addSmartLog.workloadTimer.normalized = RawSmartLog.readUInt8(87) // always 100
  addSmartLog.workloadTimer.raw = utils.bit
    .mergeBigInteger([
      RawSmartLog.readUInt32LE(89),
      RawSmartLog.readUInt16LE(93)
    ])
    .toString()

  addSmartLog.thermalThrottle = {}
  addSmartLog.thermalThrottle.id = RawSmartLog.readUInt8(96)
  addSmartLog.thermalThrottle.normalized = RawSmartLog.readUInt8(99) // always 100
  addSmartLog.thermalThrottle.percentage = RawSmartLog.readUInt8(101)
  addSmartLog.thermalThrottle.eventCount = RawSmartLog.readUInt32LE(102)

  addSmartLog.retryBufferOverflow = {}
  addSmartLog.retryBufferOverflow.id = RawSmartLog.readUInt8(108)
  addSmartLog.retryBufferOverflow.normalized = RawSmartLog.readUInt8(111) // always 100
  addSmartLog.retryBufferOverflow.raw = utils.bit
    .mergeBigInteger([
      RawSmartLog.readUInt32LE(113),
      RawSmartLog.readUInt16LE(117)
    ])
    .toString()
  addSmartLog.pllLockLoss = {}
  addSmartLog.pllLockLoss.id = RawSmartLog.readUInt8(120)
  addSmartLog.pllLockLoss.normalized = RawSmartLog.readUInt8(123) // always 100
  addSmartLog.pllLockLoss.raw = utils.bit
    .mergeBigInteger([
      RawSmartLog.readUInt32LE(125),
      RawSmartLog.readUInt16LE(129)
    ])
    .toString()

  addSmartLog.nandByteWritten = {}
  addSmartLog.nandByteWritten.id = RawSmartLog.readUInt8(132)
  addSmartLog.nandByteWritten.normalized = RawSmartLog.readUInt8(135) // always 100
  addSmartLog.nandByteWritten.raw = utils.bit
    .mergeBigInteger([
      RawSmartLog.readUInt32LE(137),
      RawSmartLog.readUInt16LE(141)
    ])
    .toString() // 1 count = 32MiB

  addSmartLog.hostByteWritten = {}
  addSmartLog.hostByteWritten.id = RawSmartLog.readUInt8(144)
  addSmartLog.hostByteWritten.normalized = RawSmartLog.readUInt8(147) // always 100
  addSmartLog.hostByteWritten.raw = utils.bit
    .mergeBigInteger([
      RawSmartLog.readUInt32LE(149),
      RawSmartLog.readUInt16LE(153)
    ])
    .toString() // 1 count = 32MiB
  return addSmartLog
}
