import Hapi from '@hapi/hapi'
import dotenv from 'dotenv'
import routes from './routes.js'

dotenv.config()

async function init() {
  const server = Hapi.server({
    port: process.env.PORT || 5000,
    host: process.env.HOST || 'localhost',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  })

  server.route(routes)

  await server.start()
  console.log(`Server berjalan pada ${server.info.uri}`)
}

init()
