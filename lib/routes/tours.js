/* eslint-disable new-cap */
const router = require('express').Router();
const Tour = require('../models/tour');
const addGeoWeather = require('../middleware/add-geo-weather');

router

  .post('/', (req, res, next) => {
    Tour.create(req.body)
      .then(tour => res.json(tour))
      .catch(next);
  })

  .get('/', (req, res, next) => {
    Tour.find()
      .then(tours => res.json(tours))
      .catch(next);
  })

  .post('/:id/stops', addGeoWeather(), (req, res, next) => {
    Tour.addStop(req.params.id, req.body)
      .then(stop => {
        res.json(stop);
      })
      .catch(next);
  })

  .delete('/:id/stops/:stopId', (req, res, next) => {
    Tour.removeStop(req.params.id, req.params.stopId)
      .then(stop => res.json(stop))
      .catch(next);
  });


module.exports = router;