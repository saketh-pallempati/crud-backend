import { MongoClient } from "mongodb";
import express from "express";
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const uri = process.env.MONGO_URI;
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
        const result = await users.updateOne({ email }, { $set: req.body })
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