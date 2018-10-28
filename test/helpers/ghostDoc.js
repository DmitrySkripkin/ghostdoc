const GhostDoc = require('../../')

function beforeEach (t) {
  const ghostDoc = new GhostDoc({})
  Object.assign(t.context, { ghostDoc })
}

function afterEach () {}

module.exports = { beforeEach, afterEach }
