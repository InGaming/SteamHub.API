'use strict'

const Schema = use('Schema')

class SteamGamePricesSchema extends Schema {
  up () {
    this.create('steam_game_prices', (table) => {
      table.increments()
      table.timestamps()
    })
  }

  down () {
    this.drop('steam_game_prices')
  }
}

module.exports = SteamGamePricesSchema
