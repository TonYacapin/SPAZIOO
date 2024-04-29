const Rating = require('../models/RatingsModel');

// Controller to create a new rating
exports.createRating = async (req, res) => {
  try {
    const { land, user, rating, comment } = req.body;
    
    // Create a new rating instance
    const newRating = new Rating({
      land,
      user,
      rating,
      comment
    });

    // Save the new rating to the database
    await newRating.save();

    res.status(201).json({ message: 'Rating created successfully', rating: newRating });
  } catch (error) {
    console.error('Error creating rating:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Controller to get all ratings
exports.getAllRatings = async (req, res) => {
  try {
    const ratings = await Rating.find();
    res.status(200).json(ratings);
  } catch (error) {
    console.error('Error fetching ratings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Controller to get rating by ID
exports.getRatingById = async (req, res) => {
  try {
    const ratingId = req.params.id;
    const rating = await Rating.findById(ratingId);
    
    if (!rating) {
      return res.status(404).json({ error: 'Rating not found' });
    }

    res.status(200).json(rating);
  } catch (error) {
    console.error('Error fetching rating by ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


exports.getRatingsByLandId = async (req, res) => {
  try {
    const landId = req.params.id;
    const ratings = await Rating.find({ land: landId }).populate('user'); // Populate the user field
    
    if (!ratings) {
      return res.status(404).json({ error: 'Ratings not found for this land' });
    }

    res.status(200).json(ratings);
  } catch (error) {
    console.error('Error fetching ratings by land ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
// Controller to update a rating
exports.updateRating = async (req, res) => {
  try {
    const ratingId = req.params.id;
    const updates = req.body;

    const updatedRating = await Rating.findByIdAndUpdate(ratingId, updates, { new: true });

    if (!updatedRating) {
      return res.status(404).json({ error: 'Rating not found' });
    }

    res.status(200).json({ message: 'Rating updated successfully', rating: updatedRating });
  } catch (error) {
    console.error('Error updating rating:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Controller to delete a rating
exports.deleteRating = async (req, res) => {
  try {
    const ratingId = req.params.id;
    const deletedRating = await Rating.findByIdAndDelete(ratingId);

    if (!deletedRating) {
      return res.status(404).json({ error: 'Rating not found' });
    }

    res.status(200).json({ message: 'Rating deleted successfully', rating: deletedRating });
  } catch (error) {
    console.error('Error deleting rating:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
