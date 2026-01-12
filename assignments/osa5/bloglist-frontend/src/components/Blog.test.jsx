import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import { vi } from 'vitest'

describe('<Blog />', () => {
  const blog = {
    title: 'Testing React components',
    author: 'Test Author',
    url: 'http://testurl.com',
    likes: 5,
    user: {
      username: 'testuser',
      name: 'Test User'
    }
  }

  const mockUpdateBlog = () => {}
  const mockRemoveBlog = () => {}
  const mockUser = {
    username: 'testuser',
    name: 'Test User'
  }

  test('renders title and author', () => {
    render(
      <Blog 
        blog={blog} 
        updateBlog={mockUpdateBlog}
        removeBlog={mockRemoveBlog}
        user={mockUser}
      />
    )

    const element = screen.getByText('Testing React components Test Author')
    expect(element).toBeDefined()
  })

  test('does not render url or likes by default', () => {
    render(
      <Blog 
        blog={blog} 
        updateBlog={mockUpdateBlog}
        removeBlog={mockRemoveBlog}
        user={mockUser}
      />
    )

    const detailsDiv = screen.getByTestId('blogDetails')
    expect(detailsDiv).toHaveStyle('display: none')
  })

  test('url and likes are shown when view button is clicked', async () => {
    const user = userEvent.setup()
  
    render(
      <Blog 
        blog={blog} 
        updateBlog={mockUpdateBlog}
        removeBlog={mockRemoveBlog}
        user={mockUser}
      />
    )
  
    const viewButton = screen.getByText('view')
    await user.click(viewButton)
  
    const detailsDiv = screen.getByTestId('blogDetails')
    expect(detailsDiv).not.toHaveStyle('display: none')
    expect(detailsDiv).toHaveTextContent('http://testurl.com')
    expect(detailsDiv).toHaveTextContent('likes 5')
    expect(detailsDiv).toHaveTextContent('Test User')
  })


  test('clicking like button twice calls event handler twice', async () => {
    const user = userEvent.setup()
    const mockHandler = vi.fn()

    render(
      <Blog 
        blog={blog} 
        updateBlog={mockHandler}
        removeBlog={mockRemoveBlog}
        user={mockUser}
      />
    )
    const viewButton = screen.getByText('view')
    await user.click(viewButton)

    const likeButton = screen.getByText('like')

    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockHandler).toHaveBeenCalledTimes(2)
  })
})