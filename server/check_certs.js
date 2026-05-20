const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://rajmangezerokost_db_user:G3qiTG5iVGwtkNLS@cluster0.uxlc4cn.mongodb.net/forest_dashboard?retryWrites=true&w=majority&appName=Cluster0';

async function check() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to MongoDB");
        
        const Certificate = mongoose.model('Certificate', new mongoose.Schema({}, { strict: false }));
        const count = await Certificate.countDocuments();
        console.log(`Total Certificates found: ${count}`);
        
        const certs = await Certificate.find().limit(5);
        console.log("Samples:", JSON.stringify(certs, null, 2));
        
        process.exit(0);
    } catch (err) {
        console.error("Test failed:", err);
        process.exit(1);
    }
}

check();
