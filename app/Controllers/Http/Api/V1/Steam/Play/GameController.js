'use strict'

class GameController {
  post ( { request } ) {
    const SteamUser = require('steam-user')
    const SteamTotp = require('steam-totp')
    
    const client = new SteamUser()
    
    const gameID = parseInt(request.get().gameID)
    const userName = request.get().name
    const password = request.get().password
    const f2a = request.get().f2a

    const logOnOptions = {
      accountName: userName,
      password: password,
    }
    
    client.logOn(logOnOptions)
    
    client.on('steamGuard', function(domain, callback) {
      console.log("Steam Guard code needed from email ending in " + domain);
      const code = getCodeSomehow();
      callback(code);
    });

    client.on('loggedOn', () => {
      console.log('Logged into Steam')
      client.setPersona(SteamUser.Steam.EPersonaState.Online);
      client.gamesPlayed(gameID);
    })

  }
}

module.exports = GameController
