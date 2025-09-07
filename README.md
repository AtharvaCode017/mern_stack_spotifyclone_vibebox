VibeBox 🎵 - A Spotify-like Music Streaming App
VibeBox is a full-stack web application built with the MERN stack that allows users to search for, stream, and save their favorite music. It leverages the YouTube API as a free and vast source for its music library and persists user data using MongoDB.

## Features
Search: Search for any song with real-time auto-complete suggestions.

Stream Audio: Play high-quality audio streams directly from YouTube sources.

Liked Songs Library: Save your favorite tracks to a "Liked Songs" list, which is stored in a MongoDB database.

Unlike/Remove Songs: Easily manage your library by removing songs.

Shuffle Play: Play your entire "Liked Songs" library in a randomized order.

Autoplay: When a song from a list (search results or liked songs) finishes, the next one automatically plays.

Custom Player Controls:

Play / Pause

Draggable seek bar to jump to any timestamp.

Playback speed controls (0.5x to 2x).

Download button for the currently playing song.

Modern UI: A dark-themed, multi-column layout inspired by modern music streaming platforms.

## Technology Stack
Frontend:

React.js

Backend:

Node.js

Express.js

Mongoose (for MongoDB object modeling)

Axios (for API requests)

@distube/ytdl-core (for audio streaming)

cors and dotenv

Database:

MongoDB (using the Atlas cloud service)

APIs:

YouTube Data API v3

## Setup and Installation
To run this project locally, you will need Node.js and a free MongoDB Atlas account.

1. Clone the Repository
Bash

git clone [your-repo-link]
cd [your-repo-folder]
2. Backend Setup
Bash

# Navigate to the backend folder
cd music-app-backend

# Install dependencies
npm install

# Create a .env file in this folder and add the following variables:
YOUTUBE_API_KEY=your_youtube_api_key_here
MONGO_URI=your_mongodb_atlas_connection_string_here

# Generate a self-signed SSL certificate
openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -sha256 -days 365 -nodes

# Start the backend server
npm start
The backend server will be running on https://localhost:8080.

3. Frontend Setup
Bash

# Navigate to the frontend folder from the root directory
cd music-app-frontend

# Install dependencies
npm install

# Start the frontend server
npm start
The frontend server will be running on https://localhost:3000.

4. Browser Configuration (Important!)
Because we are using self-signed HTTPS certificates for local development, you must manually tell your browser to trust them:

Open a new tab and navigate to https://localhost:8080. You will see a privacy warning. Click "Advanced" and "Proceed to localhost (unsafe)".

Your app at https://localhost:3000 should now be able to communicate with the backend.
