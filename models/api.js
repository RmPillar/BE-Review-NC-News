const fs = require('fs');

exports.fetchAllEndPoints = () => {
  return new Promise((resolve, reject) => {
    return fs.readFile('./endpoints.json', 'utf8', (err, jsonEndPoints) => {
      if (err) reject(err);
      else {
        const endPoints = JSON.parse(jsonEndPoints);
        resolve(endPoints);
      }
    });
  });
};
