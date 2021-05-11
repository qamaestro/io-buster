/* global workloadLib */

workloadLib.TS_001 = workloadLib.createWorkload()
workloadLib.TS_001.name = 'Initial_Retention_Basic'

// workloadLib.TS_001.addPreCondition({
//   name: 'PRE_SEQ_FullFill',
//   condition: 0,
//   trial: 2,
//   loops: 1,
//   nsid: 1,
//   queueDepth: 128,
//   xferSize: '128K',
//   workload: 'sequential',
//   readPercent: 0,
//   startOffset: 0,
//   testCapa: '100%'
// })

workloadLib.TS_001.addPreCondition({
  name: 'PRE_SEQ_WRT_1sec',
  condition: 0,
  trial: 1,
  loops: 1,
  nsid: 1,
  queueDepth: 128,
  xferSize: '128K',
  workload: 'sequential',
  readPercent: 0,
  startOffset: '10%',
  testCapa: '4G'
})

workloadLib.TS_001.addMainWorkload({
  name: 'RND_RDD_1sec',
  condition: 0,
  trials: 1,
  loops: 1,
  nsid: 1,
  latency: [1, 10000],
  queueDepth: 32,
  xferSize: '4K',
  workload: 'random',
  readPercent: 100,
  startOffset: '10%',
  testCapa: '4G',
  duration: 1
})
