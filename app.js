const express = require('express');
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());
const path = require('path');
const port = process.env.PORT || 3000;
const db = require("./db");
const collection = "todo";

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'todo.html'));
});

app.get('/getTodos',(req,res)=>{
db.getDB().collection(collection).find({}).toArray((err,documents)=>{
    if(err)
    console.log(err);
    else {
        console.log(documents);
        res.json(documents);
    }
})
});


app.put('/:id',(req,res)=>{
    const todoID = req.params.id;
    const userInput=req.body;
    db.getDB().collection(collection).findOneAndUpdate({_id : db.getPrimaryKey(todoID)},{$set : {todo:userInput.todo}},{returnOriginal:false},(err,result)=>{
        if(err)
        console.log(err);
        else
        res.json(result);
    })

});

app.post('/',(req,res)=>{
    const userInput = req.body;
    db.getDB().collection(collection).insertOne(userInput,(err,result)=>{
        if(err)
        console.log(err);
        else
        res.json({result:result,document:result.ops[0]});
    });
});

app.delete('/:id',(req,res)=>{
    // Primary Key of Todo Document
    const todoID = req.params.id;
    // Find Document By ID and delete document from record
    db.getDB().collection(collection).findOneAndDelete({_id : db.getPrimaryKey(todoID)},(err,result)=>{
        if(err)
            console.log(err);
        else
            res.json(result);
    });
});



db.connect((err)=>{
    if(err){
    console.log('unable to connect to database');
    process.exit(1);
}
    else{
    app.listen(port,()=>{
        console.log('connected to database, app listening to Port 3')
    });
}
})