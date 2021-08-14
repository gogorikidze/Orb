const cheerio = require('cheerio');
const fetch = require("node-fetch");

module.exports = {
  search: (term, then) => {
    pages(term, then);
  }
}

async function pages(term, then){ //gets the number of all pages
  let numberOfPages = 1;
  await fetch('https://el.ge/search?visible_subtype_id=&query='+term+'&type%5B%5D=1&type%5B%5D=52')
      .then(response => response.text())
      .then(body => {
        let smaller = cheerio.load(body).html('#app > div');
        numberOfPages = parseInt(smaller.split('<span>/</span>')[1].split('<span>')[1].split('</span>')[0]);
      });
  getAllPages(term, numberOfPages, then);
}
async function getAllPages(term, numberOfPages, then){
  let result = [];
  for (let i = 1; i <= numberOfPages; i++) {
    await fetch(`https://el.ge/search?visible_subtype_id=&query=${term}&type%5B%5D=1&type%5B%5D=52&page=${i}`)
      .then(response => response.text())
      .then(body => {
        result = result.concat(parse(body));
        console.log(i)
      })
  }
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