const express = require('express');
const cors = require('cors');
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
            console.log(user);
            const result = await users.insertOne(user);
            console.log(result);
            res.json(result);
        })

        // get all cars

        app.get('/getcars', async(req, res) => {
            const allCars = await carsCollection.find({}).toArray();
            res.json(allCars);
        })

        // add new car

        app.post('/addcar', async(req, res) => {
            const car = req.body;
            console.log(car);
            const result = await carsCollection.insertOne(car);
            res.json(result);
        })

        // make admin

        app.put('/makeadmin', async(req, res) => {
            const email = req.query.email;
            console.log(email);
            const filter = {email: email};
            console.log(filter);
            const updateDoc = {$set:{role: "admin"},};
            const options = { upsert: true };
            const result = await users.updateOne(filter, updateDoc, options);
            res.json(result);
            
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