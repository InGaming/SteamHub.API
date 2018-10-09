'use strict'

const Model = use('Model')

class AppDetail extends Model {
  static get table () {
    return 'AppsDetails'
  }
  
  static get createdAtColumn () {
    return null
  }

  static get updatedAtColumn () {
    return 'LastUpdated'
  }
}

module.exports = AppDetail
