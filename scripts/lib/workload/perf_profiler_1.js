/* global workloadLib */

workloadLib.perfProfile1 = workloadLib.createWorkload()
workloadLib.perfProfile1.name = 'Basic_Performance_Profiling'

// -----------------------------------------------------------------------------
// Sequential Recovery Write
// -----------------------------------------------------------------------------
workloadLib.perfProfile1.addMainWorkload({
  name: 'PERF:RECOVER_SEQ_FULLFILL',
  trials: 1,
  loops: 2,
  nsid: 1,
  condition: 0,
  queueDepth: 128,
  ioSize: "128K",
  workload: 'sequential',
  readPercent: 0,
  startOffset: 0,
  testCapa: '100%'
})

// -----------------------------------------------------------------------------
// Sequential Write Performance
// -----------------------------------------------------------------------------
workloadLib.perfProfile1.addMainWorkload({
  name: 'PERF:SUS_SEQ_WRT_1RM',
  trials: 1,
  loops: 1,
  nsid: 1,
  condition: 0,
  queueDepth: 128,
  ioSize: "128K",
  workload: 'sequential',
  readPercent: 0,
  startOffset: 0,
  testCapa: '100%'
})

workloadLib.perfProfile1.addMainWorkload({
  name: 'PERF:SUS_SEQ_WRT_5times',
  trials: 5,
  loops: 1,
  nsid: 1,
  condition: 0,
  queueDepth: 128,
  ioSize: "128K",
  workload: 'sequential',
  readPercent: 0,
  startOffset: 0,
  testCapa: '100%',
  duration: 180
})

// -----------------------------------------------------------------------------
// Sequential Read Performance
// -----------------------------------------------------------------------------
workloadLib.perfProfile1.addMainWorkload({
  name: 'PERF:SOAK_SEQ_RDD_1times',
  trials: 1,
  loops: 1,
  nsid: 1,
  condition: 0,
  queueDepth: 128,
  ioSize: "128K",
  workload: 'sequential',
  readPercent: 100,
  startOffset: 0,
  testCapa: '100%',
  duration: 180
})

workloadLib.perfProfile1.addMainWorkload({
  name: 'PERF:SUS_SEQ_RDD_1RM',
  trials: 1,
  loops: 1,
  nsid: 1,
  condition: 0,
  queueDepth: 128,
  ioSize: "128K",
  workload: 'sequential',
  readPercent: 100,
  startOffset: 0,
  testCapa: '100%'
})

workloadLib.perfProfile1.addMainWorkload({
  name: 'PERF:SUS_SEQ_RDD_5times',
  trials: 5,
  loops: 1,
  nsid: 1,
  condition: 0,
  queueDepth: 128,
  ioSize: "128K",
  workload: 'sequential',
  readPercent: 100,
  startOffset: 0,
  testCapa: '100%',
  duration: 180
})

workloadLib.perfProfile1.addMainWorkload({
  name: 'PERF:SEQPRE_RND_RDD_5times',
  trials: 5,
  loops: 1,
  nsid: 1,
  condition: 0,
  queueDepth: 256,
  ioSize: "4K",
  workload: 'random',
  readPercent: 100,
  startOffset: 0,
  testCapa: '100%',
  duration: 180
})

// -----------------------------------------------------------------------------
// Random Write Performance
// -----------------------------------------------------------------------------
workloadLib.perfProfile1.addMainWorkload({
  name: 'PERF:SUS_RND_WRT_1RM',
  trials: 1,
  loops: 1,
  nsid: 1,
  condition: 0,
  queueDepth: 256,
  ioSize: "4K",
  workload: 'random',
  readPercent: 0,
  startOffset: 0,
  testCapa: '100%'
})

workloadLib.perfProfile1.addMainWorkload({
  name: 'PERF:SUS_RND_WRT_5times',
  trials: 5,
  loops: 1,
  nsid: 1,
  condition: 0,
  queueDepth: 256,
  ioSize: "4K",
  workload: 'random',
  readPercent: 0,
  startOffset: 0,
  testCapa: '100%',
  duration: 180
})

workloadLib.perfProfile1.addMainWorkload({
  name: 'PERF:4K_QD1_WRT_5times',
  trials: 5,
  loops: 1,
  nsid: 1,
  condition: 0,
  queueDepth: 1,
  ioSize: "4K",
  workload: 'random',
  readPercent: 0,
  startOffset: 0,
  testCapa: '100%',
  duration: 180
})

