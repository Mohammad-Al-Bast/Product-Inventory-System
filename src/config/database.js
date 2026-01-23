import mongoose, { mongo } from 'mongoose';

const connectDatabase = async (connectionString) => {
    try {
        await mongoose.connect(connectionString, {
            connectTimeoutMS: 3000,
            serverSelectionTimeoutMS: 3000,
        });
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Database connection error:', error);
        throw error;
    }
};

export default connectDatabase;