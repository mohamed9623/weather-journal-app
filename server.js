// Setup empty JS object to act as endpoint for all routes
projectData = {};

// Require Express to run server and routes
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Start up an instance of app
const app = express();
const port = 3000;

/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
app.use(cors());

// Initialize the main project folder
app.use(express.static('website'));


// Setup Server
app.listen(port, () => console.log('Server start on port 3000'));

app.get('/journal', async(req, res) => {
    res.send(projectData);
});


app.post('/journal', async(req, res) => {
    console.log(req.body)
    if (!req.body.temp){
        return res.status(400).send({status: 'fail', statusMsg: 'Missing temperature value'});
    }
    if (!req.body.date){
        return res.status(400).send({status: 'fail', statusMsg: 'Missing date value'});
    }
    if (!req.body.content) {
        return res.status(400).send({status: 'fail', statusMsg: 'Missing userResponse value'});
    }
    projectData.temp = req.body.temp;
    projectData.date = req.body.date;
    projectData.content = req.body.content;
    res.send({status: 'success'})
})