const test = require('ava')
const DLL = require('../dll')
const { beforeEach, afterEach } = require('./helpers/dll')

test.beforeEach(beforeEach)
test.afterEach(afterEach)

test('returns itself', t => {
  t.true(t.context.dll instanceof DLL)
})

test('initial length is zero', t => {
  const dll = new DLL()
  t.true(dll.length === 0)
})

test('initial head and tail are null', t => {
  const dll = new DLL()
  t.true(dll.head === null && dll.tail === null)
})

test('add first item', t => {
  const dll = new DLL()
  dll.add({ insert: 'a', hash: 1 })
  t.true(dll.length === 1 && dll.head.data.insert === 'a' && dll.tail.data.insert === 'a')
})

test('add some items', t => {
  const dll = new DLL()
  dll.add({ insert: 'a', hash: 1 })
  dll.add({ insert: 'b', hash: 2 })
  dll.add({ insert: 'c', hash: 3 })
  t.true(dll.length === 3)
  t.true(dll.head.data.insert === 'a')
  t.true(dll.tail.data.insert === 'c')
})

test('search for existent node', t => {
  const dll = new DLL()
  dll.add({ insert: 'a', hash: 1 })
  dll.add({ insert: 'b', hash: 2 })
  dll.add({ insert: 'c', hash: 3 })
  const node = dll.searchNodeAt(2)
  t.true(node.data.insert === 'b')
})

test('search for non-existent node', t => {
  const dll = new DLL()
  dll.add({ insert: 'a', hash: 1 })
  dll.add({ insert: 'b', hash: 2 })
  dll.add({ insert: 'c', hash: 3 })
  const node = dll.searchNodeAt(5)
  t.true(node === false)
})

test('remove non-existent node', t => {
  const dll = new DLL()
  dll.add({ insert: 'a', hash: 1 })
  dll.add({ insert: 'b', hash: 2 })
  dll.add({ insert: 'c', hash: 3 })
  const result = dll.remove(5)
  t.true(result === false && dll.length === 3)
})

test('remove existent node', t => {
  const dll = new DLL()
  dll.add({ insert: 'a', hash: 1 })
  dll.add({ insert: 'b', hash: 2 })
  dll.add({ insert: 'c', hash: 3 })
  const result = dll.remove(2)
  t.true(result === true && dll.length === 2)
  t.true(dll.searchNodeAt(2).data.insert === 'c')
})

test('remove head node', t => {
  const dll = new DLL()
  dll.add({ insert: 'a', hash: 1 })
  dll.add({ insert: 'b', hash: 2 })
  dll.add({ insert: 'c', hash: 3 })
  const result = dll.remove(1)
  t.true(result === true && dll.length === 2)
  t.true(dll.searchNodeAt(1).data.insert === 'b')
})

test('remove tail node', t => {
  const dll = new DLL()
  dll.add({ insert: 'a', hash: 1 })
  dll.add({ insert: 'b', hash: 2 })
  dll.add({ insert: 'c', hash: 3 })
  const result = dll.remove(3)
  t.true(result === true && dll.length === 2)
  t.true(dll.searchNodeAt(2).data.insert === 'b')
})

test('remove only node', t => {
  const dll = new DLL()
  dll.add({ insert: 'a', hash: 1 })
  const result = dll.remove(1)
  t.true(result === true && dll.length === 0)
  t.true(dll.head === null && dll.tail === null)
})

test('get node by hash', t => {
  const dll = new DLL()
  dll.add({ insert: 'a', hash: 1 })
  dll.add({ insert: 'b', hash: 2 })
  dll.add({ insert: 'c', hash: 3 })
  t.true(dll.getNodeByHash(2).data.insert === 'b')
})

test('remove node by hash', t => {
  const dll = new DLL()
  dll.add({ insert: 'a', hash: 1 })
  dll.add({ insert: 'b', hash: 2 })
  dll.add({ insert: 'c', hash: 3 })
  dll.removeByHash(2)
  t.true(dll.length === 2)
})

test('remove non-existent node by hash', t => {
  const dll = new DLL()
  dll.add({ insert: 'a', hash: 1 })
  dll.add({ insert: 'b', hash: 2 })
  dll.add({ insert: 'c', hash: 3 })
  dll.removeByHash(5)
  t.true(dll.length === 3)
})
