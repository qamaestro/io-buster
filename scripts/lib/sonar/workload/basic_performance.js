/* Global */

let basicPerformance = sonar.workLib.createWorkload()

basicPerformance.add("SCRUB_RANDOM_DIRTY", sonar.workLib.SEQ_WRITE, {loop:2})
basicPerformance.add("SEQ:PERF:WRITE_1RM", sonar.workLib.SEQ_WRITE)
basicPerformance.add("SEQ:PERF:WRITE_3min", sonar.workLib.SEQ_WRITE, {trials:3,duration:180})
basicPerformance.add("SEQ:PERF:READ_1RM", sonar.workLib.SEQ_READ)
basicPerformance.add("SEQ:PERF:READ_3min", sonar.workLib.SEQ_READ, {trials:3,duration:180})
basicPerformance.add("RND:PERF:WRITE_1RM", sonar.workLib.RND_WRITE)
basicPerformance.add("RND:PERF:WRITE_3min", sonar.workLib.RND_WRITE, {trials:3,duration:180})
basicPerformance.add("RND:PERF:WRITE_QD1", sonar.workLib.RND_WRITE, {trials:3,queueDepth:1,duration:180})
basicPerformance.add("RND:PERF:READ_1RM", sonar.workLib.RND_READ)
basicPerformance.add("RND:PERF:READ_3min", sonar.workLib.RND_READ, {trials:5,duration:180})
basicPerformance.add("RND:PERF:READ_QD1", sonar.workLib.RND_READ, {trials:3,queueDepth:1,duration:180})
basicPerformance.add("RND:PERF:R9W1_MIXED_3min", sonar.workLib.RND_MIXED, {trials:3,readRatio:90,duration:180})
basicPerformance.add("RND:PERF:R7W3_MIXED_3min", sonar.workLib.RND_MIXED, {trials:3,readRatio:70,duration:180})
basicPerformance.add("RND:PERF:R5W5_MIXED_3min", sonar.workLib.RND_MIXED, {trials:3,readRatio:50,duration:180})
basicPerformance.add("RND:PERF:R3W7_MIXED_3min", sonar.workLib.RND_MIXED, {trials:3,readRatio:30,duration:180})
basicPerformance.add("RND:PERF:R1W9_MIXED_3min", sonar.workLib.RND_MIXED, {trials:3,readRatio:10,duration:180})
basicPerformance.add("RND:LTCY:4KB_QD1_WRITE", sonar.workLib.RND_LAT_QD1_WRT, {trials:3,duration:1800})
basicPerformance.add("RND:LTCY:4KB_QD32_WRITE", sonar.workLib.RND_LAT_QD1_WRT, {trials:3,queueDepth:32,duration:600})
basicPerformance.add("RND:LTCY:4KB_QD1_READ", sonar.workLib.RND_LAT_QD1_RDD, {trials:3,duration:1800})
basicPerformance.add("RND:LTCY:4KB_QD32_READ", sonar.workLib.RND_LAT_QD1_RDD, {trials:3,queueDepth:32,duration:600})
basicPerformance.add("RND:LTCY:4KB_QD1_MIXED_R7W3", sonar.workLib.RND_LAT_QD1_MIX, {trials:3,duration:1800})
basicPerformance.add("RND:LTCY:4KB_QD32_MIXED_R7W3", sonar.workLib.RND_LAT_QD1_MIX, {trials:3,queueDepth:32,duration:600})




