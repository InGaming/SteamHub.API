'use strict'
const cheerio = require('cheerio')
const requested = require('request')
const Env = use('Env')
const _ = require('lodash')
const News = use('App/Models/Api/V1/News')

class GamerSkyController {
  store ({ request }) {
    const key = request.get().key
    if (key !== Env.get('API_KEY')) {
      return 'error'
    }

    requestData()
    evalData()
    
    function requestData () {
      requested.get('https://www.gamersky.com/pcgame/',{
        headers: {
          'User-Agent': 'Baiduspider'
        }
      }, async function (error, body) {
        if (true) {
          let data = body.body
          const $ = cheerio.load(data)
          let title = []
          let site = []
          let image = []
          let link = []
          let description = []
          $('.pictxt .con .tit a').each((idx, element) => {
            title.push({
              title: $(element).text()
            })
            site.push({
              site: 'gamersky'
            })
          })
          $('ul.pictxt li .txt').each((idx, element) => {
            description.push({
              description: $(element).text()
            })
          })
          $('.pictxt .img a img').each((idx, element) => {
            image.push({
              image: $(element).attr('src')
            })
          })
          $('.pictxt .con .tit a').each((idx, element) => {
            link.push({
              link: $(element).attr('href')
            })
          })
          const arrayData = _.merge(title, description, image, link, site)
          console.log(arrayData)
          arrayData.forEach(async element => {
            if (element.title) {
              let newsData =  await News.query().where('title', element.title)
              if (newsData.length === 0) {
                News.create({
                  Title: element.title,
                  Description: element.description,
                  Link: element.link,
                  Type: '新闻',
                  Site: element.site,
                  Image: element.image
                })
              }
            }
          })
        }
      })
    }

    function evalData () {
      requested.get('https://www.gamersky.com/review/pc/',{
        headers: {
          'User-Agent': 'Baiduspider'
        }
      }, async function (error, body) {
        if (true) {
          let data = body.body
          const $ = cheerio.load(data)
          let title = []
          let site = []
          let image = []
          let link = []
          let description = []
          let star = []
          $('.pictxt .tit a').each((idx, element) => {
            title.push({
              title: $(element).text()
            })
            site.push({
              site: 'gamersky'
            })
          })
          $('.pictxt .con .txt').each((idx, element) => {
            description.push({
              description: $(element).text()
            })
          })
          $('.pictxt .img a img').each((idx, element) => {
            image.push({
              image: $(element).attr('src')
            })
          })
          $('.pictxt .tit a').each((idx, element) => {
            link.push({
              link: $(element).attr('href')
            })
          })
          $('ul.pictxt li .pc .num').each((idx, element) => {
            star.push({
              star: $(element).text()
            })
          })
          const arrayData = _.merge(title, description, image, link, site)
          arrayData.forEach(async element => {
            if (element.title) {
              let newsData =  await News.query().where('title', element.title)
              if (newsData.length === 0) {
                News.create({
                  Title: element.title,
                  Description: element.description,
                  Link: element.link,
                  Type: '评测',
                  Site: element.site,
                  Image: element.image,
                  Star: element.star
                })
              }
            }
          })
        }
      })
    }
  }
}

module.exports = GamerSkyController