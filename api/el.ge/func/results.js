const fetch = require("node-fetch");
const cheerio = require('cheerio');

module.exports = {main}

async function main(term, page, then){
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