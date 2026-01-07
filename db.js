const mogoose = require('mongoose');
mogoose.connect('mongodb://localhost:27017/userdb')
.then(() => {
    console.log('Connected to MongoDB');
})
.catch((err) => {
    console.error('Error connecting to MongoDB', err);
});