/* global nvme 
   This extends existing nvme library
*/

/**
   * Write NVMe LBAs
   * 
   * @param {number} nsid - Namespace ID 
   * @param {number} qid - NVMe queue ID 
   * @param {number} lbaLow32 - Lower 32bit LBA address for CDW10
   * @param {number} lbaHigh32 - Upper 32bit LBA address for CDW11
   * @param {number} numOfLba - Number of LBAs
   * @param {buffer} writeBuf - Buffer which has a host write pattern   
   * 
   * @function write
   * @memberof nvme   
   */
nvme.write = function(qid, lbaLow32, lbaHigh32, numOfLba, writeBuf) {

   nvme.sendNvmCommand(
      qid,
      {
        opc: nvme.opcode.nvm.WRITE,
        nsid: nsid,
        cdw10: lbaLow32,
        cdw11: lbaHigh32,
        cdw12: numOfLba - 1
      },
      writeBuf,
      true
    )
}

/**
   * Read NVMe LBAs
   * 
   * @return {buffer} - read out data from this NVMe device
   * 
   * @param {number} nsid - Namespace ID 
   * @param {Number} qid - NVMe queue ID 
   * @param {Number} lbaLow32 - Lower 32bit LBA address for CDW10
   * @param {Number} lbaHigh32 - Upper 32bit LBA address for CDW11
   * @param {Number} numOfLba - Number of LBAs
   * @param {Buffer} writeBuf - Buffer which has a host write pattern   
   * 
   * @function read
   * @memberof nvme   
   */
nvme.read = function(nsid, qid, lbaLow32, lbaHigh32, numOfLba) {

   const nsInfo = nvme.getNamespaceInfo(nsid)   
   const readBuf = new Buffer(nsInfo.lbaSize * numOfLba)

   nvme.sendNvmCommand(
      qid,
      {
        opc: nvme.opcode.nvm.READ,
        nsid: nsid,
        cdw10: lbaLow32,
        cdw11: lbaHigh32,
        cdw12: numOfLba - 1
      },
      readBuf,
      false
   )

   return readBuf
}


