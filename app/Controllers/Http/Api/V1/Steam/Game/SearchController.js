'use strict'
const Price = use('App/Models/Api/V1/Steam/Game/Price')
const List = use('App/Models/Api/V1/Steam/Game/List')
const Redis = use('Redis')

class SearchController {
  async index ({ request, response }) {

    const q =request.get().q
    const price = request.get().price
    const appid = request.get().appid
    const name = request.get().name
    const filter = request.get().filter
    const priceTime = request.get().priceTime

    if (q && filter) {
      if (filter === 'price') {
        return getPriceQuestion(q)
      } else if (q) {
        return getQuestionList(q)
      }
    }

    if (price && filter) {
      if (filter === 'initial') {
        return getPriceInitial(price)
      } else if (filter === 'final') {
        return getPriceFinal(price)
      } else if (filter === 'timeFinalAsc') {
        return getPriceFinalTimeAsc(price)
      } else if (filter === 'timeFinalDesc') {
        return getPriceFinalTimeDesc(price)
      }
    } else if (price) {
      return getPrice(price)
    }

    if (name) {
      return getGameName(name)
    }

    if (appid && priceTime) {
      const splitPriceTime = priceTime.split(",")
      return getGamePriceTime(appid, splitPriceTime)
    }else if (appid && filter) {
      if (filter === 'historicalLowPrice') {
        return getGameHistoricalLowPrice(appid)
      } else if (filter === 'priceTimeAsc') {
        return getGamePriceTimeAsc(appid)
      } else if (filter === 'priceTimeDesc') {
        return getGamePriceTimeDesc(appid)
      } else if (filter === 'priceDiscountNow') {
        return getGamePriceDiscountNow(appid)
      }
    }else if (appid) {
      return getGameId(appid)
    }

    // 精准查询 原价/折后价
    async function getPrice(price) {
      const data = await Price.query().with('app')
                                      .where('initial', price*100)
                                      .orWhere('final', price*100)
                                      .fetch()
      return data.toJSON()
    }

    // 精准查询 原价
    async function getPriceInitial(price) {
      const data = await Price.query().with('app').where('initial', price*100).fetch()
      return data.toJSON()
    }

    // 精准查询 折后价
    async function getPriceFinal(price) {
      const data = await Price.query().with('app').where('final', price*100).fetch()
      return data.toJSON()
    }

    // 查询指定 时间段 的折后价(时间增序)
    async function getPriceFinalTimeAsc(price) {
      const data = await Price.query().with('app').where('final', price*100).orderBy('created_at', 'asc').fetch()
      return data.toJSON()
    }

    // 查询指定 时间段 的折后价(时间降序)
    async function getPriceFinalTimeAsc(price) {
      const data = await Price.query().with('app').where('final', price*100).orderBy('created_at', 'desc').fetch()
      return data.toJSON()
    }

    // 模糊查询 价格
    async function getPriceQuestion(q) {
      const data = await Price.query().with('app')
                                    .where('appid', q)
                                    .orWhere('initial', q*100)
                                    .orWhere('final', q*100)
                                    .orWhere('discount_percent', q)
                                    .fetch()
      return data.toJSON()
    }

    // 模糊查询 列表
    async function getQuestionList(q) {
      const data = await List.query().with('prices')
                                    .where('appid', q)
                                    .orWhere('name', 'like', '%' + q + '%')
                                    .orWhere('created_at', 'like', '%' + q + '%')
                                    .fetch()
      return data.toJSON()
    }

    // 请求指定 appid 内容
    async function getGameId (appid) {
      const data = await List.query().with('prices').where('appid', appid).fetch()
      return data.toJSON()
    }

    // 请求指定 name 内容
    async function getGameName (name) {
      const data = await List.query().with('prices').where('name', 'like', '%' + name + '%').fetch()
      return data.toJSON()
    }

    // 请求指定 appid 价格(时间增序)
    async function getGamePriceTimeAsc (appid) {
      const data = await Price.query().with('app').where('appid', appid).orderBy('created_at', 'asc').fetch()
      return data.toJSON()
    }

    // 请求指定 appid 价格(时间降序)
    async function getGamePriceTimeDesc (appid) {
      const data = await Price.query().with('app').where('appid', appid).orderBy('created_at', 'desc').fetch()
      return data.toJSON()
    }

    // 请求指定 appid 历史最低价格
    async function getGameHistoricalLowPrice (appid) {
      const data = await Price.query().with('app').where('appid', appid).orderBy('final', 'asc').first()
      return data.toJSON()
    }

    // 请求当前是否打折
    async function getGamePriceDiscountNow (appid) {
      const data = await Price.query().with('app').where('appid', appid).orderBy('created_at', 'desc').first()
      return data.toJSON()
    }

    // 请求指定 价格时间段
    async function getGamePriceTime (appid, priceTime) {
      const data = await Price.query().with('app').where('appid', appid).whereBetween('created_at', priceTime)
      return data
    }
    
  }
}

module.exports = SearchController
