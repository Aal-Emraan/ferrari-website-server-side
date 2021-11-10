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

        // const database = client.db("sample_mflix");
        // const movies = database.collection("movies");

        app.get('/getcars', async(req, res) => {
            const allCars = await carsCollection.find({}).toArray();
            console.log(allCars);
            res.json(allCars);
        })

        app.post('/addCars', async(req, res) => {

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