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
router.get('/bookcount', (req, res) => {
  getOverallCount(result => {
    res.json(result);
  });
})
module.exports = router;

function getOverallCount(then){ //gets the number of all pages
  fetch("https://www.sjuni.edu.ge/ebiblioteka/index.php/ka/2018-02-19-20-56-08", {
    "headers": {
      "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
      "accept-language": "en-US,en;q=0.9",
      "cache-control": "max-age=0",
      "content-type": "application/x-www-form-urlencoded",
      "sec-ch-ua": "\"Chromium\";v=\"92\", \" Not A;Brand\";v=\"99\", \"Google Chrome\";v=\"92\"",
      "sec-ch-ua-mobile": "?0",
      "sec-fetch-dest": "document",
      "sec-fetch-mode": "navigate",
      "sec-fetch-site": "same-origin",
      "sec-fetch-user": "?1",
      "upgrade-insecure-requests": "1",
      "cookie": "_ga=GA1.3.1691740330.1629008808; pll_language=ka; 9a7077f136549f9b8606f3edcb79c75d=adqdk5acn3c3kiq7o5n3obmor8"
    },
    "referrer": "https://www.sjuni.edu.ge/ebiblioteka/index.php/ka/2018-02-19-20-56-08",
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": "filter%5Bsearch%5D=&list%5Blimit%5D=5&filter%5Bcategory_id%5D=&filter%5Bauthor_id%5D=&filter%5Byear%5D=&filter_order=a.title&filter_order_Dir=asc&letter=&limitstart=&task=search.search&list%5Bfullordering%5D=null+ASC",
    "method": "POST",
    "mode": "cors"
  }).then(response => response.text())
      .then(body => {
        const $ = cheerio.load(body);
        
        let results = $('#adminForm > h3 > span').text().trim();
        then(parseInt(results));
      });
}
async function stats(term, then){ //gets the number of all pages
  let numberOfPages = 1;
  fetch(`https://www.sjuni.edu.ge/ebiblioteka/index.php/ka/2018-02-19-20-56-08`,{
    "headers": {
      "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
      "accept-language": "en-US,en;q=0.9",
      "cache-control": "max-age=0",
      "content-type": "application/x-www-form-urlencoded",
      "sec-ch-ua": "\"Chromium\";v=\"92\", \" Not A;Brand\";v=\"99\", \"Google Chrome\";v=\"92\"",
      "sec-ch-ua-mobile": "?0",
      "sec-fetch-dest": "document",
      "sec-fetch-mode": "navigate",
      "sec-fetch-site": "same-origin",
      "sec-fetch-user": "?1",
      "upgrade-insecure-requests": "1",
      "cookie": "_ga=GA1.3.1691740330.1629008808; _gid=GA1.3.332339266.1629470443; pll_language=ka; 9a7077f136549f9b8606f3edcb79c75d=s0e0qbjb0gpv0icl3rdvoqt4r9"
    },
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": "filter%5Bsearch%5D="+term+"&list%5Blimit%5D=0&filter%5Bcategory_id%5D=&filter%5Bauthor_id%5D=&filter%5Byear%5D=&filter_order=a.title&filter_order_Dir=ASC&letter=&limitstart=&task=search.search&list%5Bfullordering%5D=null+ASC",
    "method": "POST",
    "mode": "cors"
  }).then(response => response.text())
      .then(body => {
        const $ = cheerio.load(body);

        //checks if number of results is 0
        if($('#adminForm > p').text().trim() == "No books"){
          then("Nothing found");
          return;
        }

        let numberOfResults = $('#adminForm > h3 > span').text();

        let lastPageButton = $('#adminForm > div.pagination > p');
        if(lastPageButton.text() == ''){ numberOfPages = 1 }else{ numberOfPages = parseInt(lastPageButton.text().trim().split("გვერდი 1 სულ ")[1])}
        then({pages: 1, results: numberOfResults});
      });
}

async function getResults(term, page, then){
  let result = [];
  await fetch(`https://www.sjuni.edu.ge/ebiblioteka/index.php/ka/2018-02-19-20-56-08`,{
    "headers": {
      "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
      "accept-language": "en-US,en;q=0.9",
      "cache-control": "max-age=0",
      "content-type": "application/x-www-form-urlencoded",
      "sec-ch-ua": "\"Chromium\";v=\"92\", \" Not A;Brand\";v=\"99\", \"Google Chrome\";v=\"92\"",
      "sec-ch-ua-mobile": "?0",
      "sec-fetch-dest": "document",
      "sec-fetch-mode": "navigate",
      "sec-fetch-site": "same-origin",
      "sec-fetch-user": "?1",
      "upgrade-insecure-requests": "1",
      "cookie": "_ga=GA1.3.1691740330.1629008808; _gid=GA1.3.332339266.1629470443; pll_language=ka; 9a7077f136549f9b8606f3edcb79c75d=s0e0qbjb0gpv0icl3rdvoqt4r9"
    },
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": "filter%5Bsearch%5D="+term+"&list%5Blimit%5D=0&filter%5Bcategory_id%5D=&filter%5Bauthor_id%5D=&filter%5Byear%5D=&filter_order=a.title&filter_order_Dir=ASC&letter=&limitstart=&task=search.search&list%5Bfullordering%5D=null+ASC",
    "method": "POST",
    "mode": "cors"
  }).then(response => response.text())
    .then(body => {
      result = parse(body);
    })
  then(result);
}
function parse(body){
  let pageResults = [];
  const $ = cheerio.load(body);
  $('#adminForm > table > tbody').find('tr').each(function (index, element) {
      let name = $(element).find('td:nth-child(2) > h3 > a').text().trim();
      let author = $(element).find('td:nth-child(2) > div').text().trim();
      let href = 'https://www.sjuni.edu.ge'+$(element).find('td:nth-child(2) > h3 > a').attr('href');
      let imgsrc = 'https://www.sjuni.edu.ge'+$(element).find('td:nth-child(1) > div > a > img').attr('src');
      pageResults.push({name: name, author: author, href: href, imgsrc: imgsrc});
  });
  return pageResults;
}