module.exports = {
  search: (term, then) => {
    fetch('https://el.ge/search?visible_subtype_id=&query='+term+'&type%5B%5D=1&type%5B%5D=52')
      .then(response => response.text())
      .then(body => parse(body, then));
  }
}

const cheerio = require('cheerio');
const fetch = require("node-fetch");

function parse(body, then){
  let result = [];
  const $ = cheerio.load(body);
  $('#app > div > div.container.searchResults > div.content.row > div > div').find('div.col > a').each(function (index, element) {
    let name = $(element).find('p.article-title').text().trim();
    let author = $(element).find('p.author').text().trim();
    let href = $(element).attr('href');
    let imgsrc = $(element).find('div > img').attr('data-src');
    result.push({name: name, author: author, href: href, imgsrc: imgsrc});
  });
  then(result);
}