'use strict'
const GetGameApps = use('App/Models/Api/V1/Steam/App')
const Redis = use('Redis')

class AppController {
  async index ({ request }) {
    let page = request.get().page
    if (page === undefined) {
      page = 1
    }
    const Cached = await Redis.get('GameApps=' + page)
    if (Cached) {
      return JSON.parse(Cached)
    }
    const GameApps = await GetGameApps.query().with('AppsTypes').paginate(page)
    await Redis.set('GameApps=' + page, JSON.stringify(GameApps.toJSON()), 'ex', 600)
    return GameApps.toJSON()
  }

  async show ({ params }) {
    const AppID = params.id
    const Cached = await Redis.get('GameAppID=' + AppID)
    if (Cached) {
      return JSON.parse(Cached)
    }
    const GameAppID = await GetGameApps.query().with('AppsTypes').with('AppsInfo').where('AppID', AppID).fetch()
    await Redis.set('GameAppID=' + AppID, JSON.stringify(GameAppID.toJSON()), 'ex', 600)
    return GameAppID.toJSON()
  }
}

module.exports = AppController
