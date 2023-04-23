const express = require('express');
const mongoose = require('mongoose');
const WM = require('./db.js');
const app = express();
const PORT = 8080;
mongoose.connect('mongodb://localhost/washmash');

//create an entity and add it to the database
async function run(time,id) {
    const wm = new WM ({date: time, note: id.toString()});
    await wm.save();
    console.log(wm);
}
//deletes all entries older than now
function update(model,now){
    console.log("now=",now);
    model.deleteMany({ date: { $lt: now } })
  .then((result) => {
    console.log(`Deleted ${result.deletedCount} documents`);
  })
}

//delete wrong entries, used for testing
function cleanup(model){
    model.deleteMany({ date: { $exists:false } })
  .then((result) => {
    console.log(`Deleted ${result.deletedCount} documents`);
  })
}
app.use(express.json())

//handle a get request
app.get('/get_time:date', (req,res)=>

{
    const { date } = req.params;
    const id = req.params.date;
    const newStr = id.substring(1);
    const num = parseInt(newStr);
    let d_t = new Date(num*1000);
    console.log(newStr)
    console.log(d_t); 
    console.log(`${date}`);
    const now = new Date()
    //clear old entries by running: 
    //update(WM,now); 
    WM.find().then((time)=> {
        res.status(200).send(time)
    })
});

//handle a post request by creating a new entry in the datebase
app.post('/set_time',(req,res)=>{
    const {id} = req.params;
    const {time} = req.body; 
    const {note} = req.body; 
    run(time,note)
    console.log(time);
    console.log(note)
    res.send({
        "time": `${time}`
    });
}
);


app.listen(
    PORT,
    () => console.log(`it \'s alive on http://localhost:${PORT}`)
)
