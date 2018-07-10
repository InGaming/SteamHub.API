'use strict'

const Model = use('Model')

class Log extends Model {
  static get table () {
    return 'job_logs'
  }
}

module.exports = Log
