/* global importScript */

/**
 * @name sonar.workLib 
 * @memberof sonar
 */
sonar.workLib = {}

/**
 * Construct an instance of the "workload" class
 * 
 * @returns {Workload} - a new object of class Workload
 * 
 * @function createWorkload
 * @memberof sonar.workLib
 */
workloadLib.createWorkload = function () {
  
  /**
   * @class workload
   * @property {string} name - name of a set of workload
   * @property {workGenTask[]} playList - a set of workloads   
   */
  class Workload {

    constructor () {
      this.name = 'workload'      
      this.playList = []
    }    

    /**
     * Add a target workload based on "baseWorkload"
     * 
     * @param {taskname} taskName - task name
     * @param {sonar.workGenTask} baseWorkload - base workload for "updateOptions"
     * @param {sonar.workGenTask} [updateOptions] - update options for a new workload
     * 
     * @function add
     * @memberof workload
     */
    add (taskName, baseWorkload, updateOptions) {

      // Copy all attributes
      let tempTask = objectutils.deepCopyObject(baseWorkload)      
      
      // Update task options      
      tempTask.name = taskName

      if(updateOptions != undefined) {
        for(let updateItem in updateOptions) {
          tempTask[updateItem] = updateOptions[updateItem]        
        }
      }
      
      // Add updated workload task
      this.playList.push(tempTask)
    }

    /**
     * Update the "testTag" fields of all workloads in a playlist
     * - You can distinguish and complare workload play results with setting different "testTag".
     * 
     * @param {string} newTestTag - new test tage name to distinguish between different test phases
     * 
     * @function updateTestTag
     * @memberof workload
     */
    updateTestTag (newTestTag) {
      for(let idx = 0 ; idx < this.playList.length ; idx++) {
        this.playList[idx].testTag = newTestTag
      }
    }

    /**
     * Update the "testTag" fields of all workloads in a playlist
     * - You can distinguish and complare workload play results with setting different "testTag".
     * 
     * @param {string} newTestTag - new test tage name to distinguish between different test phases
     * 
     * @function updateTestTag
     * @memberof workload
     */
    playWorkloadList (newTestTag) {
      this.updateTestTag(newTestTag)
      for(let idx = 0 ; idx < this.playList.length ; idx++) {
        sonar.runWorkloadGenerator(this.playList[idx])
      }
    }

  }

  const workload = new Workload()
  return workload
}

importScript('base_workload.js')
