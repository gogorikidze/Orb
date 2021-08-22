const fetch = require("node-fetch");
const cheerio = require('cheerio');

module.exports = {main}

async function main(term, page, then){
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