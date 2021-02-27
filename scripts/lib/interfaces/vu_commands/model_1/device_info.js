/** This is one VU catetory to set or get device information
 *    - Serial and model number
 *    - Firmware version
 *    - SSD channel configuration 
 *    - important firmware data structures for debugging
 * 
 * @namespace info
 * @type {object} 
 * @name device.vu.info
*/
device.vu.info = {}

/** 
 * @typedef deviceArchObj
 * @type {object}
 * @property {commonInfo} common
 * @property {socInfo} soc
 * @property {dramInfo} dram
 * @property {nandInfo} nand
 * @property {blockLayoutInfo} blockLayout
 * @property {ftlInfo[]} ftl
 * @memberof device.vu.info
*/
device.vu.info.deviceArch = {}

/** 
 * @typedef commonInfo
 * @type {object}
 * @property {string} driveCapacity - drive capacity with "G"(giga) or "T"(tera) notation
 * @property {string} customer - target customer
 * @property {string} formFactor - target drive form factor
 * @property {number} numOfNandDies - number of entire NAND dies on this drive
 * @property {number} numOfFcpu - number of entire FTL cores on this drive
 * @property {number} channelsPerFcpu - number of physical NAND channels on a FTL core
 * @property {number} cesPerChannel - number of NAND CEs one a physical NAND channel
 * @property {number} lunsPerCe - number of NAND LUNs one a physical NAND CE
 * @property {number} lbaSize - number of NAND LUNs one a physical NAND CE
 * @property {number} superBlockSizeKb - KB size of a super block size 
 * @property {number} superPageSizeKb - KB size of a super page size 
 * @property {number} physicalBlockSizeKb - KB size of a physical NAND block 
 * @property {number} bgmsSelectiveWlScan - indicator of Forced BGMS(selective WL scan) 
 * @property {number} bgmsCurrentVsbn - current VSBN of Forced BGMS
 * @property {number} bgmsCurrentWl - current WL of Forced BGMS
 * @memberof device.vu.info
*/
device.vu.info.deviceArch.common = {}

/** 
 * @typedef nandInfo
 * @type {object}
 * @property {string} name - nand product name (ex. S96_512Gb_TLC)
 * @property {number} planes - number of planes on a NAND LUN 
 * @property {number} blocksPerPlane - number of physical NAND bloks on a NAND plane
 * @property {number} pagesPerBlock - number of physica pages on a NAND physical block
 * @property {number} sizeOfLpn - byte size of LPN(logical page = mapping unit)
 * @property {number} sizeOfPage - byte size of the main(data) area of a physical NAND page
 * @property {number} sizeOfSpare - byte size of the spare(ECC parity and meta data) area of a physical NAND page
 * @property {string} revision - NAND revision name
 * @memberof device.vu.info
*/
device.vu.info.deviceArch.nand = {}

/** 
 * @typedef blockLayoutInfo
 * @type {object}
 * @property {number} lpnsSplitPerCore - number of LPNs on a FCPU core
 * @property {number} fwStartBlock - start VSBN of the firmware area
 * @property {number} fwEndBlock - end VSBN of the firmware area
 * @property {number} rootStartBlock - start VSBN of the root area
 * @property {number} rootEndBlock - end VSBN of the root area
 * @property {number} vflStartBlock - start VSBN of the VFL area
 * @property {number} vflEndBlock - end VSBN of the VFL area
 * @property {number} coredumpStartBlock - start VSBN of the coredump area
 * @property {number} coredumpEndBlock - end VSBN of the coredump area
 * @property {number} hilMetaStartBlock - start VSBN of the HIL meta area
 * @property {number} hilMetaEndBlock - end VSBN of the HIL meta area
 * @property {number} plpStartBlock - start VSBN of the PLP area
 * @property {number} plpEndBlock - end VSBN of the PLP area
 * @property {number} mapStartBlock - start VSBN of the map area
 * @property {number} mapEndBlock - end VSBN of the map area
 * @property {number} mapMirrorStartBlock - start VSBN of the map mirror area
 * @property {number} mapMirrorEndBlock - end VSBN of the map mirror area
 * @property {number} reservedStartBlock - start VSBN of the reserved area
 * @property {number} reservedEndBlock - end VSBN of the reserved area
 * @property {number} userStartBlock - start VSBN of the user area
 * @property {number} userEndBlock - end VSBN of the user area
 * @property {number} trackerStartBlock - start VSBN of the Tracker log area
 * @property {number} trackerEndBlock - end VSBN of the Tracker log area
 * @memberof device.vu.info
*/
device.vu.info.deviceArch.blockLayout = {}

/** 
 * @typedef socInfo
 * @type {object}
 * @property {string} name - SoC name
 * @property {string} revision - SoC revision
 * @property {number} lbaEccSize - ECC size of LBA
 * @property {number} lpnEccSize - ECC size of LPN
 * @property {number} metaEccSize - ECC size of meta
 * @memberof device.vu.info
*/
device.vu.info.deviceArch.soc = {}

