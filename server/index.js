require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Land = require('./models/Land');
const multer = require('multer');



const corsOptions = {
    origin: '*', // Change this to allow requests from specific origins
    methods: 'GET,PUT,POST,DELETE',
    optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(bodyParser.json());

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Multer Configuration
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50 MB, adjust as needed
  },
});
// Update this line to use your IP address
const ipAddress = '192.168.0.109';
const port = process.env.PORT || 4000;

app.get("/", (req, res) => {
    res.send("Hello, world!");
});

// Signup
app.post("/api/signup", async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user
        user = new User({
            username,
            email,
            password,
        });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // Save user to database
        await user.save();

        res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Login
app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user exists
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Create and return JWT token
        const payload = {
            user: {
                id: user.id,
            },
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
});
app.post('/upload', upload.single('image'), async (req, res) => {
    console.log(req.body);

    try {
      const { landName, landSize, location, price, base64Image } = req.body;
      
      if (!base64Image) {
        return res.status(400).json({ message: 'No base64 image provided' });
      }
      
      // Create a new Land object
      const newLand = new Land({
        landName,
        landSize,
        location,
        price,
        imageUrl: base64Image,
      });
    
      // Save the new Land object to the database
      const savedLand = await newLand.save();
    
      res.status(201).json(savedLand);
    } catch (error) {
      console.error("Error posting land:", error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
// Handle Land Post with Base64 Image
// Handle Land Post with Base64 Image
app.post('/api/lands', upload.single('base64Image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const { landName, landSize, location, price } = req.body;
        const imageUrl = req.file.buffer.toString('base64');
        
        // Create a new Land object
        const newLand = new Land({
            landName,
            landSize,
            location,
            price,
            imageUrl,
        });
      
        // Save the new Land object to the database
        const savedLand = await newLand.save();
      
        res.status(201).json(savedLand);
    } catch (error) {
        console.error('Error posting land:', error);
        res.status(500).send('Server Error');
    }
});


// Fetch all Lands
app.get('/api/lands', async (req, res) => {
    try {
        const lands = await Land.find();
        res.status(200).json(lands);
    } catch (error) {
        console.error('Error fetching lands:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

app.listen(port, ipAddress, () => {
    console.log(`Server running on ${ipAddress}:${port}`);
});
