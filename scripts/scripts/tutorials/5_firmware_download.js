// =========================================================
// Admin commands can be issued by filling the necessary fields
// For more details on the fields, please visit
// https://qamaestro.github.io/io-buster/nvme.html#.sendAdminCommand
// Below is an example of firmware download and firmware activate 
// =========================================================

// NOTE: Update the filename with path to your firmware binary before
// running this user script
const filename = "./fwbin"     //relative path to script file 

function fw_download () {  
  const buf = Buffer.alloc(4096)
  
  logger.info("Performing Firmware Download")
  const fwbin = readFile(filename)

  let fw_size = fwbin.length
  let offset = 0 
  let xfer = 5 //4096 
  logger.info(fwbin)
  while(fw_size > 0){
    xfer = Math.min(xfer, fw_size)
    const buffer = fwbin.slice(offset, offset+xfer)
    nvme.sendAdminCommand({
      opc: 0x11,
      cdw10: (xfer >> 2) - 1,
      cdw11: offset >> 2,
      },
      buffer,
      true
    )
    fw_size = fw_size - xfer
    offset = offset + xfer
  }
  logger.info("Firmware Download Successful")
}

function fw_activate (action, slot) {
  if (slot < 2 || slot > 7)
    throw new Error('Firmware Commit Error: slot should be within 2~7')
  if (action < 0 || action > 7)
    throw new Error('Firmware Commit Error: action should be within 0~7')
  let bpid = 0
  nvme.sendAdminCommand({
      opc: 0x10,
      cdw10: (bpid << 31) | (action << 3) | slot
    },
    {},
    false
  )
  logger.info("Firmware Activate Successful")
}


// =========================================================
// load NVMe driver in IO-Buster 
// =========================================================
nvme.probeController()
// =========================================================
// Firmware download 
// =========================================================
fw_download()
// =========================================================
// Firmware activate
// =========================================================
fw_activate()