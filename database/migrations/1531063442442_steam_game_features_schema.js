'use strict'

const Schema = use('Schema')

class SteamGameFeaturesSchema extends Schema {
  up () {
    this.create('steam_game_features', (table) => {
      table.integer('id', 10)
      table.integer('type', 10)
      table.string('name', 50)
      table.boolean('discounted')
      table.integer('discount_percent', 10)
      table.integer('original_price', 10)
      table.integer('final_price', 10)
      table.string('currency', 50)
      table.string('large_capsule_image', 200)
      table.string('small_capsule_image', 200)
      table.boolean('windows_available')
      table.boolean('mac_available')
      table.boolean('linux_available')
      table.boolean('streamingvideo_available')
      table.integer('discount_expiration', 10)
      table.string('header_image', 200)
      table.string('controller_support', 50)
      table.timestamps()
    })
  }

  down () {
    this.drop('steam_game_features')
  }
}

module.exports = SteamGameFeaturesSchema
