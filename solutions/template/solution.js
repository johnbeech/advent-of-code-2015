var read = require('../lib/read')

read(__dirname, '/input.txt', 'utf8')
    .then(solve)
    .then(report)
    .catch(error)

function solve (lines) {
  throw new Error('Not implemented')
}

function report (summary) {
  console.log('Summary:', JSON.stringify(summary, null, '  '))
}

function error (ex) {
  console.log('Error:', ex)
  !ex.stack || console.log(ex.stack)
}
