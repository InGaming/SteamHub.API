'use strict'

const Model = use('Model')

class App extends Model {
  static get table () {
    return 'Apps'
  }

  static get createdAtColumn () {
    return null
  }

  static get updatedAtColumn () {
    return 'LastUpdated'
  }

  // 反向关联 AppsTypes 表
  AppsTypes () {
    return this.belongsTo('App/Models/Api/V1/Steam/AppType', 'AppType', 'AppType')
  }

  // 关联 AppsInfo 表
  AppsInfo () {
    return this.hasMany('App/Models/Api/V1/Steam/AppInfo', 'AppID', 'AppID')
  }

  // 关联 AppsInfo 表
  AppsPrices () {
    return this.hasMany('App/Models/Api/V1/Steam/Game/Price', 'AppID', 'AppID')
  }
}

module.exports = App
