module.exports = function IsIdEqual(object1, object2) {
  return object1._id.toString() == object2._id.toString();
};
