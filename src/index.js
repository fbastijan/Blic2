import express from "express";
import bodyParser from "body-parser";
import connect from "./db.js";
import { v4 as uuidv4 } from "uuid";
var ObjectId = require("mongodb").ObjectID;

const app = express(); // instanciranje aplikacije
const port = 3000; // port na kojem će web server slušati
app.use(express.json());

app.listen(port, () => console.log(`npm Slušam na portu ${port}!`));
app.get("/GetItemByID/:id", async (req, res) => {
  // parametri rute dostupni su u req.params
  let id = req.params.id;

  // spoji se na bazu
  let db = await connect();
  console.log();
  // za dohvat jednog dokumenta koristimo `findOne()`
  let document = await db
    .collection("collection1")
    .findOne({ _id: new ObjectId(id) });
  res.json({
    status: "OK",
    data: {
      item: document,
    },
  });
});
app.get("/getBrand/:brand", async (req, res) => {
  var brandi = req.params.brand;
  console.log(brandi);
  let db = await connect(); // pristup db objektu
  let cursor = await db.collection("collection1").find({ brand: brandi });
  let results = await cursor.toArray();
  console.log(results);
  res.json({
    brand: brandi,
    item: results,
  });
});
app.post("/saveItem", async (req, res) => {
  let db = await connect();
  let data = req.body;

  console.log(data);
  let result = await db.collection("collection1").insertOne(data);
  if (result.insertedCount != 1) {
    res.json({
      status: "success",
      message: "Item " + data.name + " saved in DB",
    });
  } else {
    res.json({
      status: "fail",
    });
  }
});

app.patch("/updateItemPrice/:id", async (req, res) => {
  let doc = req.body;
  delete doc._id;
  let id = req.params.id;
  let db = await connect();
  let result = await db.collection("collection1").updateOne(
    { _id: new ObjectId(id) },
    {
      $set: doc,
    }
  );

  res.json({
    status: "OK",
    message: "ITEm " + id + "updated with new price " + doc.price,
  });
});
