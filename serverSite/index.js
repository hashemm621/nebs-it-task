require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

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
    const db = client.db("nebsItDB");
    const noticesCollection = db.collection("notices");

    // 1. Get Notices (Filtering, Search, Pagination)
    app.get("/notices", async (req, res) => {
      try {
        const { status, page, limit, search, dept, date } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        let query = {};
        if (status && status !== "Status") query.status = status.toLowerCase();
        if (search) query.noticeTitle = { $regex: search, $options: "i" };
        if (dept && dept !== "Departments or individuals")
          query.targetAudience = dept;
        if (date) query.publishDate = date;

        const notices = await noticesCollection
          .find(query)
          .sort({ _id: -1 })
          .skip(skip)
          .limit(parseInt(limit))
          .toArray();

        const total = await noticesCollection.countDocuments(query);
        const activeCount = await noticesCollection.countDocuments({
          status: "published",
        });
        const draftCount = await noticesCollection.countDocuments({
          status: "draft",
        });

        res.send({
          notices,
          total,
          totalPages: Math.ceil(total / limit) || 1,
          activeCount,
          draftCount,
        });
      } catch (err) {
        res.status(500).send({ message: err.message });
      }
    });

    // 2. Create Notice
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
        res.status(500).send({ success: false, error: err.message });
      }
    });

    // 3. Update Status (Patch)
    app.patch("/notices/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) };
        const updateDoc = { $set: { status: req.body.status } };
        const result = await noticesCollection.updateOne(filter, updateDoc);
        res.send(result);
      } catch (err) {
        res.status(500).send({ message: err.message });
      }
    });

    // 4. Full Update (Put)
    app.put("/notices/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) };
        const data = req.body;
        const updateDoc = {
          $set: {
            noticeTitle: data.noticeTitle,
            noticeType: data.noticeType,
            targetAudience: data.targetAudience,
            publishDate: data.publishDate,
            description: data.description,
            imageUrl: data.imageUrl,
          },
        };
        const result = await noticesCollection.updateOne(filter, updateDoc);
        res.send(result);
      } catch (err) {
        res.status(500).send({ message: err.message });
      }
    });

    // 5. Delete Notice
    app.delete("/notices/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const result = await noticesCollection.deleteOne({
          _id: new ObjectId(id),
        });
        res.send(result);
      } catch (err) {
        res.status(500).send({ message: err.message });
      }
    });

    // Ping check
    await client.db("admin").command({ ping: 1 });
    console.log("Connected to MongoDB!");
  } catch (err) {
    console.error(err);
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Nebs IT Server is running...");
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
