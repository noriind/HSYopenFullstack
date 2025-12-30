import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password
      })

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      console.log('Incorrect credentials.')
    }
  }

  const loginForm = () => (
    <div>
      <h2> Log in with your credentials </h2>
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
      <p>
        {user.name} is logged in currently.
      </p>
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