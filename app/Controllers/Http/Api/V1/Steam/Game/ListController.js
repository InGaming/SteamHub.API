'use strict'
const got = require('got')

class ListController {
  async index () {
    try {
      const response = await got('https://api.steampowered.com/ISteamApps/GetAppList/v0002/')
      return response.body
    } catch (error) {
      console.log(error.response.body);
    }
  }
  
  async show ({ params }) {
    const id = params.id
    try {
      const response = await got('https://store.steampowered.com/api/appdetails?appids=' + id)
      return response.body
    } catch (error) {
      console.log(error.response.body)
    }
  }
}

module.exports = ListController
