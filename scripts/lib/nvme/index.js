/* global nvme 
   This extends existing nvme library
*/

/**
 * All functions under this directory are extension of existed IO Buster nvme
 * 
 * @namespace nvme
 */

nvme.opcode = {}

nvme.opcode.admin = {
   GET_LOG_PAGE:0x02,
   IDENTIFY:0x06,
}

nvme.opcode.nvm = {
   WRITE:0x01,
   READ:0x02,
   DATASET_MANAGEMENT:0x09,
}

importScript('data_io.js')
importScript('dataset_management.js')
importScript('identify.js')
importScript('get_log_page.js')
