'use strict'
const mysql = require('mysql2/promise')
const SQL = require('sql-template-strings')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const DB_HOST = process.env.DB_HOST
const DB_PORT = process.env.DB_PORT
const DB_USER = process.env.DB_USER
const DB_NAME = process.env.DB_NAME
const DB_PASSWORD = process.env.DB_PASSWORD

const pool = mysql.createPool({
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  database: DB_NAME,
  password: DB_PASSWORD,
  connectionLimit: 2,
})

/**
 * searches user by LINE UID.
 * By passing in the LINE UID, you can search for specific user.
 *
 * luid String pass specific user's LINE UID to search.
 * returns User
 **/
exports.getUserByLuid = function (luid) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await _getUserByLuid(luid)
      if (!res) return reject({ code: 404, reason: 'User not found' })
      resolve(res)
    } catch (err) {
      reject({ code: err.code || 500, err })
    }
  })
}

exports.getAllUsers = function () {
  return new Promise(async (resolve, reject) => {
    const stmt = SQL`SELECT * FROM user`
    try {
      const [rows] = await pool.query(stmt)
      resolve(rows)
    } catch (err) {
      reject({ code: 500, err })
    }
  })
}

/**
 * adds an inventory item
 * Register a LINE user to DB.
 *
 * luid User To register a user, provide his/her LINE UID.
 * no response value expected for this operation
 **/
exports.registerUser = function (user) {
  return new Promise(async (resolve, reject) => {
    const existUser = await _getUserByLuid(user.luid)
    if (existUser) return resolve()

    const stmt = SQL`INSERT INTO user (LINE_UID) VALUES (${user.luid})`
    try {
      await pool.query(stmt)
      resolve(200)
    } catch (err) {
      reject({ code: 500, err })
    }
  })
}

async function _getUserByLuid(luid) {
  const stmt = SQL`SELECT * FROM user WHERE LINE_UID=${luid}`
  const [rows] = await pool.query(stmt)
  return rows[0]
}
