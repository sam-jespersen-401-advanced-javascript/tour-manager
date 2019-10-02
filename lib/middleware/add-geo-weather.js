const getLocation = require('../services/maps-api');
const getWeather = require('../services/weather-api');

module.exports = () => (req, res, next) => {
  const { location } = req.body;
  const { address } = location;
  console.log(address);

  if(!address) {
    return next({
      statusCode: 400,
      error: 'address must be supplied'
    });
  }

  getLocation(address)
    .then(location => {
      if(!location) {
        return next({
          statusCode: 400,
          error: 'address must be resolvable to geolocation'
        });
      }

      const { latitude, longitude } = location;
      req.body.location.lat = latitude;
      req.body.location.lng = longitude;

      getWeather(latitude, longitude)
        .then(weather => {
          console.log('WEATHER', weather);
          if(!weather) {
            return next({
              statusCode: 400,
              error: 'address does not resolve to a location with weather'
            });
          }
          req.body.weather = weather[0].forecast;
          next();
        });
    })
    .catch(next);
};