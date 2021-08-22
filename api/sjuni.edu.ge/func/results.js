const fetch = require("node-fetch");
const cheerio = require('cheerio');

module.exports = {main}

async function main(term, page, then){
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