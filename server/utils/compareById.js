const _ = require("lodash");

module.exports = (prevArr, newArr, isEqual) => {
  prevDict = _.keyBy(prevArr, "_id");

  const updated = [];
  const added = [];
  for (let val of newArr) {
    if (prevDict[val?._id]) {
      if (!isEqual(prevDict[val._id], val)) {
        updated.push(val);
      }
      delete prevDict[val._id];
    } else added.push(val);
  }
  const removed = Object.values(prevDict);

  return { updated, added, removed };
};
