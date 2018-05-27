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

test('sets null content', t => {
  const { ghostDoc } = t.context
  ghostDoc.content = null
  t.true(ghostDoc.content instanceof Array)
  t.true(ghostDoc.content.length === 0)
})

test('sets a content', t => {
  const { ghostDoc } = t.context
  ghostDoc.content = [{ hash: '123', insert: 'a' }]
  t.true(ghostDoc.content instanceof Array)
  t.true(ghostDoc.content.length === 1)
  t.true(ghostDoc.plainText === 'a')
})

test('gets an empty plaintext', t => {
  const { ghostDoc } = t.context
  t.true(ghostDoc.content instanceof Array)
  t.true(ghostDoc.plainText === '')
})

test('_getPartForPositionSearch test', t => {
  const { ghostDoc } = t.context
  ghostDoc.content = [{ hash: '123', insert: 'a' }, { hash: '321', insert: 'b' }]
  ghostDoc.buildIndex()
  t.true(true)
})

test('get amp', t => {
  const { ghostDoc } = t.context
  t.true(ghostDoc.amp === 1)
})

test('set amp', t => {
  const { ghostDoc } = t.context
  ghostDoc.amp = 5
  t.true(ghostDoc.amp === 5)
})

test('finds a position', t => {
  const { ghostDoc } = t.context
  ghostDoc.content = [{ hash: '123', insert: 'a' }, { hash: '321', insert: 'b' }, { hash: '222', insert: 'c' }]
  ghostDoc.buildIndex()
  t.true(ghostDoc.findPosition('222') === 2)
})

test('can\'t find a position', t => {
  const { ghostDoc } = t.context
  ghostDoc.content = [{ hash: '123', insert: 'a' }, { hash: '321', insert: 'b' }, { hash: '222', insert: 'c' }]
  ghostDoc.buildIndex()
  t.true(ghostDoc.findPosition('nope') === null)
})

test('applyes insert operation', t => {
  const { ghostDoc } = t.context
  ghostDoc.content = [{ hash: '123', insert: 'a' }, { hash: '321', insert: 'b' }, { hash: '222', insert: 'c' }]
  ghostDoc.buildIndex()
  ghostDoc.applyOperation({ hash: '444', position: '123', insert: 'a' })
  t.true(ghostDoc.plainText === 'aabc')
})

test('applyes delete operation', t => {
  const { ghostDoc } = t.context
  ghostDoc.content = [{ hash: '123', insert: 'a' }, { hash: '321', insert: 'b' }, { hash: '222', insert: 'c' }]
  ghostDoc.buildIndex()
  ghostDoc.applyOperation({ hash: '555', position: '123' })
  t.true(ghostDoc.plainText === 'bc')
})

test('can\'t apply operation', t => {
  const { ghostDoc } = t.context
  ghostDoc.content = [{ hash: '123', insert: 'a' }, { hash: '321', insert: 'b' }, { hash: '222', insert: 'c' }]
  ghostDoc.buildIndex()
  ghostDoc.applyOperation({ hash: '555', position: 'nope' })
  t.true(ghostDoc.plainText === 'abc')
  t.true(ghostDoc.stashed['nope'].hash === '555')
})

test('applyes multiple insert operations', t => {
  const { ghostDoc } = t.context
  ghostDoc.content = [{ hash: '123', insert: 'a' }, { hash: '321', insert: 'b' }, { hash: '222', insert: 'c' }]
  ghostDoc.buildIndex()
  ghostDoc.applyOperation({ hash: '444', position: '123', insert: 'g' })
  ghostDoc.applyOperation({ hash: '142', position: '222', insert: 'e' })
  ghostDoc.applyOperation({ hash: '142', position: '444', insert: 'x' })
  t.true(ghostDoc.plainText === 'agxbce')
})

test('can\'t apply operation but then can', t => {
  const { ghostDoc } = t.context
  ghostDoc.content = [{ hash: '123', insert: 'a' }, { hash: '321', insert: 'b' }, { hash: '222', insert: 'c' }]
  ghostDoc.buildIndex()
  ghostDoc.applyOperation({ hash: '555', position: 'nope', insert: 'n' })
  ghostDoc.applyOperation({ hash: 'nope', position: '123', insert: 'x' })
  t.true(ghostDoc.plainText === 'axnbc')
})
