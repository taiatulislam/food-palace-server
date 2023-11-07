const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1qp2qmz.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

app.use(cors())
app.use(express.json())

async function run() {
    try {
        // await client.connect();

        const foods = client.db("foodPalaceDB").collection("allFoods");

        // Show all food
        app.get('/allFoods', async (req, res) => {
            const result = await foods.find().toArray();
            res.send(result)
        })

        // Show search food
        app.get('/allFoods/:name', async (req, res) => {
            const name = req.params.name;
            const query = { name: name }
            const result = await foods.find(query).toArray();
            res.send(result)
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {

        // await client.close();
    }
}
run().catch(console.dir);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})