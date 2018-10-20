'use strict'
const cheerio = require('cheerio')
const requested = require('request')
const Env = use('Env')
const _ = require('lodash')
const News = use('App/Models/Api/V1/News')

class VgtimeController {
  store ({ request }) {
    const key = request.get().key
    if (key !== Env.get('API_KEY')) {
      return 'error'
    }

    requestData()
    evalData()

    function requestData () {
      requested('https://www.vgtime.com/topic/index/load.jhtml?page=1&pageSize=99', async function (error, body) {
        if (!error) {
          let data = JSON.parse(body.body).data
          const $ = cheerio.load(data)
          let title = []
          let type = []
          let site = []
          let image = []
          let link = []
          let description = []
          $('.info_box a h2').each((idx, element) => {
            title.push({
              title: $(element).text()
            })
            site.push({
              site: 'vgtime'
            })
          })
          $('.info_box p').each((idx, element) => {
            description.push({
              description: $(element).text()
            })
          })
          $('.info_box .vg_tab').each((idx, element) => {
            type.push({
              type: $(element).text()
            })
          })
          $('.img_box a img').each((idx, element) => {
            image.push({
              image: $(element).attr('src')
            })
          })
          $('.img_box a').each((idx, element) => {
            link.push({
              link: 'https://www.vgtime.com' + $(element).attr('href')
            })
          })
          const arrayData = _.merge(title, description, type, image, link, site)
          arrayData.forEach(async element => {
            let newsData =  await News.query().where('title', element.title)
            if (newsData.length === 0) {
              News.create({
                Title: element.title,
                Description: element.description,
                Link: element.link,
                Type: element.type,
                Site: element.site
              })
            }
          })
        }
      })
    }

    function evalData () {
      requested('https://www.vgtime.com/game/eval_list.jhtml?page=1&pageSize=99', async function (error, body) {
        if (!error) {
          let data = JSON.parse(body.body)
          data.data.forEach(async element => {
            let newsData =  await News.query().where('title', element.title)
            if (newsData.length === 0) {
              News.create({
                Title: element.title,
                Description: element.remark,
                Advantage: element.merit,
                Disadvantage: element.defect,
                Type: '评测',
                Site: 'vgtime',
                Link: 'https://www.vgtime.com/topic/' + element.id + '.jhtml',
                Star: element.editorScore
              })
            }
          })
        }
      })
    }
  }
}

module.exports = VgtimeController