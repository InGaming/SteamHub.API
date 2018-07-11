'use strict'

const Model = use('Model')

class StoreUpdateQueue extends Model {
  static get table () {
    return 'StoreUpdateQueue'
  }
}

module.exports = StoreUpdateQueue
