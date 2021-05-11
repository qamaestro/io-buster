/* global importScript */

const workloadLib = {}

workloadLib.createWorkload = function () {
  // Define Workload class within this function to avoid exposing Workload class
  // to the global namespace

  class Workload {
    constructor () {
      this.name = 'workload'
      this.preCondition = []
      this.main = []
    }

    addPreCondition (workload) {
      this.preCondition.push(workload)
    }

    addMainWorkload (workload) {
      this.main.push(workload)
    }
  }

  const workload = new Workload()
  return workload
}

importScript('perf_profiler_1.js')
importScript('TS_001.js')
