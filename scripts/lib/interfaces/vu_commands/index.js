/** A host must make a path tree of VU library directories and files.

   1. Put your VU library for your target model according to below directory path rule.

      - vu_commands --
                     |- directory for model_1 - index.js 
                     |- directory for model_2 - index.js 
                     |-         ...           - index.js 
 
   2. Register a SSD model number list of your company in device.vu.getVuLibraryDirectory()

 * @namespace device
 * @type {object}  
 * @name device.vu
*/
device.vu = {}
this.availability = false   

/*
   Common VU Opcode list for SK Hynix SVC v.1.2
*/
this.opcode = {
} 

const vuOpcode = this.opcode

/**
 * Set a target VU library for SONAR  and a check flag(this.availability)
 *
 * @returns {bool} - true:VU library is ready / false:No available VU library
 * 
 * @param {string} modelNumber - model number which is from nvme.identifyController()  
 * 
 * @function setCommandLibrary
 * @memberof device.vu 
 *                                   
*/
device.vu.setCommandLibrary = function(modelNumber) {   
   
   const dirName = this.getVuLibraryDirectory(modelNumber)
   const vuLibPath = `../lib/interfaces/vu_commands/${dirName}/index.js`

   logger.log("FLOW", `\n> Binding VU library of ${dirName}`)
   
   try{
      importScript(vuLibPath)  
      logger.log("FLOW", `[PASS] Get the valid VU library for ${modelNumber}`)
      this.availability = true      
   }
   catch(e) {      
      logger.log("FLOW", e)
      logger.log("FLOW", `[FAIL] There is no VU library for ${modelNumber}`)
      this.availability = false     
   }

   return this.availability
}

/**
 * Show if a VU library is available for this model number
 *             
 * @returns {bool} - true: available / false: not available
 * 
 * @function hasOwnLibrary
 * @memberof device.vu
 *                                   
*/
device.vu.hasOwnLibrary = function () {
   return this.availability
}

/**
 * Check if a VU library is ready for this model number
 *  - Please put your model number in modelNumberList{ }
 *  - format : modelNumberList = { 
 *                modelNo1:directoryName1,
 *                modelNo2:directoryName2,
 *                ... 
 *             }
 * 
 * @returns {string} - directoryNames
 *             
 * @param {string} modelNumber - model number which is from nvme.identifyController() 
 * 
 * @function getVuLibraryDirectory
 * @memberof device.vu
 *  
 *                                   
*/
device.vu.getVuLibraryDirectory = function(modelNumber) {
   const modelNumberList = {
      model_1:"firmware_1",
   }

   return modelNumberList[modelNumber]
}

