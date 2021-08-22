const fetch = require("node-fetch");
const cheerio = require('cheerio');

module.exports = {main}

function main(then){ //gets the number of all pages
  fetch(`http://dspace.gela.org.ge/handle/123456789/2/simple-search?location=123456789%2F2&query=&filter_field_1=subject&filter_type_1=notequals&filter_value_1=%E1%83%A1%E1%83%9E%E1%83%9D%E1%83%A0%E1%83%A2%E1%83%98&filter_field_2=subject&filter_type_2=notequals&filter_value_2=%E1%83%A4%E1%83%94%E1%83%AE%E1%83%91%E1%83%A3%E1%83%A0%E1%83%97%E1%83%98&filter_field_3=subject&filter_type_3=notequals&filter_value_3=%E1%83%A4%E1%83%9D%E1%83%A2%E1%83%9D&filter_field_4=subject&filter_type_4=notequals&filter_value_4=%E1%83%AE%E1%83%94%E1%83%9A%E1%83%9D%E1%83%95%E1%83%9C%E1%83%94%E1%83%91%E1%83%90&filter_field_5=has_content_in_original_bundle&filter_type_5=equals&filter_value_5=true&rpp=5&sort_by=score&order=DESC&etal=0&submit_search=Update`)
      .then(response => response.text())
      .then(body => {
        const $ = cheerio.load(body);
        
        let results = $('#content > div:nth-child(4) > div > div.col-md-9 > div.discovery-result-pagination.row.container > div').text().trim().split(' of ')[1].split(' (Search time')[0];
        then(parseInt(results));
      });
}