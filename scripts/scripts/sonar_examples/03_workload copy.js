/* global importScript, sonar, workloadLib */

importScript('../lib/sonar/index.js')

sonar.init()

let taskList = sonar.workLib.createWorkload()

taskList.add("SEQ_WRITE_3min", workloadLib.SEQ_WRITE, {duration:180})
taskList.add("SEQ_READ_3min", workloadLib.SEQ_READ, {duration:180})
taskList.add("RND_WRITE_3min", workloadLib.RND_WRITE, {duration:180})
taskList.add("RND_READ_3min", workloadLib.RND_READ, {duration:180})

taskList.playWorkloadList()


