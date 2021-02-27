/* global importScript, nvme, logger, utility */

/**
 * @namespace sonar
 * @type {object}
 * @name sonar
 */

const sonar = {}

importScript('../nvme/index.js')
importScript('../utils/index.js')
importScript('../test_log/index.js')
importScript('../interfaces/index.js')
importScript('../workload/index.js')

importScript('starter/index.js')
importScript('host_io/index.js')

/**
 * Initialize SONAR to run a target NVMe drive
 *   - open default log files
 *   - scan and open FTDI devices for UART, power switching, and control units
 *   - initialize and identify a target NVMe drive
 *   - build drive information
 *   - save initial SMART and drive logs
 *   - bind a target VU library 
 *   - bind a target NAND library
 * 
 * @function init
 * @memberof sonar
 */
sonar.init = function () {

  // Open default log files
  this.openDefaultLogFiles()

  // Build connections of UART and power units
  this.ftdiInfo = this.scanFtdiDevices()
  if(this.ftdiInfo.availability == true) {
    this.buildUartConnection()
    this.buildPowerUnitConnection()
  }  
  
  // Load generic PCIe driver and probe NVMe controller
  try{    
    nvme.probeController()    
  }
  catch(e){
    // If only UART and Power and Power On&Off are possible, 
    // this drive can be in a bare drive without FW.
    if(serial.isAvailableConnection("UART") == true && powerunit.isPowerSwitchUnitAvailable() == true) {
      logger.log("FLOW", `[NVMe Detection Fail] Power and UART connection are good.`)
      logger.log("FLOW", `[NVMe Detection Fail] But the device cannot be detected as a NVMe devices.`)
      logger.log("FLOW", `[NVMe Detection Fail] You can only use UART and power unit functions.`)
      return
    } else {
      throw new Error("[NVMe Detection Fail] without any available power and UART connection.")
    }
  }  

  // Build a host and drive information
  this.hostInfo = this.checkHostInformation()
  this.controllerInfo = this.identifyNvmController();
  this.namespaceInfo = this.identifyNvmNamespace(1)      

  // Check default SMART information
  this.initSmart = this.getInitialSmartLog()
  this.initCaLog = this.getInitialLogPage0xCA()
  this.prevSmart = this.initSmart
  this.prevCaLog = this.initCaLog  

  // Bind VU interface
  this.vuSupport = this.bindVuLibrary()

  // Bind NAND interface
  if(this.vuSupport == true) {

  }

  // Build test information 
}

/**
 * @typedef cpuCoreInfo
 * @type  {object}
 * @property {string} model - CPU core model name
 * @property {number} speed - CPU core speed
 * @memberof sonar
 */

/**
 * @typedef hostInfo
 * @type  {object}
 * @property {object} cores - core information of a host machine
 * @property {cpuCoreInfo} cores.primary - primary core information of this drive port on IO Buster
 * @property {cpuCoreInfo} cores.secondary - secondary core information of this drive port on IO Buster
 * @property {string} os - operating system of a host machine
 * @property {string} hostname - a host machine name
 * @property {string} hostname - a host machine name
 * @property {number} totalMemory - main memory size of a host machine
 * @property {number} port - drive port number on a host machine
 * @property {string} frameworkVersion - framework version of IO buster 
 * @memberof sonar
 */

/** Check host information 
 * 
 * @returns {hostInfo} - host information
 * 
 * @function checkHostInformation
 * @memberof sonar
 * 
 */
