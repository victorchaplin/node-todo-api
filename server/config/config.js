const env = process.env.NODE_ENV || 'development'
console.log(`Environment being used is [${env}]`)

const MONGODB_LOCAL_URI = 'mongodb://localhost:27017/TodoApp'
const MONGODB_TEST_URI = 'mongodb://localhost:27017/TodoAppTest'

if (env === 'development') {
    process.env.PORT = 3000
    process.env.MONGODB_URI = MONGODB_LOCAL_URI
} else if (env === 'test') {
    process.env.PORT = 3000
    process.env.MONGODB_URI = MONGODB_TEST_URI
}