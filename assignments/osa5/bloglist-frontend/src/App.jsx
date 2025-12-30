import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [message, setMessage] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedinBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const showNotification = (text, type) => {
    setMessage({text, type})
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password
      })

      window.localStorage.setItem(
        'loggedinBlogAppUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      showNotification(`${user.name} Logged in!`, 'success')
    } catch (exception) {
      showNotification('Wrong username or password', 'error')
      console.log('Incorrect credentials.')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedinBlogAppUser')
    setUser(null)
    blogService.setToken(null)
    showNotification('Logged out', 'success')
  }
  
  const addBlog = async (event) => {
    event.preventDefault()

    try {
    const blogObject = {
      title: title,
      author: author,
      url: url
    }

    const returnedBlog = await blogService.create(blogObject)
    setBlogs(blogs.concat(returnedBlog))
    setTitle('')
    setAuthor('')
    setUrl('')
    showNotification(
      `New Blog added successfully title: ${returnedBlog.title} author: ${returnedBlog.author} url: ${returnedBlog.url}`, 'success'
    )
  } catch (exception) {
    showNotification('Blog creation failed', 'error') 
  }
  }

  const loginForm = () => (
    <div>
      <h2> Log in with your credentials </h2>
      <Notification message={message} />
        <form onSubmit={handleLogin}>
          <div>
            <label>
              username
              <input
              type='text'
              value={username}
              name='Username'
              onChange={({target}) => setUsername(target.value)}
              />
            </label>
          </div>
          <div>
            <label>
              password
              <input
              type='password'
              value={password}
              name='Password'
              onChange={({target}) => setPassword(target.value)}
              />
            </label>
          </div>
          <button type= "submit" >Login</button>
        </form>
    </div>
  )

  const blogForm = () => (
    <div>
      <h2>Create a new Blog</h2>
      <form onSubmit={addBlog}>
        <div>
          <label>
            Title:
            <input
              type="text"
              value={title}
              name="Title"
              onChange={({target}) => setTitle(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            Author:
            <input
              type="text"
              value={author}
              name="Author"
              onChange={({target}) => setAuthor(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            Url:
            <input
              type='text'
              value={url}
              name="Url"
              onChange = {({target}) => setUrl(target.value)}
            />
          </label>
        </div>
        <button type = 'submit'>Create new Blog</button>
      </form>
    </div>
  )

  const blogList = () => (
    <div>
      <h2> Blogs </h2>
      <Notification message={message} />
      <p>
        {user.name} is logged in currently.
        <button onClick={handleLogout}>Log out</button>
      </p>
      {blogForm()}
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )

  return (
    <div>
      {user === null ? loginForm() : blogList()}
    </div>
  )
}

export default App