const mongoose = require('mongoose')

mongoose.Promise = global.Promise

const MONGODB_LOCAL_URI = 'mongodb://localhost:27017/TodoApp'
mongoose.connect(process.env.MONGODB_URI || MONGODB_LOCAL_URI)

module.exports = mongoose