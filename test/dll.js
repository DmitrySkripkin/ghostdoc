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
  dll.add('a')
  t.true(dll.length === 1 && dll.head.data === 'a' && dll.tail.data === 'a')
})

test('add some items', t => {
  const dll = new DLL()
  dll.add('a')
  dll.add('b')
  dll.add('c')
  t.true(dll.length === 3)
  t.true(dll.head.data === 'a')
  t.true(dll.tail.data === 'c')
})

test('search for existent node', t => {
  const dll = new DLL()
  dll.add('a')
  dll.add('b')
  dll.add('c')
  const node = dll.searchNodeAt(2)
  t.true(node.data === 'b')
})

test('search for non-existent node', t => {
  const dll = new DLL()
  dll.add('a')
  dll.add('b')
  dll.add('c')
  const node = dll.searchNodeAt(5)
  t.true(node === false)
})

test('remove non-existent node', t => {
  const dll = new DLL()
  dll.add('a')
  dll.add('b')
  dll.add('c')
  const result = dll.remove(5)
  t.true(result === false && dll.length === 3)
})

test('remove existent node', t => {
  const dll = new DLL()
  dll.add('a')
  dll.add('b')
  dll.add('c')
  const result = dll.remove(2)
  t.true(result === true && dll.length === 2)
  t.true(dll.searchNodeAt(2).data === 'c')
})

test('remove head node', t => {
  const dll = new DLL()
  dll.add('a')
  dll.add('b')
  dll.add('c')
  const result = dll.remove(1)
  t.true(result === true && dll.length === 2)
  t.true(dll.searchNodeAt(1).data === 'b')
})

test('remove tail node', t => {
  const dll = new DLL()
  dll.add('a')
  dll.add('b')
  dll.add('c')
  const result = dll.remove(3)
  t.true(result === true && dll.length === 2)
  t.true(dll.searchNodeAt(2).data === 'b')
})

test('remove only node', t => {
  const dll = new DLL()
  dll.add('a')
  const result = dll.remove(1)
  t.true(result === true && dll.length === 0)
  t.true(dll.head === null && dll.tail === null)
})
