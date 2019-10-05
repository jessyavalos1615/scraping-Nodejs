const cheerio = require("cheerio");
const request = require("request-promise");
const fs = require("fs-extra");

const writeStream = fs.createWriteStream("quotes.csv");

const tags = [];

init = async () => {
  const $ = await request({
    uri: "http://quotes.toscrape.com/",
    transform: body => cheerio.load(body)
  });

  writeStream.write("Quote|Author|Tags\n");
  $(".quote").each((i, e) => {
    const text = $(e)
      .find("span.text")
      .text()
      .replace(/(^\“|\”$)/g, "");
    const author = $(e)
      .find("span small.author")
      .text();
    $(e)
      .find(".tags a.tag")
      .each((i, e) => tags.push($(e).text()));

    writeStream.write(`${text}|${author}|${tags}\n`);
  });
};

init();
