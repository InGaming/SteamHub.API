'use strict'

const Model = use('Model')

class App extends Model {
  static get table () {
    return 'Apps'
  }

  // 反向关联 AppsTypes 表
  AppsTypes () {
    return this.belongsTo('App/Models/Api/V1/Steam/AppType', 'AppType', 'AppType')
  }

  // 关联 AppsInfo 表
  AppsInfo () {
    return this.hasMany('App/Models/Api/V1/Steam/AppInfo', 'AppID', 'AppID')
  }
}

module.exports = App
