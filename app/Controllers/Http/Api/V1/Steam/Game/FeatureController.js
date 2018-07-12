'use strict'

const Feature = use('App/Models/Api/V1/Steam/Game/Feature')
const Redis = use('Redis')
const got = require('got')
const Env = use('Env')

class FeatureController {

  async index ({ request }) {

    const Cache = await Redis.get('GameFeatures')
    if (Cache) {
      return JSON.parse(Cache)
    }

    const response = await got('https://store.steampowered.com/api/featuredcategories')

    await Redis.set('GameFeatures', response.body, 'ex', 600)
    return JSON.parse(response.body)

  }


  async store ({ request }) {
    const key = request.get().key
    if (key !== Env.get('API_KEY')) {
      return 'error'
    }
    const response = await got('https://store.steampowered.com/api/featuredcategories')
    const parseResponse = JSON.parse(response.body)
    await Feature.truncate()
    await Feature.createMany(parseResponse.specials.items)
    return
  }

}

module.exports = FeatureController
