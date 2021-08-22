const fetch = require("node-fetch");
const cheerio = require('cheerio');

module.exports = {main}

function main(then){ //gets the number of all pages
  fetch("https://www.sjuni.edu.ge/ebiblioteka/index.php/ka/2018-02-19-20-56-08").then(response => response.text())
      .then(body => {
        const $ = cheerio.load(body);
        
        let results = $('#adminForm > h3 > span').text().trim();
        then(parseInt(results));
      });
}