'use strict'
const Detail = use('App/Models/Api/V1/Steam/AppDetail')
const GetGameApps = use('App/Models/Api/V1/Steam/App')
const Env = use('Env')
const requested = require('request')
const _ = require('lodash')

class AppDetailController {
  async store ({ request }) {
    const key = request.get().key
    if (key !== Env.get('API_KEY')) {
      return 'error'
    }

    const appList = await GetGameApps.query().select('appid').fetch()
    const arrayAppList = appList.toJSON()
    let country = {
      '中国': {
        lang: 'schinese',
        country: 'China',
      },
      '美国': {
        lang: 'english',
        country: 'United States',
      }
    }

    const appidList = _.map(arrayAppList, 'appid')
    for (let i = 0; i < appidList.length; i++) {
      setTimeout(function timer () {
        for (let item in country) {
          setTimeout(function timer () {
            requested('https://store.steampowered.com/api/appdetails?appids=' + appidList[i] + '&l=' + country[item]['lang'], async function (error, body) {
              if (!error) {
                let oldDetail = await Detail.query().where('AppID', appidList[i]).where('Language', country[item]['lang']).orderBy('LastUpdated', 'desc')
                if (oldDetail && oldDetail.length) {
                  await Detail.query().where('AppID', appidList[i]).where('Language', country[item]['lang']).update({ 'Data': JSON.stringify(body.body) })
                } else {
                  Detail.create({
                    'AppID': appidList[i],
                    'Language': country[item]['lang'],
                    'Data': JSON.stringify(body.body)
                  })
                }
              }
            })
          }, i * 1000)
        }
      }, i * 1000)
    }
    return
  }
}

module.exports = AppDetailController
