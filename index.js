const express = require('express');
const path = require('path');
const el_ge = require('./api/el.ge');
const dspace_nplg_gov_ge = require('./api/dspace.nplg.gov.ge');
const eon_ge = require('./api/eon.ge');

let app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/el.ge', el_ge);
app.use('/api/dspace.nplg.gov.ge', dspace_nplg_gov_ge);
app.use('/api/eon.ge', eon_ge);

app.listen(PORT, () => {console.log('listening on', PORT)})