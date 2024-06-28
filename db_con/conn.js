const mongoose = require('mongoose');

const connectionString = 'mongodb://127.0.0.1:27017/rms';

mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB connected');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});