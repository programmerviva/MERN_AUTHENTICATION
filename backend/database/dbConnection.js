import mongoose from 'mongoose';

export const connection = ()=> {
    mongoose.connect(process.env.MONGO_URL, {
        dbName: "MERN_AUTHENTICATION"
    }).then(()=>{
        console.log("Database connected successfully");
    }).catch(err=>{
        console.log(`Error in database connection: ${err}`);
    })
}