const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser')
const ObjectId = require('mongodb').ObjectId;


//database Connection String
const uri = "mongodb+srv://OrganicUser:ZsPA7yPLpLaXdKsn@organicproductconnector.looo6.mongodb.net/OrganicDB?retryWrites=true&w=majority";

const app = express();
app.use(bodyParser.json())
var urlencodedParser = bodyParser.urlencoded({ extended: false })

const port = 3000

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/form.html')
})


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const studentCollection = client.db("OrganicDB").collection("students");
    console.log("DataBase Connection Successfully");

    app.get('/students', (req, res) => {
        studentCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    app.post('/addNewStudent', urlencodedParser, (req, res) => {
        const student = req.body
        studentCollection.insertOne(student, () => {
            console.log("New Student Update Successfully");
            res.redirect('/')
        })
    })

    app.delete('/delete/:id', (req, res) => {
        studentCollection.deleteOne({ _id: ObjectId(req.params.id) })
            .then((result) => {
                res.send(result.deletedCount > 0)
            })
    })

    app.get('/update/:id', (req, res)=>{
        studentCollection.find({ _id: ObjectId(req.params.id) })
        .toArray((err, document)=>{
            res.send(document[0])
        })
    })

    app.patch('/updateInfo/:id', (req, res) => {
        console.log(req.body.Email);
        studentCollection.updateOne({ _id: ObjectId(req.params.id) },
            {
                $set: { City: req.body.City, Email: req.body.Email, Versity: req.body.Versity }
            })
            .then(result => {
                console.log(result);
            })
    })
});


app.listen(port, () => {
    console.log(`listening from http://localhost:${port}`);
})