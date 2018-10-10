'use strict'

const Model = use('Model')

class Trending extends Model {
  static get table () {
    return 'TopSellers'
  }

  static get createdAtColumn () {
    return null
  }

  static get updatedAtColumn () {
    return 'LastUpdated'
  }

}

module.exports = Trending
