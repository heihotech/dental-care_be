const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const compression = require('compression')
const cookieParser = require('cookie-parser')
const { ResponseUtil } = require('../../internal/utils')

const listEndpoints = require('express-list-endpoints')

const config = require('../../internal/config').Var

module.exports = {
  Init: () => {
    const app = express()

    app.use(cookieParser())
    let whitelist = ['http://localhost:3001', 'http://localhost:3000']
    let corsOptions = {
      origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
          callback(null, true)
        } else {
          callback(new Error('Not allowed by CORS'))
        }
      },
    }
    console.log(corsOptions.origin)
    app.use(cors({ credentials: true, origin: corsOptions.origin }))
    // app.use(cors({ credentials: true, origin: `${config.AllowOrigin}` }))
    // app.use(cors({ origin: '*' }))
    // app.use(cors({ credentials: false, origin: '*' }))
    app.use(express.urlencoded({ extended: true }))
    app.use(express.json())
    app.use('/files', express.static('public'))
    app.use((req, res, next) => {
      if (req.method === 'TRACE') {
        return res.status(405).send()
      }

      return next()
    })
    app.use(morgan('tiny'))
    app.use(compression())

    return app
  },
  Invoke: (app) => {
    app.use((err, req, res, next) => {
      if (err) {
        console.error(err)

        return res
          .status(res.statusCode !== 200 ? res.statusCode : 500)
          .send(ResponseUtil.RespJSONError(err))
      }

      return res.send()
    })

    // console.log(listEndpoints(app))
    return app
  },
}
