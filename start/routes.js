'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.0/routing
|
*/

const Route = use('Route')

Route.on('/').render('welcome')

Route
  .group(() => {
    Route.resource('/user/infos', '/User/InfoController')
    Route.resource('/play/games', '/Play/GameController')
    Route.resource('/game/lists', '/Game/ListController')
    Route.resource('/game/prices', '/Game/PriceController')
    Route.resource('/game/searches', '/Game/SearchController')
    Route.resource('/game/features', '/Game/FeatureController')
    Route.resource('/apps', '/AppController')
    Route.resource('/app/infos', '/AppInfoController')
    Route.resource('/app/store/update/queues', '/StoreUpdateQueueController')
  })
  .prefix('api/v1/steam')
  .namespace('Api/V1/Steam')