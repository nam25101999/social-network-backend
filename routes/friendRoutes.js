// routes/friendRoutes.js
const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authenticate');
const {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  getPendingRequests
} = require('../controllers/friendController');

router.post('/send', authenticate, sendFriendRequest);
router.put('/accept/:request_id', authenticate, acceptFriendRequest);
router.put('/reject/:request_id', authenticate, rejectFriendRequest);
router.get('/pending', authenticate, getPendingRequests);

module.exports = router;
