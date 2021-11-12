const { MongoClient } = require("mongodb");
const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;
const ObjectId = require("mongodb").ObjectId;

// MiddleWare
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.y2kiu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// console.log(uri);

async function run() {
  try {
    await client.connect();
    const database = client.db("motor-Mania");

    // const sampleDataCollection = database.collection("sampleData");
    const allHelmetDataCollection = database.collection("allHelmetData");
    // const exploreDataCollection = database.collection("exploreData");

    //GET API 01.1 for allHelmetData
    app.get("/allHelmetData", async (req, res) => {
      const cursor = allHelmetDataCollection.find({});
      const allHelmetData = await cursor.toArray();
      res.send(allHelmetData);
    });

    //GET API 01.2 for checkout single product
    app.get("/allHelmetData/:id", async (req, res) => {
      // console.log(req.params.id);

      const cursor = allHelmetDataCollection.find({
        _id: ObjectId(req.params.id),
      });
      const allHelmetData = await cursor.toArray();
      res.send(allHelmetData[0]);
    });


    

    //GET API 01.2 for exploreData
    // app.get("/exploreData", async (req, res) => {
    //   const cursor = exploreDataCollection.find({});
    //   const exploreData = await cursor.toArray();
    //   res.send(exploreData);
    // });
  } finally {
    //   await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Finally On The Way To Junior Web Developer!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
