import playwright from "playwright";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";

dotenv.config();

const MONGODB_URL = process.env.MONGODB_URL;

/**
 * Add em quotes!
 */
async function addQuotes(client, quotes) {
  const db = client.db("NorvstarDevDB");

  const promises = quotes.map(async (quote) => {
    /**
     * NOTE:
     * We need loop through the quotes,
     * in each quote, we need find the collection if the quote string matches
     * if YES,
     *    We skip
     * Otherwise
     *    We insert it to the DB
     */

    const exist = await db
      .collection("quotes")
      .find({
        quote: {
          $regex: quote.quote,
        },
      })
      .toArray();

    if (exist.length > 0) {
      return;
    }

    return await db
      .collection("quotes")
      .insertOne({ ...quote, createdAt: new Date(), updatedAt: new Date() });
  });

  const result = await Promise.all(promises);

  console.log("RESULT", result);
}

/**
 * Connect the DB and make it happen!
 */
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

/**
 * NOTE:
 * We use this to harvest data and insert them to into the db
 */
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

  // Please in the start page and end page
  let range = arrayRange(1, 2, 1);

  /**
   * NOTE:
   * https://www.goodreads.com/quotes/tag/inspirational?page=${n} --> [✔️]
   * https://www.goodreads.com/quotes/tag/life?page=${n} --> [✔️]
   * https://www.goodreads.com/quotes/tag/humor?page=${START_FROM_1} --> [ON GOING]
   */

  const urls = range.map(
    (n) => `https://www.goodreads.com/quotes/tag/humor?page=${n}`
  );

  console.log("URLS", urls);

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
