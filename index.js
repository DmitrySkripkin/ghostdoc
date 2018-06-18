const autoBind = require('auto-bind')

class GhostDoc {
  constructor (config) {
    config = Object.assign({ content: [] }, config)
    this._content = config.content
    autoBind(this)
  }
  get content () {
    return this._content
  }
  set content (newContent) {
    if (newContent) {
      this._content = newContent
    } else {
      this._content = []
    }
  }

  generateHash (id) {
    return `${Date.now()}:${id}:${Math.random().toString().substr(2)}`
  }

  get stashed () {
    return this._stashed || {}
  }

  set stashed (value) {
    this._stashed = value
  }

  get amp () {
    return this._amp || 1
  }

  set amp (value) {
    this._amp = value
  }

  get length () {
    return this.content.filter((symbol) => { return !symbol.deleted })
  }

  get plainText () {
    if (this.content.length === 0) return ''
    return this.content.reduce((acc, curr) => {
      if (curr.insert) {
        return acc + curr.insert
      }
      return acc.substring(0, acc.length - 1)
    }, '')
  }

  applyOperation (operation) {
    let position = this.findPosition(operation.position)
    if (!position && position !== 0) {
      const stashed = this.stashed
      stashed[operation.position] = operation
      this.stashed = stashed
      return
    }

    while (this.content[position + 1] && this.content[position + 1].position &&
      this.content[position + 1].position === operation.position &&
      this.content[position + 1].hash < operation.hash) {
      position++
    }

    this.amp = this.amp + 1
    this.content.splice(position + 1, 0, operation)
    this.index[operation.hash] = position
    if (this.stashed[operation.hash]) {
      const stashed = this.stashed
      const operationTemp = stashed[operation.hash]
      delete stashed[operation.hash]
      this.stashed = stashed
      this.applyOperation(operationTemp)
    }
  }

  buildIndex () {
    let i = 0
    this._index = this.content.reduce((acc, curr) => {
      acc[curr.hash] = i
      i++
      return acc
    }, {})
  }

  get index () {
    return this._index
  }

  _getPartForPositionSearch (hash) {
    return this.content.slice(this.index[hash], Math.max(this.amp + 1, this.content.length))
  }

  findPosition (hash) {
    let i = this.index[hash]
    // let i = this.amp
    const part = this._getPartForPositionSearch(hash)
    for (let symbol of part) {
      if (symbol.hash === hash) {
        return i
      }
      i++
    }
    return null
  }
}

module.exports = GhostDoc
