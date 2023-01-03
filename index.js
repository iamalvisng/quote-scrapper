import playwright from "playwright";
import { MongoClient } from "mongodb";

const MONGODB_URL = process.env.MONGODB_URL;

async function connectDB(quotes) {
  const client = new MongoClient(MONGODB_URL);

  try {
    // Connect to the MongoDB cluster
    await client.connect();

    // Make the appropriate DB calls
    await addQuotes(client, quotes);
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

async function addQuotes(client, quotes) {
  const db = client.db("NorvstarDevDB");

  console.log("QUOTES", quotes);
  await db.collection("quotes").insertMany(quotes);
}

async function main() {
  const browser = await playwright.chromium.launch({
    headless: false,
  });

  const page = await browser.newPage();

  const arrayRange = (start, stop, step) =>
    Array.from(
      { length: (stop - start) / step + 1 },
      (value, index) => start + index * step
    );

  let range = arrayRange(41, 100, 1);

  const urls = range.map(
    (n) => `https://www.goodreads.com/quotes/tag/inspirational?page=${n}`
  );

  console.log(urls);

  for (const url of urls) {
    page.goto(url);
    await page.waitForTimeout(20000);

    const items = await page.$$eval(".quote", (all_items) => {
      const data = [];
      all_items.forEach((item) => {
        const quote = item.querySelector(
          ".quoteDetails > .quoteText"
        ).innerText;
        const author = item.querySelector(
          ".quoteDetails > .quoteText > span"
        ).innerText;

        const tags = item.querySelector(
          ".quoteDetails > .quoteFooter > .smallText"
        );

        const tagContents = tags.querySelectorAll("a");
        let list = [].slice.call(tagContents);
        let tagTextArr = list.map(function (e) {
          return e.innerText;
        });

        const strWithoutQuotes = quote.replace(/[”“]/g, "");
        const strWithoutAuthor = strWithoutQuotes.split("― ");
        const quoteStr = {
          quote: strWithoutAuthor[0],
          author: strWithoutAuthor[1],
        };

        data.push({
          ...quoteStr,
          tags: tagTextArr,
        });
      });
      return data;
    });

    await connectDB(items).catch(console.error);
  }

  await browser.close();
}

main();
