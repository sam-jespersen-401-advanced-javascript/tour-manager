jest.mock('../../lib/services/maps-api');
jest.mock('../../lib/services/weather-api');
const request = require('../request');
const db = require('../db');
// const { matchMongoId } = require('../match-helpers');
const getLocation = require('../../lib/services/maps-api');
const getWeather = require('../../lib/services/weather-api');

getLocation.mockResolvedValue({
  latitude: 42.3216979,
  longitude: -122.8879418
});

getWeather.mockResolvedValue({
  forecast: 'Partly Cloudy'
});

describe('tour api', () => {
  beforeEach(() => {
    return db.dropCollection('tours');
  });

  const tour = {
    title: 'A Grand Tour',
    activities: ['moshpit', 'ballpit'],
    launchDate: new Date('4/20/2019'),
    stops: []
  };

  function postTour(tour) {
    return request
      .post('/api/tours')
      .send(tour)
      .expect(200)
      .then(({ body }) => body);
  }

  it('post a tour', () => {
    return postTour(tour).then(tour => {
      expect(tour).toEqual({
        _id: expect.any(String),
        __v: 0,
        ...tour
      });
    });
  });

  it('gets all tours', () => {
    return Promise.all([postTour(tour), postTour(tour), postTour(tour)])
      .then(() => {
        return request.get('/api/tours').expect(200);
      })
      .then(({ body }) => {
        expect(body.length).toBe(3);
        expect(body[0]).toMatchInlineSnapshot(
          {
            _id: expect.any(String),
            launchDate: expect.any(String)
          },
          `
          Object {
            "__v": 0,
            "_id": Any<String>,
            "activities": Array [
              "moshpit",
              "ballpit",
            ],
            "launchDate": Any<String>,
            "stops": Array [],
            "title": "A Grand Tour",
          }
        `
        );
      });
  });

  const stop = {
    location: {
      address: '123 washington street, medford, or',
      lat: 0,
      lng: 0
    },
    weather: '',
    attendance: 69
  };

  it('posts a stop to a tour', () => {
    return postTour(tour).then(tour => {
      return request
        .post(`/api/tours/${tour._id}/stops`)
        .send(stop)
        .expect(200)
        .then(({ body }) => {
          expect(body[0]).toMatchInlineSnapshot(
            {
              _id: expect.any(String)
            },
            `
            Object {
              "_id": Any<String>,
              "attendance": 69,
              "location": Object {
                "address": "123 washington street, medford, or",
                "lat": 42.3216979,
                "lng": -122.8879418,
              },
              "weather": "Partly Cloudy",
            }
          `
          );
        });
    });
  });

  it('deletes a stop', () => {
    let getTour;
    return postTour(tour)
      .then(returnedTour => {
        getTour = returnedTour;
        return request.post(`/api/tours/${getTour._id}/stops`).send(stop);
      })
      .then(({ body }) => {
        return request
          .delete(`/api/tours/${getTour._id}/stops/${body[0]._id}`)
          .expect(200);
      })
      .then(({ body }) => {
        expect(body.length).toBe(0);
      });
  });

  it('updates attendance of a stop', () => {
    let getTour;
    return postTour(tour)
      .then(returnedTour => {
        getTour = returnedTour;
        return request.post(`/api/tours/${getTour._id}/stops`).send(stop);
      })
      .then(({ body }) => {
        expect(body[0].attendance).toBe(stop.attendance);
        return request
          .put(`/api/tours/${getTour._id}/stops/${body[0]._id}/attendance`)
          .send({ attendance: 420 })
          .expect(200);
      })
      .then(({ body }) => {
        expect(body[0].attendance).toBe(420);
      });
  });
});
