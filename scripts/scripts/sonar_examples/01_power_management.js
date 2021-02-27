/* global importScript, sonar, workloadLib */

importScript('../lib/sonar/index.js')

sonar.init()

powerunit.runPowerCycle()
powerunit.adjustDevicePower({vol12:"12.0"})
powerunit.measureDevicePower()

