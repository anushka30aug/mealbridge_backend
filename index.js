require('dotenv').config();
const express = require('express')
const app = express()
const port = 3000
const main = require('./connect');

main().then(()=>{
  console.log("connected to db");
}).catch((err)=>{
  console.log("error connecting to db");
})
 
app.get('/', (req, res) => {
  res.send('Hello World!');
})

app.listen(port, () => {
  console.log(`http://localhost:${port}`)
})