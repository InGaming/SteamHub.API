'use strict'

const Model = use('Model')

class Feature extends Model {
  static get table () {
    return 'steam_game_features'
  }
}

module.exports = Feature
