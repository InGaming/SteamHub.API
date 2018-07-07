'use strict'
const Price = use('App/Models/Api/V1/Steam/Game/Price')
const List = use('App/Models/Api/V1/Steam/Game/List')
const Redis = use('Redis')

class SearchController {
  async index ({ request, response }) {

    const appid = request.get().appid
    const name = request.get().name
    const filter = request.get().filter
    const priceTime = request.get().priceTime

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

    // 请求指定 appid 内容
    async function getGameId (appid) {
      const data = await List.query().with('prices').where('appid', appid).fetch()
      return data.toJSON()
    }

    // 请求指定 name 内容
    async function getGameName (name) {
      const list = await List.query().where('name', 'like', '%' + name + '%').fetch()
      const parseList = list.toJSON()
      let appid = ''
      parseList.forEach(element => {
        appid = element.appid
      })
      const data = await List.query().with('prices').where('appid', appid).fetch()
      return data.toJSON()
    }

    // 请求指定 appid 价格(时间增序)
    async function getGamePriceTimeAsc (appid) {
      const data = await Price.query().where('appid', appid).orderBy('created_at', 'asc').fetch()
      return data.toJSON()
    }

    // 请求指定 appid 价格(时间降序)
    async function getGamePriceTimeDesc (appid) {
      const data = await Price.query().where('appid', appid).orderBy('created_at', 'desc').fetch()
      return data.toJSON()
    }

    // 请求指定 appid 历史最低价格
    async function getGameHistoricalLowPrice (appid) {
      const data = await Price.query().where('appid', appid).orderBy('final', 'asc').first()
      return data.toJSON()
    }

    // 请求当前是否打折
    async function getGamePriceDiscountNow (appid) {
      const data = await Price.query().where('appid', appid).orderBy('created_at', 'desc').first()
      if (data.discount_percent === 0) {
        response.send({
          discount: false
        })
      } else {
        response.send({
          discount: true
        })
      }
    }

    // 请求指定 价格时间段
    async function getGamePriceTime (appid, priceTime) {
      const data = await Price.query().where('appid', appid).whereBetween('created_at', priceTime)
      return data
    }
    
  }
}

module.exports = SearchController
