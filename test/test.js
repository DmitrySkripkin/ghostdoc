const test = require('ava')

const GhostDoc = require('../')
const { beforeEach, afterEach } = require('./helpers')

test.beforeEach(beforeEach)
test.afterEach(afterEach)

test('returns itself', t => {
  t.true(t.context.ghostDoc instanceof GhostDoc)
})

test('sets a config object', t => {
  const ghostDoc = new GhostDoc(false)
  t.true(ghostDoc instanceof GhostDoc)
})

test('returns content', t => {
  const { ghostDoc } = t.context
  t.true(ghostDoc.content instanceof Array)
})

test('sets a default content', t => {
  const { ghostDoc } = t.context
  t.true(ghostDoc.content instanceof Array)
  t.true(ghostDoc.content.length === 0)
})

test('sets an empty content', t => {
  const { ghostDoc } = t.context
  ghostDoc.content = []
  t.true(ghostDoc.content instanceof Array)
  t.true(ghostDoc.content.length === 0)
})
