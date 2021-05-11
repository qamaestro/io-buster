/* global importScript, nvme, bitutils */

importScript('../bitutils/index.js')

const logIdentifier = {
  ERROR_INFO: 0x01,
  SMART: 0x02,
  FIRMWARE_SLOT_INFO: 0x03,
  DRIVE_SELF_TEST: 0x06
}

// This extends existing nvme library
nvme.getLogPage = function (cmdOpt, nsid) {
  const cmd = {}
  cmd.opc = 0x02
  cmd.nsid = nsid
  cmd.cdw10 =
    (cmdOpt.LID & 0xff) |
    ((cmdOpt.LSP & 0xf) << 8) |
    ((cmdOpt.RAE & 0x1) << 15) |
    ((cmdOpt.NUMD & 0xffff) << 16)

  cmd.cdw11 = ((cmdOpt.NUMD >> 16) & 0xffff) | ((cmdOpt.LSI & 0xffff) < 16)
  cmd.cdw12 = cmdOpt.LPOL
  cmd.cdw13 = cmdOpt.LPOU
  cmd.cdw14 = cmdOpt.UUID & 0x7f // UUID
  cmd.cdw15 = 0 // Reserved

  const readBuf = Buffer.alloc(4096)
  nvme.sendAdminCommand(cmd, readBuf, false)

  return readBuf
}

// This extends existing nvme library
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

  smartLog.dataUnitRead = bitutils.mergeBigInteger([
    rawSmartLog.readUInt32LE(32),
    rawSmartLog.readUInt32LE(36),
    rawSmartLog.readUInt32LE(40),
    rawSmartLog.readUInt32LE(44)
  ]).toString()

  smartLog.dataUnitWritten = bitutils.mergeBigInteger([
    rawSmartLog.readUInt32LE(48),
    rawSmartLog.readUInt32LE(52),
    rawSmartLog.readUInt32LE(56),
    rawSmartLog.readUInt32LE(60)
  ]).toString()

  smartLog.numHostReadCmd = bitutils.mergeBigInteger([
    rawSmartLog.readUInt32LE(64),
    rawSmartLog.readUInt32LE(68),
    rawSmartLog.readUInt32LE(72),
    rawSmartLog.readUInt32LE(76)
  ]).toString()

  smartLog.numHostWriteCmd = bitutils.mergeBigInteger([
    rawSmartLog.readUInt32LE(80),
    rawSmartLog.readUInt32LE(84),
    rawSmartLog.readUInt32LE(88),
    rawSmartLog.readUInt32LE(92)
  ]).toString()

  smartLog.controllerBusyTime = bitutils.mergeBigInteger([
    rawSmartLog.readUInt32LE(96),
    rawSmartLog.readUInt32LE(100),
    rawSmartLog.readUInt32LE(104),
    rawSmartLog.readUInt32LE(108)
  ]).toString()

  smartLog.numPowerCycles = bitutils.mergeBigInteger([
    rawSmartLog.readUInt32LE(112),
    rawSmartLog.readUInt32LE(116),
    rawSmartLog.readUInt32LE(120),
    rawSmartLog.readUInt32LE(124)
  ]).toString()

  smartLog.hoursPowerOn = bitutils.mergeBigInteger([
    rawSmartLog.readUInt32LE(128),
    rawSmartLog.readUInt32LE(132),
    rawSmartLog.readUInt32LE(136),
    rawSmartLog.readUInt32LE(140)
  ]).toString()

  smartLog.numUnsafeShutdown = bitutils.mergeBigInteger([
    rawSmartLog.readUInt32LE(144),
    rawSmartLog.readUInt32LE(148),
    rawSmartLog.readUInt32LE(152),
    rawSmartLog.readUInt32LE(156)
  ]).toString()

  smartLog.numUnrecoveredIntegrity = bitutils.mergeBigInteger([
    rawSmartLog.readUInt32LE(160),
    rawSmartLog.readUInt32LE(164),
    rawSmartLog.readUInt32LE(168),
    rawSmartLog.readUInt32LE(172)
  ]).toString()

  smartLog.numErrLifecycle = bitutils.mergeBigInteger([
    rawSmartLog.readUInt32LE(176),
    rawSmartLog.readUInt32LE(180),
    rawSmartLog.readUInt32LE(184),
    rawSmartLog.readUInt32LE(188)
  ]).toString()

  smartLog.warningCompositeTempTime = rawSmartLog.readUInt32LE(192)
  smartLog.criticalCompositeTempTime = rawSmartLog.readUInt32LE(196)

  return smartLog
}
