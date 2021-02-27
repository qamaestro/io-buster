/**
   * Get a host name
   *
   * @function getHostName
   * @memberof sonar
   * 
   * @returns {String} - a host name
   */
sonar.getHostName = function() {
   return this.hostInfo.hostname
}

/**
   * Get a port number
   *
   * @function getDrivePort
   * @memberof sonar
   * 
   * @returns {Number} - port number
   */
sonar.getDrivePort = function() {   
   return this.hostInfo.port
}

/**
   * Get a framework version
   *
   * @function getFrameworkVersion
   * @memberof sonar
   * 
   * @returns {String} - a host name
   */
sonar.getFrameworkVersion = function() {   
   return this.hostInfo.frameworkVersion
}

/**
   * Get a drive vendor name by NVMe Identify CMD
   *
   * @function getNvmeVendorName
   * @memberof sonar
   * 
   * @returns {String} - a vendor name
   */
sonar.getNvmeVendorName = function() {
   this.controllerInfo = this.identifyNvmController()
   return this.controllerInfo.vendor
}

/**
   * Get a drive vendor Id by NVMe Identify CMD
   *
   * @function getNvmeVendorId
   * @memberof sonar
   * 
   * @returns {Number} - 4 bytes of drive vendor ID
   */
sonar.getNvmeVendorId = function() {   
   this.controllerInfo = this.identifyNvmController()
   return this.controllerInfo.vendorId
}

/**
   * Get a drive serial number by NVMe Identify CMD
   *
   * @function getNvmeSerialNumber
   * @memberof sonar
   * 
   * @returns {String} - serial number
   */
sonar.getNvmeSerialNumber = function() {   
   this.controllerInfo = this.identifyNvmController()
   return this.controllerInfo.serial
}

/**
   * Get a drive model number by NVMe Identify CMD
   *
   * @function getNvmeModelNumber
   * @memberof sonar
   * 
   * @returns {String} - model number
   */
  sonar.getNvmeModelNumber = function() {   
   this.controllerInfo = this.identifyNvmController()
   return this.controllerInfo.model
}

/**
   * Get a drive firmware version by NVMe Identify CMD
   *
   * @function getDriveVendorId
   * @memberof sonar
   * 
   * @returns {String} - firmware version
   */
  sonar.getNvmeFirmwareVersion = function() {   
   this.controllerInfo = this.identifyNvmController()
   return this.controllerInfo.fwVersion
}

/**
   * Get a max number of LBA by NVMe Identify CMD
   *
   * @function getNvmeMaxLbaNumber
   * @memberof sonar
   * 
   * @returns {Number} - byte size of LBA
   */
  sonar.getNvmeMaxLbaNumber = function() {   
   this.namespaceInfo = this.identifyNvmNamespace(1)
   return this.namespaceInfo.maxLbaNumber
}

/**
   * Get a byte size of LBA by NVMe Identify CMD
   *
   * @function getLbaSize
   * @memberof sonar
   * 
   * @returns {Number} - byte size of LBA
   */
sonar.getNvmeLbaSize = function() {   
   this.namespaceInfo = this.identifyNvmNamespace(1)
   return this.namespaceInfo.lbaSize
}

/**
   * Get a drive capacity by NVMe Identify CMD
   *
   * @function getDriveCapacity
   * @memberof sonar
   * 
   * @returns {Number} - byte size of drive capacity
   */
sonar.getDriveCapacity = function() {   
   this.namespaceInfo = this.identifyNvmNamespace(1)
   return this.namespaceInfo.capacity
}
