require('dotenv').config()
const express = require('express');
const app=express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');

const port=process.env.PORT || 5000


app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.USER_DB}:${process.env.USER_PASS}@cluster0.vqbd2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
   

    const usersDetails=client.db('assainment10').collection('addUsers')
    const allApplicationData=client.db('allApplyUsers').collection('applyUsers')
    const myaddedvisa=client.db('Allvisa').collection('visa')

    app.get('/allData',async(req,res)=>{
     const user=usersDetails.find();
     const result=await user.toArray()
     res.send(result)
    })
    app.get('/latest',async(req,res)=>{
     const user=usersDetails.find().limit(6);
     const result=await user.toArray()
     res.send(result)
    })


    // single id for finding
    app.get('/allData/:id',async(req,res)=>{
      const id=req.params.id
      const quary={_id : new ObjectId(id)}
      const result=await usersDetails.findOne(quary)
      res.send(result)
    })


    // all users
    app.post('/addData', async(req,res)=>{
     const user=req.body;
     const result=await usersDetails.insertOne(user);
     res.send(result)
    })


    // application users
    app.get('/Raihan',async(req,res)=>{
      const {searchParms}=req.query;
      let option={};
      if(searchParms){
        option={CountryName:{$regex:searchParms,$options:'i'}};
      }
      const result=await allApplicationData.find(option).toArray();
      res.send(result)
    })

    // application users
    app.post('/Raihan', async (req,res)=>{
      const newser=req.body;
      const result=await allApplicationData.insertOne(newser);
      res.send(result)
     })


    //  application users
     app.delete('/Raihan/:id',async(req,res)=>{
      const user=req.params.id;
      const query={_id: new ObjectId(user)}
      const result=await allApplicationData.deleteOne(query)
      res.send(result)
     })





//  added visa
app.get('/myaddvisa',async(req,res)=>{
  const user=myaddedvisa.find();
  const result=await user.toArray();
  res.send(result)
})

app.get('/myaddvisa/:id',async(req,res)=>{
  const id =req.params.id
  const query={_id:new ObjectId(id)}
  const result= await myaddedvisa.findOne(query)
  res.send(result)
})

app.put(`/myaddvisa/:id`,async(req,res)=>{
  const id=req.params.id
  const filter={_id: new ObjectId(id)}
  const option= {upsert:true}
  const updeteDatasss=req.body
  const data={
    $set:{
      CountryName:updeteDatasss.CountryName,
      Validity:updeteDatasss.Validity,
      Visa_type:updeteDatasss.Visa_type,
      Description:updeteDatasss.Description,
      Age_restriction:updeteDatasss.Age_restriction,
      Fee:updeteDatasss.Fee,
      Application_method:updeteDatasss.Application_method,
      photo:updeteDatasss.photo
    }
  }
  const result=await myaddedvisa.updateOne(filter,data,option)
  res.send(result)
})

    //  my added visa
    app.post('/myaddvisa', async (req,res)=>{
      const visa =req.body;
      const result=await  myaddedvisa.insertOne(visa)
      res.send(result)
    })

    // added data

    app.delete('/myaddvisa/:id',async(req,res)=>{
      const user=req.params.id;
      const id ={_id:new ObjectId(user)}
      const result = await myaddedvisa.deleteOne(id)
      res.send(result)
    })

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

  } finally {
    // Ensures that the client will close when you finish/error
//     await client.close();
  }
}
run().catch(console.dir);





app.get('/',(req,res)=>{
     res.send('hello serverSide , welcome our server')
})


app.listen(port,(req,res)=>{
     console.log(`This is a port no ${port}`)
})