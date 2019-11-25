const { expect } = require('chai');
const {
  formatDates,
  makeRefObj,
  formatComments
} = require('../db/utils/utils');

describe('formatDates', () => {
  it('Takes a single input timestamp number and converts it to the date format', () => {
    const list = [
      {
        title: 'Living in the shadow of a great man',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'I find this existence challenging',
        created_at: 1542284514171,
        votes: 100
      }
    ];
    const formattedData = formatDates(list);
    expect(formattedData[0].created_at).to.be.an.instanceof(Date);
  });
  it('Takes an array of multiple items and returns a new array with all create_at timestamps converted to date format', () => {
    const list = [
      {
        title: 'Living in the shadow of a great man',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'I find this existence challenging',
        created_at: 1542284514171,
        votes: 100
      },
      {
        title: 'Sony Vaio; or, The Laptop',
        topic: 'mitch',
        author: 'icellusedkars',
        body:
          'Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.',
        created_at: 1416140514171
      },
      {
        title: 'Eight pug gifs that remind me of mitch',
        topic: 'mitch',
        author: 'icellusedkars',
        body: 'some gifs',
        created_at: 1289996514171
      }
    ];
    const formattedData = formatDates(list);
    expect(formattedData[0].created_at).to.be.an.instanceof(Date);
    expect(formattedData[1].created_at).to.be.an.instanceof(Date);
    expect(formattedData[2].created_at).to.be.an.instanceof(Date);
  });
  it('returns new array', () => {
    const list = [
      {
        title: 'Living in the shadow of a great man',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'I find this existence challenging',
        created_at: 1542284514171,
        votes: 100
      }
    ];
    const formattedData = formatDates(list);
    expect(formattedData).to.not.equal(list);
  });
  it('original array is not mutated', () => {
    const list = [
      {
        title: 'Living in the shadow of a great man',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'I find this existence challenging',
        created_at: 1542284514171,
        votes: 100
      }
    ];
    const expected = [
      {
        title: 'Living in the shadow of a great man',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'I find this existence challenging',
        created_at: 1542284514171,
        votes: 100
      }
    ];

    formatDates(list);
    expect(list).to.deep.equal(expected);
  });
});

describe('makeRefObj', () => {
  it('returns a new object', () => {
    const list = [
      {
        title: 'Living in the shadow of a great man',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'I find this existence challenging',
        created_at: 1542284514171,
        votes: 100
      }
    ];
    expect(makeRefObj(list)).to.not.equal(list);
  });
  it('does not mutate original array', () => {
    const list = [
      {
        title: 'Living in the shadow of a great man',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'I find this existence challenging',
        created_at: 1542284514171,
        votes: 100
      }
    ];
    const expected = [
      {
        title: 'Living in the shadow of a great man',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'I find this existence challenging',
        created_at: 1542284514171,
        votes: 100
      }
    ];

    formatDates(list);
    expect(list).to.deep.equal(expected);
  });
  it('returns an empty object, when passed an empty array', () => {
    const input = [];
    const actual = makeRefObj(input);
    const expected = {};
    expect(actual).to.eql(expected);
  });
  it('returns object containing one name and id key/value pair', () => {
    expect(
      makeRefObj([
        {
          article_id: 1,
          title: 'Living in the shadow of a great man',
          topic: 'mitch',
          author: 'butter_bridge',
          body: 'I find this existence challenging',
          created_at: 1542284514171,
          votes: 100
        }
      ])
    ).to.deep.equal({ 'Living in the shadow of a great man': 1 });
  });
  it('returns object containing multiple name and phone number key/value pairs', () => {
    expect(
      makeRefObj([
        {
          article_id: 1,
          title: 'Living in the shadow of a great man',
          topic: 'mitch',
          author: 'butter_bridge',
          body: 'I find this existence challenging',
          created_at: 1542284514171,
          votes: 100
        },
        {
          article_id: 2,
          title: 'Sony Vaio; or, The Laptop',
          topic: 'mitch',
          author: 'icellusedkars',
          body:
            'Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.',
          created_at: 1416140514171
        }
      ])
    ).to.deep.equal({
      'Living in the shadow of a great man': 1,
      'Sony Vaio; or, The Laptop': 2
    });
  });
});

describe('formatComments', () => {
  it('if an empty array is passed, returns empty array', () => {
    expect(formatComments([])).to.deep.equal([]);
  });
  it('does not mutate original array input', () => {
    const array = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: 'butter_bridge',
        votes: 16,
        created_at: 1511354163389
      }
    ];
    const expected = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: 'butter_bridge',
        votes: 16,
        created_at: 1511354163389
      }
    ];
    const lookupObj = { "They're not exactly dogs, are they?": 9 };
    formatComments(array, lookupObj);
    expect(array).to.eql(expected);
  });
  it('formats an array containing single object', () => {
    const array = [
      {
        comment_id: 1,
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: 'butter_bridge',
        votes: 16,
        created_at: 1511354163389
      }
    ];
    const lookupObj = { "They're not exactly dogs, are they?": 9 };
    const formattedComment = formatComments(array, lookupObj);

    expect(formattedComment[0]).to.deep.include({
      comment_id: 1,
      body:
        "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
      article_id: 9,
      author: 'butter_bridge',
      votes: 16
    });
    expect(formattedComment[0].created_at).to.be.an.instanceof(Date);
  });
  it('formats an array containing multiple objects', () => {
    const array = [
      {
        comment_id: 1,
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: 'butter_bridge',
        votes: 16,
        created_at: 1511354163389
      },
      {
        comment_id: 2,
        body:
          'The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.',
        belongs_to: 'Living in the shadow of a great man',
        created_by: 'butter_bridge',
        votes: 14,
        created_at: 1479818163389
      }
    ];
    const lookupObj = {
      "They're not exactly dogs, are they?": 9,
      'Living in the shadow of a great man': 1
    };
    const formattedComment = formatComments(array, lookupObj);

    expect(formattedComment[0]).to.deep.include({
      comment_id: 1,
      body:
        "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
      article_id: 9,
      author: 'butter_bridge',
      votes: 16
    });
    expect(formattedComment[0].created_at).to.be.an.instanceof(Date);
    expect(formattedComment[1]).to.deep.include({
      comment_id: 2,
      body:
        'The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.',
      article_id: 1,
      author: 'butter_bridge',
      votes: 14
    });
    expect(formattedComment[1].created_at).to.be.an.instanceof(Date);
  });
});
