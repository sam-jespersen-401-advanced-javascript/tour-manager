const request = require('../request');
const db = require('../db');

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
    return postTour(tour)
      .then(tour => {
        expect(tour).toEqual({
          _id: expect.any(String),
          __v: 0,
          ...tour
        });
      });
  });

  it('gets all tours', () => {
    return Promise.all([
      postTour(tour),
      postTour(tour),
      postTour(tour)
    ])
      .then(() => {
        return request
          .get('/api/tours')
          .expect(200);
      })
      .then(({ body }) => {
        expect(body.length).toBe(3);
      });
  });

});