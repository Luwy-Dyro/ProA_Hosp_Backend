const mongoose = require('mongoose');
require('dotenv').config();

const dbConection = async() => {

//user2022
//User2022
    try{
        
       await mongoose.connect( process.env.DB_CNN);

       console.log("DB online");


    }catch(error){
        console.log(error);
        throw new Error('Error en la BD')
    }



}

module.exports = {
    dbConection
}