'use strict'
const Price = use('App/Models/Api/V1/Steam/Game/Price')
const List = use('App/Models/Api/V1/Steam/Game/List')
const Env = use('Env')
const Redis = use('Redis')
const requestd = require('request')
const chunks = require('chunk-array').chunks

class PriceController {
  async index ({ request }) {

    let page = request.get().page
    if (page === undefined) {
      page = 1
    }
    const cachedPriceLists = await Redis.get('steamGameListPrices=' + page)
    if (cachedPriceLists) {
      return JSON.parse(cachedPriceLists)
    }

    const prices = await Price.query().paginate(page)
    await Redis.set('steamGameListPrices=' + page, JSON.stringify(prices.toJSON()), 'ex', 43200)
    return prices

  }

  async show ({ params, request }) {
    const appid = params.id
    const page = request.get().page
    if (page !== undefined) {
      const cachedPagePrices = await Redis.get('steamGamePagePrices=' + page)

      if (cachedPagePrices) {
        return JSON.parse(cachedPagePrices)
      }
      const pagePrices = await Price.query().where('appid', appid).paginate(page)
      await Redis.set('steamGamePagePrices=' + page, JSON.stringify(pagePrices.toJSON()), 'ex', 43200)
      return pagePrices
    }

    
    const cachedPrices = await Redis.get('steamGamePrices=' + appid)
    if (cachedPrices) {
      return JSON.parse(cachedPrices)
    }
    const prices = await Price.query().where('appid', appid).fetch()
    await Redis.set('steamGamePrices=' + appid, JSON.stringify(prices.toJSON()), 'ex', 43200)
    return prices
  }

  async store ({ request }) {
    const key = request.get().key
    if (key !== Env.get('API_KEY')) {
      return 'error'
    }

    const appList = await List.query().select('appid').fetch()
    const arrayAppList = appList.toJSON()

    const arrayList = new Array()
    let indexList = 0
    arrayAppList.forEach(element => {
      arrayList[indexList] = element.appid
      indexList++
    })
    
    const arrayGot = new Array()
    let indexGot = 0
    const chunkAppLists = chunks(arrayList, 1000)
    chunkAppLists.forEach(element => {
      requestd('https://store.steampowered.com/api/appdetails?appids=' + element + '&cc=cn&filters=price_overview', function (error, response, body) {
        let parseResponse = JSON.parse(body)
        element.forEach(apps => {
          if (parseResponse[apps].hasOwnProperty('data')) {
            let appDatas = parseResponse[apps].data
            if (appDatas.hasOwnProperty('price_overview')) {
              let priceOverview = appDatas['price_overview']
              indexGot++
              Price.create(
                {
                  appid: apps,
                  success: parseResponse[apps]['success'],
                  currency: priceOverview['currency'],
                  initial: priceOverview['initial'],
                  final: priceOverview['final'],
                  discount_percent: priceOverview['discount_percent']
                }
              )
            } else {
              indexGot++
            }
          } else {
            indexGot++
          }
        })
      })
    })

    return
  }
}

module.exports = PriceController
