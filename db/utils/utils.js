exports.formatDates = list => {
  const formattedDates = [];
  list.forEach((item, i) => {
    formattedDates.push(Object.assign({}, item));
    formattedDates[i].created_at = new Date(item.created_at);
  });
  return formattedDates;
};

exports.makeRefObj = list => {
  const reference = {};
  list.forEach(object => {
    reference[object.title] = object.article_id;
  });
  return reference;
};

exports.formatComments = (comments, articleRef) => {
  const formattedComments = exports.formatDates(comments);
  formattedComments.forEach(item => {
    item.article_id = articleRef[item.belongs_to];
    item.author = item.created_by;
    delete item.belongs_to;
    delete item.created_by;
  });
  return formattedComments;
};
