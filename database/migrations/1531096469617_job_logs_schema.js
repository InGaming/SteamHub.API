'use strict'

const Schema = use('Schema')

class JobLogsSchema extends Schema {
  up () {
    this.create('job_logs', (table) => {
      table.increments()
      table.string('controller', 100)
      table.text('log')
      table.timestamps()
    })
  }

  down () {
    this.drop('job_logs')
  }
}

module.exports = JobLogsSchema
