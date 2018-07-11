'use strict'
const GetRSS = use('App/Models/Api/V1/Steam/Rss')
const Redis = use('Redis')

class RssController {
  async index () {
    const Cached = await Redis.get('RSS')
    if (Cached) {
      return JSON.parse(Cached)
    }
    const RSS = await GetRSS.all()
    await Redis.set('RSS', JSON.stringify(RSS.toJSON()), 'ex', 600)
    return RSS.toJSON()
  }
}

module.exports = RssController
