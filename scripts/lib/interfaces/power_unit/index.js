/* Global */

/**
 * @namespace powerunit
*/
const powerunit = {}


powerunit.switch = undefined
powerunit.controller = undefined
powerunit.skipOnOff = true
powerunit.skipControl = true

/**
 * - Open a power switching(On/Off) unit
 * - Register power on and off scripts with powerController.init() of IO Buster
 * 
 * @param {ftdiunit.ftdiInfo} ftdiConfig - object to have information of all detected FTDI devices
 * 
 * @function openPowerSwitch
 * @memberof powerunit
 */
powerunit.openPowerSwitch = function(ftdiConfig) {

    if(ftdiConfig.switch == undefined) {
        logger.log("FLOW", "[BYPASS] script registration of power On/Off")
    } else {        
        powerController.init('generic', {
            onScript: '../lib/interfaces/power_unit/power_on.js', 
            offScript: '../lib/interfaces/power_unit/power_off.js',
        })        
        logger.log("FLOW", "[PASS] Register scripts for power on and off")

        powerunit.switch = true
        powerunit.skipOnOff = false
    }   
}

/**
 * - Open a power control(adjustment) unit
 * 
 * @param {ftdiunit.ftdiInfo} ftdiConfig - object to have information of all detected FTDI devices
 * 
 * @function openPowerController
 * @memberof powerunit
 */
powerunit.openPowerController = function(ftdiConfig) {

    const portMap = [0, 1, 2, 3]
    const curPort = utility.systemInfo().port;   

    if(ftdiConfig.controller == undefined) {
        logger.log("FLOW", "[BYPASS] open power control unit")
    } else {      
        try{
            this.controller = ftdi.open({
                vendor: 0x0403, 
                product: ftdiConfig.controller, 
                serial: `PMU-V${ftdiConfig.version}-${portMap[curPort]}`, 
                interface: 1
            });
            ftdi.setBitmode(this.controller, { bitmask: 0x0, mode: 0x0 })
            ftdi.setBaudRate(this.controller, 115200)                 
            
            powerunit.controller = true
            powerunit.skipControl = false

            logger.log("FLOW", "[PASS] open power control unit")            
        }
        catch(e) {
            logger.log("FLOW", "[FAIL] open power control unit")
            logger.log("FLOW", e)            
        }
        
    }
}

/**
 * Check if the power swtiching unit is ready to use
 * 
 * @returns {bool} true=ready, false=not available
 * 
 * @function isPowerSwitchUnitAvailable
 * @memberof powerunit
 */
powerunit.isPowerSwitchUnitAvailable = function() {
    return powerunit.switch
}

/**
 * Check if the power control unit is ready to use
 * 
 * @returns {bool} true=ready, false=not available
 * 
 * @function isPowerControlUnitAvailable
 * @memberof powerunit
 */
powerunit.isPowerControlUnitAvailable = function() {
    return powerunit.controller
}

/**
 * - Disalbe power switching and control units
 * - Will skip all functions related with power management  
 * - To enable again, please use powerunit.enablePowerManagement()
 * 
 * @function disablePowerManagement
 * @memberof powerunit
 */
powerunit.disablePowerManagement = function() {
    this.skipOnOff = true
    this.skipControl = true
}

/**
 * - Enable power switching and control units
 * - To disable, please use powerunit.disablePowerManagement()
 * 
 * @function disablePowerManagement
 * @memberof powerunit
 */
powerunit.enablePowerManagement = function() {
    this.skipOnOff = false
    this.skipControl = false
}

/**
 * @typedef powerOpt
 * @type {object}
 * @property {number} [delayMs=2000] - delay(waiting) time before power on and off
 * @property {number} [HoldMs=2000] - hold(keeping) time after power on and off
 * @memberof powerunit
 */

/**
 * power Off using power switching unit
 *  
 * @param {powerOpt} opt - delay time before power off and hold time after power-off
 * 
 * @function powerOffDrive
 * @memberof powerunit
 */
