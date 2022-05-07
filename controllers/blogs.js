const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 })

  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body
  if (!request.token) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const user = request.user

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id,
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  const returnedBlog = await Blog
    .findById(savedBlog._id.toString())
    .populate('user', { username: 1, name: 1 })

  response.status(201).json(returnedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  if (!request.token) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const user = request.user
  const blog = await Blog.findById(request.params.id)

  if (blog.user.toString() === user._id.toString()) {
    await blog.remove()
    response.status(204).end()
  } else {
    response.status(401).json({ error: 'only blog creator can delete blog' })
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
  }

  const updatedBlog = await Blog
    .findByIdAndUpdate(
      request.params.id,
      blog,
      { new: true, runValidators: true, context: 'query' }
    )
    .populate('user', { username: 1, name: 1 })

  response.json(updatedBlog)
})


module.exports = blogsRouter
