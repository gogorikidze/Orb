const fetch = require("node-fetch");
const cheerio = require('cheerio');

module.exports = {main}

async function main(term, page, then){
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