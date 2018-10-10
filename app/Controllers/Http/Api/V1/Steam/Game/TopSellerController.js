'use strict'
const cheerio = require('cheerio')
const requested = require('request')
const TopSeller = use('App/Models/Api/V1/Steam/Game/TopSeller')
const Env = use('Env')
const _ = require('lodash')

class TopSellerController {
  store ({ request }) {
    const key = request.get().key
    if (key !== Env.get('API_KEY')) {
      return 'error'
    }
    require('https').globalAgent.keepAlive = true
    requestData('cn', 'schinese')
    requestData('us', 'english')
    function requestData (cc, language) {
      requested('https://store.steampowered.com/search/?ignore_preferences=1&filter=globaltopsellers&category1=998&cc=' + cc + '&l=' + language, async function (error, body) {
        if (!error) {
          let country = ''
          if (cc === 'cn') { country = 'China' }
          if (cc === 'us') { country = 'United States' }
          let price = []
          let releaseDate = []
          let title = []
          let appids = []
          const $ = cheerio.load(body.body)
          $('.ignore_preferences a').each((idx, element) => {
            let removeURL = $(element).attr('href').replace(/^https:\/\/store\.steampowered\.com\/app\//g, '')
            let id = removeURL.match(/^[0-9]*/g)
            appids.push({
              appid: id.toString()
            })
          })
          $('.search_name .title').each((idx, element) => {
            title.push({
              title: $(element).text()
            })
          })
          $('.search_released').each((idx, element) => {
            releaseDate.push({
              releaseDate: $(element).text()
            })
          })
          $('.search_price').each((idx, element) => {
            price.push({
              price: $(element).text().replace(/\s/g, '')
            })
          })
          TopSeller.create({
            'Country': country,
            'Data': JSON.stringify(_.merge(appids, title, releaseDate, price))
          })
        } else if (error) { console.log(error) }
      })
    }
  }
}

module.exports = TopSellerController