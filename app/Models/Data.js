'use strict'
const got = require('got')

function config (FileUrl) {
  const low = require('lowdb')
  const FileSync = require('lowdb/adapters/FileSync')
  const adapter = new FileSync(FileUrl)
  const db = low(adapter)
  return db
}

async function get (ResourceUrl) {
  try {
    const response = await got(ResourceUrl)
    console.log('Got resource: ' + ResourceUrl)
  } catch (error) {
    console.log('Got error')
  }
  const parseResponse  = JSON.parse(response.body)
  return parseResponse
}

async function insert (FileUrl, ResourceUrl, response) {
  const db = config (FileUrl)
  const parseResponse = await get(ResourceUrl)
  try {
    // Set some defaults (required if your JSON file is empty)
    db.defaults({ data: [parseResponse] })
      .write()
    console.log('Insert DB in: ' + FileUrl)
  } catch (error) {
    console.log('Insert DB error')
  }
}

module.exports.insert = insert
