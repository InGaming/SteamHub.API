'use strict'
const Price = use('App/Models/Api/V1/Steam/Game/Price')
const List = use('App/Models/Api/V1/Steam/Game/List')
const Env = use('Env')
const Redis = use('Redis')
const got = require('got')
const chunks = require('chunk-array').chunks

class PriceController {
  async index () {
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

    chunkAppLists.forEach(async (element) => {
      let response = await got('https://store.steampowered.com/api/appdetails?appids=' + element + '&cc=cn&filters=price_overview')
      let parseResponse = JSON.parse(response.body)
      element.forEach(async (apps) => {
        let defaultArrayGot = [
          arrayGot[indexGot] = {
            appid: apps,
            success: parseResponse[apps]['success'],
            currency: null,
            initial: null,
            final: null,
            discount_percent: null
          }
        ]
        if (parseResponse[apps].hasOwnProperty('data')) {
          let appDatas = parseResponse[apps].data
          if (appDatas.hasOwnProperty('price_overview')) {
            let priceOverview = appDatas['price_overview']
            arrayGot[indexGot] = {
              appid: apps,
              success: parseResponse[apps]['success'],
              currency: priceOverview['currency'],
              initial: priceOverview['initial'],
              final: priceOverview['final'],
              discount_percent: priceOverview['discount_percent']
            }
            indexGot++
          } else {
            defaultArrayGot
            indexGot++
          }
        } else {
          defaultArrayGot
          indexGot++
        }
      })
    })
    console.log(arrayGot)
    return 
  }

  async store ({ request }) {
    const key = request.get().key
    if (key !== Env.get('API_KEY')) {
      return 'error'
    }
    const response = await got('https://api.steampowered.com/ISteamApps/GetAppList/v0002/')
    const parseResponse = JSON.parse(response.body)
    const chunkAppLists = chunks(parseResponse.applist.apps, 250)

    await List.truncate()

    for (let index = 0; index < chunkAppLists.length; index++) {
      const element = chunkAppLists[index]
      await List.createMany(element)
    }

    return
  }
}

module.exports = PriceController
