const fetch = require("node-fetch");
const cheerio = require('cheerio');

module.exports = {main}

function main(then){ //gets the number of all pages
    fetch(`https://eon.ge/%E1%83%AC%E1%83%98%E1%83%92%E1%83%9C%E1%83%94%E1%83%91%E1%83%98/`)
        .then(response => response.text())
        .then(body => {
          const $ = cheerio.load(body);
          
          let results = 0;
  
          $('#content > div:nth-child(2) > article > div > div.elementor.elementor-728 > div > section.elementor-section.elementor-top-section.elementor-element.elementor-element-ed17c3c.elementor-section-boxed.elementor-section-height-default.elementor-section-height-default > div > div.elementor-column.elementor-col-50.elementor-top-column.elementor-element.elementor-element-8050472 > div > div > div > ul').find('li > a').each(function (index, element) {
            let cat = parseInt($(element).text().trim().split('(')[1].split(')')[0]);
            if(!isNaN(cat)){ //sometimes ther is a comment or something in the brackets, in that case ParseInt returns NaN
              results += parseInt(cat);
            }
          });
          then(results);
        });
  }