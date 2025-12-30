const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')

const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')

describe('when there is initially some blogs saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })
    await user.save()

    const blogs = helper.initialBlogs.map(blog => ({
      ...blog,
      user: user._id
    }))

    await Blog.insertMany(blogs)
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('a specific blog is within the returned blogs', async () => {
    const response = await api.get('/api/blogs')
    const titles = response.body.map(r => r.title)
    assert(titles.includes('React patterns'))
  })

  test('blog posts have id property instead of _id', async () => {
    const response = await api.get('/api/blogs')
    const blogs = response.body
    blogs.forEach(blog => {
      assert(blog.id)
      assert.strictEqual(blog._id, undefined)
    })
  })
})

describe('addition of a new blog', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User ({ username: 'root', passwordHash })
    await user.save()
  })

  test('succeeds with valid data and token', async () => {
    const loginResponse = await api
      .post('/api/login')
      .send({ username: 'root', password: 'sekret' })

    const token = loginResponse.body.token

    const newBlog = {
      title: 'Test Blog',
      author: 'Test Author',
      url: 'http://testblog.com',
      likes: 10,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, 1)

    const titles = blogsAtEnd.map((blog) => blog.title)
    assert(titles.includes('Test Blog'))
  })

  test('fails with status 401 if token is not provided', async () => {
    const newBlog = {
      title: 'Test Blog',
      author: 'Test Author',
      url: 'https://testblog.com',
      likes: 10
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, 0)
  })

  //4.11
  test('if likes is missing, it defaults to 0', async () => {

    const loginResponse = await api
      .post('/api/login')
      .send({ username: 'root', password: 'sekret' })

    const token = loginResponse.body.token

    const newBlog = {
      title: 'Blog without likes :(',
      author: 'Test Author',
      url: 'http://example.com',
    }

    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.likes, 0)
  })

  test('fails with status 400 if title is missing', async () => {

    const loginResponse = await api
      .post('/api/login')
      .send({ username: 'root', password: 'sekret' })

    const token = loginResponse.body.token

    const newBlog = {
      author: 'Test Author',
      url: 'http://example.com',
      likes: 5,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}` )
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, 0)
  })

  test('fails with status 400 if url is missing', async () => {

    const loginResponse = await api
      .post('/api/login')
      .send({ username:'root', password: 'sekret'
      })

    const token = loginResponse.body.token

    const newBlog = {
      title: 'Test Blog',
      author: 'Test Author',
      likes: 5,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, 0)
  })
})

//4.13
describe('deletion of a blog', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret' , 10)
    const user = new User({ username: 'root', passwordHash })
    await user.save()

    const blog = new Blog({
      title: 'test blog',
      author: 'Test author',
      url: 'http://test.com',
      likes: 5,
      user: user._id

    })
    await blog.save()
  })



  test('succeeds with status 204 if id is valid and user is creator', async () => {

    const loginResponse = await api
      .post('/api/login')
      .send ({ username:'root', password:'sekret' })

    const token = loginResponse.body.token

    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, 0)

    const titles = blogsAtEnd.map(blog => blog.title)
    assert(!titles.includes(blogToDelete.title))
  })

  test('fails with status 401 if token is not provided', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(401)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
  })
})

describe('updating a blog', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username:'root', passwordHash })
    await user.save()

    const blog = new Blog({
      title: 'Test blog',
      author: 'Test author',
      url: 'http://test.com',
      likes: 5,
      user: user._id
    })
    await blog.save()

  })

  test('succeeds with valid data', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const updatedData = {
      title: blogToUpdate.title,
      author: blogToUpdate.author,
      url: blogToUpdate.url,
      likes: blogToUpdate.likes + 10
    }

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedData)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    const updatedBlog = blogsAtEnd.find(blog => blog.id === blogToUpdate.id)

    assert.strictEqual(updatedBlog.likes, blogToUpdate.likes + 10)
  })

  test('fails with status 400 if id is invalid', async () => {
    const invalidId = '5a3d5da59070081a82a3445'

    const updatedData = {
      title: 'Test',
      author: 'Test',
      url: 'http://test.com',
      likes: 10
    }

    await api
      .put(`/api/blogs/${invalidId}`)
      .send(updatedData)
      .expect(400)
  })

  test('likes can be updated independently', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const updatedData = {
      likes: 100
    }

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedData)
      .expect(200)

    const blogsAtEnd = await helper.blogsInDb()
    const updatedBlog = blogsAtEnd.find(blog => blog.id === blogToUpdate.id)

    assert.strictEqual(updatedBlog.likes, 100)
  })
})

after(async () => {
  await mongoose.connection.close()
})
