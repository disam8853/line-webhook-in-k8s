'use strict'

/**
 * searches user by LINE UID.
 * By passing in the LINE UID, you can search for specific user.
 *
 * luid String pass specific user's LINE UID to search.
 * returns User
 **/
exports.getUserByLuid = function (luid) {
  return new Promise(function (resolve, reject) {
    var examples = {}
    examples['application/json'] = {
      luid: 'U4af4980629...',
    }
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]])
    } else {
      resolve()
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
exports.registerUser = function (luid) {
  return new Promise(function (resolve, reject) {
    resolve()
  })
}
