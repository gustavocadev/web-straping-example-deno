import * as cheerio from 'npm:cheerio';

const response = await fetch('https://quotes.toscrape.com/');
const html = await response.text();

const $ = cheerio.load(html);

const quotesFile = await Deno.create('quotes.csv');
const encoder = new TextEncoder();

await quotesFile.write(encoder.encode('quote|author|tags\n'));

$('.quote').each((_idx, el) => {
  const text = $(el)
    .find('span.text')
    .text()
    .replaceAll('“', '')
    .replaceAll('”', '');
  console.log(text);

  const author = $(el).find('span small.author').text();
  const tags: string[] = [];
  $(el)
    .find('div.tags a.tag')
    .each((_idx, el) => {
      tags.push($(el).text());
    });

  quotesFile.write(encoder.encode(`${text}|${author}|${tags.join(',')}\n`));
  console.log(author);
  console.log(tags);
});
