import mongoose from 'mongoose';
import { DB_NAME } from '../../constants.js';



export const connectDB = async () => {
    try {
        const connection = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
        console.log(`mongoDB connected || DB  HOST: ${connection.connection.host}`);        
    } catch (error) {
        console.log("masseg", error);
    }
}

