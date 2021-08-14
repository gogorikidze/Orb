const express = require('express');
const path = require('path');

let app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/search/el.ge/:term', (request, response) => {
    require('./scrapers/el.ge').search(encodeURI(request.params.term), result => {
        response.json(result);
    });
})
app.get('/api/search/dspace.nplg.gov.ge/:term', (request, response) => {
    require('./scrapers/dspace.nplg.gov.ge').search(encodeURI(request.params.term), result => {
        response.json(result);
    });
})

app.listen(PORT, () => {console.log('listening on', PORT)})