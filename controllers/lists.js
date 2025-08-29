const express = require("express");
const verifyToken = require("../middleware/verify-token.js");
const router = express.Router();
const List = require("../models/list.js");

router.get("/", verifyToken, async (req, res) => {
  try {
    //only yours lists, without ones shared with you
    const allLists = await List.find({ author: req.user._id });
    // const allLists = await List.find();
    return res.status(200).json(allLists);
  } catch (e) {
    console.error(e);
    return res.sendStatus(500);
  }
});

router.post("/", verifyToken, async (req, res) => {
  try {
    req.body.author = req.user._id;
    // console.log("req.body in POST /lists:", req.body);

    const newList = await List.create(req.body);
    return res.status(201).json(newList);
  } catch (e) {
    console.error(e);
    return res.sendStatus(500);
  }
});

router.get("/shared", verifyToken, async (req, res) => {
  try {
    const sharedLists = await List.find({ sharedWith: req.user._id });
    if(!sharedLists) return res.sendStatus(404);
    return res.status(200).json(sharedLists);
  } catch (e) {
    console.error(e);
    return res.sendStatus(500);
  };
});

router.get("/:listId", verifyToken, async (req, res) => {
  try {
    const { listId } = req.params;
    if (!listId) {
      return res.sendStatus(423);
    }
    const list = await List.findOne({
      _id: listId,
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
});

router.put("/:listId", verifyToken, async (req, res) => {
  try {
    const { listId } = req.params;
    const {
      name,
      items = [],
      description = "",
      closeDate = null,
      sharedWith = [],
    } = req.body;
    if (!listId || !name) {
      return res.sendStatus(423);
    }
    const updatedList = await List.findByIdAndUpdate(
      listId,
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
});

router.delete("/:listId", verifyToken, async (req, res) => {
  try {
    const { listId } = req.params;
    if (!listId) {
      return res.sendStatus(423);
    }
    const list = await List.findById(listId);
    if (!list) {
      return res.sendStatus(404);
    }
    await List.findByIdAndDelete(listId);
    return res.status(200).json(list);
  } catch (e) {
    console.error(e);
    return res.sendStatus(500);
  }
});

router.post("/:listId/newItem", verifyToken, async (req, res) => {
  try {
    const list = await List.findById(req.params.listId);

    if (!list) {
      return res.sendStatus(404);
    }

    list.items.push(req.body);
    await list.save();

    return res.status(201).json(list);
  } catch (e) {
    console.error(e);
    return res.sendStatus(500);
  }
});

module.exports = router;
