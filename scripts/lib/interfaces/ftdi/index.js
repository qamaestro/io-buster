/* Global */

/**
 * @namespace ftdiunit
*/
const ftdiunit = {}

/**
 * @typedef ftdiInfo
 * @type {object}
 * @property {Bool} availability - An indicator to show if even a FTDI device exists.
 * @property {Number} controller - A product ID of power margining control & measure unit
 * @property {Number} switch - A product ID of power switching unit(just on & off)
 *                            - Ardent PMU v.5.0 has a power switching and an UART units on a same FTDI device
 *                               - Power Switching Unit : interface = 2
 *                               - Serial UART Unit : interface = 1
 * @property {Number} uartInterface - A product ID for UART interface unit to make UART cable connection convenient
 * @property {Number} version - a version number of PMU board 
 * @memberof ftdiunit
 */

/**
 * Scan all FTDI devices on a host machine
 *  - You must write a proper scan algorithm for your specific hardware.
 *  - This scan function is based on Arden PMU v.5.0
 * 
 * @returns {ftdiInfo} - Object which has product IDs of all FTDI devices.
 * 
 * @function scanFtdiDevices
 * @memberof ftdiunit 
 *                                   
*/
ftdiunit.scanFtdiDevices = function() {

   logger.log("FLOW", "\n> Scan FTDI Devices")

   let ftdiList = [0x6001, 0x6010, 0x6011, 0x6014]
   let ftdiIndicator = ["PMU", "AMS", "IF004"]
   let ftdiConfig = {
      availability:false,
      controller:undefined,
      switch:undefined,
      uartInterface:undefined,
      version:0
   }
   
   for(var idx = 0 ; idx < ftdiList.length ; idx++) {

      var ftdiInfo = ftdi.getDeviceList({vendor: 0x0403, product: ftdiList[idx]});
      let numOfFtdiDevices = ftdiInfo.length;      

      if(numOfFtdiDevices > 0) {

         for(let devIdx=0 ; devIdx<ftdiIndicator.length ; devIdx++) {

            let key = ftdiIndicator[devIdx]
            
            if(ftdiInfo[0].serial.indexOf(key) > -1) {

               switch(key){
                  case "PMU" : // Power margining control & measure unit
                     ftdiConfig.controller = ftdiList[idx]
                     logger.log("FLOW", `[FTDI Detect] Power Control Unit = ${ftdiInfo[0].serial.slice(0, 6)}, ID = 0x${ftdiList[idx].toString(16)}`)
                     break
                  case "AMS" : // Power switching & basic UART
                     ftdiConfig.availability = true
                     ftdiConfig.switch = ftdiList[idx]
                     ftdiConfig.version = parseInt(ftdiInfo[0].serial.slice(5, 6))
                     logger.log("FLOW", `[FTDI Detect] Power Switch & UART Unit = ${ftdiInfo[0].serial.slice(0, 6)}, ID = 0x${ftdiList[idx].toString(16)}`)
                     break
                  case "IF004" : // Additional UART interface unit for chamber connection
                     ftdiConfig.uartInterface = ftdiList[idx]
                     logger.log("FLOW", `[FTDI Detect] UART Interface Unit = ${ftdiInfo[0].serial}, ID = 0x${ftdiList[idx].toString(16)}`)
                     break
               }
            }
         }
      }
   }

   if(ftdiConfig.availability == false) {
      logger.log("FLOW", `[FAIL][FTDI Detect] No FTDI Units for power control and UART`)
      logger.log("FLOW", `[FAIL][FTDI Detect] All UART and power management activities will be discarded.`)
   }

   return ftdiConfig
}