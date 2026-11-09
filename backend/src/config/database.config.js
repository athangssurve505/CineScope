import mongoose from "mongoose";

async function connectToDatabase(){
    try{
       await mongoose.connect(`${process.env.MONGO_URI}cinescope`);
       console.log("Connected to Database")
    }
    catch(e){
        console.log("Connection To Database Failed : "+ e.message);

    }

}

 export default connectToDatabase;