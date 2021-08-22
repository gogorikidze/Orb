const fetch = require("node-fetch");
const cheerio = require('cheerio');

module.exports = {main}

function main(then){ //gets the number of all pages
fetch(`https://el.ge/search?visible_subtype_id=&type%5B%5D=1&type%5B%5D=52&query=`)
    .then(response => response.text())
    .then(body => {
        const $ = cheerio.load(body);
        
        let results = $('#app > div > div.container.searchResults > div.flex-between.mt-4.mb-3 > div').text().trim().split('სულ ')[1];
        then(parseInt(results));
    });
}