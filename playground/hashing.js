const {SHA256} = require('crypto-js')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const password = '123abc!'

bcrypt.genSalt(10, (error, salt) => {
    bcrypt.hash(password, salt, (error, hash) => {
        console.log(hash)
    })
})

const hashedPassword = '$2a$10$EmkCi/0YMbsAVZzvcMJi8.0TleO5WbKCoDWl3QC61W71vHoGeIviK'

bcrypt.compare(password, hashedPassword, (error, result) => {
    console.log(result)
})

// const data = {
//     id: 10
// }

// const token = jwt.sign(data, '123abc')
// console.log(token)

// const decoded = jwt.verify(token, '123abc')
// console.log('decoded', decoded)

// const message = 'Im user number 3'
// const hash = SHA256(message).toString()

// console.log(`Message: ${message}`)
// console.log(`Hash: ${hash}`)

// const data = {
//     id: 4
// }
// const token = {
//     data,
//     hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// }

// // token.data.id = 5
// // token.hash = SHA256(JSON.stringify(token.data)).toString()

// const resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString()

// if (resultHash === token.hash) {
//     console.log('Data was not changed')
// } else {
//     console.log('Data was changed. Do not trust!')
// }