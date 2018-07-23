'use strict'
const Price = use('App/Models/Api/V1/Steam/Game/Price')
const GetGameApps = use('App/Models/Api/V1/Steam/App')
const Env = use('Env')
const Redis = use('Redis')
const requested = require('request')
const _ = require('lodash')

class PriceController {
  async index({ request, response }) {

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

  async show({ params, request, response }) {
    const appid = params.id
    const country = request.get().country
    const cachedPrices = await Redis.get('steamGamePrices=' + appid)
    if (cachedPrices) {
      response.send(JSON.parse(cachedPrices))
    }
    const prices = await Price.query().where('appid', appid).where('Country', country).fetch()
    await Redis.set('steamGamePrices=' + appid + country, JSON.stringify(prices.toJSON()), 'ex', 43200)
    return prices.toJSON()
  }

  async store({ request }) {
    const key = request.get().key
    if (key !== Env.get('API_KEY')) {
      return 'error'
    }

    const appList = await GetGameApps.query().select('appid').fetch()
    const arrayAppList = appList.toJSON()

    let country = {
      '中国': {
        cc: 'cn',
        country: 'China',
        displayCountryName: '中国',
        displayCountrySymbol: '元'
      },
      '美国': {
        cc: 'us',
        country: 'United States',
        displayCountryName: '美国',
        displayCountrySymbol: '美元'
      },
      '俄罗斯': {
        cc: 'ru',
        country: 'Russia',
        displayCountryName: '俄罗斯',
        displayCountrySymbol: '卢布'
      },
      '英国': {
        cc: 'uk',
        country: 'United Kingdom',
        displayCountryName: '英国',
        displayCountrySymbol: '英镑'
      }
    }
    const appidList = _.map(arrayAppList, 'appid')
    const chunkAppidList = _.chunk(appidList, 20)
    for (let i = 0; i < chunkAppidList.length; i++) {
      setTimeout(function timer() {
        for (let item in country) {
          setTimeout(function timer() {
            requested('https://store.steampowered.com/api/appdetails?appids=' + chunkAppidList[i] + '&cc=' + country[item]['cc'] + '&filters=price_overview', async function (error, response, body) {
              let parseBody = JSON.parse(body)
              let Country = country[item]['country']
              let DisplayCountryName = country[item]['displayCountryName']
              let DisplayCountrySymbol = country[item]['displayCountrySymbol']
              for (let key in parseBody) {
                let oldPriceFirst = await Price.query().where('AppID', key).where('Country', country[item]['country']).orderBy('LastUpdated', 'desc').first()
                let oldPrice = await Price.query().where('AppID', key).where('Country', country[item]['country']).orderBy('LastUpdated', 'desc')
                let insertPriceNull = {
                  AppID: key,
                  Country: Country,
                  DisplayCountryName: DisplayCountryName,
                  DisplayCountrySymbol: DisplayCountrySymbol,
                  PriceInitial: null,
                  PriceFinal: null,
                  PriceDiscount: null
                }
    
                if (!_.isEmpty(parseBody[key]['data'])) {
                  if (!_.isEmpty(parseBody[key]['data']['price_overview'])) {
                    let insertPrice = {
                      AppID: key,
                      Country: Country,
                      DisplayCountryName: DisplayCountryName,
                      DisplayCountrySymbol: DisplayCountrySymbol,
                      PriceInitial: parseBody[key]['data']['price_overview']['initial'],
                      PriceFinal: parseBody[key]['data']['price_overview']['final'],
                      PriceDiscount: parseBody[key]['data']['price_overview']['discount_percent']
                    }
    
                    if (oldPriceFirst === null || oldPriceFirst === undefined ) {
                      Price.create(insertPrice)
                    } else if (oldPriceFirst.PriceFinal !== parseBody[key]['data']['price_overview']['final']) {
                      Price.create(insertPrice)
                    } else if (oldPriceFirst.PriceFinal === parseBody[key]['data']['price_overview']['final']) {
                      if (oldPrice.length === 1) {
                        Price.create(insertPrice)
                      } else {
                        await Price.query().where('AppID', key).where('Country', country[item]['country']).where('LastUpdated', oldPriceFirst.LastUpdated).update(insertPrice)
                      }
                    }
    
                  } else if (_.isEmpty(parseBody[key]['data']['price_overview'])) {
    
                    if (oldPriceFirst === null || oldPrice.length === 1) {
                      Price.create(insertPriceNull)
                    } else {
                      await Price.query().where('AppID', key).where('Country', country[item]['country']).where('LastUpdated', oldPriceFirst.LastUpdated).update(insertPriceNull)
                    }
    
                  }
                } else if (_.isEmpty(parseBody[key]['data'])) {
                  if (oldPriceFirst === null || oldPrice.length === 1) {
                    Price.create(insertPriceNull)
                  } else {
                    await Price.query().where('AppID', key).where('Country', country[item]['country']).where('LastUpdated', oldPriceFirst.LastUpdated).update(insertPriceNull)
                  }
                }
              }
    
            })
          }, i * 10000)
        }
      }, i * 10000)
    }
    return
  }
}

module.exports = PriceController
