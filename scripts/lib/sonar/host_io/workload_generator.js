
/**
 * Convert string type of capacity to a number of LBA
 * 
 * [Supported Notation]
 *  - Percentage = "10%", "27%", ....
 *  - Capacity[KB/MB/GB/TB] = "1k", "8G", "1g"....
 *
 * @return {number} - convered LBA
 *
 * @param {object} nsInfo          Namespace information
 * @param {number} nsInfo.lbaSize  LBA byte size
 * @param {number} nsInfo.size     Maximum number of LBAs
 * @param {string} capaStr         capacity with various notations
 * 
 * @function convertLbaRange
 * @memberof sonar
 */
sonar.covertCapaStrtoLba = function (nsInfo, capaStr) {

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
 * @param {object} nsInfo               Namespace information
 * @param {number} nsInfo.lbaSize       LBA byte size
 * @param {number} nsInfo.maxLbaNum     Maximum number of LBAs
 * @param {string} startOffset          startOffset from LBA 0
 * @param {string} testCapa             capacity from startOffset
 * 
 * @function convertLbaRange
 * @memberof sonar
 * 
 */
sonar.convertLbaRange = function (nsInfo, startOffset, testCapa) {
  var startLba = 0
  var endLba = 0

  if (typeof startOffset === 'number' && typeof testCapa === 'number') {
    startLba = startOffset
    endLba = startOffset + testCapa - 1
  } else {
    if (typeof startOffset === 'number') {
      startLba = startOffset
    } else {
      startLba = sonar.covertCapaStrtoLba(nsInfo, startOffset)
    }

    if (typeof testCapa === 'number') {
      endLba = startLba + testCapa - 1
    } else {
      endLba = startLba + sonar.covertCapaStrtoLba(nsInfo, testCapa) - 1
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
 * @typedef workGenTask
 * @type {object}
 * @property {string} [taskObj.name='NONAME'] - task name of a current host workload
 * @property {string} [taskObj.testTag='INIT'] - test stage name when you run a same name of task at a different test condition
 * @property {string} [taskObj.trials=1] - test trial number 
 * @property {number} [taskObj.loops=1] - repeat number of a current host workload
 * @property {number} [taskObj.nsid=1] - Namespace ID
 * @property {number} [taskObj.queueDepth=128] - Queue depth
 * @property {number|string} [taskObj.ioSize='4K'] - byte size of one IO transaction, ex) "1K", "4K", "128k"
 *                                       - KB(k/K), MB(m/M), GB(g/G), TB(t,T)
 * @property {string} [taskObj.workload="random"] - only one of "sequential" or "random"
 * @property {number} [taskObj.readRatio=50] - percentage of read workload in a current host workload, 0<= ReadRatio <= 100
 * @property {number[]} [taskObj.lbaList] - a list of selected start LBAs of each IO
 * @property {number|string} [taskObj.startOffset=0] workload start offset size
 *                                                - various notations can be supported.
 *                                                - [number] 512, 1024, 2048, ...
 *                                                - [percentage notation] "3%", "20%", ...
 *                                                - [capacity notation] "1g", "256K", ...
 * @property {number|string} [taskObj.testCapa=100%] - test capacity from "StartOffset". supported notations are same with "StartOffset".
 * @property {number} [soak] - soaking time before starting a workload
 * @property {number} [duration] - duration time to keep running, 'sec' orders
 * @property {number[]} [latency] - latency histogram measure condition 
 *                             - should be two element.
 *                             - 1st : histogram measure start
 *                             - 2nd : historam measure end 
 * @memberof sonar
 */


/**
 * Run a IO Buster workload generator with specific workload conditions
 *
 * @param {workGenTask} taskObj
 * 
 * @function runWorkloadGenerator
 * @memberof sonar
 */
sonar.runWorkloadGenerator = function (taskObj) {

  if ('name' in taskObj == false) {
    taskObj.name = "NONAME"
  }

  if ('testStage' in taskObj == false) {
    taskObj.testTag = "INIT"
  }
  
  if('trials' in taskObj == false) {
    taskObj.trials = 1
  }

  if('loops' in taskObj == false) {
    taskObj.loops = 1
  }

  if('nsid' in taskObj == false) {
    taskObj.nsid = 1
  }

  if('queueDepth' in taskObj == false) {
    taskObj.queueDepth = 128
  }

  if('ioSize' in taskObj == false) {
    taskObj.ioSize = "4K"
  }

  if('workload' in taskObj == false) {
    taskObj.workload = "random"
  }

  if('readRatio' in taskObj == false) {
    taskObj.ratio = 50
  }

  if ('latency' in taskObj) {
    if(taskObj.latency.length == 2) {
      taskObj.features = {}
      taskObj.features.histogram = {}
      taskObj.features.histogram.enabled = true
      taskObj.features.histogram.rawData = true
      taskObj.features.histogram.startUs = taskObj.latency[0]
      taskObj.features.histogram.endUs = taskObj.latency[1]
      taskObj.features.histogram.precise = 2
    } else {
      logger.log("FLOW", "[Input Error] The array length of latency must be two.")
      return
    }   
  }

  var nsInfo = nvme.getNamespaceInfo(taskObj.nsid);
  taskObj.xferSize = sonar.covertCapaStrtoLba(nsInfo, taskObj.ioSize) * nsInfo.lbaSize

  if ('lbaList' in taskObj) {
    taskObj.startOffset = 'LBA_LIST'
    taskObj.testCapa = 'LBA_LIST'
    taskObj.range = taskObj.lbaList
  } else {
    // default start offset = 0
    if (('startOffset' in taskObj) == false) {
      taskObj.startOffset = 0
    }

    // default test capacity = 100%
    if (('testCapa' in taskObj) == false) {
      taskObj.testCapa = '100%'
    }

    taskObj.range = {}
    const tempRange = sonar.convertLbaRange(
      nsInfo,
      taskObj.startOffset,
      taskObj.testCapa
    )
    taskObj.range.startLba = tempRange[0]
    taskObj.range.size = tempRange[1]
  }  

  if('soak' in taskObj) {
    utility.sleep(taskObj.soak)
  }

  for (
    taskObj.curTrial = 0;
    taskObj.curTrial < taskObj.trials;
    taskObj.curTrial++
  ) {
    logger.log('FLOW', `[WorkloadTest][Start] ${JSON.stringify(taskObj)}`)
    taskObj.performance = nvme.startWorkloadGenerator(taskObj)
    taskObj.curSmart = nvme.getSmartLog()
    taskObj.curCaLog = nvme.getLogPage0xCA()    
    sonar.printWorkloadTestResults(taskObj)
    logger.log('FLOW', `[WorkloadTest][Done] ${taskObj.name}`)
    delete taskObj.performance
  }
}

// /**
//  * getWorkloadRange
//  *
//  * convert string type of capacity amount to a number of LBA within TestRange
//  * 
//  * [Supported Notation]
//  *    - Percentage = "10%", "27%", ....
//  *    - Capacity[KB/MB/GB/TB] = "1k", "8G", "1g"....
//  * 
//  * @param {Object} TaskObj              Limit test range, if you want to test with Percentage
//  * @param {Number} TaskObj.startLba     workload start LBA
//  * @param {Number} TaskObj.size         workload LBA size
//  * @param {string} TaskObj.startPoint   workload start point "front" : start from the front, "rear" :  start from the rear
//  * @param          TaskObj.test_capa    test capacity from "StartOffset". supported notations are same with "StartOffset".
//  * [Example]
//  *     - getWorkloadRange(curSSD, {startLba: test_range.startLba, size: test_range.size, startPoint:"front", test_capa: "50%"});
//  * @autoverify
//  */
// HostIo.getWorkloadRange = function(curDevice, TaskObj)
// {
//     let TestRange = {}
//     TestRange.start = TaskObj.startLba;
//     TestRange.end = TaskObj.startLba + TaskObj.size;

//     if(TaskObj.startPoint == "front" || TaskObj.startPoint == "Front" || TaskObj.hasOwnProperty("startPoint") == false)
//     {
//         targetLba = this.covertLbaForWl(curDevice, TaskObj.test_capa, TestRange);
//         startLba = TestRange.start;
//         endLba = TestRange.start + targetLba - 1;            
//         if(endLba > TestRange.end)
//         {
//             endLba = TestRange.end;
//         }
//     }
//     else if(TaskObj.startPoint == "rear" || TaskObj.startPoint == "Rear")
//     {
//         targetLba = this.covertLbaForWl(curDevice, TaskObj.test_capa, TestRange);
//         endLba = TestRange.end;
//         startLba = endLba - targetLba + 1;

//         if(TestRange.start > startLba || startLba < 0)
//         {
//             startLba = TestRange.start;
//         }
//     }

//     var retVal = [startLba, endLba];
//     return retVal;
// }

// /**
//  * covertLbaForWl
//  *
//  * convert string type of capacity amount to a number of LBA within TestRange
//  * 
//  * [Supported Notation]
//  *    - Percentage = "10%", "27%", ....
//  *    - Capacity[KB/MB/GB/TB] = "1k", "8G", "1g"....
//  * 
//  * @param {String} CapaNum              capacity with various notations
//  * @param {Object} TestRange            Limit test range, if you want to test with Percentage
//  * @param {Number} TestRange.start      workload start LBA
//  * @param {Number} TestRange.end        workload end LBA
//  * 
//  * @autoverify
//  */
// HostIo.covertLbaForWl = function(curDevice, CapaStr, TestRange)
// {
//     // TODO:Input Parameter Check
//     if(typeof(CapaStr) !== "string")
//     {
//         return CapaStr;
//     }

//     var CapaNum = parseInt(CapaStr.slice(0, CapaStr.length-1));

//     if(Number.isInteger(CapaNum) === false)
//     {
//         console.log("The input parameter except the last character must be an integer.");
//         return;
//     }

//     var targetLba = 0;

//     if( CapaStr[CapaStr.length-1] === '%')
//     {
//         targetLba = Math.floor((TestRange.end+1 - TestRange.start) * (CapaNum/100));
//     }
//     else if( CapaStr[CapaStr.length-1] === 't' || CapaStr[CapaStr.length-1] === 'T')
//     {
//         targetLba = CapaNum * 1024 * 1024 * 1024 * 1024 / curDevice.config.LBA_SIZE;
//     }
//     else if( CapaStr[CapaStr.length-1] === 'g' || CapaStr[CapaStr.length-1] === 'G')
//     {
//         targetLba = CapaNum * 1024 * 1024 * 1024 / curDevice.config.LBA_SIZE;
//     }
//     else if( CapaStr[CapaStr.length-1] === 'm' || CapaStr[CapaStr.length-1] === 'M')
//     {
//         targetLba = CapaNum * 1024 * 1024 / curDevice.config.LBA_SIZE;
//     }
//     else if( CapaStr[CapaStr.length-1] === 'k' || CapaStr[CapaStr.length-1] === 'K')
//     {
//         targetLba = CapaNum * 1024 / curDevice.config.LBA_SIZE;
//     }

//     return  targetLba;
// }

// HostIo.getStripeSize = function(curDevice)
// {
//     var numLbaperKB = 1024 / curDevice.config.LBA_SIZE;
//     var stripeSize = curDevice.config.SUPER_PAGE_SIZE_KB * numLbaperKB;
    
//     return stripeSize;
// }

