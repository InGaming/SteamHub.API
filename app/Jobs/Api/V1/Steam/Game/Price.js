
'use strict'
const jobLog = use('App/Models/Api/V1/Job/Log')
const priceModel = use('App/Models/Api/V1/Steam/Game/Price')

class Price {
  // If this getter isn't provided, it will default to 1.
  // Increase this number to increase processing concurrency.
  static get concurrency () {
    return 1
  }

  // This is required. This is a unique key used to identify this job.
  static get key () {
    return 'steamGamePriceJob'
  }

  // This is where the work is done.
  async handle (data) {
    priceModel.create(data)
  }
}

module.exports = Price