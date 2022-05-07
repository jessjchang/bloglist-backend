const commentsRouter = require('express').Router()
const Blog = require('../models/blog')

commentsRouter.get('/:id/comments', async (request, response) => {
  const blog = await Blog.findById(request.params.id)

  response.json(blog.comments)
})

commentsRouter.post('/:id/comments', async (request, response) => {
  const originalBlog = await Blog.findById(request.params.id)

  const comment = request.body.comment
  const newComments = [...originalBlog.comments, comment]

  const updatedBlog = await Blog
    .findByIdAndUpdate(
      request.params.id,
      { comments: newComments },
      { new: true }
    )
    .populate('user', { username: 1, name: 1 })

  response.json(updatedBlog)
})

module.exports = commentsRouter
