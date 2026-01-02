import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)

  const blogFormRef = useRef()

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
  
  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility()
    try{
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))
      showNotification(
        `A new blog ${returnedBlog.title} by ${returnedBlog.author} added`, 'success'
      )
    } catch (exception) {
      showNotification('Failed to create blog', 'error')
    }
  }

  const updateBlog = async (id, blogObject) => {
    try {
      const returnedBlog = await blogService.update(id, blogObject)
      setBlogs(blogs.map(blog => 
        blog.id !== id 
          ? blog 
          : { ...returnedBlog, user: blog.user } 
      ))
    } catch (exception) {
      showNotification('Failed to update blog', 'error')
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


  const blogList = () => (
      <div>
          <h2> Blogs </h2>
          <Notification message={message} />
          <p>
              {user.name} is logged in currently.
              <button onClick={handleLogout}>Log out</button>
          </p>

          <Togglable buttonLabel="Create a new blog" ref={blogFormRef}>
              <BlogForm createBlog={addBlog} />
          </Togglable>

          {blogs.map((blog) => 
              <Blog 
              key={blog.id} 
              blog={blog}
              updateBlog={updateBlog} 
              />
          )}
      </div>
  );

  return (
    <div>
      {user === null ? loginForm() : blogList()}
    </div>
  )
}

export default App