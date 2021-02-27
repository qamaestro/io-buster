function latency_measurement(){

  // =========================================================
  // load NVMe driver in IO-Buster 
  // =========================================================
  nvme.probeController()

  // =============================================================
  // WorkloadGenerator comes with build-in I/O completion latency 
  // analytical data. To enable the measurement, simply enable
  // histogram feature and output data can be retreived from
  // res.<read/write>.latency
  // =============================================================
  res = nvme.startWorkloadGenerator({
    nsid: 1,
    queueDepth: 32,
    xferSize: 512,
    duration: 100,
    loops: 1,
    readPercent: 0,
    workload: 'random', 
    features: { histogram: { 
      enabled: true
    }}
  })

  // =============================================================
  // I/O completion latency outputs are recorded in the following format
  // first - lowest I/O completion time in us
  // perc50 - 50% of the I/O are completed within this time (us)
  // perc90 - 90% of the I/O are completed within this time (us)
  // perc99 - 99% of the I/O are completed within this time (us)
  // nines3 - 99.9% of the I/O are completed within this time (us)
  // =============================================================
  logger.info(res.write)

  // =============================================================
  // WorkloadGenerator also provide configurable latency measurement 
  // in raw bucket data format with start/end time and precision. 
  // =============================================================
  res = nvme.startWorkloadGenerator({
    nsid: 1,
    queueDepth: 32,
    xferSize: 512,
    duration: 100,
    loops: 1,
    readPercent: 0,
    workload: 'random', 
    features: { histogram: { 
      enabled: true, 
      startUs: 100, 
      endUs: 100000, 
      precisions: 4, 
      rawData: true
    }}
  })

  // =============================================================
  // Latency raw data contains array of measurements elements and 
  // each element contains start/end time for each bucket as well 
  // as number of I/O counts 
  // =============================================================
  logger.info(res.write.histogramRawData)
}

latency_measurement()