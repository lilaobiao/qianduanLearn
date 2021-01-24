// 一个类似于 jquery 的解析 html 的插件
const cheerio = require('cheerio');
const html = `
<ul id="fruit">
   <li>Apple</li>
   <li class="favorite">Banana</li>
   <li class="favorite">Peach</li>
</ul>
`;
let $ = cheerio.load(html);
let fruit = $('#fruit');

// let favoriteFruits = fruit.children().filter((index, item) => $(item).hasClass('favorite'));
// console.log(favoriteFruits.length); // 2

// let lis = fruit.find('li');
// console.log(lis.length); // 3
// let fruits = [];
// lis.each((index, li) => {
//    fruits.push($(li).text());
// });
// console.log(fruits); // [ 'Apple', 'Banana', 'Peach' ]

let lis = fruit.find('li');
console.log(lis.first().text()); // Apple
console.log(lis.last().text()); // Peach
console.log(lis.eq(-2).text()); // Banana

//children 取的是直接子元素，也就是亲儿子
//find是后代元素
//console.log(fruit.children().length);
