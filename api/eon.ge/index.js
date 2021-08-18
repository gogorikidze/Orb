const cheerio = require('cheerio');
const router = require('express').Router();
const fetch = require("node-fetch");

router.get('/search/:term/:page/:numberOfPages', (req, res) => {
  getResults(encodeURI(req.params.term), req.params.numberOfPages, result => {
    res.json(result);
  });
})
router.get('/stats/:term', (req, res) => {
  pages(encodeURI(req.params.term), result => {
    switch(result){
      case "Nothing found":
        res.status('204').end(); //search returned no results;
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
        // if(numberOfpages > 10){
        //   then("Search is too broad");
        //   return;
        // }
        
        then({pages: numberOfpages, results: 'რამოდენიმე'})
      });
}
async function getResults(term, numberOfPages, then){
  let results = []

  let pagelimit = (numberOfPages <= 5) ? numberOfPages : 5; //last pages are just articles

  for (let index = 1; index <= pagelimit ; index++) {
    await fetch(`https://eon.ge/page/${index}/?s=${term}`)
      .then(response => response.text())
      .then(body => {
        const $ = cheerio.load(body);

        results = results.concat(parse(body))
      });
  }
  then(results);
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