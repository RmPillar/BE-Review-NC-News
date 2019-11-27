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
                expect(user).to.deep.equal({
                  username: 'butter_bridge',
                  name: 'jonny',
                  avatar_url:
                    'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg'
                });
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
          it.only('Status: 200 responds with single article', () => {
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
          it('Status: 400 responds with bad request error', () => {
            return request(app)
              .get('/api/articles/id')
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.deep.equal('Bad Request!!');
              });
          });
        });
        describe('PATCH', () => {
          it('Status: 200 responds with the updated article when the vote is increased', () => {
            const updateVote = { inc_votes: 1 };
            return request(app)
              .patch('/api/articles/1')
              .send(updateVote)
              .expect(200)
              .then(({ body: { article } }) => {
                expect(article[0].votes).to.equal(101);
              });
          });
          it('Status: 200 responds with the updated article when the vote is decreased', () => {
            const updateVote = { inc_votes: -100 };
            return request(app)
              .patch('/api/articles/1')
              .send(updateVote)
              .expect(200)
              .then(({ body: { article } }) => {
                expect(article[0].votes).to.equal(0);
              });
          });
          it('Status: 404 responds with article not found message', () => {
            const updateVote = { inc_votes: -100 };
            return request(app)
              .patch('/api/articles/5000')
              .send(updateVote)
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).to.deep.equal('Article Not Found');
              });
          });
          it('Status: 400 responds with bad request error', () => {
            const updateVote = { inc_votes: '7' };
            return request(app)
              .patch('/api/articles/1')
              .send(updateVote)
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.deep.equal('Bad Request!!');
              });
          });
          xit('Status: 422 responds with unprocessable entity when body has a key other than inc_vote', () => {
            const updateVote = { something_else: -100 };
            return request(app)
              .patch('/api/articles/1')
              .send(updateVote)
              .expect(422)
              .then(({ body: { msg } }) => {
                expect(msg).to.deep.equal('Unprocessable Request!!');
              });
          });
        });
        describe('/comments', () => {
          describe('POST', () => {
            it('Status: 201 responds with the posted comment', () => {
              const comment = {
                username: 'butter_bridge',
                body: 'This has words and is a comment'
              };
              return request(app)
                .post('/api/articles/1/comments')
                .send(comment)
                .expect(201)
                .then(({ body: { comment } }) => {
                  expect(comment[0]).to.deep.include({
                    comment_id: 19,
                    author: 'butter_bridge',
                    article_id: 1,
                    votes: 0,
                    body: 'This has words and is a comment'
                  });
                });
            });
            it('Status: 400 responds with article not found refenrecning a non-existant article id', () => {
              const comment = {
                username: 'butter_bridge',
                body: 'This has words and is a comment'
              };
              return request(app)
                .post('/api/articles/5000/comments')
                .send(comment)
                .expect(400)
                .then(({ body: { msg } }) => {
                  expect(msg).to.deep.equal('Bad Request!!');
                });
            });
          });
          describe('GET', () => {
            it('Status: 200 responds with an array containing all comments associated with an article_id', () => {
              return request(app)
                .get('/api/articles/1/comments')
                .expect(200)
                .then(({ body: { comments } }) => {
                  expect(comments).to.be.an('array');
                  expect(comments).to.deep.equal([
                    {
                      comment_id: 2,
                      author: 'butter_bridge',
                      article_id: 1,
                      votes: 14,
                      created_at: '2016-11-22T12:36:03.389Z',
                      body:
                        'The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.'
                    },
                    {
                      comment_id: 3,
                      author: 'icellusedkars',
                      article_id: 1,
                      votes: 100,
                      created_at: '2015-11-23T12:36:03.389Z',
                      body:
                        'Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.'
                    },
                    {
                      comment_id: 4,
                      author: 'icellusedkars',
                      article_id: 1,
                      votes: -100,
                      created_at: '2014-11-23T12:36:03.389Z',
                      body:
                        ' I carry a log — yes. Is it funny to you? It is not to me.'
                    },
                    {
                      comment_id: 5,
                      author: 'icellusedkars',
                      article_id: 1,
                      votes: 0,
                      created_at: '2013-11-23T12:36:03.389Z',
                      body: 'I hate streaming noses'
                    },
                    {
                      comment_id: 6,
                      author: 'icellusedkars',
                      article_id: 1,
                      votes: 0,
                      created_at: '2012-11-23T12:36:03.389Z',
                      body: 'I hate streaming eyes even more'
                    },
                    {
                      comment_id: 7,
                      author: 'icellusedkars',
                      article_id: 1,
                      votes: 0,
                      created_at: '2011-11-24T12:36:03.389Z',
                      body: 'Lobster pot'
                    },
                    {
                      comment_id: 8,
                      author: 'icellusedkars',
                      article_id: 1,
                      votes: 0,
                      created_at: '2010-11-24T12:36:03.389Z',
                      body: 'Delicious crackerbreads'
                    },
                    {
                      comment_id: 9,
                      author: 'icellusedkars',
                      article_id: 1,
                      votes: 0,
                      created_at: '2009-11-24T12:36:03.389Z',
                      body: 'Superficially charming'
                    },
                    {
                      comment_id: 10,
                      author: 'icellusedkars',
                      article_id: 1,
                      votes: 0,
                      created_at: '2008-11-24T12:36:03.389Z',
                      body: 'git push origin master'
                    },
                    {
                      comment_id: 11,
                      author: 'icellusedkars',
                      article_id: 1,
                      votes: 0,
                      created_at: '2007-11-25T12:36:03.389Z',
                      body: 'Ambidextrous marsupial'
                    },
                    {
                      comment_id: 12,
                      author: 'icellusedkars',
                      article_id: 1,
                      votes: 0,
                      created_at: '2006-11-25T12:36:03.389Z',
                      body: 'Massive intercranial brain haemorrhage'
                    },
                    {
                      comment_id: 13,
                      author: 'icellusedkars',
                      article_id: 1,
                      votes: 0,
                      created_at: '2005-11-25T12:36:03.389Z',
                      body: 'Fruit pastilles'
                    },
                    {
                      comment_id: 18,
                      author: 'butter_bridge',
                      article_id: 1,
                      votes: 16,
                      created_at: '2000-11-26T12:36:03.389Z',
                      body: 'This morning, I showered for nine minutes.'
                    }
                  ]);
                });
            });
          });
        });
      });
    });
  });
});
