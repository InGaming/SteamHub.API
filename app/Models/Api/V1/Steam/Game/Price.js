'use strict'

const Model = use('Model')

class Price extends Model {
  static get table () {
    return 'steam_game_prices'
  }
}

module.exports = Price
