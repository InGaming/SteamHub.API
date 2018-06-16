'use strict'

class GameController {
  store ( { request } ) {
    const SteamUser = require('steam-user')
    const SteamTotp = require('steam-totp')
    
    const client = new SteamUser()
    
    const gameID = parseInt(request.post().gameID)
    const userName = request.post().name
    const password = request.post().password
    const f2a = request.post().f2a

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
