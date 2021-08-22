const fetch = require("node-fetch");
const cheerio = require('cheerio');

module.exports = {main}

async function main(term, then){ //gets the number of all pages
    let numberOfPages = 1;
    fetch(`http://dspace.nplg.gov.ge/simple-search?location=&query=${term}&filter_field_1=type&filter_type_1=equals&filter_value_1=Book&rpp=50&sort_by=score&order=DESC&etal=0&submit_search=Update`)
        .then(response => response.text())
        .then(body => {
          const $ = cheerio.load(body);
  
          //checks if number of results is 0
          if($('#content > div:nth-child(4) > div > div.col-md-9 > p').text().trim() == "Search produced no results."){
            then("Nothing found");
            return;
          }
  
          let numberOfResults = $('#content > div:nth-child(4) > div > div.col-md-9 > div:nth-child(4) > div').text().split("of ")[1].split(" ")[0];
  
          let lastPageButton = $('#content > div:nth-child(4) > div > div.col-md-9 > div:nth-child(4) > ul > li:nth-last-child(2) > a');
          if(lastPageButton.text() == ''){ numberOfPages = 1 }else{ numberOfPages = parseInt(lastPageButton.text())}
          then({pages: numberOfPages, results: numberOfResults});
        });
  }