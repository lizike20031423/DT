require('dotenv').config()

const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const cors = require('cors');
const connection = require('./database');

app.use(express.static('./public'))
const path = require('path');

let uuid = null;

app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, './views/index.html'));
});

app.get('/consentForm', (req, res) => {
    res.sendFile(path.resolve(__dirname, './views/consentForm.html'));
});

app.get('/experiment', (req, res) => {
    res.sendFile(path.resolve(__dirname, './views/experiment.html'))
    uuid = req.query.uuid;
    console.log('uuid', uuid);
});

app.post('/experiment', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', '*')
    res.setHeader('Access-Control-Allow-Method', '*')
    console.log(req.body);
    const record = JSON.parse(req.body.data)
    
    const sqlStr = 'insert into web_parameters (line_width, content_font_size, line_height, font_hue, font_saturation, font_lightness, background_hue, background_saturation, background_lightness, uuid) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    connection.query(sqlStr, [record.linewidth, record.fontsize, record.lineheight, record.fonthue, record.fontsaturation, record.fontlightness, record.backgroundhue, record.backgroundsaturation, record.backgroundlightness, uuid], (error, results) => {
        if(error) return console.log(error.message)
        res.send('success')
    })
    
});


const PORT = process.env.PORT || 8080;
app.listen(PORT,()=>{
    console.log(`server is running at Port ${PORT}`);
});