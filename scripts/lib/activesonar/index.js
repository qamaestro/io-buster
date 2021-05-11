/* global importScript, nvme, logger, utility */

const activesonar = {}

importScript('print_helpers.js')
importScript('workload_generator.js')
importScript('test_framework.js')
importScript('../nvme/index.js')

activesonar.init = function () {
  // ==================================================================
  // Load generic PCIe driver and probe NVMe controller
  // ==================================================================
  nvme.probeController()

  // ==================================================================
  // Open log files
  // ==================================================================
  const flowLogFile = 'FlowLog'
  const perfLogFile = 'PerfLog'
  const histLogFile = 'HistLog'
  const smartLogFile = 'SmartLog'

  logger.create('FLOW', `${flowLogFile}.txt`, { useTimestamp: true })
  logger.create('PERF', `${perfLogFile}.txt`, { useTimestamp: false })
  logger.create('HIST', `${histLogFile}.txt`, { useTimestamp: false })
  logger.create('SMART', `${smartLogFile}.txt`, { useTimestamp: false })

  logger.create('PERF_JSON', `${perfLogFile}.json`)
  logger.create('SMART_JSON', `${smartLogFile}.json`)

  activesonar.printPerformanceHeader()
  activesonar.printSmartHeader()

  // ==================================================================
  // Get a host machine information
  // ==================================================================
  const sysInfo = utility.systemInfo()

  logger.log('FLOW', '\n>> Host Information')
  logger.log('FLOW', 'Number of Cores = %d', sysInfo.cpus.length)

  for (let i = 0; i < sysInfo.cpus.length; i++) {
    logger.log('FLOW', 'CORE[%d] Model = %s', i, sysInfo.cpus[i].model)
    logger.log('FLOW', 'CORE[%d] Speed = %d', i, sysInfo.cpus[i].speed)
  }
  logger.log('FLOW', `OS = ${sysInfo.platform}`)
  logger.log('FLOW', `Host_Name = ${sysInfo.hostname}`)
  logger.log(
    'FLOW',
    `Total_Memory = ${(sysInfo.totalmem / (1024 * 1024 * 1024)).toFixed(2)} GiB`
  )
  logger.log('FLOW', `Drive_Port = ${sysInfo.port}`)

  // ==================================================================
  // Identify a NVM controller
  // ==================================================================

  // TODO: Add more vendors
  const listDriveVendors = { '1C5C': 'SK_Hynix' }

  const nvmControllerId = nvme.identifyController()

  const hexVendorId = nvmControllerId.vendor.toString(16).toUpperCase()
  const hexSubVendorId = nvmControllerId.subsysVendor.toString(16).toUpperCase()

  nvmControllerId.manufacturer = listDriveVendors[hexVendorId]

  logger.log('FLOW', '\n>> Drive Identification')
  logger.log('FLOW', `Vendor_ID = 0x${hexVendorId}`)
  logger.log('FLOW', `SUB_Vendor_ID = 0x${hexSubVendorId}`)
  logger.log('FLOW', `Drive_Model = ${nvmControllerId.modelNo}`)
  logger.log('FLOW', `Serial_Number = ${nvmControllerId.serialNo}`)
  logger.log('FLOW', `Firmware_Version = ${nvmControllerId.fwVersion}`)

  // ==================================================================
  // Identify a NVM controller
  // ==================================================================
  const devInfo = nvme.getDeviceInfo()

  logger.log('FLOW', '\n>> Drive Information')
  logger.log('FLOW', `Max Transfer Size = ${devInfo.maxXferSize}`)
  logger.log('FLOW', `Max Queue Depth = ${devInfo.maxQueueDepth}`)
  logger.log('FLOW', `Max Namespace ID = ${devInfo.maxNamespaceId}`)
}
