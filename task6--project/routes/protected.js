const express = require('express');
const router = express.Router();
const authenticateUser = require('./index');


// Protected route (requires authentication)
router.get('/protected', authenticateUser, (req, res) => {
  // Handle protected route logic
  // You can access the user ID via req.userId
  res.json({ message: 'Protected route accessed successfully' });
});

module.exports = router;
