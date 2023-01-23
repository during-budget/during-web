const _ = require("lodash");
const mongoose = require("mongoose");

// category settings controller

/**
 * Create category setting element
 *
 * @body {isExpense: boolean, title: String, icon: String}
 * @return categories
 */
module.exports.create = async (req, res) => {
  try {
    const user = req.user;

    user.categories.push({
      isExpense: req.body.isExpense,
      title: req.body.title,
      icon: req.body.icon,
    });

    await req.user.save();

    return res.status(200).send({ categories: user.categories });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

/**
 * Read user's category settings
 *
 * @return categories
 */
module.exports.find = async (req, res) => {
  try {
    const user = req.user;

    return res.status(200).send({ categories: user.categories });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

/**
 * Update user's category setting element
 *
 * @param {_id: oid}
 * @return categories
 */
module.exports.update = async (req, res) => {
  try {
    const user = req.user;

    const idx = _.findIndex(user.categories, {
      _id: mongoose.Types.ObjectId(req.params._id),
    });
    if (idx === -1) return res.status(404).send();

    user.categories[idx] = {
      _id: user.categories[idx]._id,
      isExpense: req.body.isExpense || true,
      title: req.body.title,
      icon: req.body.icon,
    };

    await user.save();

    return res.status(200).send({ categories: user.categories });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

/**
 * Swap user's category setting elements
 *
 * @body {_id1: oid, _id2: oid}
 * @return categories
 */
module.exports.swap = async (req, res) => {
  try {
    const user = req.user;

    const idx1 = _.findIndex(user.categories, {
      _id: mongoose.Types.ObjectId(req.body._id1),
    });
    if (idx1 === -1) return res.status(404).send();
    const idx2 = _.findIndex(user.categories, {
      _id: mongoose.Types.ObjectId(req.body._id2),
    });
    if (idx2 === -1) return res.status(404).send();

    const temp = user.categories[idx1];
    user.categories[idx1] = user.categories[idx2];
    user.categories[idx2] = temp;

    await user.save();

    return res.status(200).send({ categories: user.categories });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

/**
 * Remove user's category setting element
 *
 * @param {_id: oid}
 * @return categories
 */
module.exports.remove = async (req, res) => {
  try {
    const user = req.user;

    const idx = _.findIndex(user.categories, {
      _id: mongoose.Types.ObjectId(req.params._id),
    });
    if (idx === -1) return res.status(404).send();

    user.categories.splice(idx, 1);
    await user.save();

    return res.status(200).send({ categories: user.categories });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};