// -----------------------------------------------------------------------------
// Random Write Performance
// -----------------------------------------------------------------------------
workloadLib.perfProfile1.addMainWorkload({
  name: 'PERF:SOAK_RND_RDD_1times',
  trials: 1,
  loops: 1,
  nsid: 1,
  condition: 0,
  queueDepth: 256,
  ioSize: "4K",
  workload: 'random',
  readPercent: 100,
  startOffset: 0,
  testCapa: '100%',
  duration: 180
})

workloadLib.perfProfile1.addMainWorkload({
  name: 'PERF:SUS_RND_RDD_1RM',
  trials: 1,
  loops: 1,
  nsid: 1,
  condition: 0,
  queueDepth: 256,
  ioSize: "4K",
  workload: 'random',
  readPercent: 100,
  startOffset: 0,
  testCapa: '100%'
})

workloadLib.perfProfile1.addMainWorkload({
  name: 'PERF:SUS_RND_RDD_5times',
  trials: 5,
  loops: 1,
  nsid: 1,
  condition: 0,
  queueDepth: 256,
  ioSize: "4K",
  workload: 'random',
  readPercent: 100,
  startOffset: 0,
  testCapa: '100%',
  duration: 180
})

workloadLib.perfProfile1.addMainWorkload({
  name: 'PERF:4K_QD1_RDD_5times',
  trials: 5,
  loops: 1,
  nsid: 1,
  condition: 0,
  queueDepth: 1,
  ioSize: "4K",
  workload: 'random',
  readPercent: 100,
  startOffset: 0,
  testCapa: '100%',
  duration: 180
})

// -----------------------------------------------------------------------------
// Random Read Latency
// -----------------------------------------------------------------------------
workloadLib.perfProfile1.addMainWorkload({
  name: 'LAT:4K_QD01_RDD',
  trials: 3,
  loops: 1,
  nsid: 1,
  condition: 0,
  latency: [1, 10000],
  queueDepth: 1,
  ioSize: "4K",
  workload: 'random',
  readPercent: 100,
  startOffset: 0,
  testCapa: '100%',
  duration: 1000
})

workloadLib.perfProfile1.addMainWorkload({
  name: 'LAT:4K_QD32_RDD',
  trials: 3,
  loops: 1,
  nsid: 1,
  condition: 0,
  latency: [1, 10000],
  queueDepth: 32,
  ioSize: "4K",
  workload: 'random',
  readPercent: 100,
  startOffset: 0,
  testCapa: '100%',
  duration: 600
})

// -----------------------------------------------------------------------------
// Random Write Latency
// -----------------------------------------------------------------------------
workloadLib.perfProfile1.addMainWorkload({
  name: 'LAT:4K_QD01_WRT',
  trials: 5,
  loops: 1,
  nsid: 1,
  condition: 0,
  latency: [1, 100000],
  queueDepth: 1,
  ioSize: "4K",
  workload: 'random',
  readPercent: 0,
  startOffset: 0,
  testCapa: '100%',
  duration: 1000
})

workloadLib.perfProfile1.addMainWorkload({
  name: 'LAT:4K_QD32_WRT',
  trials: 5,
  loops: 1,
  nsid: 1,
  condition: 0,
  latency: [1, 100000],
  queueDepth: 32,
  ioSize: "4K",
  workload: 'random',
  readPercent: 0,
  startOffset: 0,
  testCapa: '100%',
  duration: 600
})

// -----------------------------------------------------------------------------
// Mixed Performance
// -----------------------------------------------------------------------------
workloadLib.perfProfile1.addMainWorkload({
  name: 'PERF:4K_MIX_R7W3_5times',
  trials: 5,
  loops: 1,
  nsid: 1,
  condition: 0,
  queueDepth: 256,
  ioSize: "4K",
  workload: 'random',
  readPercent: 70,
  startOffset: 0,
  testCapa: '100%',
  duration: 180
})

workloadLib.perfProfile1.addMainWorkload({
  name: 'LAT:QD1_4K_MIX_R7W3_5times',
  trials: 5,
  loops: 1,
  nsid: 1,
  condition: 0,
  latency: [1, 100000],
  queueDepth: 1,
  ioSize: "4K",
  workload: 'random',
  readPercent: 70,
  startOffset: 0,
  testCapa: '100%',
  duration: 1000
})

workloadLib.perfProfile1.addMainWorkload({
  name: 'LAT:QD32_4K_MIX_R7W3_5times',
  trials: 5,
  loops: 1,
  nsid: 1,
  condition: 0,
  latency: [1, 100000],
  queueDepth: 32,
  ioSize: "4K",
  workload: 'random',
  readPercent: 70,
  startOffset: 0,
  testCapa: '100%',
  duration: 600
})
