const mongoose = require('mongoose')

function connectDB(){
    
        mongoose.connect(process.env.MONGO_URI)
        .then(()=>{
            console.log("Connected to Db")
        })        
        .catch(error=>{
            console.error(error)
            process.exit(1)
        })
}

module.exports=connectDB