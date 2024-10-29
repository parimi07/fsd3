const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Item = require('./models/Item'); // Adjust the path if necessary
const User = require('./models/User'); // Adjust the path if necessary
const Purchase = require('./models/Purchase'); // Add Purchase model
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require('./middleware/auth'); // JWT authentication middleware

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/images', express.static('images'));
// EJS setup
app.set('view engine', 'ejs');
app.set('views', './views'); // Path to your EJS files

// MongoDB connection
const mongoURI = 'mongodb://localhost:27017/yourDatabaseName'; // Replace with your MongoDB URI
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected...'))
.catch(err => console.error('MongoDB connection error:', err));

// Home route
app.get('/', (req, res) => {
    res.render('index', { title: 'Home' });  // Pass the title variable here
});

// Shop route
app.get('/shop', (req, res) => {
    res.render('shop', { title: 'Shop' }); // Pass the title variable here
});

// View route
app.get('/view', (req, res) => {
    res.render('view'); // Pass the title variable here
});

// About Us route
app.get('/about_us', (req, res) => {
    res.render('about_us', { title: 'About Us' }); // Pass the title variable here
});

// Contact Us route
app.get('/contact_us', (req, res) => {
    res.render('contact_us', { title: 'Contact Us' }); // Pass the title variable here
});

// Item routes
app.get('/items', async (req, res) => {
    try {
        const items = await Item.find();
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/items', async (req, res) => {
    const item = new Item(req.body);
    try {
        const savedItem = await item.save();
        res.status(201).json(savedItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// User registration
app.post('/api/users/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// User login
app.post('/api/users/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ message: 'User not found' });
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in' });
    }
});

// Purchase route (requires authentication)
app.post('/api/purchases', auth, async (req, res) => {
    const { itemId, quantity } = req.body;
    try {
        const purchase = new Purchase({
            userId: req.userId, // Use authenticated user's ID
            itemId,
            quantity,
        });
        await purchase.save();
        res.status(201).json({ message: 'Purchase successful' });
    } catch (error) {
        res.status(500).json({ message: 'Error processing purchase' });
    }
});

// Server listening
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
