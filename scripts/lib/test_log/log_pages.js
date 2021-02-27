/**
 * Print a smart log data into "smart.log"
 * 
 * @param {nvme.smartLog} curSmartlog 
 * @param {sonar.workGenTask} taskObj 
 * 
 * @function printSmartLog
 * @memberof sonar
 */
sonar.printSmartLog = function (curSmartlog, taskObj) {  

   if( sonar.existDefaultLogFile("SMT1", "json") == true ) {
     logger.log('SMT1_JSON', curSmartlog)
   }
 
   if( sonar.existDefaultLogFile("SMT1", "csv") == true ) {
     
    let outString = sonar.printCommonHeaderInfo(taskObj)
 
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
    outString += curSmartlog.numErrLifecycle + ' '
    outString += curSmartlog.warningCompositeTempTime + ' '
    outString += curSmartlog.criticalCompositeTempTime
 
    logger.log('SMT1', outString)
   }
 }

 /**
 * Print a smart log data into "smart.log"
 * 
 * @param {nvme.smartLog} curSmartlog 
 * @param {sonar.workGenTask} taskObj 
 * 
 * @function printSmartLog
 * @memberof sonar
 */
sonar.printSmartDeltaLog = function (curSmartlog, taskObj) {  

  if( sonar.existDefaultLogFile("SMT1", "json") == true ) {
    logger.log('SMT1_JSON', curSmartlog)
  }

  if( sonar.existDefaultLogFile("SMT1", "csv") == true ) {
    
   let outString = sonar.printCommonHeaderInfo(taskObj)

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
   outString += curSmartlog.numErrLifecycle + ' '
   outString += curSmartlog.warningCompositeTempTime + ' '
   outString += curSmartlog.criticalCompositeTempTime

   logger.log('SMT1', outString)
  }
}
 
/**
 * Print a 0xCA Intel log data into "0xCA_page.log"
 * 
 * @param {nvme.caLog} curCalog 
 * @param {sonar.workGenTask} taskObj 
 * 
 * @function printSmartLog
 * @memberof sonar
 */
sonar.printLogPage0xCA = function (curCalog, taskObj) {  

  if( sonar.existDefaultLogFile("CA_1", "json") == true ) {
    logger.log('CA_1_JSON', curCalog)
   }
 
   if( sonar.existDefaultLogFile("CA_1", "csv") == true ) {
    let outString = sonar.printCommonHeaderInfo(taskObj)
 
    outString += curCalog.programFailCount.normalized + ' '
    outString += curCalog.programFailCount.raw + ' '
    outString += curCalog.eraseFailCount.normalized + ' '
    outString += curCalog.eraseFailCount.raw + ' '
    outString += curCalog.wearLevelingCount.normalized + ' '
    outString += curCalog.wearLevelingCount.raw_min + ' '
    outString += curCalog.wearLevelingCount.raw_max + ' '
    outString += curCalog.wearLevelingCount.raw_ave + ' '
    outString += curCalog.endToEndErrorCount.raw + ' '
    outString += curCalog.crcErroCount.raw + ' '
    outString += curCalog.workloadMediaWear.raw + ' '
    outString += curCalog.workloadHostRead.raw + ' '
    outString += curCalog.workloadTimer.raw + ' '
    outString += curCalog.thermalThrottle.percentage + ' '
    outString += curCalog.thermalThrottle.eventCount + ' '
    outString += curCalog.retryBufferOverflow.raw + ' '
    outString += curCalog.pllLockLoss.raw + ' '
    outString += curCalog.nandByteWritten.raw + ' '
    outString += curCalog.hostByteWritten.raw + ' '
 
     logger.log('CA_1', outString)
   }
 }