/**
 * @namespace serial
*/

const serial = {}

// Object to register device handlers of serial devices.
serial.deviceList = {}

/**
 * Open a serial connection
 *  - You must write a proper scan algorithm for your specific hardware.
 *  - This scan function is based on Arden PMU v.5.0
 *
 * @function openConnection
 * @memberof serial
 * 
 * @param {String} type - serial type
 *                      - "UART" / "PMU" 
 * @param {Object} serialObj - Object which has FTDI information for a serial IF
 * @param {Number} serialObj.uartInterface - A product ID of UART IF board. An indicator for its existance
 * @param {Number} serialObj.switch - A product ID of serial shared with Power Switching Unit
 * @param {Number} serialObj.baudRate - serial baudrate
 * @param {Number} serialObj.readInterval - read interval time(mS unit) from Rx 
 * @param {Number} uartserialObjObj.newline - newline character on serial
 * 
 * @returns {Number} - true = open success, false = open failure 
 *                                   
*/
serial.openConnection = function (type, serialObj) {

    let handler = undefined
    const curPort = utility.systemInfo().port;   

    try{
        
        if(serialObj.uartInterface != undefined){ 
            // Connection with an interface board whih has "IF004" S/N
            handler= serialport.open('ftdi', {
                vendor: 0x0403,
                product: serialObj.uartInterface,
                serial: `IF004`,
                interface: curPort+1,
                baudRate: 115200,
                readInterval: 5,
                newline: '\r'
            })            
        } else {          
            
            errorutils.assertCritical( 
                type == "UART" || type == "PMU",
                `[Type Error] Serial types must be "UART" or "PMU".`)

            let productId = 0
            let strSerial = null

            if(type == "PMU") {
                productId = serialObj.controller
                strSerial = `PMU-V${serialObj.version}-${curPort}`
            } else {
                productId = serialObj.switch
                strSerial = `AMS-V${serialObj.version}-${curPort}`
            }            

            //  Direct connection without IF board
            handler= serialport.open('ftdi', {
                vendor: 0x0403,
                product: productId,
                serial: strSerial,
                interface: 1,
                baudRate: 115200,
                readInterval: 5,
                newline: '\r'
            })
        }
        
        serial.deviceList[type] = handler // register a current target device handler
        logger.log("FLOW", `[PASS] ${type} Connection`)
    }
    catch(e) {
        logger.log("FLOW", `[FAIL] ${type} Connection`)
        logger.log("FLOW", e)

    }
}

serial.isAvailableConnection = function (type) {
    if(serial.deviceList[type] != undefined) {
        return true
    } else {
        return false
    }
}

/**
 * Send a serial command
 *
 * @function sendCommand
 * @memberof serial
 *
 * @param {String} type - a serial device type registered in {Object} serial.deviceList
 * @param {String} strCmd - an serial command 
 * @param {Number} loop - a loop number of the issued serial command(strCmd)
 *                                   
*/
serial.sendCommand = function(type, strCmd, loop) {

    if(this.deviceList.hasOwnProperty(type) == false) {
        return
    }

    // null or ""(empty string) is an Enter input
    for(let i = 0 ; i < loop ; i++) {
        if(strCmd == null || strCmd == "") {
            serialport.sendLine(this.deviceList[type]);
        } else {
            serialport.sendLine(this.deviceList[type], strCmd);
        }
        utility.sleep(100)
    }    
}

/**
 * Wait for matched strings on UART
 *
 * @function waitForMatchingStrings
 * @memberof serial
 * 
 * @param {String} type - a serial device type registered in {Object} serial.deviceList
 * @param {Array} aryMatchStr - an array of target matching stringss
 * @param {Number} timeoutS - timout(mS) if this framework cannot detect target matching strings
 *                                   
*/
serial.waitForMatchingStrings = function(type, aryMatchStr, timeoutS) {

    if(this.deviceList.hasOwnProperty(type) == false) {
        return
    }

    try{
        const matchedString = serialport.wait(
            this.deviceList[type], 
            {
                patterns:aryMatchStr, 
                timeoutMs:timeoutS*1000, 
                flushBeforeWait:false
            });

        return matchedString
    }
    catch(e){
        errorutils.assertCritical(
            false, 
            `[Match UART String] Cannot find the matching strings on UART.\n
            Timeout Failure to match target strings.\n
            Timeout = ${timeoutS} sec
            Match Strings = ${aryMatchStr} sec`)
            
        return ""
    }   
}

/**
 * connect UART Rx to the UART log file
 *
 * @function openLogFile
 * @memberof serial
 * 
 * @param {String} type - a serial device type registered in {Object} serial.deviceList
 *                                   
*/
serial.connectLogFile = function(type) {

    if(this.deviceList.hasOwnProperty(type) == false) {
        return
    }  
    
    serialport.pipe(this.deviceList[type], "UART")
}

/**
 * write a string to the UART log file
 *
 * @function writeStringToLogFile
 * @memberof serial
 * 
 * @param {String} type - a serial device type registered in {Object} serial.deviceList
 * @param {Number} fileHandler - a file hanlder to point a target log file
 * @param {String} strMsg - printing message 
 *                                   
*/
serial.writeStringToLogFile = function(type, fileHandler, strMsg) {

    if(this.deviceList.hasOwnProperty(type) == false) {
        return
    }

    errorutils.assertCritical( 
        typeof(strMsg) == 'string', 
        `[Write Log] Argument should be a string.`)
    
    logger.log(fileHandler, strMsg)
}

/**
 * disconnect the UART log file
 *
 * @function disconnectLogFile
 * @memberof serial  
 * 
 * @param {String} type - a serial device type registered in {Object} serial.deviceList
 *                                   
*/
serial.disconnectLogFile = function(type) {

    if(this.deviceList.hasOwnProperty(type) == false) {
        return
    }

    serialport.unpipe(this.deviceList[type])
}

/**
 * send a file to a device via UART
 *   - without txOption(Default) : binary transfer
 *   - with txOpeion : other transfer protocol
 *
 * @function sendFile
 * @memberof serial
 * 
 * @param {String} type - a serial device type registered in {Object} serial.deviceList
 * @param {String} filename - filename with file path
 * @param {Object} txOption - an object which has a transfer protocol and timeout(mS) condition
 *                                   
*/
serial.sendFile = function(type, filename, txOption) {    

    if(this.deviceList.hasOwnProperty(type) == false) {
        return
    }

    if(txOption != undefined) {

        errorutils.assertCritical(
            (txOption.protocol == null || txOption.protocol == 'ymodem'), 
            `[Send file via UART] IOB can support on binary and ymodem protocol.`)

        serialport.sendFile(
            this.deviceList[type], 
            filename, 
            {
                protocol:txOption.protocol, 
                timeoutMs:txOption.timeoutS*1000
        })
    } else { // default binary transfer
        serialport.sendFile(this.deviceList[type], file)
    }
}

/**
 * close a serial connection
 * 
 * @function closeConnection
 * @memberof serial
 * 
 * @param {String} type - a serial device type registered in {Object} serial.deviceList
 *                                   
*/
serial.closeConnection = function(type) {

    if(this.deviceList.hasOwnProperty(type) == false) {
        return
    }s
    
    serialport.close(this.deviceList[type])
}


