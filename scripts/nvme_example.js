'use strict'

function main () {
  logger.info('systemInfo()')
  const info = systemInfo()

  logger.create('perf', 'perf.log', { useTimestamp: false })
  logger.log('perf', 'test message')

  logger.info(info.cpus)
  logger.info(info.hostname)
  logger.info(info.platform)
  logger.info(info.type)
  logger.info(info.totalmem)
  logger.info(info.uptime)

  logger.info('loadDriver()')
  loadDriver()

  // show device info
  logger.info('getDeviceInfo()')
  logger.info(getDeviceInfo())

  // show namespace info
  logger.info('getNamespaceInfo(1)')
  logger.info(getNamespaceInfo(1))

  // send admin command identify
  logger.info('sendAdminCommand(...)')
  const buf = Buffer.alloc(4096)
  logger.info(sendAdminCommand({
    opc: 0x06,
    nsid: 0,
    cdw10: 1
  }, buf, false))

  logger.info('startWorkloadGenerator(...)')
  logger.info(startWorkloadGenerator({
    nsid: 1,
    queueDepth: 128,
    xferSize: 512,
    duration: 10,
    loops: 1,
    readPercent: 0,
    workload: 'random'
  }))

  /* ================================================================================ */
  /*     SEQ WRITE Q-Depth Dependency                                               */
  /* ================================================================================ */
  for (const qd of [128, 256, 512, 1024, 2048]) {
    logger.info(`Sequential Write, XferSize=4096b, QD=${qd}`)
    const res = startWorkloadGenerator({
      nsid: 1,
      queueDepth: qd,
      xferSize: 4096,
      duration: 10,
      loops: 1,
      readPercent: 0,
      workload: 'sequential',
      range: '100%'
    })
    logger.info(JSON.stringify(res.write.perf))
  }

  /* ================================================================================ */
  /*     SEQ WRITE IO-Size Dependency                                               */
  /* ================================================================================ */
  for (const io of [4096 * 16, 4096 * 32, 4096 * 64]) {
    logger.info(`Sequential Write, XferSize=${io}b, QD = 256`)
    const res = startWorkloadGenerator({
      nsid: 1,
      queueDepth: 256,
      xferSize: io,
      duration: 10,
      loops: 1,
      readPercent: 0,
      workload: 'sequential',
      range: '100%'
    })
    logger.info(JSON.stringify(res.write.perf))
  }
}

main()
