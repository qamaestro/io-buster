/* global importScript, sonar, workloadLib */

importScript('../lib/sonar/index.js')

sonar.init()

sonar.downloadFirmwareUart("model_1", "model_1/fw_1")
sonar.basicPerformance.playWorkloadList("fw_1")

sonar.downloadFirmwareUart("model_1", "model_1/fw_1")
sonar.basicPerformance.playWorkloadList("fw_2")

