const express = require('express');
const path = require('path');
const scr = require('./scrapers/autoload');

let app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/search/:term', (request, response) => {
    scr.search('php', result => {
        response.json(result);
    })
})

app.listen(PORT, () => {console.log('listening on', PORT)})