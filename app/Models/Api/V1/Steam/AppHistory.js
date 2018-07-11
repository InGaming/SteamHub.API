'use strict'

const Model = use('Model')

class AppHistory extends Model {
  static get table () {
    return 'AppsHistory'
  }
}

module.exports = AppHistory
