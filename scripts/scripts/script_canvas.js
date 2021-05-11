/* global importScript, activesonar, workloadLib */

importScript('../lib/activesonar/index.js')
importScript('../lib/workload/index.js')

activesonar.init();

activesonar.runWorkloadList(workloadLib.perfProfile1.main)

