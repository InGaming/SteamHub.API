'use strict'

const Model = use('Model')

class List extends Model {
  static get table () {
    return 'steam_games'
  }

  prices () {
    return this.hasMany('App/Models/Api/V1/Steam/Game/Price', 'appid', 'appid')
  }
}

module.exports = List
