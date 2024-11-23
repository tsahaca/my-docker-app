require('dotenv').config(); 

const express = require('express');
const bodyParser = require('body-parser');
const redis = require('redis');
const cors = require('cors');

const CORS_ORIGIN=process.env.CORS_ORIGIN
const app = express();
const redisClient = redis.createClient({ url: 'redis://redis:6379' }); // Redis connection
const PORT = 5000;


app.use(cors({
  origin: `http://${CORS_ORIGIN}:3001`,  // Frontend service name and port
}));

app.use(bodyParser.json());

// Redis connection
redisClient.on('error', (err) => {
    console.log('Redis Client Error', err);
});

(async () => {
    try {
        await redisClient.connect();
        console.log('Connected to Redis');
    } catch (err) {
        console.error('Failed to connect to Redis:', err);
    }
})();

// API endpoints
app.post('/api/topics', async (req, res) => {
    const { topic, description } = req.body;
    if (!topic || !description) {
        return res.status(400).send('Topic and description are required');
    }

    await redisClient.hSet('topics', topic, description);
    await redisClient.hSet('votes', topic, JSON.stringify([]));

    const votingUrl = `http://${CORS_ORIGIN}:3001/vote/${topic}`;
    res.json({ message: 'Topic created!', votingUrl });
});

app.get('/api/topics/:topic/vote', async (req, res) => {
    const topic = req.params.topic;
    const description = await redisClient.hGet('topics', topic);
    if (!description) {
        return res.status(404).send('Topic not found');
    }
    res.json({ topic, description });
});

app.post('/api/topics/:topic/vote', async (req, res) => {
    const topic = req.params.topic;
    const { vote, name } = req.body;

    if (!vote || !name) {
        return res.status(400).json({ error: 'Vote and name are required' });
    }

    const currentVotes = JSON.parse(await redisClient.hGet('votes', topic)) || [];
    currentVotes.push({ name, vote });
    await redisClient.hSet('votes', topic, JSON.stringify(currentVotes));

    res.json({ message: 'Vote counted!' });
});

app.get('/api/topics/:topic/results', async (req, res) => {
    const topic = req.params.topic;
    const votes = JSON.parse(await redisClient.hGet('votes', topic)) || [];

    const agreeVotes = votes.filter(v => v.vote === 'agree');
    const notAgreeVotes = votes.filter(v => v.vote === 'not_agree');

    res.json({
        topic,
        countAgree: agreeVotes.length,
        countNotAgree: notAgreeVotes.length,
        votes: {
            agree: agreeVotes,
            notAgree: notAgreeVotes
        }
    });
});


// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