/** 
 * @typedef dramInfo
 * @type {object}
 * @property {string} type - DRAM type 
 * @memberof device.vu.info
*/
device.vu.info.deviceArch.dram = {}

/** 
 * @typedef ftlInfo
 * @type {object}
 * @property {string} type - DRAM type 
 * @memberof device.vu.info
*/
device.vu.info.deviceArch.ftl = [{}, {}, {}, {}]

/**
 * @typedef ftlInfo
 * @type {object}
 * @property {number} currentVsbnUserWrite - current using VSBN for user write
 * @property {number} currentVpnUserWrite - current using VPN for user write
 * @property {number} nextVsbnUserWrite - next VSBN for user write
 * @property {number} currentVsbnGcWrite - current using VSBN for GC write
 * @property {number} currentVpnGcWrite - current using VPN for GC write
 * @property {number} nextVsbnGcWrite - next VSBN for GC write
 * @property {number} currentVsbnRefresherWrite - current using VSBN for Refresher write
 * @property {number} currentVpnRefresherWrite - current using VPN for Refresher write
 * @property {number} nextVsbnRefresherWrite - next VSBN for Refresher write
 * @property {number} currentCellMode - current cell mode
 * @property {number} bgmsState - BGMS state
 * @property {number} bgmsNumVsbnToScan - number of VSBN to scan
 * @property {number} bgmsFirstLoopTimer - first loop timer of BGMS
 * @property {number} bgmsNextLoopTimer - next loop timer of BGMS
 * @property {number} bgmsSearchStartVsbn - search start VSBN of BGMS
 * @property {number} bgmsSearchEndVsbn - search end VSBN of BGMS
 * @memberof device.vu.info
 */

/**
 * Get build information of a current device firmware 
 * 
 * @returns {fwBuildInfo}
 * 
 * @function getFirmwareBuildInformation
 * @memberof device.vu.info 
*/
device.vu.info.getFirmwareBuildInformation = undefined

/**
 * Get device information of devivce configuration and block layout
 * 
 * @returns {deviceArchObj}
 * 
 * @function getDeviceArchitecture
 * @memberof device.vu.info 
*/
device.vu.info.getDeviceArchitecture = undefined

/** Get a drive capapcity
 *
 * @returns {string} - drive capacity with "G", "T" notation
 *
 * @function getDriveCapacity
 * @memberof device.vu.info
*/
device.vu.info.getDriveCapacity = function() {
    return device.vu.info.deviceArch.common.driveCapacity
}

/** Get a drive customer
 *
 * @returns {string} - customer name
 *
 * @function getDriveCustomer
 * @memberof device.vu.info
*/
device.vu.info.getDriveCustomer = function() {
    return device.vu.info.deviceArch.common.customer
}

/** Get a drive form factor
 *
 * @returns {string} - form factor name
 *
 * @function getDriveFormFactor
 * @memberof device.vu.info
*/
device.vu.info.getDriveFormFactor = function() {
    return device.vu.info.deviceArch.common.formFactor
}

/** Get a number of FTL cores
 *
 * @returns {Number} - a number of FTL cores
 *
 * @function getNumberOfFltCores
 * @memberof device.vu.info
*/
device.vu.info.getNumberOfFltCores = function() {
    return device.vu.info.deviceArch.common.numOfFcpu
}

/** Get a number of channels per FCPU core
 * 
 * @returns {Number} - a number of channels per FTL core
 * 
 * @function getNumberOfChannelsPerCore
 * @memberof device.vu.info
*/
device.vu.info.getNumberOfChannelsPerCore = function() {
    return device.vu.info.deviceArch.common.channelsPerFcpu
}

/** Get a number of CEs per SSD channel
 * 
 * @returns {Number} - a number of NAND CEs per channel
 * 
 * @function getNumberOfCEsPerChannel
 * @memberof device.vu.info
*/
device.vu.info.getNumberOfCEsPerChannel = function() {
    return device.vu.info.deviceArch.common.cesPerChannel
}

/** Get a number of LUNs per NAND CE
 * 
 * @returns {Number} - a number of NAND LUNs per CE
 * 
 * @function getNumberOfLunsPerCE
 * @memberof device.vu.info
*/
device.vu.info.getNumberOfLunsPerCE = function() {
    return device.vu.info.deviceArch.common.lunsPerCe
}

/** Get a LBA size
 * 
 * @returns {Number} - LBA size
 * 
 * @function getLbaSize
 * @memberof device.vu.info
*/
device.vu.info.getLbaSize = function() {
    return device.vu.info.deviceArch.common.lbaSize
}

/** Get a KB size of a super block size
 * 
 * @returns {Number} - super block size
 * 
 * @function getSuperBlockKbSize
 * @memberof device.vu.info
*/
device.vu.info.getSuperBlockKbSize = function() {
    return device.vu.info.deviceArch.common.superBlockSizeKb
}

