const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const cors = require('cors');
const bodyParser =  require('body-parser');
require('dotenv').config()

const port = process.env.PORT || 8080

app.use(cors());
app.use(bodyParser.json());
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8adgo.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const serviceCollection = client.db("luxury").collection("item");
  const orderCollection = client.db("luxury").collection("order");

  app.post('/addEvent',(req,res)=>{
    const newEvent = req.body;
    serviceCollection.insertOne(newEvent)
    .then(result =>{
        console.log('insertedCount:', result.insertedCount);
        res.send(result.insertedCount > 0)
    })
  })

  app.post('/addEmail',(req,res)=>{
    const newEmail = req.body;
    serviceCollection.insertOne(newEmail)
    .then(result =>{
        console.log('insertedCount:', result.insertedCount);
        res.send(result.insertedCount > 0)
    })
  })

  app.get('/servicePhoto',(req,res)=>{
    serviceCollection.find({})
    .toArray((err,items)=>{
      res.send(items);
      console.log(items);
    })
  })

  app.delete('/delete/:id',(req,res)=>{
    const id = ObjectID(req.params.id);
    serviceCollection.findOneAndDelete({_id: id})
    .then(documents => res.send(!! documents.value))
})

app.post('/addOrder',(req,res)=>{
  const newOrder = req.body;
  console.log(newOrder);
  orderCollection.insertOne(newOrder)
  .then(result =>{
      console.log(result);
  })
  console.log(newOrder);
})


  
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})