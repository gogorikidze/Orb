const fetch = require("node-fetch");
const cheerio = require('cheerio');

module.exports = {main}

function main(then){ //gets the number of all pages
    fetch(`http://dspace.nplg.gov.ge/simple-search?location=&query=&filter_field_1=type&filter_type_1=equals&filter_value_1=Book&rpp=5&sort_by=score&order=DESC&etal=0&submit_search=Update`)
        .then(response => response.text())
        .then(body => {
        const $ = cheerio.load(body);
        
        let results = $('#content > div:nth-child(4) > div > div.col-md-9 > div.discovery-result-pagination.row.container > div').text().trim().split('of ')[1].split(' (')[0];
        then(parseInt(results));
        })
}