const express = require('express')
var bodyParser = require('body-parser')
var dataRouter = require('./routes/pushdata');

const app = express()
const port = 3001

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/', dataRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})