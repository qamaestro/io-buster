// =======================================
// create a function called basic_workload
// =======================================
function basic_workload () {

  // ================================================
  // logger.info will print information on terminal
  // ================================================
  logger.info('Start basic workload demo')
  
  // =========================================================
  // load NVMe driver in IO-Buster 
  // =========================================================
  nvme.probeController()
  
  // ==============================================
  // nvme.startWorkloadGenerator(...) will start customized 
  // workload according to input parameters and return 
  // status of workload in JSON format when it's completed
  // 
  // for detail description of input parameters, please visit
  // https://qamaestro.github.io/io-buster/nvme.html#.startWorkloadGenerator
  // ==============================================
  res = nvme.startWorkloadGenerator({
    nsid: 1,
    queueDepth: 128,
    xferSize: 512,
    duration: 10,
    loops: 1,
    readPercent: 0,
    workload: 'random'
  })

  // =================================================
  // logger.info can also be used to print JSON object
  // =================================================
  logger.info(res)  

}

// =================
// run basic_workload function
// =================
basic_workload() 