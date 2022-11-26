const MongoClient = require("mongodb").MongoClient;

const database = "mongodb+srv://netninja:Rocker47@cluster0.k5s3d7h.mongodb.net/sample_restaurants";

async function initialize(restaurants, sample_restaurants) {
  const client = await MongoClient.connect(database, {
    useNewUrlParser: true,
  }).catch((err) => {
    console.log(err);
  });

  if (!client) return;

  try {
    const db = client.db("sample_restaurants");

    const res = await db.collection("restaurants");

    console.log("Connection established");
  } catch (err) {
    console.log(err);
  } finally {
    client.close();
  }
}

module.exports = { 
  initialize 
}
