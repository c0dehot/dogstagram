require( 'dotenv' ).config() // looks for .env ; process.env gets it's values

const express = require('express')
const apiRouter = require('./app/router')
const app = express()

const orm = require('./app/orm');

const PORT = process.env.PORT || 8080

// for parsing incoming POST data
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// for serving all the normal html
app.use( express.static('public') )

// pre-seed data
orm.initDb()

// for routes
apiRouter(app)

app.listen(PORT, function() {
    console.log( `Serving app on: http://localhost:${PORT}` )
})