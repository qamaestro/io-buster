/** - Basic Sequential Write with QD=128 IO=128K
 * - You can use this object as a base recipe
 * @typedef basicSeqWrite
 * @type {object}
 * @property {string} [name="SEQ_WRITE"]
 * @property {number} [trials=1]
 * @property {number} [loops=1]
 * @property {number} [nsid=1]
 * @property {string} [testTag="INIT"]
 * @property {number} [queueDepth=128]
 * @property {number|string} [ioSize="128K"]
 * @property {string} [workload="sequential"]
 * @property {number} [readPercent=0]
 * @property {number} [startOffset=0]
 * @property {string} [testCapa="100%"]
 * @memberof sonar.workLib
 */
sonar.workLib.SEQ_WRITE = {    
   name:"SEQ_WRITE",
   trials: 1,
   loops: 1,
   nsid: 1,
   testTag: "INIT",
   queueDepth: 128,
   ioSize: "128K",
   workload: "sequential",
   readPercent: 0,
   startOffset: 0,
   testCapa: "100%"
}

/**
 * Basic Sequential Read with QD=128 IO=128K
 * @typedef basicSeqRead
 * @type {object}
 * @property {string} [name="SEQ_READ"]
 * @property {number} [trials=1]
 * @property {number} [loops=1]
 * @property {number} [nsid=1]
 * @property {string} [testTag="INIT"]
 * @property {number} [queueDepth=128]
 * @property {number|string} [ioSize="128K"]
 * @property {string} [workload="sequential"]
 * @property {number} [readPercent=100]
 * @property {number} [startOffset=0]
 * @property {string} [testCapa="100%"]
 * @memberof sonar.workLib
 */
sonar.workLib.SEQ_READ = {
   name:"SEQ_READ",
   trials: 1,
   loops: 1,
   nsid: 1,
   testTag: "INIT",
   queueDepth: 128,
   ioSize: "128K",
   workload: 'sequential',
   readPercent: 100,
   startOffset: 0,
   testCapa: '100%'
}

/**
 * Basic Random 4KB Write with QD=256 IO=4K
 * @typedef basicRndWrite
 * @type {object}
 * @property {string} [name="RND_WRITE"]
 * @property {number} [trials=1]
 * @property {number} [loops=1]
 * @property {number} [nsid=1]
 * @property {string} [testTag="INIT"]
 * @property {number} [queueDepth=256]
 * @property {number|string} [ioSize="4K"]
 * @property {string} [workload="random"]
 * @property {number} [readPercent=0]
 * @property {number} [startOffset=0]
 * @property {string} [testCapa="100%"]
 * @memberof sonar.workLib
 */
sonar.workLib.RND_WRITE = {
   name:"RND_WRITE",
   trials: 1,
   loops: 1,
   nsid: 1,
   testTag: "INIT",
   queueDepth: 256,
   ioSize: "4K",
   workload: 'random',
   readPercent: 0,
   startOffset: 0,
   testCapa: '100%'
}

/**
 * Basic Random 4KB Read with QD=256 IO=4K
 * @typedef basicRndRead
 * @type {object}
 * @property {string} [name="RND_READ"]
 * @property {number} [trials=1]
 * @property {number} [loops=1]
 * @property {number} [nsid=1]
 * @property {string} [testTag="INIT"]
 * @property {number} [queueDepth=256]
 * @property {number|string} [ioSize="4K"]
 * @property {string} [workload="random"]
 * @property {number} [readPercent=100]
 * @property {number} [startOffset=0]
 * @property {string} [testCapa="100%"]
 * @memberof sonar.workLib
 */
sonar.workLib.RND_READ = {
   name:"RND_READ",
   trials: 1,
   loops: 1,
   nsid: 1,
   testTag: "INIT",
   queueDepth: 256,
   ioSize: "4K",
   workload: 'random',
   readPercent: 100,
   startOffset: 0,
   testCapa: '100%'
}

