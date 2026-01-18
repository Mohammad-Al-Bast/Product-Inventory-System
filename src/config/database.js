import mongoose from 'mongoose';

const connectDatabase = async (connectionString) => {
    try {
        await mongoose.connect(connectionString, {
            connectTimeoutMS: 10000,
            serverSelectionTimeoutMS: 10000,
        });
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Database connection error:', error);
        throw error;
    }
};

export default connectDatabase;