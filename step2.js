import { ObjectID } from "bson";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import slug from "slug";

dotenv.config();

const MONGODB_URL = process.env.MONGODB_URL;

function capitalizeWithUnderscore(str) {
  return str
    .split(" ")
    .map(function (word) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join("_");
}

function removeNonAlphabets(str) {
  return str.replace(/[^a-z_.]/gi, "");
}

function replaceDotWithSpace(str) {
  return str.replace(/\./g, " ");
}

const verifyAuthorObj = (obj) => {
  if (!obj || !obj?.name) {
    return false;
  }

  return true;
};

/**
 * NOTE:
 * We use this function to create author
 */
const addAuthorByQuoteAuthorRaw = async (client, quotes) => {
  const db = client.db("NorvstarDevDB");

  const authorObjArr = quotes.map((quote) => {
    const data = quote.author.split(",");
    return {
      name: data[0],
      archives: data[1] ? data[1].trim() : null,
    };
  });

  console.log("PARSED_ARR", authorObjArr);

  const results = [...new Set(authorObjArr.map((item) => item.name))].map(
    (name) => {
      const authorNameWithUnderscore = capitalizeWithUnderscore(name);
      const altName = removeNonAlphabets(authorNameWithUnderscore);
      const sluggableName = replaceDotWithSpace(name);
      const sluggedName = slug(sluggableName);

      const archives = [];

      authorObjArr.forEach((a) => {
        if (a.name === name && a.archives !== null) {
          archives.push(a.archives);
        }
      });

      return {
        name: name,
        altName: altName,
        slug: sluggedName,
        createdAt: new Date(),
        updatedAt: new Date(),
        archives: [...new Set(archives)],
      };
    }
  );

  const createAuthorPromises = results.map(async (result) => {
    const existingAuthor = await db.collection("authors").findOne({
      name: result.name,
      slug: result.slug,
      altName: result.altName,
    });

    if (existingAuthor) {
      return await db.collection("authors").findOneAndUpdate(
        { _id: ObjectID(existingAuthor._id) },
        {
          $set: {
            archives: [
              ...new Set([...existingAuthor.archives, ...result.archives]),
            ],
          },
        },
        {
          upsert: true,
        }
      );
    }

    return await db.collection("authors").insertOne(result);
  });

  const addedAuthors = await Promise.all(createAuthorPromises);

  return addedAuthors;
};

const getQuotesWithoutAuthorObj = async (client) => {
  const db = client.db("NorvstarDevDB");
  const authors = await db
    .collection("quotes")
    .find({ "author.name": { $exists: false } })
    .toArray();
  return authors;
};

(async function connectDB(quotes) {
  const client = new MongoClient(MONGODB_URL);

  try {
    // Connect to the MongoDB cluster
    await client.connect();

    const quotesWithoutAuthorObj = await getQuotesWithoutAuthorObj(client);
    await addAuthorByQuoteAuthorRaw(client, quotesWithoutAuthorObj);
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
})();
