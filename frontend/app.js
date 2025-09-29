const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
const PORT = 3000;

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from /public
app.use(express.static(path.join(__dirname, 'public')));

// Homepage route
app.get('/', async (req, res) => {
    try {
        const response = await axios.get('http://127.0.0.1:8000/tracks');
        const tracks = response.data;
        res.render('index', { tracks });
    } catch (err) {
        console.error("Error fetching tracks from backend:", err.message);
        res.status(500).send('Error fetching tracks from backend.');
    }
});

// Playlist page
app.get('/playlist/:name', (req, res) => {
    const playlistName = req.params.name;
    // TODO: Fetch tracks for this playlist if you implement playlists in backend or localStorage
    res.render('playlist', { playlistName, tracks: [] });
});

// Search page
app.get('/search', async (req, res) => {
    const query = req.query.q || '';

    try {
        const response = await axios.get('http://127.0.0.1:8000/tracks');
        const allTracks = response.data;

        // Filter tracks if query exists, else empty array
        const results = query
            ? allTracks.filter(t =>
                t.title.toLowerCase().includes(query.toLowerCase()) ||
                t.artist.toLowerCase().includes(query.toLowerCase())
              )
            : [];

        // Always pass 'results' and 'query' to template
        res.render('search', { results, query });
    } catch (err) {
        console.error("Error fetching tracks from backend:", err.message);
        res.status(500).send('Error fetching tracks from backend.');
    }
});




// 404 fallback
app.use((req, res) => {
    res.status(404).send('Page not found');
});

// Start server
app.listen(PORT, () => console.log(`Frontend running at http://localhost:${PORT}`));
