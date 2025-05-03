import express from 'express';
import authenticate from '../middlewares/authenticate.js';
import { 
  sendFriendRequest, 
  acceptFriendRequest, 
  rejectFriendRequest, 
  getPendingRequests 
} from '../controllers/friendController.js';

const router = express.Router();

router.post('/send', authenticate, sendFriendRequest);
router.put('/accept/:request_id', authenticate, acceptFriendRequest);
router.put('/reject/:request_id', authenticate, rejectFriendRequest);
router.get('/pending', authenticate, getPendingRequests);

export default router;
