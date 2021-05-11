/* global activesonar, importScript, logger, utility, nvme */

// Loads nvme extension
importScript('../nvme/index.js')

activesonar.printPerformanceHeader = function () {
  let outString = ''
  outString = 'Machine PortNum Name Condition Trials Loops Qdepth IoSize '
  outString += 'Access ReadRatio StartOffset TestCapa RunTime R_BW R_IOPS '
  outString += 'W_BW W_IOPS RW Nines Latency'
  logger.log('PERF', outString)
}

activesonar.printHistogramHeader = function () {
  let outString = ''

  outString = 'Machine PortNum Name Condition Bin Frequency'
  outString += ''
  logger.log('SMART', outString)
}

activesonar.printWorkloadTestResults = function (taskObj) {
  activesonar.printSmartHealthLog(taskObj)
  activesonar.printPerformanceResult(taskObj)

  if ('latency' in taskObj) {
    activesonar.printLatencyHistogramResults(taskObj)
  }
}

activesonar.printPerformanceResult = function (taskObj) {
  logger.log('PERF_JSON', taskObj)

  const taskInfo = taskObj.performance.info
  const readPef = taskObj.performance.read
  const writePef = taskObj.performance.write
  let outString = ''

  const sysInfo = utility.systemInfo()

  outString = sysInfo.hostname + ' '
  outString += sysInfo.hostname.port + ' '
  outString += taskObj.name + ' '
  outString += taskObj.condition + ' '

  outString += taskObj.curTrial + ' '
  outString += taskObj.loops + ' '
  outString += taskObj.queueDepth + ' '
  outString += taskObj.xferSize + ' '
  outString += taskObj.workload + ' '
  outString += taskObj.readPercent + ' '

  if (
    typeof taskObj.startOffset === 'string' &&
    taskObj.startOffset[taskObj.startOffset.length - 1] === '%'
  ) {
    outString += taskObj.startOffset + '% '
  } else {
    outString += taskObj.startOffset + ' '
  }

  if (
    typeof taskObj.testCapa === 'string' &&
    taskObj.testCapa[taskObj.testCapa.length - 1] === '%'
  ) {
    outString += taskObj.testCapa + '% '
  } else {
    outString += taskObj.testCapa + ' '
  }

  outString += taskInfo.duration + ' '

  outString += readPef.perf.bandwidth + ' '
  outString += readPef.perf.iops + ' '
  outString += writePef.perf.bandwidth + ' '
  outString += writePef.perf.iops

  if ('latency' in taskObj.hasOwnProperty) {
    if (taskObj.readPercent > 0 && readPef.latency) {
      logger.log('PERF', '%s R 1 %d', outString, readPef.latency.first)
      logger.log('PERF', '%s R 50 %d', outString, readPef.latency.perc50)
      logger.log('PERF', '%s R 90 %d', outString, readPef.latency.perc90)
      logger.log('PERF', '%s R 99 %d', outString, readPef.latency.perc99)

      for (var i = 3; i <= 8; i++) {
        logger.log(
          'PERF',
          '%s R %d %d',
          outString,
          i,
          readPef.latency['nines' + i]
        )
      }
    }

    if (100 - taskObj.readPercent > 0 && writePef.latency) {
      logger.log('PERF', '%s W 1 %d', outString, writePef.latency.first)
      logger.log('PERF', '%s W 50 %d', outString, writePef.latency.perc50)
      logger.log('PERF', '%s W 90 %d', outString, writePef.latency.perc90)
      logger.log('PERF', '%s W 99 %d', outString, writePef.latency.perc99)

      for (var i = 3; i <= 8; i++) {
        logger.log(
          'PERF',
          '%s W %d %d',
          outString,
          i,
          writePef.latency['nines' + i]
        )
      }
    }
  } else {
    logger.log('PERF', '%s N 0 0', outString)
  }
}

activesonar.printLatencyHistogramResults = function (taskObj) {
  // TODO: Complete me

  // const taskInfo = taskObj.performance.info
  const readHist = taskObj.performance.read.histogramRawData.data
  // const writeHist = taskObj.performance.write.histogramRawData.data

  const sysInfo = utility.systemInfo()

  let outString = ''
  outString = sysInfo.hostname + ' '
  outString += sysInfo.hostname.port + ' '
  outString += taskObj.name + ' '
  outString += taskObj.condition + ' '

  for (let i = 0; i < readHist.length; i++) {
    if (readHist[i].count > 0) {
      logger.log(
        'HIST',
        `${outString} ${readHist[i].start} ${readHist[i].count}`
      )
    }
  }
}

activesonar.printSmartHeader = function () {
  let outString = ''
  outString = 'Machine PortNum Name Condition '
  outString += 'CriticalWarning CompositeTemp_K CompositeTemp_C AvailableSpare '
  outString += 'AvailableSpareTreshold PercentageUsed EnduranceGroupCritical '
  outString += 'DataUnitRead DataUnitWrite NumHostReadCmd NumHostWriteCmd '
  outString += 'ControllerBusyTime NumPowerCycle HoursPowerOn '
  outString += 'NumUnsafeShutDown NumUnrecoveredIntegrity NumErrLifeCycle '
  outString += 'WarnCompositeTemp CriticalCompositeTemp'

  logger.log('SMART', outString)
}

activesonar.printSmartHealthLog = function (taskObj) {
  let outString = ''

  const sysInfo = utility.systemInfo()
  outString = sysInfo.hostname + ' '
  outString += sysInfo.hostname.port + ' '
  outString += taskObj.name + ' '
  outString += taskObj.condition + ' '

  const curSmartlog = nvme.getSmartLog()
  logger.log('SMART_JSON', curSmartlog)

  outString += curSmartlog.criticalWarning + ' '
  outString += curSmartlog.compositeTemperature + ' '
  outString += logger.sprintf(
    '%5.2f ',
    curSmartlog.compositeTemperature - 273.15
  )
  outString += curSmartlog.availableSpare + ' '
  outString += curSmartlog.availableSpareThreshold + ' '
  outString += curSmartlog.percentageUsed + ' '
  outString += curSmartlog.enduranceGroupCritical + ' '
  outString += curSmartlog.dataUnitRead + ' '
  outString += curSmartlog.dataUnitWritten + ' '
  outString += curSmartlog.numHostReadCmd + ' '
  outString += curSmartlog.numHostWriteCmd + ' '
  outString += curSmartlog.controllerBusyTime + ' '
  outString += curSmartlog.numPowerCycles + ' '
  outString += curSmartlog.hoursPowerOn + ' '
  outString += curSmartlog.numUnsafeShutdown + ' '
  outString += curSmartlog.numUnrecoveredIntegrity + ' '
  outString += curSmartlog.warningCompositeTempTime + ' '
  outString += curSmartlog.criticalCompositeTempTime

  logger.log('SMART', outString)
}
