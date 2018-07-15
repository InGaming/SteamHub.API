'use strict'

const Model = use('Model')

class AppInfo extends Model {
  static get table () {
    return 'AppsInfo'
  }

  // 反向关联 Apps 表
  Apps () {
    return this.belongsTo('App/Models/Api/V1/Steam/App', 'AppID', 'AppID')
  }

  // 关联 KeyNames 表
  KeyNames () {
    return this.hasMany('App/Models/Api/V1/Steam/KeyName', 'Key', 'ID')
  }
}

module.exports = AppInfo
