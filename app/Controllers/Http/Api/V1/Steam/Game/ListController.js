'use strict'

const List = use('App/Models/Api/V1/Steam/Game/List')
const Env = use('Env')
const Redis = use('Redis')
const got = require('got')
const chunks = require('chunk-array').chunks

class ListController {

  async index () {

    const cachedLists = await Redis.get('steamGameLists')
    if (Array.isArray(cachedLists)) {
      return JSON.parse(cachedLists)
    }

    const lists = List.all()
    await Redis.set('steamGameLists', JSON.stringify(lists), 'ex', 6000)
    return lists

  }
  
  async show ({ params }) {
    
    const id = params.id
    const cachedAppdetails = await Redis.get('steamGameAppdetails=' + id)

    if (cachedAppdetails) {
      return JSON.parse(cachedAppdetails)
    }

    const appdetails = await got('https://store.steampowered.com/api/appdetails?appids=' + id)
    const parseAppdetails = JSON.parse(appdetails.body)
    await Redis.set('steamGameAppdetails=' + id, JSON.stringify(parseAppdetails), 'ex', 86400)
    return parseAppdetails
  }

  async store ({ request }) {
    const key = request.get().key
    if (key !== Env.get('API_KEY')) {
      return 'error'
    }
    const response = await got('https://api.steampowered.com/ISteamApps/GetAppList/v0002/')
    const parseResponse = JSON.parse(response.body)
    const chunkAppLists = chunks(parseResponse.applist.apps, 250)

    await List.truncate()

    for (let index = 0; index < chunkAppLists.length; index++) {
      const element = chunkAppLists[index]
      await List.createMany(element)
    }

    return
  }

}

module.exports = ListController
