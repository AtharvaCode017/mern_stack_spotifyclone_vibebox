// backend/models/Song.js
const mongoose = require('mongoose');

const SongSchema = new mongoose.Schema({
  videoId: { type: String, required: true },
  title: { type: String, required: true },
  channelTitle: { type: String, required: true },
  thumbnailUrl: { type: String, required: true },
  
});

// Ensures a user cannot like the same song twice
SongSchema.index({ videoId: 1, likedBy: 1 }, { unique: true });

module.exports = mongoose.model('Song', SongSchema);