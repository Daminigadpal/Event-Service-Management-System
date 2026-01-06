const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { getDeliverables, createDeliverable } = require('../controllers/deliverableController');

router.route('/')
  .get(auth, getDeliverables)
  .post(auth, createDeliverable);

module.exports = router;