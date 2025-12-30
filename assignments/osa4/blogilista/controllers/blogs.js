const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
    .find({})
    .populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', middleware.userExtractor, async (request, response, next) => {
  const body = request.body

  try {
    const user = request.user

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

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response, next) => {
  try {
    const user = request.user

    const blog = await Blog.findById(request.params.id)

    if (!blog){
      return response.status(404).json({ error:'blog not found' })
    }

    if(!blog.user){
      return response.status(400).json({ error: 'blog has no user assigned' })
    }

    if (blog.user.toString() === user._id.toString()){
      await Blog.findByIdAndDelete(request.params.id)
      response.status(204).end()
    } else {
      return response.status(403).json({ error:'permission denied' })
    }
  } catch (exception) {
    next(exception)
  }
})

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