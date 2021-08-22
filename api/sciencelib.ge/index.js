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
  fetch(`http://dspace.gela.org.ge/handle/123456789/2/simple-search?location=123456789%2F2&query=&filter_field_1=subject&filter_type_1=notequals&filter_value_1=%E1%83%A1%E1%83%9E%E1%83%9D%E1%83%A0%E1%83%A2%E1%83%98&filter_field_2=subject&filter_type_2=notequals&filter_value_2=%E1%83%A4%E1%83%94%E1%83%AE%E1%83%91%E1%83%A3%E1%83%A0%E1%83%97%E1%83%98&filter_field_3=subject&filter_type_3=notequals&filter_value_3=%E1%83%A4%E1%83%9D%E1%83%A2%E1%83%9D&filter_field_4=subject&filter_type_4=notequals&filter_value_4=%E1%83%AE%E1%83%94%E1%83%9A%E1%83%9D%E1%83%95%E1%83%9C%E1%83%94%E1%83%91%E1%83%90&filter_field_5=has_content_in_original_bundle&filter_type_5=equals&filter_value_5=true&rpp=5&sort_by=score&order=DESC&etal=0&submit_search=Update`)
      .then(response => response.text())
      .then(body => {
        const $ = cheerio.load(body);
        
        let results = $('#content > div:nth-child(4) > div > div.col-md-9 > div.discovery-result-pagination.row.container > div').text().trim().split(' of ')[1].split(' (Search time')[0];
        then(parseInt(results));
      });
}
async function stats(term, then){ //gets the number of all pages
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
async function getResults(term, page, then){
  let result = [];
  await fetch(`http://dspace.gela.org.ge/handle/123456789/2/simple-search?query=${term}&filter_field_1=subject&filter_type_1=notequals&filter_value_1=%E1%83%A1%E1%83%9E%E1%83%9D%E1%83%A0%E1%83%A2%E1%83%98&filter_field_2=subject&filter_type_2=notequals&filter_value_2=%E1%83%A4%E1%83%94%E1%83%AE%E1%83%91%E1%83%A3%E1%83%A0%E1%83%97%E1%83%98&filter_field_3=subject&filter_type_3=notequals&filter_value_3=%E1%83%A4%E1%83%9D%E1%83%A2%E1%83%9D&filter_field_4=subject&filter_type_4=notequals&filter_value_4=%E1%83%AE%E1%83%94%E1%83%9A%E1%83%9D%E1%83%95%E1%83%9C%E1%83%94%E1%83%91%E1%83%90&filter_field_5=has_content_in_original_bundle&filter_type_5=equals&filter_value_5=true&sort_by=score&order=desc&rpp=50&etal=0&start=${(page-1)*50}`)
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
      let name = $(element).find('td:nth-child(2) > a').text().trim();
      let author = $(element).find('td:nth-child(3) > em').text().trim();
      let href = 'http://dspace.gela.org.ge/'+$(element).find('td:nth-child(2) > a').attr('href');
      pageResults.push({name: name, author: author, href: href});
    }
  });
  return pageResults;
}