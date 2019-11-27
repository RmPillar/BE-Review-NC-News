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
  describe('INVALID HTTP METHOD', () => {
    it('Status: 405', () => {
      const methods = ['post', 'patch', 'put', 'delete'];
      const methodPromises = methods.map(method => {
        return request(app)
          [method]('/api/articles')
          .expect(405)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal('HTTP method not allowed');
          });
      });
      return Promise.all(methodPromises);
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
      describe('GET', () => {
        it('Status: 200 responds with array of articles', () => {
          return request(app)
            .get('/api/articles/')
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).to.be.an('array');
              expect(articles).to.have.length(12);
            });
        });
        it('Status: 200 response array has required keys', () => {
          return request(app)
            .get('/api/articles/')
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles[0]).to.contain.keys(
                'author',
                'title',
                'article_id',
                'topic',
                'created_at',
                'votes',
                'comment_count'
              );
            });
        });
        it('Status: 200 response array has correct comment count', () => {
          return request(app)
            .get('/api/articles/')
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles[0].comment_count).to.equal('13');
            });
        });
        it('Status: 200 articles array is sorted by descending date as default', () => {
          return request(app)
            .get('/api/articles/')
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).to.be.sortedBy('created_at', {
                descending: true
              });
            });
        });
        it('Status: 200 articles array sorted by user query', () => {
          return request(app)
            .get('/api/articles?sort_by=author')
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).to.be.sortedBy('author', {
                descending: true
              });
            });
        });
        it('Status: 200 articles array ordered by user query', () => {
          return request(app)
            .get('/api/articles?order=asc')
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).to.be.sortedBy('created_at');
            });
        });
        it('Status: 200 articles are filted by user author query', () => {
          return request(app)
            .get('/api/articles?author=butter_bridge')
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).to.have.length(3);
            });
        });
        it('Status 200: articles are filtered by user topic query', () => {
          return request(app)
            .get('/api/articles?topic=mitch')
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).to.have.length(11);
            });
        });
        it('Status: 404 responds with Query Not Found if user query references author or topic that does not exist', () => {
          return request(app)
            .get('/api/articles?author=butter_bridge1')
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal('Query Not Found');
            });
        });
        it('Status: 400 responds with Bad REquest if sort_by query references column that does not exist', () => {
          return request(app)
            .get('/api/articles?sort_by=hkshjkdfs')
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal('Bad Request!!');
            });
        });
      });
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
            it('Status: 400 responds with Bad request when id references a non-existant article id', () => {
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
                  expect(comments).to.have.length(13);
                });
            });
            it('Status: 200 array is ordered by default by created_at column', () => {
              return request(app)
                .get('/api/articles/1/comments')
                .expect(200)
                .then(({ body: { comments } }) => {
                  expect(comments).to.be.sortedBy('created_at', {
                    descending: true
                  });
                });
            });
            it('Status: 200 array is ordered by user query', () => {
              return request(app)
                .get('/api/articles/1/comments?sort_by=votes')
                .expect(200)
                .then(({ body: { comments } }) => {
                  expect(comments).to.be.sortedBy('votes', {
                    descending: true
                  });
                });
            });
            it('Status: 200 array is ordered by user query', () => {
              return request(app)
                .get('/api/articles/1/comments?order=asc')
                .expect(200)
                .then(({ body: { comments } }) => {
                  expect(comments).to.be.sortedBy('created_at');
                });
            });
            it('Status: 404 responds with article not found', () => {
              return request(app)
                .get('/api/articles/500/comments')
                .expect(404)
                .then(({ body: { msg } }) => {
                  expect(msg).to.equal('Article Not Found');
                });
            });
            it('Status: 400 responds with a Bad request when an invalid article_id is requested', () => {
              return request(app)
                .get('/api/articles/five/comments')
                .expect(400)
                .then(({ body: { msg } }) => {
                  expect(msg).to.equal('Bad Request!!');
                });
            });
            it('Status: 400 responds with bad request when sort_by query has a non-existant column', () => {
              return request(app)
                .get('/api/articles/1/comments?sort_by=voted')
                .expect(400)
                .then(({ body: { msg } }) => {
                  expect(msg).to.equal('Bad Request!!');
                });
            });
          });
        });
      });
    });
    describe('/comments', () => {
      describe('/:comment_id', () => {
        describe('PATCH', () => {
          it('Status: 200 responds with the updated comment', () => {
            const updateVote = { inc_votes: 1 };
            return request(app)
              .patch('/api/comments/1')
              .send(updateVote)
              .expect(200)
              .then(({ body: { comments } }) => {
                expect(comments[0].votes).to.equal(17);
              });
          });
          it('Status: 400 responds with bad request error', () => {
            const updateVote = { inc_votes: '7' };
            return request(app)
              .patch('/api/comments/1')
              .send(updateVote)
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.deep.equal('Bad Request!!');
              });
          });
          it('Status: 404 responds with article not found message', () => {
            const updateVote = { inc_votes: -100 };
            return request(app)
              .patch('/api/comments/5000')
              .send(updateVote)
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).to.deep.equal('Comment Not Found');
              });
          });
        });
        describe.only('DELETE', () => {
          it('Status: 204 no response when comment is deleted', () => {
            return request(app)
              .delete('/api/comments/1')
              .expect(204);
          });
        });
      });
    });
  });
});
