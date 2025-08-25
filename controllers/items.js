const Item = require('../models/item.js');
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const createdItem = await Item.create(req.body);
    res.status(201).json(createdItem);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const foundItems = await Item.find();
    res.status(200).json(foundItems);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

router.get('/:itemId', async (req, res) => {
  try {
    const foundItem = await Item.findById(req.params.itemId);
    if (!foundItem) {
      res.status(404);
      throw new Error('Item not found.');
    }
    res.status(200).json(foundItem);
  } catch (err) {
    if (res.statusCode === 404) {
      res.json({ err: err.message });
    } else {
      res.status(500).json({ err: err.message });
    }
  }
});

router.delete('/:itemId', async (req, res) => {
    try {
        const itemId = req.params.id;
        const deletedItem = await Item.findByIdAndDelete(req.params.itemId);

        if (!deletedItem) {
            return res.status(404).json({ error: 'Item not found' });
        }
        res.status(200).json(deletedItem);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occured while deleting the item' });
    }
});

router.put('/:itemId', async (req, res) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(req.params.itemId, req.body, {
      new: true,
    });
    if (!updatedItem) {
      res.status(404);
      throw new Error('Item not found.');
    }
    res.status(200).json(updatedItem);
  } catch (err) {
    if (res.statusCode === 404) {
      res.json({ err: err.message });
    } else {
      res.status(500).json({ err: err.message });
    }
  }
});




module.exports = router;