/**
 * Basic Random Mixed 4KB Read with QD=256 IO=4K Read=50% Write=50%
 * @typedef basicRndMixed
 * @type {object}
 * @property {string} [name="RND_MIXED"]
 * @property {number} [trials=1]
 * @property {number} [loops=1]
 * @property {number} [nsid=1]
 * @property {string} [testTag="INIT"]
 * @property {number} [queueDepth=256]
 * @property {number|string} [ioSize="4K"]
 * @property {string} [workload="random"]
 * @property {number} [readPercent=50]
 * @property {number} [startOffset=0]
 * @property {string} [testCapa="100%"]
 * @memberof sonar.workLib
 */
sonar.workLib.RND_MIXED = {
   name:"RND_MIXED",
   trials: 1,
   loops: 1,
   nsid: 1,
   testTag: "INIT",
   queueDepth: 256,
   ioSize: "4K",
   workload: 'random',
   readPercent: 50,
   startOffset: 0,
   testCapa: '100%'
}

/**
 * Basic Random QD1 4KB Write for latency measure with QD=1 IO=4K 
 * @typedef basicRndWriteLatency
 * @type {object}
 * @property {string} [name="RND_QD1_WRT_LATENCY"]
 * @property {number} [trials=1]
 * @property {number} [loops=1]
 * @property {number} [nsid=1]
 * @property {string} [testTag="INIT"]
 * @property {number} [queueDepth=1]
 * @property {number|string} [ioSize="4K"]
 * @property {string} [workload="random"]
 * @property {number} [readPercent=0]
 * @property {number} [startOffset=0]
 * @property {string} [testCapa="100%"]
 * @property {number[]} [testCapa=[1,100000]]
 * @memberof sonar.workLib
 */
sonar.workLib.RND_LAT_QD1_WRT = {
   name:"RND_QD1_WRT_LATENCY",
   trials: 1,
   loops: 1,
   nsid: 1,
   testTag: "INIT",
   queueDepth: 1,
   ioSize: "4K",
   workload: 'random',
   readPercent: 0,
   startOffset: 0,
   testCapa: '100%',
   latency:[1, 100000] // Measure Range = [1uS, 100mS]
}

/**
 * Basic Random QD1 4KB Read for latency measure with QD=1 IO=4K 
 * @typedef basicRndReadLatency
 * @type {object}
 * @property {string} [name="RND_QD1_RDD_LATENCY"]
 * @property {number} [trials=1]
 * @property {number} [loops=1]
 * @property {number} [nsid=1]
 * @property {string} [testTag="INIT"]
 * @property {number} [queueDepth=1]
 * @property {number|string} [ioSize="4K"]
 * @property {string} [workload="random"]
 * @property {number} [readPercent=100]
 * @property {number} [startOffset=0]
 * @property {string} [testCapa="100%"]
 * @property {number[]} [testCapa=[1,10000]]
 * @memberof sonar.workLib
 */
sonar.workLib.RND_LAT_QD1_RDD = {
   name:"LAT_RND_QD1_RDD",
   trials: 1,
   loops: 1,
   nsid: 1,
   testTag: "INIT",
   queueDepth: 1,
   ioSize: "4K",
   workload: 'random',
   readPercent: 100,
   startOffset: 0,
   testCapa: '100%',
   latency:[1, 10000] // Measure Range = [1uS, 10mS]
}

/**
 * Basic Random QD1 4KB Mixed for latency measure with QD=1 IO=4K 
 * @typedef basicRndReadLatency
 * @type {object}
 * @property {string} [name="RND_QD1_MIX_LATENCY"]
 * @property {number} [trials=1]
 * @property {number} [loops=1]
 * @property {number} [nsid=1]
 * @property {string} [testTag="INIT"]
 * @property {number} [queueDepth=1]
 * @property {number|string} [ioSize="4K"]
 * @property {string} [workload="random"]
 * @property {number} [readPercent=70]
 * @property {number} [startOffset=0]
 * @property {string} [testCapa="100%"]
 * @property {number[]} [testCapa=[1,100000]] // Measure Range = [1uS, 100mS]
 * @memberof workloadLib
 */
workloadLib.RND_LAT_QD1_MIX = {
   name:"LAT_RND_QD1_MIX",
   trials: 1,
   loops: 1,
   nsid: 1,
   testTag: "INIT",
   queueDepth: 1,
   ioSize: "4K",
   workload: 'random',
   readPercent: 70,
   startOffset: 0,
   testCapa: '100%',
   latency:[1, 100000] // Measure Range = [1uS, 10mS]
}
