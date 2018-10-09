'use strict'
const cheerio = require('cheerio')
const requested = require('request')
const Trending = use('App/Models/Api/V1/Steam/Game/Trending')
const Env = use('Env')
const _ = require('lodash')

class TrendingController {
  store ({ request }) {
    const key = request.get().key
    if (key !== Env.get('API_KEY')) {
      return 'error'
    }

    // Use abstract equality == for "is number" test
    function isEven (n) {
      return n == parseFloat(n)? !(n%2) : void 0
    }

    // Use strict equality === for "is number" test
    function isEvenStrict (n) {
      return n === parseFloat(n)? !(n%2) : void 0
    }

    setTimeout(function timer () {
      requested('https://store.steampowered.com/stats/Steam-Game-and-Player-Statistics?l=chinese', async function (error, body) {
        if (!error) {
          let now = []
          let total = []
          let title = []
          let appids = []
          const $ = cheerio.load(body.body)
          $('.player_count_row td span').each((idx, element) => {
            let $element = $(element)
            if (isEvenStrict(idx)) {
              now.push({
                now: $element.text()
              })
            } else {
              total.push({
                total: $element.text()
              })
            }
          })
          $('.gameLink').each((idx, element) => {
            let $element = $(element)
            let removeURL = $element.attr('href').replace(/^https:\/\/store\.steampowered\.com\/app\//g, '')
            let id = removeURL.match(/^[0-9]*/g)
            appids.push({
              appid: id.toString()
            })
            title.push({
              title: $element.text()
            })
          })
          Trending.create({'Data': JSON.stringify(_.merge(appids, title, total, now))})
        }
      })
    }, 500)
  }
}

module.exports = TrendingController