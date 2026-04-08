const mongoose = require('mongoose');

const testDB = async () => {
    try {
        console.log("Trying to connect...");
        const conn = await mongoose.connect(
            'mongodb://ghulambai:2N24DOLub14ZmHEO@foodordercluster-shard-00-00.yzmrq.mongodb.net:27017,foodordercluster-shard-00-01.yzmrq.mongodb.net:27017,foodordercluster-shard-00-02.yzmrq.mongodb.net:27017/?ssl=true&replicaSet=atlas-8duqrt-shard-0&authSource=admin&appName=FoodOrderCluster',
            { serverSelectionTimeoutMS: 5000 } // fail if cannot connect in 5 sec
        );
        console.log("MongoDB Connected:", conn.connection.host);
        process.exit(0);
    } catch (err) {
        console.error("DB ERROR:", err.message);
        process.exit(1);
    }
};

testDB();