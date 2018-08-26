'use strict'
const Price = use('App/Models/Api/V1/Steam/Game/Price')
const Info = use('App/Models/Api/V1/Steam/AppInfo')
const GetGameApps = use('App/Models/Api/V1/Steam/App')

class SearchController {
  async index ({ request }) {

    const q = request.get().q
    const page = request.get().page
    const price = request.get().price
    const AppID = request.get().AppID
    const Name = request.get().Name
    const filter = request.get().filter
    const priceTime = request.get().priceTime

    if (q && filter) {
      if (filter === 'price') {
        return getPriceQuestion(q)
      }
      if (filter === 'tag') {
        return getGameTag(q, page)
      }
    } else if (q) {
      return getQuestionList(q)
    }

    if (price && filter) {
      if (filter === 'PriceInitial') {
        return getPriceInitial(price)
      } else if (filter === 'PriceFinal') {
        return getPriceFinal(price)
      } else if (filter === 'TimeFinalAsc') {
        return getPriceFinalTimeAsc(price)
      } else if (filter === 'TimeFinalDesc') {
        return getPriceFinalTimeDesc(price)
      }
    } else if (price) {
      return getPrice(price)
    }

    if (Name) {
      return getGameName(Name)
    }

    if (AppID && priceTime) {
      const splitPriceTime = priceTime.split(",")
      return getGamePriceTime(AppID, splitPriceTime)
    }else if (AppID && filter) {
      if (filter === 'HistoricalLowPrice') {
        return getGameHistoricalLowPrice(AppID)
      } else if (filter === 'PriceTimeAsc') {
        return getGamePriceTimeAsc(AppID)
      } else if (filter === 'PriceTimeDesc') {
        return getGamePriceTimeDesc(AppID)
      } else if (filter === 'PriceDiscountNow') {
        return getGamePriceDiscountNow(AppID)
      }
    }else if (AppID) {
      return getGameId(AppID)
    }

    // 精准查询 原价/折后价
    async function getPrice(price) {
      const data = await Price.query().with('Apps')
                                      .where('PriceInitial', price*100)
                                      .orWhere('PriceFinal', price*100)
                                      .fetch()
      return data.toJSON()
    }

    // 精准查询 原价
    async function getPriceInitial(price) {
      const data = await Price.query().with('Apps').where('PriceInitial', price*100).fetch()
      return data.toJSON()
    }

    // 精准查询 折后价
    async function getPriceFinal(price) {
      const data = await Price.query().with('Apps').where('PriceFinal', price*100).fetch()
      return data.toJSON()
    }

    // 查询指定 时间段 的折后价(时间增序)
    async function getPriceFinalTimeAsc(price) {
      const data = await Price.query().with('Apps').where('PriceFinal', price*100).orderBy('LastUpdated', 'asc').fetch()
      return data.toJSON()
    }

    // 查询指定 时间段 的折后价(时间降序)
    async function getPriceFinalTimeDesc(price) {
      const data = await Price.query().with('Apps').where('PriceFinal', price*100).orderBy('LastUpdated', 'desc').fetch()
      return data.toJSON()
    }

    // 模糊查询 价格
    async function getPriceQuestion(q) {
      const data = await Price.query().with('Apps')
                                    .where('AppID', q)
                                    .orWhere('PriceInitial', q*100)
                                    .orWhere('PriceFinal', q*100)
                                    .orWhere('PriceDiscount', q)
                                    .fetch()
      return data.toJSON()
    }

    // 模糊查询 列表
    async function getQuestionList(q) {
      const data = await GetGameApps.query().with('AppsPrices')
                                    .where('AppID', q)
                                    .orWhere('Name', 'like', '%' + q + '%')
                                    .orWhere('ChineseName', 'like', '%' + q + '%')
                                    .orWhere('LastUpdated', 'like', '%' + q + '%')
                                    .fetch()
      return data.toJSON()
    }

    // 请求指定 AppID 内容
    async function getGameId (AppID) {
      const data = await GetGameApps.query().with('AppsPrices').where('AppID', AppID).fetch()
      return data.toJSON()
    }

    // 请求指定 Name 内容
    async function getGameName (Name) {
      const data = await GetGameApps.query().with('AppsPrices').where('Name', 'like', '%' + Name + '%').orWhere('ChineseName', 'like', '%' + q + '%').fetch()
      return data.toJSON()
    }

    // 请求指定 AppID 价格(时间增序)
    async function getGamePriceTimeAsc (AppID) {
      const data = await Price.query().with('Apps').where('AppID', AppID).orderBy('LastUpdated', 'asc').fetch()
      return data.toJSON()
    }

    // 请求指定 AppID 价格(时间降序)
    async function getGamePriceTimeDesc (AppID) {
      const data = await Price.query().with('Apps').where('AppID', AppID).orderBy('LastUpdated', 'desc').fetch()
      return data.toJSON()
    }

    // 请求指定 AppID 历史最低价格
    async function getGameHistoricalLowPrice (AppID) {
      const data = await Price.query().with('Apps').where('AppID', AppID).orderBy('PriceFinal', 'asc').first()
      return data
    }

    // 请求当前是否打折
    async function getGamePriceDiscountNow (AppID) {
      const data = await Price.query().with('Apps').where('AppID', AppID).orderBy('LastUpdated', 'desc').first()
      return data
    }

    // 请求指定 价格时间段
    async function getGamePriceTime (AppID, priceTime) {
      const data = await Price.query().with('Apps').where('AppID', AppID).whereBetween('LastUpdated', priceTime)
      return data
    }
    
    // 模糊查询 标签
    async function getGameTag(q, page) {
      if (page === undefined) {
        page = 1
      }
      const data = await Info.query().where('Key', 153)
                                    .where('Value', 'like', '%' + q + '%')
                                    .paginate(page)
      return data.toJSON()
    }

  }
}

module.exports = SearchController
