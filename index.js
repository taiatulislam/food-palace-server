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

        const foodCollection = client.db("foodPalaceDB").collection("allFoods");
        const purchaseCollection = client.db("foodPalaceDB").collection("purchase");
        const userCollection = client.db("foodPalaceDB").collection("users");

        // Show all food
        app.get('/allFood', async (req, res) => {
            const result = await foodCollection.find().toArray();
            res.send(result)
        })

        // store user data
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await userCollection.insertOne(user);
            res.send(result)
        })

        // Show popular food
        app.get('/popularFood', async (req, res) => {
            const query = { orderCount: { $gt: 0 } };
            const options = { sort: { orderCount: -1 } };
            const result = await foodCollection.find(query, options).limit(6).toArray();
            res.send(result)
        })

        // Show search food
        app.get('/allFood/:name', async (req, res) => {
            const name = req.params.name;
            const query = { name: name }
            const result = await foodCollection.find(query).toArray();
            res.send(result)
        })

        // Show food in a page
        app.get('/allFoodPage', async (req, res) => {
            const page = parseInt(req.query.page);
            const size = parseInt(req.query.size);

            const result = await foodCollection.find().skip(page * size).limit(size).toArray();
            res.send(result)
        })

        // Get data by id in details
        app.get('/foodDetails/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await foodCollection.findOne(query);
            res.send(result)
        })

        // Get data by id in order
        app.get('/purchase/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await foodCollection.findOne(query);
            res.send(result)
        })

        // purchase data add
        app.post('/purchase', async (req, res) => {
            const addPurchase = req.body;
            const result = await purchaseCollection.insertOne(addPurchase);
            res.send(result)
        })

        // Show my added food
        app.get('/addedFood/:email', async (req, res) => {
            const email = req.params.email;
            const query = { madeBy: email }
            const result = await foodCollection.find(query).toArray();
            res.send(result)
        })

        // Get data by id in order
        app.get('/updateFood/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await foodCollection.findOne(query);
            res.send(result)
        })

        // Update data added by user
        app.put('/updateFood/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const option = { upsert: true }
            const updateFood = req.body;

            const food = {
                $set: {
                    name: updateFood.name,
                    category: updateFood.category,
                    origin: updateFood.origin,
                    price: updateFood.price,
                    quantity: updateFood.quantity,
                    image: updateFood.image,
                    details: updateFood.details
                }
            }
            const result = await foodCollection.updateOne(filter, food, option);
            res.send(result)
        })

        // Show my ordered food
        app.get('/ordered/:email', async (req, res) => {
            const email = req.params.email;
            const query = { userEmail: email }
            const result = await purchaseCollection.find(query).toArray();
            res.send(result)
        })

        // Add Food
        app.post('/addFood', async (req, res) => {
            const addFood = req.body;
            const result = await foodCollection.insertOne(addFood);
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