sonar.checkHostInformation = function() {

  const sysInfo = utility.systemInfo()  
  const coreMap = [
    {primary:0, secondary:16},
    {primary:1, secondary:17},
    {primary:2, secondary:18},
    {primary:3, secondary:19},
  ]

  // Get core addresses assigned a current drive port
  const curPort = sysInfo.port
  const curPrimaryCore = coreMap[curPort].primary
  const curSecondaryCore = coreMap[curPort].secondary

  // Build host information
  // 1. Core Model, Speed and main memory capacity
  // 2. OS type
  // 3. Host machine name
  // 4. Current drive port number
  // 5. Current IOB framework version
  const hostInfo = {
    cores : {
      primary : {
        model:sysInfo.cpus[curPrimaryCore].model,
        speed:sysInfo.cpus[curPrimaryCore].speed
      }, 
      secondary : {
        model:sysInfo.cpus[curSecondaryCore].model,
        speed:sysInfo.cpus[curSecondaryCore].speed
      } 
    }, 
    os:sysInfo.platform,
    hostname:sysInfo.hostname,
    totalMemory:sysInfo.totalmem,
    port : sysInfo.port,
    frameworkVersion : sysInfo.version,
  }  

  _printHostInformation(hostInfo)

  return hostInfo

  function _printHostInformation(hostInfo){
    if( sonar.existDefaultLogFile("FLOW", "csv") == true ) {
      sonar.printFlowLogSeparator("Host System Information")
      logger.log("FLOW", `Primary_core_model = ${hostInfo.cores.primary.model}`)
      logger.log("FLOW", `Primary_core_speed = ${hostInfo.cores.primary.speed}`)
      logger.log("FLOW", `Secondary_core_model = ${hostInfo.cores.secondary.model}`)
      logger.log("FLOW", `Secondary_core_speed = ${hostInfo.cores.secondary.speed}`)
      logger.log("FLOW", `Operating_system = ${hostInfo.os}`)
      logger.log("FLOW", `Host_name = ${hostInfo.hostname}`)
      logger.log("FLOW", `Total_memory_capacity = ${hostInfo.totalMemory}`)
      logger.log("FLOW", `Current_drive_port = ${hostInfo.port}`)
      logger.log("FLOW", `IOB_framework_version = ${hostInfo.frameworkVersion}`)
    }

    if( sonar.existDefaultLogFile("FLOW", "json") == true ) {
      logger.log("FLOW_JSON", hostInfo)
    }
  }    
}

/**
 * Controller of NVMe "Identify" command
 * 
 * @typedef nvmeControllerId
 * @type  {object}
 * @property {string} vendor - NVMe SSD vendor name
 * @property {string} vendorId - vendor ID(hex. format)
 * @property {string} subSysvendor - NVMe subsystem vendor ID(hex. format)
 * @property {string} serial - drive serial number
 * @property {string} model - drive model number
 * @property {string} fwVersion - drive firmware version
 * @property {string} ieeeOuiId - IEEE OUI Id(hex. format)
 * @property {string} controllerId - NVMe controller ID(hex. format)
 * @property {string} version - version(hex. format) * 
 * @memberof sonar
 */

/** Check NVMe controller information 
 * 
 * @returns {nvmeControllerId} - controller identification information
 * 
 * @function identifyNvmController
 * @memberof sonar
 * 
 */
sonar.identifyNvmController = function () {  
  const vendorIdList = {
    0x1C5C : "sk_hynix",        
  }

  const nvmControllerId = nvme.identifyController()
  
  const deviceId = {
    vendor:vendorIdList[nvmControllerId.vendor],
    vendorId:`0x${nvmControllerId.vendor.toString(16)}`,
    subsysVendor:`0x${nvmControllerId.subsysVendor.toString(16)}`,
    serial:nvmControllerId.serialNo,
    model:nvmControllerId.modelNo,
    fwVersion:nvmControllerId.fwVersion,
    ieeeOuiId:`0x${nvmControllerId.ieeeOuiId.toString(16)}`,
    controllerId:`0x${nvmControllerId.controllerId.toString(16)}`,
    version:`0x${nvmControllerId.version.toString(16)}`,
  }

  _printDeviceIdentification(deviceId)

  return deviceId

  function _printDeviceIdentification(deviceId){
    if( sonar.existDefaultLogFile("FLOW", "csv") == true ) {
      sonar.printFlowLogSeparator("NVM Controller Identification")      
      logger.log("FLOW", `Drive_vendor = ${deviceId.vendor}`)
      logger.log("FLOW", `Drive_vendor_ID = ${deviceId.vendorId}`)
      logger.log("FLOW", `Drive_subsystem_vendor_ID = ${deviceId.subsysVendor}`)
      logger.log("FLOW", `Drive_serial_number = ${deviceId.serial}`)
      logger.log("FLOW", `Drive_model_number = ${deviceId.model}`)
      logger.log("FLOW", `Drive_firmware_version = ${deviceId.fwVersion}`)
      logger.log("FLOW", `Drive_IEEE_OUI_ID = ${deviceId.ieeeOuiId}`)
      logger.log("FLOW", `Drive_Controller_ID = ${deviceId.controllerId}`)
      logger.log("FLOW", `Drive_Version = ${deviceId.version}`)
    }

    if( sonar.existDefaultLogFile("FLOW", "json") == true ) {
      logger.log("FLOW_JSON", deviceId)
    }
  }  
}

