// const mongoose = require('mongoose');
// //const { MongoMemoryServer } = require('mongodb-memory-server');
// const path = require('path');
// const fs = require('fs');

// // Persistent data directory so MongoDB data survives server restarts
// const DB_PATH = path.join(__dirname, '..', 'data', 'db');

// const connectDB = async () => {
//     try {
//         const mongoUri = process.env.MONGO_URI;

//         // 1. Try connecting to the real MongoDB first if URI is provided
//         if (mongoUri) {
//             try {
//                 const conn = await mongoose.connect(mongoUri, {
//                     serverSelectionTimeoutMS: 2000 // Quick timeout if local DB isn't running
//                 });
//                 console.log(`✅ MongoDB Connected (Persistent): ${conn.connection.host}`);
//                 return conn;
//             } catch (err) {
//                 console.log('⚠️  Real MongoDB not found/reachable, falling back to Memory Server...');
//             }
//         }

//         // 2. Fallback to Persistent In-Memory DB if no URI or Real DB failed
//         try {
//             if (!fs.existsSync(DB_PATH)) {
//                 fs.mkdirSync(DB_PATH, { recursive: true });
//             }

//             const mongoServer = await MongoMemoryServer.create({
//                 instance: {
//                     dbPath: DB_PATH,
//                     storageEngine: 'wiredTiger',
//                 },
//             });
//             const memoryUri = mongoServer.getUri();
//             const conn = await mongoose.connect(memoryUri);
//             console.log('✅ MongoDB Memory Server (persistent) started!');
//             console.log(`MongoDB Connected: ${conn.connection.host}`);
//             return conn;
//         } catch (err) {
//             console.log('⚠️  Persistent Memory DB failed, trying ephemeral fallback...');
//             const mongoServer = await MongoMemoryServer.create();
//             const memoryUri = mongoServer.getUri();
//             const conn = await mongoose.connect(memoryUri);
//             console.log('⚠️  Using ephemeral in-memory database (data will reset on restart)');
//             return conn;
//         }
//     } catch (error) {
//         console.error(`❌ All MongoDB options failed: ${error.message}`);
//         process.exit(1);
//     }
// };

// module.exports = connectDB;
const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
    if (isConnected) {
        console.log('✅ Using existing MongoDB connection');
        return;
    }

    try {
        const mongoUri = process.env.MONGO_URI;

        if (!mongoUri) {
            console.error("❌ MONGO_URI not found in environment variables.");
            return;
        }

        const conn = await mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of default 30s
        });

        isConnected = !!conn.connections[0].readyState;
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        return conn;
    } catch (error) {
        console.error(`❌ MongoDB Error: ${error.message}`);
    }
};

module.exports = connectDB;