require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const axios = require('axios');
const ytdl = require('@distube/ytdl-core');
const https = require('https');
const fs = require('fs');
const Song = require('./models/Song'); // Assuming your file is named 'Song.js'

const app = express();
app.use(cors());
app.use(express.json());
const PORT = 8080; // Correct port

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('🔴 MongoDB Connection Error:', err));

// ROUTES
app.get('/', (req, res) => res.send('Hello from your VS Code server!'));

// Search Endpoint (UNCOMMENTED)
app.get('/api/search', async (req, res) => {
  const searchQuery = req.query.q;
  if (!searchQuery) {
    return res.status(400).json({ error: 'Search query "q" is required' });
  }
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=15&q=${encodeURIComponent(
    searchQuery
  )}&key=${process.env.YOUTUBE_API_KEY}`;
  try {
    const response = await axios.get(url);
    const videos = response.data.items.filter(item => item.id.kind === 'youtube#video');
    res.json(videos);
  } catch (error) {
    console.error('🔴 YouTube API Search Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch search results' });
  }
});

// Audio Streaming Endpoint (UNCOMMENTED)
app.get('/api/play/:videoId', async (req, res) => {
  const { videoId } = req.params;
  const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
  try {
    const info = await ytdl.getInfo(videoUrl);
    const format = ytdl.chooseFormat(info.formats, {
      quality: 'highestaudio',
      filter: 'audioonly'
    });
    if (format) {
      res.setHeader('Content-Type', format.mimeType);
      res.setHeader('Content-Length', format.contentLength);
      ytdl(videoUrl, { format: format }).pipe(res);
    } else {
      throw new Error('No suitable audio format found.');
    }
  } catch (error) {
    console.error('🔴 YTDL Stream Error:', error);
    res.status(500).send({ error: 'Failed to stream audio' });
  }
});

// "Like a Song" Endpoint
app.post('/api/like', async (req, res) => {
  try {
    const { videoId, title, channelTitle, thumbnailUrl } = req.body;
    const newLikedSong = new Song({ videoId, title, channelTitle, thumbnailUrl });
    await newLikedSong.save();
    res.status(201).json(newLikedSong);
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: 'Song already liked' });
    res.status(500).json({ error: 'Failed to like song' });
  }
});

// backend/index.js

// ... (your other routes)

// -------- "Unlike a Song" Endpoint --------
app.delete('/api/unlike/:videoId', async (req, res) => {
  try {
    const { videoId } = req.params;
    const result = await Song.findOneAndDelete({ videoId: videoId });

    if (!result) {
      return res.status(404).json({ message: 'Song not found in liked list' });
    }

    res.status(200).json({ message: 'Song unliked successfully' });
  } catch (error) {
    console.error("🔴 Unlike Song Error:", error);
    res.status(500).json({ error: 'Failed to unlike song' });
  }
});

// -------- Search Suggestions Endpoint --------
app.get('/api/suggest', async (req, res) => {
  const searchQuery = req.query.q;
  if (!searchQuery) {
    return res.status(400).json([]);
  }
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q=${encodeURIComponent(
    searchQuery
  )}&key=${process.env.YOUTUBE_API_KEY}`;
  try {
    const response = await axios.get(url);
    const videos = response.data.items.filter(item => item.id.kind === 'youtube#video');
    res.json(videos);
  } catch (error) {
    res.status(500).json([]);
  }
});

// backend/index.js

// ... (your other routes)

// -------- Download Song Endpoint --------
app.get('/api/download/:videoId', async (req, res) => {
  const { videoId } = req.params;
  const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

  try {
    const info = await ytdl.getInfo(videoUrl);
    const format = ytdl.chooseFormat(info.formats, {
      quality: 'highestaudio',
      filter: 'audioonly'
    });
    
    // Sanitize the title to create a valid filename
    const sanitizedTitle = info.videoDetails.title.replace(/[^a-z0-9\s]/gi, '').replace(/[\s]/g, '_');
    const filename = `${sanitizedTitle}.mp3`; // We can suggest .mp3 for compatibility

    // This header tells the browser to download the file with a specific name
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    ytdl(videoUrl, { format: format }).pipe(res);

  } catch (error) {
    console.error('🔴 Download Error:', error);
    res.status(500).send({ error: 'Failed to download audio' });
  }
});


// ... (your HTTPS server startup)

// "Get All Liked Songs" Endpoint
app.get('/api/likes', async (req, res) => {
  try {
    const likedSongs = await Song.find();
    res.json(likedSongs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get liked songs' });
  }
});

// HTTPS SERVER STARTUP
try {
  const options = { key: fs.readFileSync('key.pem'), cert: fs.readFileSync('cert.pem') };
  https.createServer(options, app).listen(PORT, () => {
    console.log(`🚀 Server is running on https://localhost:${PORT}`);
  });
} catch (error) {
  console.error('🔴 Failed to start HTTPS server.', error);
}

