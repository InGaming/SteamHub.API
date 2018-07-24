'use strict'

const Article = use('App/Models/Api/V1/Article')
const Redis = use('Redis')
const { validate } = use('Validator')

class ArticleController {
  async index ({ request }) {
    const { page, type } = request.all()

    if (page === '') {
      page = 1
    }

    if (type !== '') {
      const Cache = await Redis.get('Articles=' + page + type)
      if (Cache) {
        return JSON.parse(Cache)
      }
      const articles = await Article.query().where('type', type).paginate(page)
      await Redis.set('Articles=' + page + type, JSON.stringify(articles.toJSON()), 'ex', 300)
      return articles
    }

    const Cache = await Redis.get('Articles=' + page)

    if (Cache) {
      return JSON.parse(Cache)
    }

    const articles = await Article.query().paginate(page)
    await Redis.set('Articles=' + page, JSON.stringify(articles.toJSON()), 'ex', 300)
    return articles
  }

  async show ({ params }) {
    const id = params.id
    const Cache = await Redis.get('Articles=' + id)

    if (Cache) {
      return JSON.parse(id)
    }

    const articles = await Article.find(id)
    await Redis.set('Articles=' + id, JSON.stringify(articles.toJSON()), 'ex', 86400)
    return articles
  }

  async store ({ request, auth }) {
    const check = await auth.check()
    if (! check) {
      return 'Missing or invalid jwt token'
    }

    const rules = {
      title: 'required',
      author: 'required',
      type: 'required',
      content: 'required'
    }

    const validation = await validate(request.all(), rules)

    if (validation.fails()) {
      return 'Validation fails'
    }

    return await Article.create(request.all())
  }
}

module.exports = ArticleController
