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

    const allHelmetDataCollection = database.collection("allHelmetData");
    const feedbackCollection = database.collection("allFeedback");
    const orderCollection = database.collection("allOrders");

    //GET API 01.1 for allHelmetData
    app.get("/allHelmetData", async (req, res) => {
      const cursor = allHelmetDataCollection.find({});
      const allHelmetData = await cursor.toArray();
      res.send(allHelmetData);
    });

    //GET API 01.2 for checkout single product
    app.get("/allHelmetData/:id", async (req, res) => {
      const cursor = allHelmetDataCollection.find({
        _id: ObjectId(req.params.id),
      });
      const allHelmetData = await cursor.toArray();
      res.send(allHelmetData[0]);
    });

    // POST API 02.1 for add review mongo in home page
    app.post("/allFeedback", async (req, res) => {
      const addFeedback = req.body;
      const result = await feedbackCollection.insertOne(addFeedback);
      res.json(result);
    });

    //POST API 02.2 for show review in home page
    app.get("/allFeedback", async (req, res) => {
      const cursor = feedbackCollection.find({});
      const feedbackData = await cursor.toArray();
      res.send(feedbackData);
    });

    // 03.1 add allOrder in mongo database
    app.post("/allOrders", async (req, res) => {
      const addOrders = req.body;
      const result = await orderCollection.insertOne(addOrders);
      res.json(result);
    });

    // 03.2 show order in ui
    app.get("/allOrders", async (req, res) => {
      const cursor = orderCollection.find({});
      const ordersData = await cursor.toArray();
      console.log(req.params.email);

      res.send(ordersData);
    });

    // app.get("/allOrders/:email", async (req, res) => {
    //   const cursor = orderCollection.find({ email: req.params.email });
    //   const ordersData = await cursor.toArray();

    //   // console.log(ordersData);
    //   console.log(req.params.email);

    //   res.send(ordersData);
    // });

    // 04 delete ordered product
    app.delete("/deleteOrder/:id", async (req, res) => {
      const result = await orderCollection.deleteOne({
        _id: ObjectId(req.params.id),
      });
      // console.log(result);
      res.send(result);
    });
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
