'use strict'

var utils = require('../utils/writer.js')
var Users = require('../service/UsersService')

module.exports.getUserByLuid = function getUserByLuid(req, res, next) {
  var luid = req.swagger.params['luid'].value
  Users.getUserByLuid(luid)
    .then(function (response) {
      utils.writeJson(res, response)
    })
    .catch(function (response) {
      utils.writeJson(res, utils.respondWithCode(response.code, response))
    })
}

module.exports.registerUser = function registerUser(req, res, next) {
  var user = req.swagger.params['user'].value
  Users.registerUser(user)
    .then(function (response) {
      utils.writeJson(res, response)
    })
    .catch(function (response) {
      utils.writeJson(res, utils.respondWithCode(response.code, response))
    })
}
