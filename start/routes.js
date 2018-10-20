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
const User = use('App/Models/User')
Route.on('/').render('welcome')

Route
  .group(() => {
    Route.resource('/user/infos', '/User/InfoController')
    Route.resource('/play/games', '/Play/GameController')
    Route.resource('/game/lists', '/Game/ListController')
    Route.resource('/game/prices', '/Game/PriceController')
    Route.resource('/game/searches', '/Game/SearchController')
    Route.resource('/game/features', '/Game/FeatureController')
    Route.resource('/game/trending', '/Game/TrendingController')
    Route.resource('/game/topsellers', '/Game/TopSellerController')
    Route.resource('/rss', '/RSSController')
    Route.resource('/apps', '/AppController')
    Route.resource('/app/infos', '/AppInfoController')
    Route.resource('/app/appdetails', '/AppDetailController')
    Route.resource('/app/store/update/queues', '/StoreUpdateQueueController')
  })
  .prefix('api/v1/steam')
  .namespace('Api/V1/Steam')

Route
  .group(() => {
    Route.post('/login', 'AuthController.login')
    Route.post('/logout', 'AuthController.logout').middleware('auth')
    Route.get('/users/me', 'AuthController.me').middleware('auth')
  })
  .prefix('api/v1/admin')
  .namespace('Api/V1/Admin')

Route
  .group(() => {
    Route.resource('/articles', 'ArticleController')
  })
  .prefix('api/v1')
  .namespace('Api/V1')

Route
  .group(() => {
    Route.resource('/vgtime', 'VgtimeController')
    Route.resource('/3dmgame', 'ThreeDmgameController')
  })
  .prefix('api/v1/news')
  .namespace('Api/V1/News')