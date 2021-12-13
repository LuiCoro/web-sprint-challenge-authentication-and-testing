const db = require('../../data/dbConfig')
const Users = require('./auth-model')

function checkUserUnique(req, res, next) {

  const username = req.body.username
  Users.findBy({username: username})
      .then((user) => {
        if (user) {
          console.log(user)
          next({
            status: 422, message: 'username taken'
          })
        } else {
          next()
        }
      })
      .catch(next)
}


function checkAccountPayload(req, res, next) {

  const {username, password} = req.body

  if (!username || !password) {
    next({
      status: 400, message: 'username and password are required'
    })
  } else {
    req.body.username = username.trim()
    next()
  }
}

async function checkUserExists(req, res, next) {

  const {username} = req.body

  Users.findBy({username: username})
      .then((user) => {
        if(user){
          req.user = user
          next()
        } else {
          next({
            status: 401, message: 'invalid credentials'
          })
        }
      })
      .catch(next)

}


module.exports = {
  checkUserUnique,
  checkAccountPayload,
  checkUserExists
}