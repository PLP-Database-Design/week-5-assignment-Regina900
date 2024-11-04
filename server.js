// import our dependencies
const express = require('express')
const path = require('path')
const app = express()
const mysql = require('mysql2')
const dotenv = require('dotenv')


// configure environment variables
dotenv.config()


// create a connection object
const db = mysql.createConnection({ 
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

// test the database connection
db.connect((err) => {
    // connection is not successful
    if(err) {
       return console.log("Error connecting to the database: ", err)
    }
    // connection is successful
    console.log("Successfully connected to MySQL: ", db.threadId)
})

// 1. retrieve all patients
app.get('/patients', (req, res) => {
    const getPatients = "SELECT patient_id, first_name, last_name, date_of_birth FROM patients"
    db.query(getPatients, (err, data) => {
        // if I have an error
        if(err) {
            return res.status(400).send("Failed to get patients", err)
        }
        
         res.status(200).render('data', {data})

    })
})

// set the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.get('/', (req, res) => {
    res.render('index')
});


// 2. retrieve all providers
app.get('/providers', (req, res) => { 
    const getProviders = "SELECT first_name, last_name, provider_speciality FROM providers"
    db.query(getProviders, (err, data) => {
        // if I have an error
        if(err) {
            return res.status(400).send("Failed to get providers", err)
        }
        
         res.status(200).render('data', {data})

    })
})


// 3. Filter patients by First name
app.get('/patients/filter/:firstName', (req, res) => {
    const { firstName} = req.params
    const filterPatients = "SELECT patient_id, first_name, last_name, date_of_birth FROM patients WHERE first_name = ?"
    db.query(filterPatients, [first_name], (err, data) => {
        // if I have an error
        if(err) {
            return res.status(400).send("Failed to filter patients by first_name", err)
        }
        
         res.status(200).render('data', {data})

    })
})


// 4. Retrieve all providers by their speciality
app.get('/providers/speciality/:speciality', (req, res) => {
    const {speciality} = req
    const retrieveProviders =  "SELECT first_name, last_name, provider_speciality FROM providers WHERE provider_speciality = ?"
    db.query(getPatients, [speciality], (err, data) => {
        // if i have an error
        if(err) {
            return res.status(400).send("Failed to retrieve all providers by their speciality", err)
        }
        
         res.status(200).render('data', {data})

    })
})  

// start and listen to the server
const PORT = 3000
app.listen(PORT, () => {
    console.log(`server is runnig on http://localhost:${PORT}`)
})