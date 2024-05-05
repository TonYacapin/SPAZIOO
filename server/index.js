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
const cloudinary = require('cloudinary').v2;

const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const userRoutes = require("./routes/userRoutes");
const messageRoutes = require('./routes/messageRoutes');
const chatRoutes = require('./routes/chatRoutes')
const multerRoutes = require('./routes/multerRoute')
const transactionRoutes = require('./routes/transactionRoutes');
const transactionContractRoutes = require('./routes/transactionContractRoutes');
const ratingRoutes = require('./routes/ratingRoutes');

const ipAddress = process.env.SERVER_API;

app.use(cors());


app.use(express.json({ limit: '20mb' })); 


app.use('/api/multer', multerRoutes)
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);
app.use("/api/user", userRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/transactionsContract', transactionContractRoutes);
app.use('/api', ratingRoutes);

//app.use(bodyParser.json());
//app.use(bodyParser.json({ limit: '5mb' }));
//app.use(bodyParser.urlencoded({ extended: true, limit: '5mb' }));

// Error handling middleware
// app.use((err, req, res, next) => {
//     if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
//       // Handle JSON parsing error
//       console.error('JSON Parsing Error:', err.message);
//       res.status(400).json({ error: 'Invalid JSON' });
//     } else {
//       next();
//     }
//   });
  

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Multer Configuration for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});


app.post('/upload', async (req, res) => {
    
    console.log('Request Body:', req.body._parts);
   try {
     const { landName, landSize, locationName, location, price, base64Image, option, isAvailable, description, seller } = req.body;
     if (!base64Image) {
       return res.status(400).json({ message: 'No base64 image provided' });
     }
 
     const imageUrl = `data:image/jpeg;base64,${base64Image}`;
 
     // Create a new Land object
     const newLand = new Land({
       landName,
       landSize,
       locationName,
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
// Handle Land Post with Cloudinary Image Upload
app.post('/api/lands', upload.single('image'), async (req, res) => {
    try {
        console.log('Request Body:', req.body); 
        res.json({ requestBody: req.body, uploadedFile: req.file });

        const { landName, landSize, location, price, option, isAvailable, description, seller } = req.body;

        // Check if file was uploaded
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        
        // Upload image to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.buffer, {
            folder: 'land_images', // Optional folder in Cloudinary
            format: 'jpg', // Format of the uploaded image
        });

        console.log('Cloudinary Result:', result);

        const imageUrl = result.secure_url; // URL of the uploaded image in Cloudinary

        // Create a new Land object
        const newLand = new Land({
            landName,
            landSize,
            location,
            price,
            imageUrl,
            option,
            isAvailable,
            description,
            seller,
        });
      
        // Save the new Land object to the database
        const savedLand = await newLand.save();

        console.log('Saved Land:', savedLand);

        res.status(201).json(savedLand);
    } catch (error) {
        console.error('Error posting land:', error);
        res.status(500).send(`Server Error ${error}`);
    }
});

app.get('/api/manageland/', async (req, res) => {
  try {
    // Extract owner userId from query parameter
    const owner = req.query.seller;

    // Find lands owned by the specified user
    const lands = await Land.find({ seller: owner });

    res.json(lands);
  } catch (error) {
    console.error('Error fetching lands:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




// Fetch all Lands
app.get('/api/lands', async (req, res) => {
  try {
    const { isAvailable, isBanned, search } = req.query;
    let query = {};

    // If isAvailable parameter is provided and it's true, filter lands by availability
    if (isAvailable === 'true') {
      query = { isAvailable: true };
    }

    if (isBanned === 'false') {
      query.isBanned = false;
    }

    // If search parameter is provided, filter lands by keyword
    if (search) {
      query = {
        ...query,
        $or: [
          { landName: { $regex: search, $options: "i" } },
          { locationName: { $regex: search, $options: "i" } },
          { price: { $regex: search, $options: "i" } },
        ]
      };
    }

    const lands = await Land.find(query).populate('seller', 'name');
    res.status(200).json(lands);
  } catch (error) {
    console.error('Error fetching lands:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

app.get('/api/lands/:id', async (req, res) => {
    const landId = req.params.id;
  
    try {
      const land = await Land.findById(landId);
      if (!land) {
        return res.status(404).json({ message: 'Land not found' });
      }
      res.json(land);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  });

  app.put('/lands/:landId/updateAvailability', async (req, res) => {
    const landId = req.params.landId;
    const { isAvailable } = req.body;
  
    try {
      // Find the land by ID
      const land = await Land.findById(landId);
  
      if (!land) {
        return res.status(404).json({ message: 'Land not found' });
      }
  
      // Update the land availability
      land.isAvailable = isAvailable;
      await land.save();
  
      return res.status(200).json({ message: 'Land availability updated successfully', land });
    } catch (error) {
      console.error('Error updating land availability:', error);
      return res.status(500).json({ message: 'Server Error' });
    }
  });

  app.put('/api/lands/:id', upload.single('image'), async (req, res) => {
    try {
      const { id } = req.params;
      const { landName, landSize, location, price, option, isAvailable, description, seller, isBanned } = req.body;
  
      // Find the land by ID
      const land = await Land.findById(id);
      if (!land) {
        return res.status(404).json({ message: 'Land not found' });
      }
  
      // Update the land fields
      land.landName = landName;
      land.landSize = landSize;
      land.location = location;
      land.price = price;
      land.option = option;
      land.isAvailable = isAvailable;
      land.description = description;
      land.seller = seller;
      land.isBanned = isBanned;
  
      // If a new image is uploaded, update the imageUrl using Cloudinary
      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.buffer, {
          folder: 'land_images',
          format: 'jpg',
        });
        land.imageUrl = result.secure_url;
      }
  
      // Save the updated land
      await land.save();
  
      res.status(200).json({ message: 'Land updated successfully', land });
    } catch (error) {
      console.error('Error updating land:', error);
      res.status(500).json({ message: 'Server Error' });
    }
  });

const port = process.env.PORT || 4000;

const server = http.createServer(app);
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
        const message = {
            id: socket.id,
            text: msg.content,
            sender: msg.sender,
        };
  
        socket.broadcast.emit('chat message', message);
    });
  
    // Handle disconnect
    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

server.listen(port, ipAddress, () => {
    console.log(`Server running on ${ipAddress}:${port}`);
});
