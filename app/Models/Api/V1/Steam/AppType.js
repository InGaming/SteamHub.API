'use strict'

const Model = use('Model')

class AppType extends Model {
  static get table () {
    return 'AppsTypes'
  }

  // 关联 Apps 表
  Apps () {
    return this.hasMany('App/Models/Api/V1/Steam/App', 'AppType', 'AppType')
  }
}

module.exports = AppType
