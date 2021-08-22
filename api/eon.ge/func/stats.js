const fetch = require("node-fetch");
const cheerio = require('cheerio');

module.exports = {main}

async function main(term, then){ //gets the number of all pages
  fetch('https://eon.ge/?s='+term)
      .then(response => response.text())
      .then(body => {
        const $ = cheerio.load(body);

        let numberOfResults = $('#content > div.page-title.hu-pad.group > h1').text().trim().split(" Search results")[0];

        if(numberOfResults == "0"){
          then("Nothing found");
          return;
        }

        let numberOfpages = Math.ceil(numberOfResults/12);
        // if(numberOfpages > 10){
        //   then("Search is too broad");
        //   return;
        // }
        
        then({pages: numberOfpages, results: 'რამოდენიმე'})
      });
}