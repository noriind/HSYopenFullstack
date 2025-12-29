const jwt = require('jsonwebtoken')
const config = require('../utils/config')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
//4.17
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  .find({})
  .populate('user', { username: 1, name: 1})
  response.json(blogs)
})

//4.12
blogsRouter.post('/', async (request, response, next) => {
  //4.17
  const body = request.body

  try {
    const decodedToken = jwt.verify(request.token, config.SECRET)

    if (!decodedToken.id) {
      return response.status(401).json({error:'token invalid'})
    }

    //const users = await User.find({})
    const user = await User.findById(decodedToken.id)

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
      user: user._id
    })

    const savedBlog = await blog.save()
    user.blogs= user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)
  } catch (exception) {
    next(exception)
  }
})

//4.13
blogsRouter.delete('/:id', async (request, response, next) => {
  try {
    //step 9
    const decodedToken = jwt.verify(request.token, config.SECRET)

    if (!decodedToken.id)
    {
      return response.status(401).json({error: 'token invalid'})
    }

    const blog = await Blog.findById(request.params.id)

    if (!blog){
      return response.status(404).json({error:'blog not found'})
    }

    if (blog.user.toString() === decodedToken.id.toString()){
      await Blog.findByIdAndDelete(request.params.id)
      response.status(204).end()
    } else {
      return response.status(403).json({error:'permission denied'})
    }
    //await Blog.findByIdAndDelete(request.params.id)
    //response.status(204).end()
  } catch (exception) {
    next(exception)
  }
})

//4.14
blogsRouter.put('/:id', async (request, response, next) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  }

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      request.params.id,
      blog,
      { new: true, runValidators: true }
    )
    response.json(updatedBlog)
  } catch (exception) {
    next(exception)
  }
})

module.exports = blogsRouter