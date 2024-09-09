import { MongoClient } from "mongodb";
import express from "express";
import cors from 'cors';
const app = express();
app.use(express.json());
app.use(cors());

const uri = "mongodb://localhost:27017/";
const client = new MongoClient(uri);

const db = client.db("crud");
const users = db.collection("users");

await users.createIndex({ email: 1 }, { unique: true });

app.route('/users')
    .get(async (req, res) => {
        const result = await users.find({}).toArray();
        res.json(result);
    })
    .post(async (req, res) => {
        try {
            const result = await users.insertOne(req.body);
            res.json(result);
        } catch (error) {
            res.status(401).json({ error: "Enter Unique email" });
        }
    })
    .put(async (req, res) => {
        const { email } = req.query;
        const result = await users.findOneAndUpdate({ email }, { $set: req.body }, { returnDocument: 'after' });
        res.json(result);
    })
    .delete(async (req, res) => {
        const { email } = req.query;
        const result = await users.deleteOne({ email });
        res.json(result);
    });

app.listen(3000, () => {
    console.log("Server Started");
});