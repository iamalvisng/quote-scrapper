import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import { ObjectID } from "bson";

dotenv.config();

const MONGODB_URL = process.env.MONGODB_URL;

/**
 * NOTE:
 * We use this function to add/update the author in a quote document
 */
const updateQuotesAuthor = async (client) => {
  const db = client.db("NorvstarDevDB");
  const quotesCollection = db.collection("quotes");

  /**
   * We get a list of quotes that its author is not an object,
   *  - we do that by checking if the author.name exists
   */
  const quotes = await quotesCollection
    .find({ "author.name": { $exists: false } })
    .toArray();

  const quoteUpdatePromises = quotes.map(async (q) => {
    const authorName = q.author.split(",")[0];

    const authorsCollection = db.collection("authors");
    const foundAuthor = await authorsCollection.findOne({
      name: authorName,
    });

    console.log("foundAuthor", foundAuthor);

    let authorObj = null;

    if (!foundAuthor) {
      authorObj = q.author;
    } else {
      authorObj = {
        id: foundAuthor._id.toString(),
        slug: foundAuthor.slug,
        name: foundAuthor.name,
      };
    }

    const quoteId = ObjectID(q._id);
    const quote = await quotesCollection.findOneAndUpdate(
      { _id: quoteId },
      { $set: { author: authorObj } },
      { upsert: true }
    );

    return quote;
  });

  return Promise.all(quoteUpdatePromises);
};

(async function connectDB(quotes) {
  const client = new MongoClient(MONGODB_URL);

  try {
    await client.connect();
    const updates = await updateQuotesAuthor(client);
    console.log(updates);
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
})();
