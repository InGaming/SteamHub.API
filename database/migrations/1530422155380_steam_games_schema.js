'use strict'

const Schema = use('Schema')

class SteamGamesSchema extends Schema {
  up () {
    this.create('steam_games', (table) => {
      table.increments()
      table.string('appid', 10)
      table.string('english_name', 100)
      table.string('chinese_name', 100)
      table.timestamps()
    })
  }

  down () {
    this.drop('steam_games')
  }
}

module.exports = SteamGamesSchema
