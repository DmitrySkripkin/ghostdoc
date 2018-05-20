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
      if (curr.deleted) return acc
      return acc + curr.insert
    }, '')
  }

  applyOperation (operation) {
    let position = this.findPosition(operation.position)
    this.amp = this.amp + 1
    if (operation.insert) {
      this.content.splice(position, 0, operation)
    } else {
      this.content[position].deleted = true
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
    let i = this.amp
    for (let symbol of this._getPartForPositionSearch()) {
      if (symbol.hash === hash) {
        return i - 1
      }
      i++
    }
    return null
  }
}

module.exports = GhostDoc
