function admin_commands () {
  
  // =========================================================
  // load NVMe driver in IO-Buster 
  // =========================================================
  nvme.probeController()

  logger.info('Issue Identify controller command')
  const buf = Buffer.alloc(4096)

  // =========================================================
  // Admin commands can be issued by filling the necessary fields
  // For more details on the fields, please visit
  // https://qamaestro.github.io/io-buster/nvme.html#.sendAdminCommand
  // Below is an example to send identify controller and parse 
  // the return buffer with 4096 kb raw data 
  // =========================================================
  logger.info(nvme.sendAdminCommand(
      {
        opc: 0x06,
        nsid: 0,
        cdw10: 1
      },
      buf,
      false
  ))
  logger.info("PCI Vendor ID (VID): "+readBufferLE(buf,0,2))
  logger.info("PCI Subsystem Vendor ID (SSVID): "+readBufferLE(buf,2,2))
  logger.info("Serial Number (SN): "+readBufferString(buf,4,20))
  logger.info("Model Number (MN): "+readBufferString(buf,24,40))
  logger.info("Firmware Revision (FR): "+readBufferString(buf, 64,8))

}

function readBufferLE (buff, offset, length) {
  if (length <= 6) return '0x' + buff.readUIntLE(offset, length).toString(16)
  else {
    let t = []
    let tOffset = offset
    let tLength = length
    while (tLength > 0) {
      c1 = tLength >= 6 ? 6 : tLength
      t.push(buff.readUIntLE(tOffset, c1).toString(16))
      tLength = tLength - 6
      tOffset = tOffset + 6
    }
    let outut = '0x'
    while (tLength > 0) {
      if (t.length == 1 || t[tLength - 1] != '0') output = output + t.pop()
      else t.pop()
    }
    return output
  }
}

function readBufferString(buff, offset, length){
  let itr = offset
  let output = ""
  while(itr<offset+length){
    output = output + String.fromCharCode(buff.readUIntLE(itr,1))
    itr++
  }
  return output
}

admin_commands()