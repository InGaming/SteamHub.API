'use strict'
const GetGameApps = use('App/Models/Api/V1/Steam/App')
const Redis = use('Redis')

class AppInfoController {
  async show ({ params }) {
    const AppID = params.id
    const Cached = await Redis.get('GameAppID=' + AppID)
    if (Cached) {
      return JSON.parse(Cached)
    }
    const GameAppID = await GetGameApps.query().with('AppsInfo').with('AppsTypes').where('AppID', AppID).fetch()
    await Redis.set('GameAppID=' + AppID, JSON.stringify(GameAppID.toJSON()), 'ex', 600)
    return GameAppID.toJSON()
  }
}

module.exports = AppInfoController
