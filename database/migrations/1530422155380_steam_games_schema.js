'use strict'

const Schema = use('Schema')

class SteamGamesSchema extends Schema {
  up () {
    this.create('steam_games', (table) => {
      table.increments()
      table.timestamps()
    })
  }

  down () {
    this.drop('steam_games')
  }
}

module.exports = SteamGamesSchema
