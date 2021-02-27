sonar.commonLogHeader = 'Machine PortNum Model Capacity TaskName TestTag Trials Loops \
Qdepth IoSize Access ReadRatio StartOffset TestCapa RunTime'

sonar.defaultLogFiles = {};

sonar.printFlowLogSeparator = function(strMsg) {
  logger.log("FLOW", `\n> ${strMsg}`)  
}

sonar.printFlowLogPassEvent = function(strMsg) {
  logger.log("FLOW", `[PASS] ${strMsg}`)  
}

sonar.printFlowLogFailEvent = function(strMsg) {
  logger.log("FLOW", `[FAIL] ${strMsg}`)  
}

sonar.getCommonLogHeader = function() {
  return this.commonLogHeader
}

sonar.openDefaultLogFiles = function () {

  //----------------------------------------------------
  // default log file list
  //----------------------------------------------------    
  logFileList = [
    {
      fileHandler:"FLOW", 
      name:"flow", 
      timeStamp:true, 
      csvFile:true,
      jsonFile:false,
      header : null,
    },
    {
      fileHandler:"UART", 
      name:"uart", 
      timeStamp:true, 
      csvFile:true,
      jsonFile:false,
      header : null,
    }, 
    {
      fileHandler:"PPRB", 
      name:"power_probing", 
      timeStamp:false, 
      csvFile:true,
      jsonFile:false,
      header : null
    },
    {
      fileHandler:"PWMG", 
      name:"power_margin", 
      timeStamp:true, 
      csvFile:true,
      jsonFile:false,
      header : "3V 5V 12V"
    },
    {
      fileHandler:"PERF", 
      name:"performance",       
      timeStamp:false, 
      csvFile:true,
      jsonFile:false,
      header : `${sonar.commonLogHeader} R_BNDW R_IOPS W_BNDW W_IOPS`
    },
    {
      fileHandler:"LTCY", 
      name:"latency", 
      timeStamp:false,
      csvFile:true, 
      jsonFile:false ,
      header : `${sonar.commonLogHeader} RW Nines Latency`
    },    
    {
      fileHandler:"HIST",
      name:"latency_histogram",
      timeStamp:false,
      csvFile:true,
      jsonFile:false,
      header : `${sonar.commonLogHeader} RW Bins Frequency`
    },  
    {
      fileHandler:"SMT1", 
      name:"smart", 
      timeStamp:false, 
      csvFile:true,
      jsonFile:false,
      header : `${sonar.commonLogHeader} CriticalWarning CompositeTemp_K CompositeTemp_C \
      AvailableSpare AvailableSpareTreshold PercentageUsed EnduranceGroupCritical DataUnitRead \
      DataUnitWrite NumHostReadCmd NumHostWriteCmd ControllerBusyTime NumPowerCycle HoursPowerOn \
      NumUnsafeShutDown NumUnrecoveredIntegrity NumErrLifeCycle WarnCompositeTemp CriticalCompositeTemp`
    },
    {
      fileHandler:"SMT2", 
      name:"smart_delta", 
      timeStamp:false, 
      csvFile:true,
      jsonFile:false,
      header : `${sonar.commonLogHeader} CriticalWarning CompositeTemp_K CompositeTemp_C \
      AvailableSpare AvailableSpareTreshold PercentageUsed EnduranceGroupCritical DataUnitRead \
      DataUnitWrite NumHostReadCmd NumHostWriteCmd ControllerBusyTime NumPowerCycle HoursPowerOn \
      NumUnsafeShutDown NumUnrecoveredIntegrity NumErrLifeCycle WarnCompositeTemp CriticalCompositeTemp`
    },    
    {
      fileHandler:"CA_1",
      name:"0xCA_page",      
      timeStamp:false,
      csvFile:true,
      jsonFile:false,
      header : `${sonar.commonLogHeader} percPSF rawPSF percESF rawESF percWearLevel WearLevelMin \
      WearLevelMax WearLevelAve rawE2eError rawCrcError rawMediaWear rawHostRead rawTimer thermalPerc \
      thermalEvent retryBufferOverFlow pllLockLoss nandByteWritten hostByteWritten`
    },
    {
      fileHandler:"CA_2",
      name:"0xCA_delta",      
      timeStamp:false,
      csvFile:true,
      jsonFile:false,
      header : `${sonar.commonLogHeader} percPSF rawPSF percESF rawESF percWearLevel WearLevelMin \
      WearLevelMax WearLevelAve rawE2eError rawCrcError rawMediaWear rawHostRead rawTimer thermalPerc \
      thermalEvent retryBufferOverFlow pllLockLoss nandByteWritten hostByteWritten WAF`
    },
  ]
  
  //----------------------------------------------------
  // open default log files
  //----------------------------------------------------    
  for(let idx=0 ; idx<logFileList.length ; idx++){

    sonar.defaultLogFiles[logFileList[idx].fileHandler] = {
      csv:false, 
      json:false
    }

    if(logFileList[idx].csvFile == true) {
      //----------------------------------------------------
      // open default log files with csv format
      //----------------------------------------------------    
      logger.create(
        logFileList[idx].fileHandler, 
        `${logFileList[idx].name}.log`, 
        { useTimestamp: logFileList[idx].timeStamp }
      );
      //----------------------------------------------------
      // print file header for csv format
      //----------------------------------------------------
      logger.log(logFileList[idx].fileHandler, logFileList[idx].header);
      logger.log("FLOW", `[Log File Open] ${logFileList[idx].name}.log`)
      sonar.defaultLogFiles[logFileList[idx].fileHandler].csv = true;
    } else {
      sonar.defaultLogFiles[logFileList[idx].fileHandler].csv = false;
    }

    //----------------------------------------------------
    // open default log files with JSON format
    //----------------------------------------------------
    if(logFileList[idx].jsonFile == true) {
      logger.create(
        `${logFileList[idx].fileHandler}_JSON`, 
        `${logFileList[idx].name}.json`, 
        { useTimestamp: true}
      );

      logger.log("FLOW", `[Log File Open] ${logFileList[idx].name}.json`)
      sonar.defaultLogFiles[logFileList[idx].fileHandler].json = true;
    } else {
      sonar.defaultLogFiles[logFileList[idx].fileHandler].json = false;
    }
  }
}

