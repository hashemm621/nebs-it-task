require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;
const { MongoClient, ServerApiVersion } = require("mongodb");

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173"],
  })
);

const uri = process.env.URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const db = client.db("nebsItDB");
    const noticesCollection = db.collection("notices");

    // API endpoint to get notices with filtering and sorting
    app.get("/notices", async (req, res) => {
      try {
        const { status } = req.query;
        let query = {};

        if (status) {
          query.status = status;
        }

        const notices = await noticesCollection
          .find(query)
          .sort({ _id: -1 })
          .toArray();

        res.status(200).send(notices);
      } catch (err) {
        console.error("Error fetching notices:", err);
        res.status(500).send({
          success: false,
          message: "Internal Server Error",
          error: err.message,
        });
      }
    });

    //create notice
    app.post("/notices", async (req, res) => {
      try {
        const noticeData = req.body;

        const newNotice = {
          ...noticeData,
          createdAt: new Date(),
          status: noticeData.status || "published",
        };

        const result = await noticesCollection.insertOne(newNotice);

        res.status(201).send({
          success: true,
          message: "Notice created successfully",
          insertedId: result.insertedId,
        });
      } catch (err) {
        console.error("Error creating notice:", err);
        res.status(500).send({
          success: false,
          message: "Internal Server Error",
          error: err.message,
        });
      }
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
