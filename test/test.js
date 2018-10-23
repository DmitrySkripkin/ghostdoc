const test = require('ava')
const GhostDoc = require('../')
const { beforeEach, afterEach } = require('./helpers')

const id = 'DmitrySkripkin'

test.beforeEach(beforeEach)
test.afterEach(afterEach)

test('returns itself', t => {
  t.true(t.context.ghostDoc instanceof GhostDoc)
})

test('sets a config object', t => {
  const ghostDoc = new GhostDoc(false)
  t.true(ghostDoc instanceof GhostDoc)
})

test('generates hash', t => {
  const ghostDoc = new GhostDoc(false)
  const hash = ghostDoc.generateHash(id)
  t.true(typeof hash === 'string')
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
  ghostDoc.content = [{ hash: '0', insert: 'a' }, { hash: '1', insert: 'b' }, { hash: '2', insert: 'c' }]
  ghostDoc.buildIndex()
  t.true(ghostDoc.findPosition('2') === 2)
})

test('can\'t find a position', t => {
  const { ghostDoc } = t.context
  ghostDoc.content = [{ hash: '1', insert: 'a' }, { hash: '2', insert: 'b' }, { hash: '3', insert: 'c' }]
  ghostDoc.buildIndex()
  t.true(ghostDoc.findPosition('nope') === null)
})

test('applyes insert operation', t => {
  const { ghostDoc } = t.context
  ghostDoc.content = [{ hash: '1', insert: 'a' }, { hash: '2', insert: 'b' }, { hash: '3', insert: 'c' }]
  ghostDoc.buildIndex()
  ghostDoc.applyOperation({ hash: '4', position: '1', insert: 'a' })
  t.true(ghostDoc.plainText === 'aabc')
})

test('applyes delete operation', t => {
  const { ghostDoc } = t.context
  ghostDoc.content = [{ hash: '1', insert: 'a' }, { hash: '2', insert: 'b' }, { hash: '3', insert: 'c' }]
  ghostDoc.buildIndex()
  ghostDoc.applyOperation({ hash: '555', position: '1' })
  t.true(ghostDoc.plainText === 'bc')
})

test('can\'t apply operation', t => {
  const { ghostDoc } = t.context
  ghostDoc.content = [{ hash: '1', insert: 'a' }, { hash: '2', insert: 'b' }, { hash: '3', insert: 'c' }]
  ghostDoc.buildIndex()
  ghostDoc.applyOperation({ hash: '4', position: 'nope' })
  t.true(ghostDoc.plainText === 'abc')
  t.true(ghostDoc.stashed['nope'].hash === '4')
})

test('applyes multiple insert operations', t => {
  const { ghostDoc } = t.context
  ghostDoc.content = [{ hash: '1', insert: 'a' }, { hash: '2', insert: 'b' }, { hash: '3', insert: 'c' }]
  ghostDoc.buildIndex()
  ghostDoc.applyOperation({ hash: '4', position: '1', insert: 'g' })
  ghostDoc.applyOperation({ hash: '5', position: '3', insert: 'e' })
  ghostDoc.applyOperation({ hash: '6', position: '4', insert: 'x' })
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

test('wrong order', t => {
  const { ghostDoc } = t.context
  ghostDoc.content = [{ hash: '0:111:1', insert: 'a' }, { hash: '5:333:6', insert: 'b', position: '0:111:1' }]
  ghostDoc.buildIndex()
  ghostDoc.applyOperation({ hash: '1:222:3', position: '0:111:1', insert: 'x' })
  t.true(ghostDoc.plainText === 'axb')
})

test('wrong order 2', t => {
  const { ghostDoc } = t.context
  ghostDoc.content = [{ hash: '0:111:1', insert: 'a' }, { hash: '5:333:6', insert: 'b', position: '0:111:1' }]
  ghostDoc.buildIndex()
  ghostDoc.applyOperation({ hash: '7:222:3', position: '0:111:1', insert: 'x' })
  t.true(ghostDoc.plainText === 'abx')
})

test(`don't break my word`, t => {
  const { ghostDoc } = t.context
  ghostDoc.content = [{ hash: '0:111:1', insert: 'h' }, { hash: '5:333:6', insert: 'i', position: '0:111:1' }]
  ghostDoc.buildIndex()
  ghostDoc.applyOperation({ hash: '7:222:3', position: '5:333:6', insert: ' ' })
  ghostDoc.applyOperation({ hash: '7:262:3', position: '5:333:6', insert: ' ' })

  ghostDoc.applyOperation({ hash: '7:222:4', position: '7:222:3', insert: 'f' })
  ghostDoc.applyOperation({ hash: '5:262:3', position: '7:262:3', insert: 'b' })

  ghostDoc.applyOperation({ hash: '7:241:4', position: '7:222:4', insert: 'o' })
  ghostDoc.applyOperation({ hash: '2:262:3', position: '5:262:3', insert: 'a' })

  ghostDoc.applyOperation({ hash: '9:241:4', position: '7:241:4', insert: 'o' })
  ghostDoc.applyOperation({ hash: '9:262:3', position: '2:262:3', insert: 'r' })
  // t.log(ghostDoc.plainText)

  t.true(ghostDoc.plainText === 'hi foo bar')
})
