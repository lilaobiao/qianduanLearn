const cheerio = require('cheerio');
const html = '<h2 class="title">Hello world</h2>';
let $ = cheerio.load(html);
let title = $('h2.title');
title.addClass('welcome');
// 添加class
title.text('ok');
console.log(title.html());
// ok
console.log($.html())
// <html><head></head><body><h2 class="title welcome">ok</h2></body></html>
