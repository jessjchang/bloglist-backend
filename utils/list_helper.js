const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => {
    return sum + blog.likes
  }, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return {}
  }

  blogs = blogs.map(({ title, author, likes }) => {
    return { title, author, likes }
  })
  let mostLikes = blogs[0].likes
  let faveBlog = blogs[0]

  blogs.forEach(blog => {
    if (blog.likes > mostLikes) {
      mostLikes = blog.likes
      faveBlog = blog
    }
  })

  return faveBlog
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return {}
  }

  let groupedByAuthor = _.groupBy(blogs, 'author')
  let counts = _.mapValues(groupedByAuthor, 'length')
  let topBlogger = Object.keys(counts).reduce((topAuthor, currentAuthor) => {
    return counts[currentAuthor] > counts[topAuthor] ? currentAuthor : topAuthor
  })

  return {
    author: topBlogger,
    blogs: counts[topBlogger]
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return {}
  }

  let groupedByAuthor = _.groupBy(blogs, 'author')
  let likes = _.mapValues(groupedByAuthor, arr => arr.reduce((sum, currBlog) => {
    return sum + currBlog.likes
  }, 0))
  let topBlogger = Object.keys(likes).reduce((topAuthor, currentAuthor) => {
    return likes[currentAuthor] > likes[topAuthor] ? currentAuthor : topAuthor
  })

  return {
    author: topBlogger,
    likes: likes[topBlogger]
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}