const expect = require('expect')
const request = require('supertest')
const {ObjectID} = require('mongodb')

const {app} = require('./../server')
const {Todo} = require('./../models/todo')
const {User} = require('./../models/user')
const {todos, populateTodos, users, populateUsers} = require('./seed/seed')

beforeEach(populateTodos)
beforeEach(populateUsers)

describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        var text = 'Test todo text'

        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text)
            })
            .end((error, response) => {
                if (error) {
                    return done(error)
                }
                Todo.find({text}).then((todos) => {
                    expect(todos.length).toBe(1)
                    expect(todos[0].text).toBe(text)
                    done()
                }).catch((error) => done(error))
            })
    })

    it('should not create todo with invalid body data', (done) => {
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((error, response) => {
                if (error) {
                    return done(error)
                }
                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2)
                    done()
                }).catch((error) => done(error))
            })
    })
})

describe('GET /todos', () => {
    it('should get all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2)
            })
            .end(done)
    })
})

describe('GET /todos/:id', () => {
    it('should return a todo doc', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text)
            })
            .end(done)
    })

    it('should return 404 if todo not found', (done) => {
        var id = new ObjectID()

        request(app)
            .get(`/todos/${id}`)
            .expect(404)
            .end(done)
    })

    it('should return 404 for non-object ids', (done) => {
        var id = 123

        request(app)
            .get(`/todos/${id}`)
            .expect(404)
            .end(done)
    })
})

describe('DELETE /todos/:id', () => {
    it('should remove a todo', (done) => {
        const hexId = todos[1]._id.toHexString()

        request(app)
            .delete(`/todos/${hexId}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(hexId)
            })
            .end((error, res) => {
                if (error) {
                    return done(error)
                }

                Todo.findById(hexId).then((todo) => {
                    expect(todo).toBeNull()
                    done()
                }).catch((error) => done(error))
            })
    })

    it('should return 404 if todo not found', (done) => {
        const id = new ObjectID()

        request(app)
            .delete(`/todos/${id}`)
            .expect(404)
            .end(done)
    })

    it('should return 404 if object id is invalid', (done) => {
        const id = 1234

        request(app)
            .delete(`/todos/${id}`)
            .expect(404)
            .end(done)
    })
})

describe('PATCH /todos/:id', () => {
    it('should update the todo', (done) => {
        const id = todos[0]._id.toHexString()
        const updatedTodo = {
            text: 'something from test case',
            completed: true
        }

        request(app)
            .patch(`/todos/${id}`)
            .send(updatedTodo)
            .expect(200)
            .expect(res => {
                expect(res.body.todo.text).toEqual(updatedTodo.text)
                expect(res.body.todo.completed).toBeTruthy()
                expect(typeof res.body.todo.completedAt).toBe('number')
            })
            .end(done)
    })

    it('should clear completedAt when todo is not completed', (done) => {
        const id = todos[1]._id.toHexString()
        const updatedTodo = {
            text: 'something else from test case',
            completed: false
        }

        request(app)
            .patch(`/todos/${id}`)
            .send(updatedTodo)
            .expect(200)
            .expect(res => {
                expect(res.body.todo.text).toEqual(updatedTodo.text)
                expect(res.body.todo.completed).toBeFalsy()
                expect(res.body.todo.completedAt).toBeNull()
            })
            .end(done)
    })
})

describe('GET /users/me', () => {
    it('should return user if authenticated', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toHexString())
                expect(res.body.email).toBe(users[0].email)
            })
            .end(done)
    })

    it('should return 401 if not authenticated', (done) => {
        request(app)
            .get('/users/me')
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({})
            })
            .end(done)
    })
})

describe('POST /users', () => {
    it('should create a user', (done) => {
        const user = {
            email: 'example@example.com',
            password: '123mnb!'
        }

        request(app)
            .post('/users')
            .send(user)
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toExist
                expect(res.body._id).toExist
                expect(res.body.email).toBe(user.email)
            })
            .end((error) => {
                if (error) {
                    return done(error)
                }

                User.findOne({'email': user.email}).then((usr) => {
                    expect(usr).toExist
                    expect(usr.password).not.toEqual(user.password)
                    done()
                })
            })
    })

    it('should return validation errors if request invalid', (done) => {
        const invalidMail = 'dasdfasdfa'

        request(app)
            .post('/users')
            .send({invalidMail})
            .expect(400)
            .end(done)
    })

    it('should not create user if email in use', (done) => {
        request(app)
            .post('/users')
            .send({
                email: users[0].email,
                password: 'Password123!'
            })
            .expect(400)
            .end(done)
    })
})