'use strict'

const Model = use('Model')

class Price extends Model {
  static get table () {
    return 'AppsPrices'
  }

  static get createdAtColumn () {
    return null
  }

  static get updatedAtColumn () {
    return 'LastUpdated'
  }

  // 反向关联 Apps 表
  Apps () {
    return this.belongsTo('App/Models/Api/V1/Steam/App', 'AppID', 'AppID')
  }

}

module.exports = Price
