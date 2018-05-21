require('./config/config')

const _ = require('lodash')
const express = require('express')
const bodyParser = require('body-parser')
const {ObjectID} = require('mongodb')

const mongoose = require('./db/mongoose')
const {Todo} = require('./models/todo')
const {User} = require('./models/user')
const {authenticate} = require('./middleware/authenticate')

const app = express()
const port = process.env.PORT

app.use(bodyParser.json())

app.post('/todos', (req, res) => {
    const todo = new Todo({
        text: req.body.text
    })

    todo.save().then((todo) => {
        res.send(todo)
    }, (error) => {
        res.status(400).send(error)
    })
})

app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({todos})
    }, (error) => {
        res.status(400).send(error)
    })
})

app.get('/todos/:id', (req, res) => {
    const id = req.params.id

    if (!ObjectID.isValid(id)) {
        return res.status(404).send()
    }

    Todo.findById(id).then((todo) => {
        if (!todo) {
            return res.status(404).send()
        }
        res.send({todo})
    }).catch((error) => {
        res.status(400).send()
    })
})

app.delete('/todos/:id', (req, res) => {
    const id = req.params.id

    if (!ObjectID.isValid(id)) {
        return res.status(404).send()
    }

    Todo.findByIdAndRemove(id).then((todo) => {
        if (!todo) {
            return res.status(404).send()
        }
        res.send({todo})
        }).catch((todo) => {
            res.status(400).send()
    })
})

app.patch('/todos/:id', (req, res) => {
    const id = req.params.id
    const body = _.pick(req.body, ['text', 'completed'])

    if (!ObjectID.isValid(id)) {
        return res.status(404).send()
    }

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime()
    } else {
        body.completed = false
        body.completedAt = null
    }

    Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
        if (!todo) {
            res.status(404).send()
        }
        res.send({todo})
    }).catch((error) => {
        res.status(400).send()
    })
})

app.post('/users', async (req, res) => {
    const body = _.pick(req.body, ['email', 'password'])
    const user = new User(body)

    try {
        await user.save()
        const token = user.generateAuthToken()
        res.header('x-auth', token).send(user)
    } catch (error) {
        res.status(400).send(error)
    }
})

app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user)
})

app.post('/users/login', (req, res) => {
    const body = _.pick(req.body, ['email', 'password'])

    User.findByCredentials(body.email, body.password).then((user) => {
        res.send(user)
    }).catch(error => {
        res.status(400).send()
    })
})

app.listen(port, () => {
    console.log(`Started server on port ${port}`)
})

module.exports = {app}