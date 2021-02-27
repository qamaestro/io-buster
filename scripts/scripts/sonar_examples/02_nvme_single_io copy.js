/* global importScript, sonar, workloadLib */

importScript('../lib/sonar/index.js')

sonar.init()

const qid = nvme.createQueuePair()

// NVMe Write 4KB
const wrtBuf = new Buffer(4096)
wrtBuf.fill(0xA5)
nvme.write(qid, 0, 0, 8, wrtBuf)

// NVMe Read 4KB
const readBuf = nvme.read(qid, 0, 0, 8)

// Compare write and read pattern
const compResult = utils.buffer.compareTwoBuffers(wrtBuf, readBuf, 0, 4096)
logger.log("FLOW", JSON.stringify(compResult, null, 4))
