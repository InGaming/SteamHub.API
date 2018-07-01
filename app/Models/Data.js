'use strict'
const got = require('got')
const fs = require("fs")

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
    const parseResponse  = await JSON.parse(response.body)
    return parseResponse
  } catch (error) {
    console.log('Got error')
  }
}

async function insert (FileUrl, ResourceUrl) {
  const db = config (FileUrl)
  const parseResponse = await get(ResourceUrl)
  try {
    db.defaults({ data: [parseResponse] })
      .write()
    console.log('Insert DB in: ' + FileUrl)
  } catch (error) {
    console.log('Insert DB error')
  }
}

module.exports.insert = insert
module.exports.config = config
