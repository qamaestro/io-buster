/* global nvme 
   This extends existing nvme library
*/

nvme.identify = function (cmdOpt) {
  const cmd = {}
  cmd.opc = nvme.opcode.admin.IDENTIFY
  cmd.nsid = cmdOpt.nsid
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

nvme.identifyNamespace = function (nsid) {
  const ret = this.identify({
    nsid:nsid,
    cns: 0x00,
    cntid: 0x00,
    nvmsetid: 0x00,
    uuid: 0x00
  })
  
  const namespaceId = {}
  namespaceId.maxLbaNumber = utils.bit.mergeBigInteger([
    ret.readUInt32LE(0),
    ret.readUInt32LE(4),
  ]).toString()

  //[TODO] how to get LBA size 
  // namespaceId.lbaSize = ret.readUInt8(26)
  namespaceId.lbaSize = 512
  
  namespaceId.capacity = (utils.bit.mergeBigInteger([
    ret.readUInt32LE(8),
    ret.readUInt32LE(12),
  ])*BigInt(namespaceId.lbaSize)).toString()

  return namespaceId
}

nvme.identifyController = function () {
  const ret = this.identify({
    nsid:0,
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

  deviceId.ieeeOuiId = ret.readUInt32LE(73) & 0x00FFFFFF
  deviceId.controllerId = ret.readUInt16LE(78)
  deviceId.version = ret.readUInt32LE(80)

  return deviceId
}
