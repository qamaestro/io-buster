/* global nvme */

// This extends existing nvme library
nvme.identify = function (cmdOpt) {
  const cmd = {}
  cmd.opc = 0x06
  cmd.nsid = 0
  cmd.cdw10 = (cmdOpt.cns & 0xff) | ((cmdOpt.cntid & 0xffff) << 16)

  if (cmdOpt.cns === 0x4) {
    cmd.cdw11 = cmdOpt.nvmsetid & 0xffff
  } else {
    cmd.cdw11 = 0
  }

  cmd.cdw14 = cmdOpt.uuid & 0x7f // UUID

  cmd.cdw12 = 0 // Reserved
  cmd.cdw13 = 0 // Reserved
  cmd.cdw15 = 0 // Reserved

  const readBuf = Buffer.alloc(4096)
  nvme.sendAdminCommand(cmd, readBuf, false)

  return readBuf
}

// This extends existing nvme library
nvme.identifyController = function () {
  const ret = this.identify({
    cns: 0x01,
    cntid: 0x00,
    nvmsetid: 0x00,
    uuid: 0x00
  })

  let curChar = null
  const deviceId = {}
  deviceId.vendor = ret.readUInt16LE(0)
  deviceId.subsysVendor = ret.readUInt16LE(2)

  deviceId.serialNo = ''

  for (var i = 0; i < 20; i++) {
    curChar = ret.readUInt8(4 + i)
    if (curChar === 0x00) break
    deviceId.serialNo += String.fromCharCode(curChar).trim()
  }

  deviceId.modelNo = ''

  for (i = 0; i < 40; i++) {
    curChar = ret.readUInt8(24 + i)
    if (curChar === 0x00) break
    deviceId.modelNo += String.fromCharCode(curChar).trim()
  }

  deviceId.fwVersion = ''

  for (i = 0; i < 8; i++) {
    deviceId.fwVersion += String.fromCharCode(ret.readUInt8(64 + i)).trim()
  }

  return deviceId
}
