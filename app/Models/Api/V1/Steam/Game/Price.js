'use strict'

const Model = use('Model')

class Price extends Model {
  static get table () {
    return 'steam_game_prices'
  }

  lists () {
    return this.belongsTo('App/Models/Api/V1/Steam/Game/List', 'appid', 'appid')
  }
}

module.exports = Price
