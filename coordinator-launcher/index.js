const { ensureDir, copy } = require('fs-extra')
const { platform } = require('os')
const { spawn, execSync } = require('child_process')
const { resolve, basename } = require('path')

function getDataDir () {
  if (platform() === 'win32') {
    return `${process.env.LOCALAPPDATA}\\qamc`
  } else {
    return `${process.env.HOME}/.qam/qamc`
  }
}

function getInstallDir () {
  if (platform() === 'win32') {
    return `${process.env.LOCALAPPDATA}\\iobc`
  } else {
    return '/usr/local/bin'
  }
}

function setPath () {
  if (platform() === 'win32') {
    try {
      execSync(`setx Path "%Path%;${getInstallDir()}"`)
    } catch (e) {
      console.log('Failed to set Path variable')
    }
  }
}

async function run () {
  const cwd = process.cwd()
  const pathData = getDataDir()
  await ensureDir(pathData)
  const cmd = 'docker'
  const args = [
    'run',
    '--rm',
    '-it',
    '-v',
    `${pathData}:/data`,
    '-v',
    `${cwd}:/workspace`,
    'gcr.io/maestro-public/qam-coordinator:latest'
  ]
  const proc = spawn(cmd, args, { stdio: 'inherit' })
  return new Promise(resolve => {
    proc.on('close', resolve)
  })
}

async function update () {
  const cmd = 'docker'
  const args = ['pull', 'gcr.io/maestro-public/qam-coordinator:latest']
  const proc = spawn(cmd, args, { stdio: 'inherit' })
  return new Promise(resolve => {
    proc.on('close', resolve)
  })
}

async function install () {
  const src = process.execPath
  const dest = resolve(getInstallDir(), basename(src))
  if (src === dest) {
    return
  }
  await copy(src, dest)
  setPath()
}

async function help () {
  console.log('')
  console.log('IO Buster Coordinator\n')
  console.log('usage: iobc <command>\n')
  console.log('Commands:')
  console.log('  run      Starts IO Buster Coordinator')
  console.log('  update   Update IO Buster Coordinator')
  console.log('  install  Installs IO Buster Coordinator')
  console.log('')
}

async function main () {
  const command = process.argv[2]
  const commandList = {
    run: run,
    update: update,
    install: install
  }
  const handler = commandList[command]
  if (!handler) {
    help()
  } else {
    await handler()
  }
}

main()
