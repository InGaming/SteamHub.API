'use strict'
const Price = use('App/Models/Api/V1/Steam/Game/Price')
const List = use('App/Models/Api/V1/Steam/Game/List')
const Env = use('Env')
const Redis = use('Redis')
const requestd = require('request')
const chunks = require('chunk-array').chunks

class PriceController {
  async index () {
    return Price.all()
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
              defaultArrayGot
              indexGot++
            }
          } else {
            defaultArrayGot
            indexGot++
          }
        })
      })
    })

    return
  }
}

module.exports = PriceController
