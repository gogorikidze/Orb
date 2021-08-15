const cheerio = require('cheerio');
const router = require('express').Router();
const fetch = require("node-fetch");

router.get('/:term', (req, res) => {
  pages(encodeURI(req.params.term), result => {
    res.json(result);
  });
})
module.exports = router;

async function pages(term, then){ //gets the number of all pages
  let numberOfPages = 1;
  fetch(`http://dspace.nplg.gov.ge/simple-search?location=&query=${term}&filter_field_1=type&filter_type_1=equals&filter_value_1=Book&rpp=100&sort_by=score&order=DESC&etal=0&submit_search=Update`)
      .then(response => response.text())
      .then(body => {
        const $ = cheerio.load(body);

        //checks if number of results is 0
        if($('#content > div:nth-child(4) > div > div.col-md-9 > p').text().trim() == "Search produced no results."){
          then("Nothing found");
          return "not found";
        }

        let lastPageButton = $('#content > div:nth-child(4) > div > div.col-md-9 > div:nth-child(4) > ul > li:nth-last-child(2) > a');
        if(lastPageButton.text() == ''){ numberOfPages = 1 }else{ numberOfPages = parseInt(lastPageButton.text())}
        console.log(numberOfPages);
        getAllPages(term, numberOfPages, then);
      });
}
async function getAllPages(term, numberOfPages, then){
  let result = [];
  for (let i = 1; i <= numberOfPages; i++) {
    await fetch(`http://dspace.nplg.gov.ge/simple-search?query=${term}&filter_field_1=type&filter_type_1=equals&filter_value_1=Book&sort_by=score&order=desc&rpp=100&etal=0&start=${(i-1)*100}`)
      .then(response => response.text())
      .then(body => {
        result = result.concat(parse(body));
      })
  }
  then(result);
}
function parse(body){
  let pageResults = [];
  const $ = cheerio.load(body);
  $('#content > div:nth-child(4) > div > div.col-md-9 > div.discovery-result-results > div > table > tbody').find('tr').each(function (index, element) {
    if(index != 0){
      let name = $(element).find('td:nth-child(3) > a').text().trim();
      let author = $(element).find('td:nth-child(4) > em').text().trim();
      let href = 'http://dspace.nplg.gov.ge/'+$(element).find('td:nth-child(3) > a').attr('href');
      let imgsrc = 'http://dspace.nplg.gov.ge/'+$(element).find('td:nth-child(1) > a > img').attr('src');
      pageResults.push({name: name, author: author, href: href, imgsrc: imgsrc});
    }
  });
  return pageResults;
}