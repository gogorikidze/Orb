const fetch = require("node-fetch");
const cheerio = require('cheerio');

module.exports = {main}

async function main(term, then){ //gets the number of all pages
  let numberOfPages = 1;
  fetch(`http://dspace.gela.org.ge/handle/123456789/2/simple-search?location=123456789%2F2&query=${term}&filter_field_1=subject&filter_type_1=notequals&filter_value_1=%E1%83%A1%E1%83%9E%E1%83%9D%E1%83%A0%E1%83%A2%E1%83%98&filter_field_2=subject&filter_type_2=notequals&filter_value_2=%E1%83%A4%E1%83%94%E1%83%AE%E1%83%91%E1%83%A3%E1%83%A0%E1%83%97%E1%83%98&filter_field_3=subject&filter_type_3=notequals&filter_value_3=%E1%83%A4%E1%83%9D%E1%83%A2%E1%83%9D&filter_field_4=subject&filter_type_4=notequals&filter_value_4=%E1%83%AE%E1%83%94%E1%83%9A%E1%83%9D%E1%83%95%E1%83%9C%E1%83%94%E1%83%91%E1%83%90&filtername=has_content_in_original_bundle&filtertype=equals&filterquery=true&rpp=50&sort_by=score&order=desc`)
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