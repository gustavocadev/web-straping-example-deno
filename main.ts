import { cheerio } from 'https://deno.land/x/cheerio@1.0.6/mod.ts';

const response = await fetch('https://quotes.toscrape.com/');
const html = await response.text();

const $ = cheerio.load(html);

const quotesFile = await Deno.create('quotes.csv');
const encoder = new TextEncoder();

await quotesFile.write(encoder.encode('quote|author|tags\n'));

$('.quote').each((idx, el) => {
  const text = $(el)
    .find('span.text')
    .text()
    .replaceAll('“', '')
    .replaceAll('”', '');
  console.log(text);

  const author = $(el).find('span small.author').text();
  const tags = [];
  $(el)
    .find('div.tags a.tag')
    .each((idx, el) => {
      tags.push($(el).text());
    });

  quotesFile.write(encoder.encode(`${text}|${author}|${tags.join(',')}\n`));
  console.log(author);
  console.log(tags);
});
