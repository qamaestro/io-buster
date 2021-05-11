/* global activesonar, nvme, logger */

/**
 * covertCapaStrtoLba
 *
 * convert string type of capacity amount to a number of LBA
 *
 * [Supported Notation]
 *  - Percentage = "10%", "27%", ....
 *  - Capacity[KB/MB/GB/TB] = "1k", "8G", "1g"....
 *
 * @param {Object} nsInfo          Namespace information
 * @param {Number} nsInfo.lbaSize  LBA byte size
 * @param {Number} nsInfo.size     Maximum number of LBAs
 * @param {String} capaStr         capacity with various notations
 */
activesonar.covertCapaStrtoLba = function (nsInfo, capaStr) {
  // TODO:Input Parameter Check
  if (typeof capaStr !== 'string') {
    console.log(
      'The input parameter of covertCapaStrtoLba must be string type.'
    )
    return
  }

  var capaNum = parseInt(capaStr.slice(0, capaStr.length - 1))

  if (Number.isInteger(capaNum) === false) {
    console.log(
      'The input parameter except the last character must be an integer.'
    )
    return
  }

  var targetLba = 0

  if (capaStr[capaStr.length - 1] === '%') {
    targetLba = Math.floor(nsInfo.size * (capaNum / 100))
  } else if (
    capaStr[capaStr.length - 1] === 't' ||
    capaStr[capaStr.length - 1] === 'T'
  ) {
    targetLba = (capaNum * 1024 * 1024 * 1024 * 1024) / nsInfo.lbaSize
  } else if (
    capaStr[capaStr.length - 1] === 'g' ||
    capaStr[capaStr.length - 1] === 'G'
  ) {
    targetLba = (capaNum * 1024 * 1024 * 1024) / nsInfo.lbaSize
  } else if (
    capaStr[capaStr.length - 1] === 'm' ||
    capaStr[capaStr.length - 1] === 'M'
  ) {
    targetLba = (capaNum * 1024 * 1024) / nsInfo.lbaSize
  } else if (
    capaStr[capaStr.length - 1] === 'k' ||
    capaStr[capaStr.length - 1] === 'K'
  ) {
    targetLba = (capaNum * 1024) / nsInfo.lbaSize
  }

  return targetLba
}

/**
 * convertLbaRange
 *
 * convert various notation of "startOffset" and "testCapa" to an array of [startLba, endLba]
 *
 * [Supported Notation]
 *  - Percentage = "10%", "27%", ....
 *  - Capacity[KB/MB/GB/TB] = "1k", "8G", "1g"....
 *
 * @param {Object} nsInfo               Namespace information
 * @param {Number} nsInfo.lbaSize       LBA byte size
 * @param {Number} nsInfo.maxLbaNum     Maximum number of LBAs
 * @param {String} startOffset          startOffset from LBA 0
 * @param {String} testCapa             capacity from startOffset
 */
activesonar.convertLbaRange = function (nsInfo, startOffset, testCapa) {
  var startLba = 0
  var endLba = 0

  if (typeof startOffset === 'number' && typeof testCapa === 'number') {
    startLba = startOffset
    endLba = startOffset + testCapa - 1
  } else {
    if (typeof startOffset === 'number') {
      startLba = startOffset
    } else {
      startLba = activesonar.covertCapaStrtoLba(nsInfo, startOffset)
    }

    if (typeof testCapa === 'number') {
      endLba = startLba + testCapa - 1
    } else {
      endLba = startLba + activesonar.covertCapaStrtoLba(nsInfo, testCapa) - 1
    }
  }

  if (endLba >= nsInfo.size) {
    endLba = nsInfo.size - 1
  }

  var retVal = null

  if (Number.isInteger(startLba) && Number.isInteger(endLba)) {
    retVal = [startLba, endLba]
  }

  return retVal
}

/**
 * runWorkloadGenerator
 *
 * @param {Object} taskObj
 * @param {String} taskObj.trials           test trial number
 * @param {String} taskObj.name             task name of a current host workload
 * @param {Number} taskObj.loops            repeat number of a current host workload
 * @param {Number} taskObj.nsid             Namespace ID
 * @param {String} taskObj.xferSize           byte size of one IO transaction, ex) "1K", "4K", "128k"
 *                                                                               ==> KB(k/K), MB(m/M), GB(g/G), TB(t,T) *
 * @param {String} taskObj.access           "SEQ" = sequential access / "RND" = random access
 * @param {Number} taskObj.readRatio        percentage of read workload in a current host workload, 0<= ReadRatio <= 100
 * @param          taskObj.startOffset      workload start offset size from LBA0
 *                                          various notations can be supported.
 *                                          [Number/Integer] 512, 1024, 2048, ...
 *                                          [String/Percentage] "3%", "20%", ...
 *                                          [String/Capacity] "1g", "256K", ...
 * @param          taskObj.testCapa         test capacity from "StartOffset". supported notations are same with "StartOffset".
 */
activesonar.runWorkloadGenerator = function (taskObj) {

  if ('latency' in taskObj) {
    taskObj.features = {}
    taskObj.features.histogram = {}
    taskObj.features.histogram.enabled = true
    taskObj.features.histogram.rawData = true
    taskObj.features.histogram.startUs = taskObj.latency[0]
    taskObj.features.histogram.endUs = taskObj.latency[1]
    taskObj.features.histogram.precise = 2
  }

  var nsInfo = nvme.getNamespaceInfo(taskObj.nsid);
  taskObj.xferSize = activesonar.covertCapaStrtoLba(nsInfo, taskObj.ioSize) * nsInfo.lbaSize

  if ('lbaList' in taskObj) {
    taskObj.startOffset = 'LBA_LIST'
    taskObj.testCapa = 'LBA_LIST'
    taskObj.range = taskObj.lbaList
  } else {
    if ('startOffset' in taskObj) {
      taskObj.startOffset = 0
    }

    if ('testCapa' in taskObj) {
      taskObj.testCapa = '100%'
    }

    taskObj.range = {}
    const tempRange = activesonar.convertLbaRange(
      nsInfo,
      taskObj.startOffset,
      taskObj.testCapa
    )
    taskObj.range.startLba = tempRange[0]
    taskObj.range.size = tempRange[1]
  }

  for (
    taskObj.curTrial = 0;
    taskObj.curTrial < taskObj.trials;
    taskObj.curTrial++
  ) {
    logger.log('FLOW', `[WorkloadTest][Start] ${JSON.stringify(taskObj)}`)
    taskObj.performance = nvme.startWorkloadGenerator(taskObj)
    activesonar.printWorkloadTestResults(taskObj)
    logger.log('FLOW', `[WorkloadTest][Done] ${taskObj.name}`)
  }
}
