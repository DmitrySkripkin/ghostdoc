const DLL = require('../../dll.js')

function beforeEach (t) {
  const dll = new DLL({})
  Object.assign(t.context, { dll })
}

function afterEach () {}

module.exports = { beforeEach, afterEach }
