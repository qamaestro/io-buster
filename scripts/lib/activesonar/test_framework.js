/* global utility, activesonar */

activesonar.runWorkloadList = function (workloadList, checkFunction) {
  for (let workloadIdx = 0; workloadIdx < workloadList.length; workloadIdx++) {
    if ('preDelay' in workloadList[workloadIdx]) {
      utility.sleep(workloadList[workloadIdx].preDelay * 1000)
    }

    activesonar.runWorkloadGenerator(workloadList[workloadIdx])

    // TODO : checkFunction
    if (checkFunction !== undefined) {
      const res = checkFunction()
      if (res.error) {
        // TODO : Error Handler
        return res
      }
    }

    if ('postDelay' in workloadList[workloadIdx]) {
      utility.sleep(workloadList[workloadIdx].postDelay * 1000)
    }
  }
}

activesonar.runRetentionFramework = function (
  preWorkload,
  mainWorkload,
  loopCondition,
  testChecker
) {
  // TODO: Complete Me
  if (preWorkload != null) {
    activesonar.runWorkloadList(preWorkload)
  }

  for (
    let retLoop = loopCondition.start;
    retLoop <= loopCondition.end;
    retLoop += loopCondition.step
  ) {
    // workloadLib.TS_001.main[0].condition = retLoop
    let res = activesonar.runWorkloadList(mainWorkload)
  }
}
