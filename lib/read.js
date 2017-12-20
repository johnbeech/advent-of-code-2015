const fs = require('fs')
const denodeify = require('denodeify')
const read = denodeify(fs.readFile)
const path = require('path')

module.exports = (x, y, z) => read(path.join(x, y), z)
