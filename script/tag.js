const axios = require('axios')
const fs = require('fs')
const path = require('path')
const { exec } = require('child_process')
const arguments = process.argv
const tagType = arguments[2]
const version = arguments[3]

async function getRelease() {
  console.log('Geting release info')
  return await axios.get(`https://api.github.com/repos/emqx/emqx-dashboard-frontend/releases/tags/${version}`)
}
async function executeShell(cmd) {
  exec(cmd, (stdout, stderr) => {
    if (stderr) {
      console.error(stderr)
      return
    }
    console.log(stdout)
  })
}

if (tagType === 'retag') {
  getRelease().then((res) => {
    const releaseId = res.data.id
    const token = fs.readFileSync(path.join(__dirname, 'token'))
    const ghToken = `token ${token.toString()}`
    const cmd = `"./script/retag.sh" ${version} "${ghToken}" ${releaseId}`
    console.log('Retaging...')
    executeShell(cmd)
  })
} else {
  const cmd = `"./script/tag.sh" ${version}`
  console.log('Taging...')
  executeShell(cmd)
}
