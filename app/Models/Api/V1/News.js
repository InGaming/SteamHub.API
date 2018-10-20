'use strict'

const Model = use('Model')

class News extends Model {
  static get table () {
    return 'News'
  }

  static get createdAtColumn () {
    return null
  }

  static get updatedAtColumn () {
    return 'LastUpdated'
  }

}

module.exports = News
