const express = require('express');
const router = express.Router();
const ratingController = require('../Controllers/ratingControllers');

// Route to create a new rating
router.post('/ratings', ratingController.createRating);

// Route to get all ratings
router.get('/ratings', ratingController.getAllRatings);

// Route to get rating by ID
router.get('/ratings/:id', ratingController.getRatingById);

// Route to update a rating
router.put('/ratings/:id', ratingController.updateRating);

// Route to delete a rating
router.delete('/ratings/:id', ratingController.deleteRating);


router.get('/ratings/land/:id', ratingController.getRatingsByLandId);
module.exports = router;
