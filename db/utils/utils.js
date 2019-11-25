exports.formatDates = list => {
  formattedDates = [];
  list.map((item, i) => {
    formattedDates.push(Object.assign({}, item));
    formattedDates[i].created_at = new Date(item.created_at);
  });
  return formattedDates;
};

exports.makeRefObj = list => {};

exports.formatComments = (comments, articleRef) => {};
