const cheerio = require('cheerio');
const router = require('express').Router();
const fetch = require("node-fetch");

router.get('/search/:term/:page', (req, res) => {
  getResults(encodeURI(req.params.term), req.params.page, result => {
    res.json(result);
  });
})
router.get('/stats/:term', (req, res) => {
  pages(encodeURI(req.params.term), result => {
    switch(result){
      case "Nothing found":
        res.status('204').end(); //search returned no results;
        break;
      case "Search is too broad":
        res.status('406').end();
        break;
      default:
        res.json(result);
    }
  });
})
module.exports = router;

async function pages(term, then){ //gets the number of all pages
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
        if(numberOfpages > 10){
          then("Search is too broad");
          return;
        }
        
        getResults(term, numberOfpages, then);
      });
}
async function getResults(term, pages, then){

  let competedpages = 0;
  let booklinks = []
  for (let index = 1; index <= pages; index++) {
    fetch(`https://eon.ge/page/${index}/?s=${term}`)
      .then(response => response.text())
      .then(body => {
        const $ = cheerio.load(body);

        booklinks = booklinks.concat(parse(body))

        competedpages += 1;

        if(competedpages == pages){
          then(booklinks);
        }
      });
  }
}
function parse(body){
  let pageResults = [];
  const $ = cheerio.load(body);
  $('#grid-wrapper > div').find('article > div').each(function (index, element) {
    let description = $(element).find('div.entry.excerpt.entry-summary > p > span').text().trim();

    if(description.indexOf("გადმოწერე PDF") != -1){
      let name = $(element).find('h2 > a').text().trim();
      let author = '[Null]';
      let href = $(element).find('h2 > a').attr('href');
      let imgsrc = $(element).find('div > a > img').attr('data-src');
      pageResults.push({name: name, author: author, href: href, imgsrc: imgsrc});
    }
  });
  return pageResults;
}