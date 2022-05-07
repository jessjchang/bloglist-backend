const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
  },
  {
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
  },
]

const initialUser = {
  username: 'root',
  password: 'sekret',
}

const nonExistingId = async () => {
  const blog = new Blog({
    title: 'willremovethissoon',
    author: 'random author',
    url: 'http://randomurl.com'
  })
  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

const loginToken = async () => {
  const login = await api
    .post('/api/login')
    .send(initialUser)

  return login._body.token
}

const testBlogAddition = async () => {
  const token = await loginToken()

  const newBlog =   {
    title: "Test",
    author: "Test",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Test.html",
    likes: 3,
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `bearer ${token}`)
    .send(newBlog)
}

module.exports = {
  initialBlogs,
  initialUser,
  blogsInDb,
  nonExistingId,
  usersInDb,
  loginToken,
  testBlogAddition
}