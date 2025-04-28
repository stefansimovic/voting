const express = require('express');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('frontend'));

app.post('/vote', (req, res) => {
    const vote = req.body;
    let votes = [];

    if (fs.existsSync('database.json')) {
        const data = fs.readFileSync('database.json');
        votes = JSON.parse(data);
    }

    votes.push(vote);
    fs.writeFileSync('database.json', JSON.stringify(votes, null, 2));

    res.json({ message: 'Vote recorded!' });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});