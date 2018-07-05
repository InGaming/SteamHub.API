'use strict'

const Model = use('Model')

class List extends Model {
  static get table () {
    return 'steam_games'
  }
}

module.exports = List