sonar.existDefaultLogFile = function(fileHandler, type) {

  errorutils.assertCritical(
    type == "csv" || type == "json", 
    "[Log Type] Log file types must be 'csv' or 'json'."
  )

  if(type == "csv") {
    return this.defaultLogFiles[fileHandler].csv
  } else if (type == "json") {
    return this.defaultLogFiles[fileHandler].json
  } 
  
  return false
}

sonar.printCommonHeaderInfo = function(taskObj) {

  let outString = ''
 
  outString = sonar.getHostName() + ' '
  outString += sonar.getDrivePort() + ' '
  outString += sonar.getNvmeModelNumber() + ' '
  outString += sonar.getDriveCapacity() + ' '  

  if (taskObj == undefined) {
    return 'NA NA 0 0 0 0 NA 0 0 0 0 '
  }  
  
  if(taskObj.hasOwnProperty("name") == true) {
    outString += taskObj.name + ' '
  } else {
    outString += 'NA '
  }

  if(taskObj.hasOwnProperty("testTag") == true) {
    outString += taskObj.testTag + ' '
  } else {
    outString += 'NA '
  }

  if(taskObj.hasOwnProperty("trials") == true) {
    outString += taskObj.trials + ' '
  } else {
    outString += '0 '
  }

  if(taskObj.hasOwnProperty("loops") == true) {
    outString += taskObj.loops + ' '
  } else {
    outString += '0 '
  }

  if(taskObj.hasOwnProperty("queueDepth") == true) {
    outString += taskObj.queueDepth + ' '
  } else {
    outString += '0 '
  }

  if(taskObj.hasOwnProperty("ioSize") == true) {
    outString += taskObj.ioSize + ' '
  } else {
    outString += '0 '
  }

  if(taskObj.hasOwnProperty("workload") == true) {
    outString += taskObj.workload + ' '
  } else {
    outString += 'NA '
  }

  if(taskObj.hasOwnProperty("readPercent") == true) {
    outString += taskObj.readPercent + ' '
  } else {
    outString += '0 '
  }

  if(taskObj.hasOwnProperty("startOffset") == true) {
    outString += taskObj.startOffset + ' '
  } else {
    outString += '0 '
  }

  if(taskObj.hasOwnProperty("testCapa") == true) {
    outString += taskObj.testCapa + ' '
  } else {
    outString += '0 '
  }

  if(taskObj.hasOwnProperty("duration") == true) {
    outString += taskObj.performance.info.duration + ' '
  } else {
    outString += '0 '
  }

  return outString
}

importScript("log_pages.js")
importScript("workload.js")