'use strict'

const Schema = use('Schema')

class SteamGamePricesSchema extends Schema {
  up () {
    this.create('steam_game_prices', (table) => {
      table.increments()
      table.integer('appid', 10)
      table.boolean('success')
      table.string('currency', 50)
      table.integer('initial', 50)
      table.integer('final', 50)
      table.integer('discount_percent', 50)
      table.timestamps()
    })
  }

  down () {
    this.drop('steam_game_prices')
  }
}

module.exports = SteamGamePricesSchema
