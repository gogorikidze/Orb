const cheerio = require('cheerio');
const router = require('express').Router();
const fetch = require("node-fetch");

router.get('/search/:term/:page/:numberOfPages', (req, res) => {
  getResults(encodeURI(req.params.term), req.params.page, result => {
    res.json(result);
  });
})
router.get('/stats/:term', (req, res) => {
  stats(encodeURI(req.params.term), result => {
    switch(result){
      case "Nothing found":
        res.status('204').end() //search returned no results;
        break;
      default:
        res.json(result);
        break;
    }
  });
})
router.get('/bookcount/', (req, res) => {
  getOverallCount(result => {
    res.json(result);
  });
})
module.exports = router;

async function stats(term, then){ //gets the number of all pages
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
function getOverallCount(then){ //gets the number of all pages
  fetch(`http://dspace.nplg.gov.ge/simple-search?location=&query=&filter_field_1=type&filter_type_1=equals&filter_value_1=Book&rpp=5&sort_by=score&order=DESC&etal=0&submit_search=Update`)
      .then(response => response.text())
      .then(body => {
        const $ = cheerio.load(body);
        
        let results = $('#content > div:nth-child(4) > div > div.col-md-9 > div.discovery-result-pagination.row.container > div').text().trim().split('of ')[1].split(' (')[0];
        then(parseInt(results));
      });
}
async function getResults(term, page, then){
  let result = [];
  await fetch(`http://dspace.nplg.gov.ge/simple-search?query=${term}&filter_field_1=type&filter_type_1=equals&filter_value_1=Book&sort_by=score&order=desc&rpp=50&etal=0&start=${(page-1)*50}`)
    .then(response => response.text())
    .then(body => {
      result = parse(body);
    })
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