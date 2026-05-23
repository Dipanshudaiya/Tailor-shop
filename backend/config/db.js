const mongoose = require('mongoose');

// Use a global variable to store the connection state across serverless function calls
let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
        console.error("❌ MONGO_URI not found in environment variables.");
        return null;
    }

    if (cached.conn) {
        // console.log('✅ Using existing MongoDB connection');
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            serverSelectionTimeoutMS: 5000,
            bufferCommands: true, // Allow Mongoose to buffer commands until connected
        };

        console.log('🔄 Connecting to MongoDB Atlas...');
        cached.promise = mongoose.connect(mongoUri, opts).then((mongooseInstance) => {
            console.log(`✅ MongoDB Connected: ${mongooseInstance.connection.host}`);
            return mongooseInstance;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        console.error(`❌ MongoDB Connection Error: ${e.message}`);
        console.error(`🔗 URI used: ${mongoUri.replace(/:([^@]+)@/, ':****@')}`); // Mask password
        console.error('👉 Please check if your IP is whitelisted in MongoDB Atlas and if the URI is correct.');
        throw e;
    }

    return cached.conn;
};

module.exports = connectDB;