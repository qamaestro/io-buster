/** This is one VU catetory for physical NAND IO
 * @namespace nandIo
 * @type {object} 
 * @name device.vu.nandIo
*/
device.vu.nandIo = {}

/** Create an object to address NAND IO operations.
 * 
 * @returns {nandIoParam}
 * 
 * @function createOperationParameters
 * @memberof device.vu.nandIo
 */
device.vu.nandIo.createOperationParameters = function () {  

    /** class to issue direct NAND IO operations.
     * 
     * @class nandIoParam
     * 
     * @property {phyAdr} phyAdr - object to have physical address information     
     * @property {options} options - object to have operation options
     */
    class nandIoParam {
      constructor () {

        /**
         * @typedef phyAdr
         * @type {object}
         * @property {number} ch - physical channel address of a target NAND LUN, it should be same with 'startChannel'
         * @property {number} ce - physical CE address of a target NAND LUN, it should be same with 'startCe'
         * @property {number} lun - physical LUN address of a target NAND LUN, it should be same with 'startLun'
         * @memberof nandIoParam
         */
        this.phyAdr = {}
        this.phyAdr.ch = 0
        this.phyAdr.ce = 0
        this.phyAdr.lun = 0
        this.phyAdr.startChannel = 0
        this.phyAdr.endChannel = 0
        this.phyAdr.startCe = 0
        this.phyAdr.endCe = 0
        this.phyAdr.startLun = 0
        this.phyAdr.endLun = 0
        this.phyAdr.startBlock = 0
        this.phyAdr.endBlock = 0
        this.phyAdr.startPage = 0
        this.phyAdr.endPage = 0

      /**
       * @typedef options
       * @type {object}
       * @property {number} cellMode - physical channel address of a target NAND LUN, it should be same with 'startChannel'     
       * @memberof nandIoParam
       */
        this.options = {}
        this.options.planeBitmap = 0
        this.options.bypassEcc = 0
        this.options.cellMode = 0
        this.options.pattern = 0
      }
  
      /** Set NAND LUN range to issue NAND operations
       *  All NAND IO commands work with LUN address information set by this function
       * 
       * @param {number} sCh - start channel
       * @param {number} eCh - end channel
       * @param {number} sCe - start CE
       * @param {number} eCe - end CE 
       * @param {number} sLun - start LUN 
       * @param {number} eLun - start LUN 
       * 
       * @function setNandLunRange
       * @memberof nandIoParam
       */
      setNandLunRange (sCh, eCh, sCe, eCe, sLun, eLun) {
        this.phyAdr.startChannel = sCh
        this.phyAdr.endChannel = eCh
        this.phyAdr.startCe = sCe
        this.phyAdr.endCe = eCe
        this.phyAdr.startLun = sLun
        this.phyAdr.endLun = eLun

        this.phyAdr.CH = sCh
        this.phyAdr.CE = sCe
        this.phyAdr.LUN = sLun
      }

      setNandBlockRange (sBlk, eBlk) {
        this.phyAdr.startBlock = sBlk
        this.phyAdr.endBlock = eBlk        
      }

      setNandPageRange (sPage, ePage) {        
        this.phyAdr.startPage = sPage
        this.phyAdr.endPage = ePage
      }

      setNandIoOptions (plnOption, bypassEcc, cellMode, pattern ) {

        switch(cellMode)
            {
            case "SLC" :
                this.options.cellMode   = 1;
                break;
            case "MLC" :
            default :
                this.options.cellMode   = 0;
        }

        switch(bypassEcc)
        {
            case "BYPASS_ECC" :
                this.options.eccBypass  = 1;
                break;
            case "WITH_ECC" :
            default :
                this.options.eccBypass  = 0;
        }

        switch(plnOption)
        {
            case "MULTI_PLANE" :
                this.options.planeType  = 1;
                break;
            case "SINGLE_PLANE" :
            default :
                this.options.planeType  = 0;
        }

        switch(pattern)
        {
            case "USER_PATTERN" :
                this.options.writePattern = "USER";
                break;
            case "AUTO_ALL_0" :
                this.options.writePattern = 1;
                break;
            case "AUTO_ALL_1" :
                this.options.writePattern = 2;
                break;
            case "AUTO_RANDOM" :
            default :
                this.options.writePattern = 0;
        }
      }
    }
  
    const nioParam = new nandIoParam()

    return nioParam
}

/** Get 6 bytes of NAND ID by "Read ID" command
 * 
 * @returns {number[]} - 6 bytes of NAND ID data
 * 
 * @param {nandIoParam.phyAdr} phyAdr - object to have a target LUN address
 * @param {number} phyAdr.ch - physical channel address of a target NAND LUN
 * @param {number} phyAdr.ce - physical CE address of a target NAND LUN
 * @param {number} phyAdr.lun - physical LUN address of a target NAND LUN
 * 
 * @function getNandId
 * @memberof device.vu.nandIo
 */
device.vu.nandIo.getNandId = undefined
