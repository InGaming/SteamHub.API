'use strict'
const Price = use('App/Models/Api/V1/Steam/Game/Price')
const List = use('App/Models/Api/V1/Steam/Game/List')
const Job = use('App/Jobs/Api/V1/Steam/Game/Price')
const Env = use('Env')
const Redis = use('Redis')
const requested = require('request')
const _ = require('lodash')

class PriceController {
  async index ({ request, response }) {

    let page = request.get().page
    if (page === undefined) {
      page = 1
    }
    const cachedPriceLists = await Redis.get('steamGameListPrices=' + page)
    if (cachedPriceLists) {
      response.send(JSON.parse(cachedPriceLists))
    }

    const prices = await Price.query().paginate(page)
    await Redis.set('steamGameListPrices=' + page, JSON.stringify(prices.toJSON()), 'ex', 43200)
    response.send(prices)

  }

  async show ({ params, request, response }) {
    const appid = params.id
    const page = request.get().page
    if (page !== undefined) {
      const cachedPagePrices = await Redis.get('steamGamePagePrices=' + page)

      if (cachedPagePrices) {
        response.send(JSON.parse(cachedPagePrices))
      }
      const pagePrices = await Price.query().where('appid', appid).paginate(page)
      await Redis.set('steamGamePagePrices=' + page, JSON.stringify(pagePrices.toJSON()), 'ex', 43200)
      response.send(pagePrices)
    }

    
    const cachedPrices = await Redis.get('steamGamePrices=' + appid)
    if (cachedPrices) {
      response.send(JSON.parse(cachedPrices))
    }
    const prices = await Price.query().where('appid', appid).fetch()
    await Redis.set('steamGamePrices=' + appid, JSON.stringify(prices.toJSON()), 'ex', 43200)
    response.send(prices)
  }

  async store ({ request }) {
    const key = request.get().key
    if (key !== Env.get('API_KEY')) {
      return 'error'
    }

    const appList = await List.query().select('appid').fetch()
    const arrayAppList = appList.toJSON()

    const appidList =  _.map(arrayAppList, 'appid')
    const chunkAppidList = _.chunk(appidList, 1000)
    
    let appidArray = []
    _(chunkAppidList).forEach(function(value) {
      requested('https://store.steampowered.com/api/appdetails?appids=' + value + '&cc=cn&filters=price_overview', function (error, response, body) {
        let parseBody = JSON.parse(body)
        Object.keys(parseBody).forEach(function (key) {
          Price.create({
            appid: key
          })
        })
      })
    })
    return indexAppid
  }
}

module.exports = PriceController
