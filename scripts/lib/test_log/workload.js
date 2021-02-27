/**
 * Print test log after running a workload task
 * - SMART log
 * - Intel 0xCA log
 * - Performance result
 * - [Latency result] : optional with 'latency' option in a 'taskObj'
 * - [Latency results] : optional with 'latency' option in a 'taskObj'
 *  
 * @param {workGenTask} taskObj 
 * 
 * @function printWorkloadTestResults
 * @memberof sonar
 */
sonar.printWorkloadTestResults = function (taskObj) {

  sonar.printSmartLog(taskObj.curSmart, taskObj)  
  sonar.printLogPage0xCA(taskObj.curCaLog, taskObj)

  sonar.printPerformanceResult(taskObj)
 
   if ('latency' in taskObj) {
    sonar.printLatency (taskObj)
    sonar.printLatencyHistogramResults(taskObj)
   }
 }

sonar.printPerformanceResult = function (taskObj) {

  if(this.existDefaultLogFile("PERF", "json")) {
    logger.log('PERF_JSON', taskObj)
  }   
   
  const readPef = taskObj.performance.read
  const writePef = taskObj.performance.write   

  let outString = sonar.printCommonHeaderInfo(taskObj)  
  outString += readPef.perf.bandwidth + ' '
  outString += readPef.perf.iops + ' '
  outString += writePef.perf.bandwidth + ' '
  outString += writePef.perf.iops

  logger.log('PERF', outString)   
}

sonar.printLatency = function(taskObj) {

  const readPef = taskObj.performance.read
  const writePef = taskObj.performance.write  
  let outString = sonar.printCommonHeaderInfo(taskObj)  

  if (taskObj.readPercent > 0) {
    logger.log('LTCY', '%s R 1 %d', outString, readPef.latency.first)
    logger.log('LTCY', '%s R 0.5 %d', outString, readPef.latency.perc50)
    logger.log('LTCY', '%s R 1E-1 %d', outString, readPef.latency.perc90)
    logger.log('LTCY', '%s R 1E-2 %d', outString, readPef.latency.perc99)

    for (var i = 3; i <= 8; i++) {
      logger.log(
        'LTCY',
        `${outString} R 1E-2${i} ${readPef.latency['nines' + i]}`
      )
    }
  }

  if (taskObj.readPercent < 100) {
    logger.log('LTCY', '%s W 1 %d', outString, writePef.latency.first)
    logger.log('LTCY', '%s W 50 %d', outString, writePef.latency.perc50)
    logger.log('LTCY', '%s W 1E-1 %d', outString, writePef.latency.perc90)
    logger.log('LTCY', '%s W 1E-2 %d', outString, writePef.latency.perc99)

    for (var i = 3; i <= 8; i++) {
      logger.log(
        'LTCY',
        `${outString} W 1E-2${i} ${writePef.latency['nines' + i]}`
      )
    }
  }
}
 
sonar.printLatencyHistogramResults = function (taskObj) {
  
  const readHist = taskObj.performance.read.histogramRawData.data
  const writeHist = taskObj.performance.write.histogramRawData.data
 
  let outString = sonar.printCommonHeaderInfo(taskObj)   

  if (taskObj.readPercent > 0) {
    for (let i = 0; i < readHist.length; i++) {
      if (readHist[i].count > 0) {
        logger.log(
          'HIST',
          `${outString} R ${readHist[i].start} ${readHist[i].count}`
        )
      }
    }
  } 

  if (taskObj.readPercent < 100) {
    for (let i = 0; i < writeHist.length; i++) {
      if (writeHist[i].count > 0) {
        logger.log(
          'HIST',
          `${outString} W ${writeHist[i].start} ${writeHist[i].count}`
        )
      }
    }
  } 
   
 }
