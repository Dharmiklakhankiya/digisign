const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');
// Add dotenv for environment variables
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());
app.use(express.static('public')); 


// Replace local MongoDB connection with MongoDB Atlas connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/digisign';

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // These options are no longer needed in newer versions of Mongoose,
    // but included for compatibility with older versions
})
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('MongoDB Atlas connection error:', err));


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = './uploads';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });


const Signature = require('./models/signature');


const signatureRoutes = require('./routes/signature');


app.use('/api/signature', signatureRoutes);


app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});



app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Server error',
        error: err.message
    });
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


module.exports = app;
