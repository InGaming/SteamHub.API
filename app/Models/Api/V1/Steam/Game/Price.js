'use strict'

const Model = use('Model')

class Price extends Model {
  static get table () {
    return 'steam_game_prices'
  }

  app () {
    return this.belongsTo('App/Models/Api/V1/Steam/Game/List', 'appid', 'appid')
  }
}

module.exports = Price
