const cheerio = require('cheerio');
const router = require('express').Router();
const fetch = require("node-fetch");

router.get('/search/:term/:page/:numberOfPages', (req, res) => {
  getResults(encodeURI(req.params.term), req.params.page, result => {
    res.json(result);
  });
})
router.get('/stats', (req, res) => {
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

// nuzrnyrkhcxbacjqml@awdrt.org
// scraper1234

async function stats(term, then){ //gets the number of all pages
  fetch("http://www.library.court.ge/index.php?cat=s", {
    "headers": {
      "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
      "accept-language": "en-US,en;q=0.9",
      "cache-control": "max-age=0",
      "content-type": "application/x-www-form-urlencoded",
      "upgrade-insecure-requests": "1",
      "cookie": "PHPSESSID=g2a1hv1k0q0ir4opdbneo1cgk7; __utma=157487655.1694497001.1629554289.1629554289.1629554289.1; __utmc=157487655; __utmz=157487655.1629554289.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); __utmt=1; __utmb=157487655.14.10.1629554289"
    },
    "referrer": "http://www.library.court.ge/index.php?cat=1",
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": "text=term&cat=&libe=&sim_search=+%E1%83%AB%E1%83%94%E1%83%91%E1%83%9C%E1%83%90",
    "method": "POST",
    "mode": "cors"
  }).then(response => response.text())
  .then(body => {
    let result = parse(body);
    then(result.length);
  });
}
function parse(body){
  let pageResults = [];
  const $ = cheerio.load(body);
  $('body > table:nth-child(6) > tbody > tr > td:nth-child(1) > table.table > tbody').find('tr').each(function (index, element) {
    let name = $(element).find('td:nth-child(2) > a').text().trim();
    let author = $(element).find('td:nth-child(3)').text().trim();
    let href = $(element).find('td:nth-child(2) > a').attr('href');
    pageResults.push({name: name, author: author, href: href});
  });
  return pageResults;
}