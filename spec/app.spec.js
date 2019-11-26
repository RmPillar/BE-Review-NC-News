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
    describe('/users', () => {
      describe('/username', () => {
        describe('GET', () => {
          it('Status: 200 responds with single user', () => {
            return request(app)
              .get('/api/users/butter_bridge')
              .expect(200)
              .then(({ body: { user } }) => {
                expect(user).to.deep.equal([
                  {
                    username: 'butter_bridge',
                    name: 'jonny',
                    avatar_url:
                      'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg'
                  }
                ]);
              });
          });
          it('Status: 404 responds with path not found when requesting a user that does not exist', () => {
            return request(app)
              .get('/api/users/butter_bridge22')
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).to.deep.equal('User Not Found');
              });
          });
        });
      });
    });
    describe('/articles', () => {
      describe('/:article_id', () => {
        describe('GET', () => {
          it('Status: 200 responds with single article', () => {
            return request(app)
              .get('/api/articles/1')
              .expect(200)
              .then(({ body: { article } }) => {
                expect(article).to.deep.equal({
                  article_id: 1,
                  title: 'Living in the shadow of a great man',
                  topic: 'mitch',
                  author: 'butter_bridge',
                  body: 'I find this existence challenging',
                  created_at: '2018-11-15T12:21:54.171Z',
                  votes: 100,
                  comment_count: '13'
                });
              });
          });
          it('Status: 404 responds with article not found message', () => {
            return request(app)
              .get('/api/articles/5000')
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).to.deep.equal('Article Not Found');
              });
          });
        });
        describe.only('PATCH', () => {
          it('Status: 200 responds with the updated article when the vote is increased', () => {
            const updateVote = { inc_vote: 1 };
            return request(app)
              .patch('/api/articles/1')
              .send(updateVote)
              .expect(200)
              .then(({ body: { article } }) => {
                expect(article[0].votes).to.equal(101);
              });
          });
          it('Status: 200 responds with the updated article when the vote is decreased', () => {
            const updateVote = { inc_vote: -100 };
            return request(app)
              .patch('/api/articles/1')
              .send(updateVote)
              .expect(200)
              .then(({ body: { article } }) => {
                expect(article[0].votes).to.equal(0);
              });
          });
          it.only('Status: 404 responds with article not found message', () => {
            const updateVote = { inc_vote: -100 };
            return request(app)
              .patch('/api/articles/5000')
              .send(updateVote)
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).to.deep.equal('Article Not Found');
              });
          });
        });
      });
    });
  });
});
