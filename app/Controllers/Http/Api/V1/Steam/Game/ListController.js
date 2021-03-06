'use strict'

const List = use('App/Models/Api/V1/Steam/Game/List')
const Env = use('Env')
const Redis = use('Redis')
const got = require('got')
const _ = require('lodash')

class ListController {

  async index ({ request, response }) {

    let page = request.get().page
    if (page === undefined) {
      page = 1
    }
    const cachedLists = await Redis.get('steamGameLists=' + page)
    if (cachedLists) {
      response.send(JSON.parse(cachedLists))
    }

    const lists = await List.query().paginate(page)
    await Redis.set('steamGameLists=' + page, JSON.stringify(lists.toJSON()), 'ex', 43200)
    response.send(lists)

  }
  
  async show ({ params, response }) {
    
    const id = params.id
    const cachedAppdetails = await Redis.get('steamGameAppdetails=' + id)

    if (cachedAppdetails) {
      response.send(JSON.parse(cachedAppdetails))
    }

    const appdetails = await got('https://store.steampowered.com/api/appdetails?appids=' + id + '&cc=cn&l=cn')
    const parseAppdetails = JSON.parse(appdetails.body)
    await Redis.set('steamGameAppdetails=' + id, JSON.stringify(parseAppdetails), 'ex', 86400)
    response.send(parseAppdetails)
  }

  async store ({ request }) {
    const key = request.get().key
    if (key !== Env.get('API_KEY')) {
      return 'error'
    }

    const response = await got('https://api.steampowered.com/ISteamApps/GetAppList/v0002/')
    const parseResponse = JSON.parse(response.body)
    const chunkAppLists = _.chunk(parseResponse.applist.apps, 250)

    await List.truncate()

    for (let index = 0; index < chunkAppLists.length; index++) {
      const element = chunkAppLists[index]
      await List.createMany(element)
    }

    return
  }

}

module.exports = ListController
