require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./models/UserModel');
const Land = require('./models/Land');
const multer = require('multer');

const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const userRoutes = require("./routes/userRoutes");
const messageRoutes = require('./routes/messageRoutes');
const chatRoutes = require('./routes/chatRoutes')


app.use(cors());

const server = http.createServer(app);
// const http = require('http').createServer(app); // Create HTTP server
// const io = require('socket.io')(http); // Initialize Socket.IO


const io = new Server(server, {
    cors: {
      origin: "*",
      methods: 'GET,PUT,POST,DELETE',
      optionsSuccessStatus: 200,
    },
  });

  io.on('connection', (socket) => {
    console.log(`User Connected: ${socket.id}`);
  
    // Handle chat messages
    socket.on('chat message', (msg) => {
      // Create a message object with additional information
      const message = {
        id: socket.id, // Unique ID for the message (you might want to use a real message ID)
        text: msg.text, // The actual message text
        timestamp: new Date().toISOString(), // Timestamp of when the message was sent
        sender: socket.id, // ID of the sender
      };
  
      // Broadcast the message to all other connected clients
      socket.broadcast.emit('chat message', message);
    });
  
    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

// const corsOptions = {
//     origin: 'http://192.168.0.106:4000', // Change this to allow requests from specific origins
//     methods: 'GET,PUT,POST,DELETE',
//     optionsSuccessStatus: 200,
// };

//app.use(cors(corsOptions));
app.use(express.json());
app.use('/api', chatRoutes);
app.use('/api', messageRoutes);
app.use("/api/user", userRoutes);

app.use(bodyParser.json());

app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '5mb' }));

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
    fileSize: 100, // 50 MB, adjust as needed
  },
});
// Update this line to use your IP address
//const ipAddress = '192.168.0.109';
const ipAddress = '192.168.0.109';


const port = process.env.PORT || 4000;

app.get("/", (req, res) => {
    res.send("Hello, world!");
});
// Fetch user by ID
app.get("/api/user/:id", async (req, res) => {
    const userId = req.params.id;

    try {
        // Find the user by ID
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Return user information
        const userInfo = {
            username: user.username,
            email: user.email,
        };

        res.status(200).json(userInfo);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server Error" });
    }
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

        console.log("Found user:", user); // Check if user is found

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Create and return JWT token
        const payload = {
            user: {
                id: user.id,
                username: user.username, 
                email: user.email, 
            },
        };

        console.log("Payload:", payload); // Check payload before signing

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) {
                    console.error("JWT Error:", err); // Log JWT error
                    return res.status(500).json({ message: 'Server Error' });
                }
                res.json({ token });
            }
        );
    } catch (err) {
        console.error("Login Error:", err.message); // Log other errors
        res.status(500).json({ message: 'Server Error' });
    }
});

app.post('/upload', async (req, res) => {
     console.log('Request Body:', req.body);
    try {
      const { landName, landSize, location, price, base64Image, option, isAvailable, description, seller } = req.body;
  
      if (!base64Image) {
        return res.status(400).json({ message: 'No base64 image provided' });
      }
  
      const imageUrl = `data:image/jpeg;base64,${base64Image}`;
  
      // Create a new Land object
      const newLand = new Land({
        landName,
        landSize,
        location,
        price,
        imageUrl, // Save the imageUrl as data URI
        option,
        isAvailable,
        description,
        seller,
      });
  
      // Save the new Land object to the database
      const savedLand = await newLand.save();
  
      res.status(201).json(savedLand);
    } catch (error) {
      console.error("Error posting land:", error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  
  
//   app.listen(port, () => {
//     console.log(`Server is running on http://localhost:${port}`);
//   });
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





server.listen(port, ipAddress, () => {
    console.log(`Server running on ${ipAddress}:${port}`);
});
  