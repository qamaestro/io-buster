function custom_workload(){

  // =========================================================
  // load NVMe driver in IO-Buster 
  // =========================================================
  nvme.probeController()

  // =========================================================
  // Workload generator will access a percentage of the drive 
  // based on the '%' value provided in range field.  
  // In this example, workload will cover 10% of the drive
  // =========================================================
  logger.info('Start percentage-based workload')
  logger.info(nvme.startWorkloadGenerator({
    nsid: 1,
    queueDepth: 32,
    xferSize: 512,
    duration: 100,
    range: '10%',
    readPercent: 0,
    workload: 'random'
  }))

  // =========================================================
  // Workload generator will access a specific size based on 
  // the value provided in 'range' field. The value can end with 
  // 'k', 'm', 'g', 't' to specify the total traffic size. 
  // In this example, 2GB of workload will be generated
  // =========================================================
  logger.info('Start size-based workload')
  logger.info(nvme.startWorkloadGenerator({
    nsid: 1,
    queueDepth: 32,
    xferSize: 512,
    duration: 100,
    range: '2G',
    readPercent: 0,
    workload: 'random'
  }))

  // =========================================================
  // Workload generator can also generate very specific workload
  // according to lba ranges. In this case, an object is provided 
  // in 'range' field with 'startLba' and 'size' describing the 
  // index of start lba and the tranfer size in multiple of sector
  // size. In this example, workload will access lba 10 to 110
  // =========================================================
  logger.info('Start lba-based workload')
  logger.info(nvme.startWorkloadGenerator({
    nsid: 1,
    queueDepth: 32,
    xferSize: 512,
    duration: 100,
    range: {startLba: 10, size: 100},
    readPercent: 0,
    workload: 'random'
  }))

  // =========================================================
  // Workload generator can be even more specific on which lba
  // index it should exercise only. By providing an array of 
  // lba indices, workload generator will only access these lba
  // In this example, workload will access lba 100, 200, 300,
  // 400, and 500 with transfer size of 512 bytes 
  // =========================================================
  logger.info('Start workload based on a list of lba')
  logger.info(nvme.startWorkloadGenerator({
    nsid: 1,
    queueDepth: 32,
    xferSize: 512,
    duration: 100,
    range: [100,200,300,400,500],
    readPercent: 0,
    workload: 'random'
  }))

}

custom_workload()