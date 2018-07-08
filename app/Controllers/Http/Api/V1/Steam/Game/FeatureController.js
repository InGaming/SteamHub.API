'use strict'

const Feature = use('App/Models/Api/V1/Steam/Game/Feature')
const Redis = use('Redis')
const got = require('got')
const Env = use('Env')

class FeatureController {

  async index ({ request }) {

    const cacheFeatures = await Redis.get('steamGameFeatures')
    if (cacheFeatures) {
      return JSON.parse(cacheFeatures)
    }

    const features = await Feature.all()
    await Redis.set('steamGameFeatures', JSON.stringify(features.toJSON()), 'ex', 1800)
    return features.toJSON()

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
