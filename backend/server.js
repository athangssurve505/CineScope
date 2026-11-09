import "dotenv/config"
import app from "./src/app.js";
import connectToDatabase from "./src/config/database.config.js";


connectToDatabase();


app.listen(process.env.PORT,()=>{
    console.log("Server is running")
})