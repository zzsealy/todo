const app = require('./app') // varsinainen Express-sovellus
require('dotenv').config()
const PORT = process.env.PORT
// const config = require('./utils/config')
// const logger = require('./utils/logger')

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
//   logger.info(`Server running on port ${config.PORT}`)
})