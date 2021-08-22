const fetch = require("node-fetch");
const cheerio = require('cheerio');

module.exports = {main}

async function main(term, numberOfPages, then){
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
      pageResults.push({name: name, href: href, imgsrc: imgsrc});
    }
  });
  return pageResults;
}