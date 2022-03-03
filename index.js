const express = require('express');
require('dotenv').config();
const {dbConection} = require('./database/config')
//caros
var cors = require('cors');


//Crear servidor express
const app  = express();

//Config CORS
app.use(cors());

//BD
dbConection()



//Rutas
app.get('/', (req, res) => {
    res.json({
        ok: true,
        msg: 'Hola Mundo'
    })
})



app.listen( process.env.PORT, () =>{
    console.log("servidor corriendo puerto" + 3000);
} )


//console.log("Hola mundo");