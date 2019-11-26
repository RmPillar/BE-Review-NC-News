process.env.NODE_ENV = 'test';

const chai = require('chai');
const { expect } = chai;
const chaiSorted = require('chai-sorted');
chai.use(chaiSorted);
const request = require('supertest');
const app = require('../app');
const connection = require('../db/connection');

beforeEach(() => connection.seed.run());
after(() => connection.destroy());

describe('app', () => {
  describe('INVALID PATH', () => {
    it('Status: 404', () => {
      return request(app)
        .get('/does-not-exist')
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal('Path not found!!');
        });
    });
  });
  describe('/api', () => {
    describe('/topics', () => {
      describe('GET', () => {
        it('Status: 200 responds with all topics in the database', () => {
          return request(app)
            .get('/api/topics')
            .expect(200)
            .then(({ body: { topics } }) => {
              expect(topics).to.be.an('array');
              expect(topics).to.deep.equal([
                {
                  description: 'The man, the Mitch, the legend',
                  slug: 'mitch'
                },
                {
                  description: 'Not dogs',
                  slug: 'cats'
                },
                {
                  description: 'what books are made of',
                  slug: 'paper'
                }
              ]);
            });
        });
      });
    });
  });
});
