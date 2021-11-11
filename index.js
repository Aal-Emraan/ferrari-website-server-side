const express = require('express');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const { MongoClient } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wd6nd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
        console.log('database connected succesfully');

        const database = client.db('Ferrari');
        const carsCollection = database.collection('allCars');
        const users = database.collection('users');
        const orders = database.collection('orders');
        const reviews = database.collection('reviews');

        // add user

        app.post('/user', async(req, res) =>{
            const user = req.body;
            const result = await users.insertOne(user);
            res.json(result);
        })

        // get all cars

        app.get('/getcars', async(req, res) => {
            const allCars = await carsCollection.find({}).toArray();
            res.json(allCars);
        })

        // get single car

        app.get('/singlecar/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const car = await carsCollection.findOne(query);
            // console.log(car);
            res.json(car);
        })

        // add new car

        app.post('/addcar', async(req, res) => {
            const car = req.body;
            console.log(car);
            const result = await carsCollection.insertOne(car);
            res.json(result);
        })

        // make order

        app.post('/order', async(req, res) => {
            const order = req.body;
            const placeOrder = await orders.insertOne(order);
            res.json(placeOrder);
        })

        // get my orders

        app.get('/myorders/:email', async(req, res) => {
            const query = {email: req.params.email};
            const myOrders = await orders.find(query).toArray();
            res.json(myOrders);
        })

        // cancel order

        app.delete('/deleteorder/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await orders.deleteOne(query);
            res.json(result)
        })

        // make admin

        app.put('/makeadmin', async(req, res) => {
            const email = req.query.email;
            const filter = {email: email};
            const updateDoc = {$set:{role: "admin"},};
            const options = { upsert: true };
            const result = await users.updateOne(filter, updateDoc, options);
            res.json(result);
        })

        // check is admin or not
        app.get('/isadmin/:email', async (req, res) => {
            const email = req.params.email;
            const query = {email: email};
            const result = await users.findOne(query);
            let isAdmin = false;
            if(result?.role === 'admin'){
                isAdmin = true;
            }
            res.json({isAdmin: isAdmin});
        })

    }
    finally{
        // await client.close()
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('assignment 12 server')
});

app.listen(port, ()=>{
    console.log('listening to port: ', port);
})


// heroku link: https://safe-scrubland-04558.herokuapp.com/