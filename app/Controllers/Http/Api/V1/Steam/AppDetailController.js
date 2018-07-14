'use strict'

class AppDetailController {
  async show ({ params }) {
    const Cache = await Redis.get('GameDetails=' + params.id)
    if (Cache) {
      return JSON.parse(Cache)
    }

    const response = await got('https://store.steampowered.com/api/appdetails?appids=' + params.id + '&cc=cn')

    await Redis.set('GameDetails=' + params.id, response.body, 'ex', 7200)
    return JSON.parse(response.body)

  }
}

module.exports = AppDetailController
