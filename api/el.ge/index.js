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
        res.status('204'); //search returned no results;
      default:
        res.json(result);
    }
  });
})
module.exports = router;

async function pages(term, then){ //gets the number of all pages
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
async function getResults(term, page, then){
  let result = [];
  await fetch(`https://el.ge/search?visible_subtype_id=&query=${term}&type%5B%5D=1&type%5B%5D=52&page=${page}`)
    .then(response => response.text())
    .then(body => {
      result = parse(body);
    })
  then(result);
}
function parse(body){
  let pageResults = [];
  const $ = cheerio.load(body);
  $('#app > div > div.container.searchResults > div.content.row > div > div').find('div.col > a').each(function (index, element) {
    let name = $(element).find('p.article-title').text().trim();
    let author = $(element).find('p.author').text().trim();
    let href = $(element).attr('href');
    let imgsrc = $(element).find('div > img').attr('data-src');
    pageResults.push({name: name, author: author, href: href, imgsrc: imgsrc});
  });
  return pageResults;
}