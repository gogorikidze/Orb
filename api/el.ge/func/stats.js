const fetch = require("node-fetch");
const cheerio = require('cheerio');

module.exports = {main}

async function main(term, then){ //gets the number of all pages
  fetch(`https://el.ge/search?visible_subtype_id=&query=${term}&type%5B%5D=1&type%5B%5D=52`)
      .then(response => response.text())
      .then(body => {
        const $ = cheerio.load(body);

        //checks if number of results = 0;
        if($('#app > div > div.container.searchResults > div.flex-between.mt-4.mb-3 > div').text().trim() == "სულ 0"){
          then("Nothing found");
          return;
        }

        let numberOfResults = $('#app > div > div.container.searchResults > div.flex-between.mt-4.mb-3 > div').text().trim().split("სულ ")[1];

        let smaller = $.html('#app > div');
        if(smaller.split('<span>/</span>')[1] && smaller.split('<span>/</span>')[1].split('<span>')[1] && smaller.split('<span>/</span>')[1].split('<span>')[1].split('</span>')[0]){
          numberOfPages = parseInt(smaller.split('<span>/</span>')[1].split('<span>')[1].split('</span>')[0]);
        }else{
          numberOfPages = 1;
        }
        then({pages: numberOfPages, results: numberOfResults});
      });
}