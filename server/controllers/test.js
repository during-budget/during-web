const Test = require("../models/Test");

// test controller

/**
 * Hello
 *
 * @return message: 'hello world'
 */
module.exports.hello = (req, res) => {
  try {
    return res.status(200).send({ message: "hello world!" });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

/**
 * Create and return testData
 *
 * @body {field1: val1, field2: val2}
 * @return testData({_id, data: {field1: val1, field2: val2}})
 */
module.exports.create = async (req, res) => {
  try {
    const testData = new Test({ data: req.body });
    await testData.save();
    return res.status(200).send({ testData });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

/**
 * Find and return testData
 *
 * @params oid
 * @return testData({_id, data: {field1: val1, field2: val2}})
 */
module.exports.find = async (req, res) => {
  try {
    const testData = await Test.findById(req.params._id);
    if (!testData)
      return res.status(404).send({ message: "testData not found" });
    return res.status(200).send({ testData });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

/**
 * Update testData
 *
 * @params oid
 * @return testData({_id, data: {field1: val1, field2: val2}})
 */
module.exports.update = async (req, res) => {
  try {
    const testData = await Test.findByIdAndUpdate(
      req.params._id,
      { data: req.body },
      {
        new: true,
      }
    );
    if (!testData)
      return res.status(404).send({ message: "testData not found" });
    return res.status(200).send({ testData });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

/**
 * Remove testData
 *
 * @params oid
 */
module.exports.remove = async (req, res) => {
  try {
    await Test.findByIdAndRemove(req.params._id);
    return res.status(200).send();
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};