powerunit.powerOffDrive = function(opt) {
    if(this.skipOnOff == true) return

    let delayMs = 0
    let holdMs  = 2000 // default 2 sec

    if(opt !== undefined )
    { 
        if(opt.hasOwnProperty("delayMs") == true) {
            delayMs = opt.delayMs
            utility.sleep(delayMs)
        }

        if(opt.hasOwnProperty("holdMs") == true) {
            holdMs = opt.holdMs
        }
    }
    
    powerController.powerOff({offHoldTimeMs:holdMs})    
}

/**
 * power on using power switching unit
 *  
 * @param {powerOpt} opt - delay time before power on and hold time after power on
 * 
 * @function powerOnDrive
 * @memberof powerunit
 */
powerunit.powerOnDrive = function(opt) {    
    if(this.skipOnOff == true) return

    let delayMs = 0
    let holdMs  = 2000 // default 2 sec

    if(opt !== undefined )
    { 
        if(opt.hasOwnProperty("delayMs") == true) {
            delayMs = opt.delayMs
            utility.sleep(delayMs)
        }

        if(opt.hasOwnProperty("holdMs") == true) {
            holdMs = opt.holdMs
        }
    }
    
    powerController.powerOn({onHoldTimeMs:holdMs})
    nvme.probeController()
}

/**
 * Apply power cycling
 * 
 * @param {powerOpt} [offOpt] - delay time before power off and hold time after power off 
 * @param {powerOpt} [onOpt] - delay time before power on and hold time after power on
 * @param {number} [loops=1] - number of power cycles
 * 
 * @function runPowerCycle
 * @memberof powerunit
 */
powerunit.runPowerCycle = function(offOpt, onOpt, loops) {
    if(this.skipOnOff == true) return

    let cycles = 0
    if(loops == undefined) {
        cycles = 1
    } else {
        cycles = loops
    }

    for(let pcyc=0 ; pcyc<cycles ; pcyc++) {
        this.powerOffDrive(offOpt)
        this.powerOnDrive(onOpt)
    }    
}

/**
 * Set PERST pin to low
 * 
 * @param {powerOpt} Opt - delay time before PERST low and hold time after PERST low
 * 
 * @function setLowPERST
 * @memberof powerunit
 */
powerunit.setLowPERST = undefined

/**
 * Set PERST pin to high
 * 
 * @param {powerOpt} Opt - delay time before PERST high and hold time after PERST high
 * 
 * @function setLowPERST
 * @memberof powerunit
 */
powerunit.setHighPERST = undefined

/**
 * - Adjust drive powers
 * - You can check the adjustment history on "power_margin.log"
 * 
 * @param {levels} object
 * @param {string} levels.vol3 - decimal string for setting 3.3V(ex. "2.9"), not supported now
 * @param {string} levels.vol5 - decimal string for setting 5V(ex. "5.3"), only valid for SATA
 * @param {string} levels.vol12 - decimal string for setting 12V(ex. "11.5")
 * 
 * @function adjustDevicePower
 * @memberof powerunit
 */
powerunit.adjustDevicePower = function(levels) {
    if(this.skipControl == true) return

    if(levels.hasOwnProperty("vol12")) {
        var cmd_buf = Buffer.from(sprintf("%cpmu(setVolt12,%s)%c", 0x02, levels.vol12, 0x03), 'utf8');
        ftdi.write(this.controller, cmd_buf);
        logger.log("PWMG", `N N ${levels.vol12}`)
    }    
}

/**
 * @typedef powerMeas
 * @type {object}
 * @property {number} V3_V - measured voltage or limit-over event counter of 3.3V,                    
 * @property {number} V5_V - measured voltage or limit-over event counter of 5V
 * @property {number} V12_V - measured voltage or limit-over event counter of 12V
 * @property {number} V3_I - measured current or limit-over event counter of 3.3V
 * @property {number} V5_I - measured current or limit-over event counter of 5V
 * @property {number} V12_I - measured current or limit-over event counter of 12V
 * @memberof powerunit
 */

