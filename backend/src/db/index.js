import mongoose from 'mongoose';

const connectDb = async () =>{
    try {
        const MongoInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`)
        console.log('Connected to MongoDB:', MongoInstance.connection.host);
    } catch (error) {
        console.error('Error connecting to the database:', error);
        process.exit(1);
    }
}

export default connectDb;