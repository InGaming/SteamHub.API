'use strict'

const Schema = use('Schema')

class ArticlesSchema extends Schema {
  up () {
    this.create('articles', (table) => {
      table.increments()
      table.string('title', 150)
      table.string('author', 80)
      table.string('type', 50)
      table.text('content')
      table.timestamps()
    })
  }

  down () {
    this.drop('articles')
  }
}

module.exports = ArticlesSchema
