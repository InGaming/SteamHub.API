'use strict'

const Model = use('Model')

class KeyName extends Model {
  static get table () {
    return 'KeyNames'
  }

  // 关联 AppsInfo 表
  AppsInfo () {
    return this.hasMany('App/Models/Api/V1/Steam/App', 'ID', 'Key')
  }
}

module.exports = KeyName