/**
 * - Measure drive powers
 * - You can check the adjustment history on "power_probing.log"
 * 
 * @returns {powerMeas} - power measurement results
 * 
 * @param {sonar.workGenTask} taskObj - workload information
 * 
 * @function measureDevicePower
 * @memberof powerunit
 */
powerunit.measureDevicePower = function(taskObj) {
    if(this.skipControl == true) return

    var cmd_buf = Buffer.from(sprintf("%cpmu(measual)%c", 0x02, 0x03), 'utf8');
    ftdi.write(this.controller, cmd_buf);
    const outString = sonar.printCommonHeaderInfo(taskObj)    
    
    while(true) {
        const readData = ftdi.read(this.controller)
        if(readData.length > 0) {
            // VOLT,3.33,3.31,11.53,AMPS,0.000,0.001,0.435
            const measStart = readData.toString().indexOf("VOLT,")
            const measData  = readData.toString().slice(measStart).split(',')
            const vol3V = parseFloat(measData[1])
            const vol5V = parseFloat(measData[2])
            const vol12V = parseFloat(measData[3])
            const cur3V = parseFloat(measData[5])
            const cur5V = parseFloat(measData[6])
            const cur12V = parseFloat(measData[7])
            logger.log("PPRB", `${outString} ${vol3V} ${vol5V} ${vol12V} ${cur3V} ${cur5V} ${cur12V}`)
            break
        }
    }

    return {V3_V:vol3V, V5_V:vol5V, V12_V:vol12V, V3_I:cur3V, V5_I:cur5V, V12_I:cur12V}
}

/**
 * - Clear power measure log in the PMU board
 * - If the power control unit is not available, this function is skipped.
 * 
 * @todo make your own function according to your PMU specification
 * 
 * @function clearDevicePowerLog
 * @memberof powerunit
 */
powerunit.clearDevicePowerLog = function () {
    if(this.skipControl == true) return    
}

/**
 * - Get power measure log in the PMU board
 * - If the power control unit is not available, this function is skipped.
 * 
 * @todo make your own function according to your PMU specification
 * 
 * @function getDevicePowerLog
 * @memberof powerunit
 */
powerunit.getDevicePowerLog = function () {
    if(this.skipControl == true) return
}


/**
 * - Set upper and lower limit conditions for internal power measurement
 * - If the power control unit is not available, this function is skipped.
 * 
 * @todo make your own function according to your PMU specification
 * 
 * @param {powerMeas} upperLimit - upper limit conditions for overshoot event count
 * @param {powerMeas} lowerLimit - lower limit conditions for overshoot event count
 * 
 * @function setPowerLimits
 * @memberof powerunit
 */
powerunit.setPowerLimits = function(upperLimit, lowerLimit) {
    if(this.skipControl == true) return
}

/**
 * @typedef powerLimits
 * @type {object}
 * @property {powerMeas} upper - counters for limit-over event of all measuring items
 * @property {powerMeas} lower - counters for limit-under event of all measuring items
 * @memberof powerunit
 */

/**
 * - Get upper and lower limit conditions for internal power measurement
 * - If the power control unit is not available, this function is skipped.
 * 
 * @todo make your own function according to your PMU specification
 * 
 * @returns {powerLimits} - setting values by setPowerLimits
 * 
 * @function getPowerLimits
 * @memberof powerunit
 */
powerunit.getPowerLimits = function() {    
    if(this.skipControl == true) return
}

/**
 * - Get internal event counters of power limit-over events
 * - If the power control unit is not available, this function is skipped.
 * 
 * @todo make your own function according to your PMU specification
 * 
 * @returns {powerLimits} - limit-over events counters for all measuring items
 * 
 * @function getPowerLimitOverEvent
 * @memberof powerunit
 */
powerunit.getPowerLimitOverEvent = function() {
    if(this.skipControl == true) returns
}
