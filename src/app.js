const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()
const port = process.env.PORT || 3000      //port will be set as of Heroku, if fail, it will use 3000

//Define paths for Express config
const publicDirPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

//Setup handlebars engine and views location
app.set('view engine','hbs')
app.set('views',viewsPath)
hbs.registerPartials(partialsPath)

//Setup static directory to serve
app.use(express.static(publicDirPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather app',
        name: 'CW'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About us',
        name: 'CW'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help page',
        helpMsg: 'Google yourself',
        name: 'CW'
    })
})

app.get('/weather', (req, res) => {
    if(!req.query.address) {
        return res.send({
            error: 'You must provide an address'
        })
      }

    geocode(req.query.address, (error, {latitude, longitude, location_geocode} = {}) => {
    if(error) {
        return res.send({error})
    }

        forecast(latitude, longitude, (error, {temp}) => {
            if(error) {
                return res.send({error})
            }
            
            res.send({
                location: location_geocode,
                temperature: temp
            })
        })
    })
//     res.send([
//     {
//         location: 'SG',
//         forecast: 'Sunny',
//         address: req.query.address
//     },
//     {
//         location: 'MY',
//         forecast: 'Sunny'
//     }
//   ])
})

app.get('/products', (req, res) => {
    if(!req.query.search) {
      return res.send({
          error: 'You must provide a search term'
      })
    }
    res.send({
        products: []
    })
})

app.get('/help/*', (req, res) => {
    res.render('404Page', {
        title: '404 page',
        errorMsg: 'Help article not found',
    })
})
app.get('*', (req, res) => {
   res.render('404Page', {
    title: '404 page',
    errorMsg: 'Page not found',
    })
})

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})