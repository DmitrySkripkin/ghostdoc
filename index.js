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
    this._content = newContent
  }
}

module.exports = GhostDoc
