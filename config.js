// config.js
const envs = {}

try {
  require.resolve('mocha')

  const dotenv = require('dotenv')
  const result = dotenv.config()

  if (result.error) {
    throw result.error
  }

  const envs = result.parsed
} catch(e) {
  envs = {
    process.env.
    process.env.
  }
}


module.exports = envs