/** Get a KB size of a super page size
 * 
 * @returns {Number} - super page size
 * 
 * @function getSuperPageKbSize
 * @memberof device.vu.info
*/
device.vu.info.getSuperPageKbSize = function() {
    return device.vu.info.deviceArch.common.superPageSizeKb
}

/** Get a KB size of a physical NAND block size
 * 
 * @returns {Number} - physical NAND block size
 * 
 * @function getNandBlockKbSize
 * @memberof device.vu.info
*/
device.vu.info.getNandBlockKbSize = function() {
    return device.vu.info.deviceArch.common.physicalBlockSizeKb
}

/** Get an enable indicator of the Forced(Selective WL)-BGMS
 * 
 * @returns {Number} - 0:not support / 1:support
 * 
 * @function isSelectiveBgmsSupported
 * @memberof device.vu.info
*/
device.vu.info.isSelectiveBgmsSupported = function() {
    return device.vu.info.deviceArch.common.bgmsSelectiveWlScan
}

/** Get a VSBN of selective WL BGMS
 * 
 * @returns {Number} - VSBN
 * 
 * @function getCurrentVsbnOfSelectiveWlBgms
 * @memberof device.vu.info
*/
device.vu.info.getCurrentVsbnOfSelectiveWlBgms = function() {
    return device.vu.info.deviceArch.common.bgmsCurrentVsbn
}

/** Get a current WL of selective WL BGMS
 * 
 * @returns {Number} - WL number
 * 
 * @function getCurrentWlOfSelectiveWlBgms
 * @memberof device.vu.info
*/
device.vu.info.getCurrentWlOfSelectiveWlBgms = function() {
    return device.vu.info.deviceArch.common.bgmsCurrentWl
}

/** Get a NAND product name
 * 
 * @returns {String} - NAND product name
 * 
 * @function getNandProductName
 * @memberof device.vu.info
*/
device.vu.info.getNandProductName = function() {
    return device.vu.info.deviceArch.nand.name
}

/** Get a number of planes in a NAND die
 * 
 * @returns {Number} - a number of planes in a NAND die
 * 
 * @function getNumberOfNandPlanes
 * @memberof device.vu.info
*/
device.vu.info.getNumberOfNandPlanes = function() {
    return device.vu.info.deviceArch.nand.planes
}

/** Get a number of NAND blocks in a NAND plane
 * 
 * @returns {Number} - a number of NAND blocks in a NAND plane
 * 
 * @function getNumberOfNandBlockPerPlane
 * @memberof device.vu.info
*/
device.vu.info.getNumberOfNandBlockPerPlane = function() {
    return device.vu.info.deviceArch.nand.blocksPerPlane
}

/** Get a number of NAND blocks in a NAND LUN
 * 
 * @returns {Number} - a number of NAND blocks in a NAND LUN
 * 
 * @function getNumberOfNandBlockPerLun
 * @memberof device.vu.info
*/
device.vu.info.getNumberOfNandBlockPerLun = function() {
    return (device.vu.info.deviceArch.nand.blocksPerPlane * device.vu.info.deviceArch.nand.planes)
}

/** Get a number of pages in a NAND block
 * 
 * @returns {Number} - a number of pages in a NAND block
 * 
 * @function getNumberOfNandPagesPerBlock
 * @memberof device.vu.info
*/
device.vu.info.getNumberOfNandPagesPerBlock = function() {
    return device.vu.info.deviceArch.nand.pagesPerBlock
}

/** Get a logical page size of FTL
 * 
 * @returns {Number} - a logical page size of FTL
 * 
 * @function getLogicalPageSize
 * @memberof device.vu.info
*/
device.vu.info.getLogicalPageSize = function() {
    return device.vu.info.deviceArch.nand.pagesPerBlock
}

/** Get a physical page main size of a NAND page
 * 
 * @returns {Number} - a physical page main size of a NAND page
 * 
 * @function getNandPageMainSize
 * @memberof device.vu.info
*/
device.vu.info.getNandPageMainSize = function() {
    return device.vu.info.deviceArch.nand.sizeOfPage
}

/** Get a physical page spare size of a NAND page
 * 
 * @returns {Number} - a physical page spare size of a NAND page
 * 
 * @function getNandPageSpareSize
 * @memberof device.vu.info
*/
device.vu.info.getNandPageSpareSize = function() {
    return device.vu.info.deviceArch.nand.sizeOfSpare
}

/** Get a SoC name
 * 
 * @returns {String} - a SoC name
 * 
 * @function getSocName
 * @memberof device.vu.infos
*/
device.vu.info.getSocName = function() {
    return device.vu.info.deviceArch.soc.name
}

/** Get a SoC revision
 * 
 * @returns {String} - a SoC revision
 * 
 * @function getSocRevision
 * @memberof device.vu.info
*/
device.vu.info.getSocRevision = function() {
    return device.vu.info.deviceArch.soc.revision
}