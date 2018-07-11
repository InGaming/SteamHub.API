'use strict'
const GetStoreUpdateQueue = use('App/Models/Api/V1/Steam/StoreUpdateQueue')
const Redis = use('Redis')

class StoreUpdateQueueController {
  async index ({ request }) {
    let page = request.get().page
    if (page === undefined) {
      page = 1
    }
    const Cached = await Redis.get('StoreUpdateQueue=' + page)
    if (Cached) {
      return JSON.parse(Cached)
    }
    const StoreUpdateQueue = await GetStoreUpdateQueue.query().paginate(page)
    await Redis.set('StoreUpdateQueue=' + page, JSON.stringify(StoreUpdateQueue.toJSON()), 'ex', 300)
    return StoreUpdateQueue.toJSON()
  }
}

module.exports = StoreUpdateQueueController