sonar.identifyNvmNamespace = function(nsid) {

  const namespaceId = nvme.identifyNamespace(nsid)

  _printNamespaceIdentification(namespaceId)

  return namespaceId

  function _printNamespaceIdentification(namespaceId){
    if( sonar.existDefaultLogFile("FLOW", "csv") == true ) {
      sonar.printFlowLogSeparator("NVM Namespace Identification")      
      logger.log("FLOW", `Max_LBA_number = ${namespaceId.maxLbaNumber}`)
      logger.log("FLOW", `LBA_bytesize = ${namespaceId.lbaSize}`)
      logger.log("FLOW", `Drive_Capacity_bytesize = ${namespaceId.capacity}`)
    }

    if( sonar.existDefaultLogFile("FLOW", "json") == true ) {
      logger.log("FLOW_JSON", namespaceId)
    }
  }  
}

sonar.scanFtdiDevices = function() {  
  let ftdiInfo = ftdiunit.scanFtdiDevices()
  return ftdiInfo
}

sonar.buildUartConnection = function() {  
  serial.openConnection("UART", this.ftdiInfo)
  serial.connectLogFile("UART")
}

sonar.buildPowerUnitConnection = function() {  
  powerunit.openPowerSwitch(this.ftdiInfo)
  powerunit.openPowerController(this.ftdiInfo)
}

sonar.bindVuLibrary = function() {  

  const vuSupport = device.vu.setCommandLibrary(this.controllerInfo.model)

  if(vuSupport == true) {
    const deviceInfo = device.vu.info.getDeviceArchitecture()
    // sonar.printDeviceInfo(deviceInfo)
  }

  return vuSupport
}

/**
 * Save an initial SMART log data to save when this test run started
 * 
 * @returns {nvme.smartLog} - initial SMART log
 * 
 * @function saveInitialSmartLog
 * @memberof sonar
 */
sonar.saveInitialSmartLog = function() {
  const initSmartLog = nvme.getSmartLog();  
  this.printSmartLog(initSmartLog, {name:"init", condition:"init"})
  return initSmartLog
}

/**
 * Save an initial 0xCA log data to save when this test run started
 * 
 * @returns {nvme.caLog} - initial 0xCA log
 * 
 * @function saveInitialLogPage0xCA
 * @memberof sonar
 */
sonar.saveInitialLogPage0xCA = function() {
  const initCaLog = nvme.getLogPage0xCA();  
  this.printLogPage0xCA(initCaLog, {name:"init", condition:"init"})
  return initCaLog
}

/**
 * Save a current SMART log data to sonar.prevCaLog
 * 
 * @param {nvme.smartLog} curSmartLog - current SMART log
 * 
 * @function saveCurrentSmartLog
 * @memberof sonar
 */
sonar.saveCurrentSmartLog = function(curSmartLog) {  
  this.prevSmart = curSmartLog
}

/**
 * Get the initial SMART log data at the start of this test run
 * 
 * @returns {nvme.smartLog} - initial SMART log
 * 
 * @function getInitialSmartLog
 * @memberof sonar
 */
sonar.getInitialSmartLog = function() {  
  return this.initialSmart
}

/**
 * Get a previous SMART log data from sonar.prevCaLog
 * 
 * @returns {nvme.smartLog} - previous SMART log
 * 
 * @function getPreviousSmartLog
 * @memberof sonar
 */
sonar.getPreviousSmartLog = function() {  
  return this.prevSmart
}

/**
 * Save a current 0xCA log data to sonar.prevCaLog
 * 
 * @param {nvme.caLog} curCaLog - current 0xCA Intel log
 * 
 * @function saveCurrentLogPage0xCA
 * @memberof sonar
 */
sonar.saveCurrentLogPage0xCA = function(curCaLog) {  
  this.prevCaLog = curCaLog
}

/**
 * Get the initial 0xCA log data at the start of this test run
 * 
 * @returns {nvme.smartLog} - initial 0xCA log
 * 
 * @function getInitialLogPage0xCA
 * @memberof sonar
 */
sonar.getInitialLogPage0xCA = function() {  
  return this.initCaSmart
  
}

/**
 * Get a previous 0xCA log data from sonar.prevCaLog
 * 
 * @returns {nvme.caLog} curCaLog - previous 0xCA log
 * 
 * @function getPreviousLogPage0xCA
 * @memberof sonar
 */
sonar.getPreviousLogPage0xCA = function() {  
  return this.prevCaLog
}

/**
 * Check if a VU library for this NVMe drive is available
 * 
 * @returns {bool} - true:available, false:not available
 * 
 * @function isVuSupported
 * @memberof sonar
 */
sonar.isVuSupported = function() {
  return this.vuSupport
}

