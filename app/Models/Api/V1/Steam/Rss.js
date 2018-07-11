'use strict'

const Model = use('Model')

class Rss extends Model {
  static get table () {
    return 'RSS'
  }
}

module.exports = Rss
