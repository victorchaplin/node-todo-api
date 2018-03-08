const {ObjectID} = require('mongodb')

const mongoose = require('./../server/db/mongoose')
const Todo = require('./../server/models/todo')
const User = require('./../server/models/user')

// var id = '5aa0b0da22c62e1f59db7b761'

// if (!ObjectID.isValid(id)) {
//     console.log('Id not valid')
// }

// Todo.find({
//     _id: id
// }).then((todos) => {
//     console.log('Todos: ', todos)
// })

// Todo.findOne({
//     _id: id
// }).then((todo) => {
//     console.log('Todo: ', todo)
// })

// Todo.findById(id).then((todo) => {
//     if (!todo) {
//         return console.log('Id not found')
//     }
//     console.log('Todo by id: ', todo)
// }).catch((error) => console.log(error))

var userId = '5a9f4ddc114eb51c29e66aed'

User.findById(userId).then((user) => {
    if (!user) {
        return console.log('User Id not found')
    }
    console.log('User by id: ', user)
}).catch((error) => console.log(error))