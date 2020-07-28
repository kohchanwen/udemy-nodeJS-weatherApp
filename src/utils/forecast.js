const request = require('request')

const forecast = (latitude, longitude, callback) => {
    const url = 'http://api.weatherstack.com/current?access_key=fd115af6770fd6a032103a2fab260def&query=' + latitude + ',' + longitude + '&units=m'

    request({url, json: true}, (error, {body}) => {
        if(error) {
            callback('Unable to connect to Location services!', undefined)
        } else if(body.error) {
            callback('Unable to find location',undefined)
        } else {
            callback(undefined, {
                temp: body.current.temperature,
                feelslike: body.current.feelslike,
                description: body.current.weather_descriptions[0]
            })
        }
    })
}

module.exports = forecast