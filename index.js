const express = require('express');
const path = require('path');

let apis = ['el.ge', 'dspace.nplg.gov.ge', 'eon.ge', 'sciencelib.ge']

let app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

apis.map(api => {
    app.use('/api/'+api, require('./api/'+api));
})

app.listen(PORT, () => {console.log('listening on', PORT)})