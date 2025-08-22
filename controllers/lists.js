const express = require("express");
const verifyToken = require("../middleware/verify-token.js");
const router = express.Router();
const List = require("../models/list.js");

router.use(verifyToken, (req, res, next) => {
  //middleware
  if (req.user) {
    next();
  } else {
    res.sendStatus(401);
  }
});

router
  .route("/")
  .get(async (req, res) => {
    try {
      //only yours lists, without ones shared with you
      const allLists = await List.find({ author: req.user._id });
      return res.status(200).json(allLists);
    } catch (e) {
      console.error(e);
      return res.sendStatus(500);
    }
  })
  .post(async (req, res) => {
    try {
      const {
        name,
        items = [],
        description = "",
        closeDate = null,
        sharedWith = [],
      } = req.body;
      if (!name) {
        return res.sendStatus(423);
      }
      const newList = await List.create({
        name,
        author: req.user._id,
        items,
        description,
        closeDate,
        sharedWith,
      });
      return res.status(201).json(newList);
    } catch (e) {
      console.error(e);
      return res.sendStatus(500);
    }
  });
router
  .route("/:id")
  .get(async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.sendStatus(423);
      }
      const list = await List.findOne({
        _id: id,
        $or: [
          //we allow to find by id for author and one of persons sharedWith
          { author: req.user._id },
          { sharedWith: req.user._id }, // works even though it's an array
        ],
      });
      if (!list) {
        return res.sendStatus(404);
      }
      return res.status(200).json(list);
    } catch (e) {
      console.error(e);
      return res.sendStatus(500);
    }
  })
  .put(async (req, res) => {
    try {
      const { id } = req.params;
      const {
        name,
        items = [],
        description = "",
        closeDate = null,
        sharedWith = [],
      } = req.body;
      if (!id || !name) {
        return res.sendStatus(423);
      }
      const updatedList = await List.findByIdAndUpdate(
        id,
        {
          name,
          author: req.user._id,
          items,
          description,
          closeDate,
          sharedWith,
        },
        { new: true }
      );

      return res.status(200).json(updatedList);
    } catch (e) {
      console.error(e);
      return res.sendStatus(500);
    }
  })
  .delete(async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.sendStatus(423);
      }
      const list = await List.findById(id);
      if (!list) {
        return res.sendStatus(404);
      }
      await List.findByIdAndDelete(id);
      return res.status(200).json(list);
    } catch (e) {
      console.error(e);
      return res.sendStatus(500);
    }
  });

module.exports = router;