const mongoose = require("mongoose")
const dotenv = require("dotenv")
dotenv.config({path: "./config/index.env"})
const Db = process.env.DATABASE
/* const Db = "mongodb://localhost:27017/db" */

mongoose.connect(Db, {
/*     useNewUrlParser: true,
    useUnifiedTopology: true */
}).then(()=>{
    console.log("MongoDB Connected!")
})

const app = require("./App")

app.listen(process.env.PORT || 5000, ()=>{
    console.log("Conneted")
})