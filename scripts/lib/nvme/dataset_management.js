/* global nvme 
   This extends existing nvme library
*/

/**
 * @typedef dmRange
 * @type {object}
 * @property {number} lbaLow32 - Lower 32bit LBA address for CDW10
 * @property {number} lbaHigh32 - Upper 32bit LBA address for CDW11
 * @property {number} numOfLba - Number of LBAs
 * @property {dmContextAttr} ctxAttr - context attributes for Dataset Management CMDs
 * @memberof nvme
 */

/**
 * @typedef dmContextAttr
 * @type {object}
 * @property {number} AF - access frequency
 *                       - 0h - No frequency information provided.
 *                       - 1h - Typical number of reads and writes expected for this LBA range.
 *                       - 2h - Infrequent writes and infrequent reads to the LBA range indicated.
 *                       - 3h - Infrequent writes and frequent reads to the LBA range indicated.
 *                       - 4h - Frequent writes and infrequent reads to the LBA range indicated.
 *                       - 5h - Frequent writes and frequent reads to the LBA range indicated.
 *                       - 6~Fh - reserved
 * @property {number} AL - access latency
 *                       - 00b - None. No latency information provided.
 *                       - 01b - Idle. Longer latency acceptable.
 *                       - 10b - Normal. Typical latency.
 *                       - 11b - Low. Smallest possible latency.
 * @property {number} SR - sequential read range
 *                       - If set to ‘1’, then the dataset should be optimized for sequential read access.
 *                         The host expects to perform operations on the dataset as a single object for reads.
 * @property {number} SW - sequential write range
 *                       - If set to ‘1’, then the dataset should be optimized for sequential write access.
 *                         The host expects to perform operations on the dataset as a single object for writes.
 * @property {number} WP - write prepare
 *                       - If set to ‘1’, then the provided range is expected to be written in the near future.
 * @property {number} cmdSize - command access size
 *                       - Number of logical blocks expected to be transferred in a single Read or Write command
 *                         from this dataset. A value of 0h indicates no Command Access Size is provided.
 *
 * @memberof nvme
 */

/**
 * Deallocate written LBAs
 *
 * @param {number} nsid - Namespace ID
 * @param {number} qid - NVMe queue ID
 * @param {dmRange[]} trimRngList - array of trim ranges
 *
 * @function deallocate
 * @memberof nvme
 */

nvme.deallocate = function (nsid, qid, trimRngList) {
  // Convert an array to a buffer type
  let trimRngBuf = new Buffer(16 * trimRngBuf.length)

  for (let i = 0; i < trimRngList.length; i++) {
    trimRngBuf.writeUInt32LE(trimRngList[i].ctxAttr, i * 16)
    trimRngBuf.writeUInt32LE(trimRngList[i].numOfLba, i * 16 + 4)
    trimRngBuf.writeUInt32LE(trimRngList[i].lbaLow32, i * 16 + 8)
    trimRngBuf.writeUInt32LE(trimRngList[i].lbaHigh32, i * 16 + 12)
  }

  // Send Deallocate CMD
  nvme.sendNvmCommand(
    qid,
    {
      opc: nvme.opcode.nvm.DATASET_MANAGEMENT,
      nsid: nsid,
      cdw10: trimRngList.length,
      cdw11: 0x01 << 2
    },
    trimRngBuf,
    true
  )
}
