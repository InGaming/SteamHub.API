'use strict'
const User = use('App/Models/User')
const Hash = use('Hash')

class AuthController {
  async login({ request, auth }) {
    const { email, password } = request.all()
    const dbUser = await User.query().where('email', email).first()
    const isSame = await Hash.verify(password, dbUser.password)
    if (isSame) {
      return await auth.generate(dbUser)
    }
  }

  async me({ auth }) {
    return auth.user
  }
}

module.exports = AuthController
