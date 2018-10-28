const autoBind = require('auto-bind')

class LI {
  constructor (data) {
    this.data = data
    this.next = null
    this.previous = null
    autoBind(this)
  }
}

class DLL {
  constructor () {
    this.head = null
    this.tail = null
    this.length = 0
    autoBind(this)
  }

  add (value) {
    const node = new LI(value)
    if (this.length) {
      this.tail.next = node
      node.previous = this.tail
      this.tail = node
    } else {
      this.head = node
      this.tail = node
    }
    this.length++
    return node
  }

  searchNodeAt (position) {
    let currentNode = this.head
    const length = this.length
    let count = 1
    // const message = { failure: 'Failure: non-existent node in this list.' }
    if (length === 0 || position < 1 || position > length) {
      return false
      // throw new Error(message.failure)
    }
    while (count < position) {
      currentNode = currentNode.next
      count++
    }
    return currentNode
  }

  remove (position) {
    let currentNode = this.head
    const length = this.length
    let count = 1
    // const message = { failure: 'Failure: non-existent node in this list.' }
    let beforeNodeToDelete = null

    if (length === 0 || position < 1 || position > length) {
      return false
      // throw new Error(message.failure)
    }

    if (position === 1) {
      if (this.length === 1) {
        this.tail = null
        this.head = null
      } else {
        this.head = currentNode.next
        this.head.previous = null
      }
    } else if (position === this.length) {
      this.tail = this.tail.previous
      this.tail.next = null
    } else {
      while (count < position) {
        currentNode = currentNode.next
        count++
      }
      beforeNodeToDelete = currentNode.previous
      let afterNodeToDelete = currentNode.next
      beforeNodeToDelete.next = afterNodeToDelete
      afterNodeToDelete.previous = beforeNodeToDelete
    }
    this.length--
    return true
    // return message.success
  }
}

module.exports = DLL
