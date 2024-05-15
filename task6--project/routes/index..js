const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();

// Connect to MongoDB (replace with your own MongoDB URL)
mongoose.connect('mongodb://localhost:27017/myauthdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define User schema
const userSchema = new mongoose.Schema({
  username: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

// Middleware to parse JSON requests
app.use(express.json());

// Register a new user
app.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error registering user' });
  }
});

// Login route
app.post('/login', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = await User.findOne({ username, email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    // Generate a JWT
    const token = jwt.sign({ userId: user._id }, 'your-secret-key', { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Error logging in' });
  }
});

// Protected route (requires authentication)
app.get('/protected', authenticateUser, (req, res) => {
  // Middleware for verifying token goes here
  // Example: check if req.headers.authorization contains a valid token
  res.json({ message: 'Protected route accessed successfully' });
});

// Middleware function to verify JWT token
function authenticateUser(req, res, next) {
  try {
    // Get the token from the request header
    const token = req.headers.authorization.split(' ')[1]; // Assuming token is sent as "Bearer <token>"

    // Verify the token using your secret key
    const decodedToken = jwt.verify(token, 'your-secret-key'); // Replace with your actual secret key

    // Attach the user ID from the token to the request object
    req.userId = decodedToken.userId;

    // Proceed to the next middleware or route
    next();
  } catch (error) {
    res.status(401).json({ error: 'Authentication failed' });
  }
}

// Middleware to check authorization
function checkAuthorization(req, res, next) {
  const apiKey = req.headers['x-api-key']; // Assuming API key is sent in headers
  if (apiKey === 'your-secret-api-key') {
    // Authorized, proceed to the next middleware
    next();
  } else {
    // Unauthorized, return a 401 response
    res.status(401).json({ error: 'Unauthorized' });
  }
}

// Apply authorization middleware to specific routes
app.get('/api/sensitive-data', checkAuthorization, (req, res) => {
  // Your sensitive data retrieval logic here
  res.json({ message: 'Sensitive data retrieved successfully' });
});

// Other routes and middleware go here

// Start the server
const PORT = process.env.PORT || 6000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
