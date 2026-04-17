const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const listDBs = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        const admin = new mongoose.mongo.Admin(conn.connection.db);
        const dbs = await admin.listDatabases();
        console.log('Databases:', dbs.databases.map(db => db.name));
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

listDBs();
