'use strict'
const cheerio = require('cheerio')
const requested = require('request')
const Env = use('Env')
const _ = require('lodash')
const News = use('App/Models/Api/V1/News')

class ThreeDmgameController {
  store ({ request }) {
    const key = request.get().key
    if (key !== Env.get('API_KEY')) {
      return 'error'
    }

    requestData()

    function requestData () {
      requested('https://www.3dmgame.com/news_32_1/', async function (error, body) {
        if (!error) {
          let data = body.body
          const $ = cheerio.load(data)
          let title = []
          let type = []
          let site = []
          let image = []
          let link = []
          let description = []
          $('.list .bt').each((idx, element) => {
            title.push({
              title: $(element).text()
            })
            site.push({
              site: '3dmgame'
            })
            type.push({
              type: '新闻'
            })
          })
          $('.list a p').each((idx, element) => {
            description.push({
              description: $(element).text()
            })
          })
          $('.imgst img').each((idx, element) => {
            image.push({
              image: $(element).attr('src')
            })
          })
          $('.list li a').each((idx, element) => {
            link.push({
              link: $(element).attr('href')
            })
          })
          const arrayData = _.merge(title, description, type, image, link, site)
          arrayData.forEach(async element => {
            if (element.title) {
              let newsData =  await News.query().where('title', element.title)
              if (newsData.length === 0) {
                News.create({
                  Title: element.title,
                  Description: element.description,
                  Link: element.link,
                  Type: element.type,
                  Site: element.site,
                  Image: 'https://www.3dmgame.com/' + element.image
                })
              }
            }
          })
        }
      })
    }
  }
}

module.exports = ThreeDmgameController