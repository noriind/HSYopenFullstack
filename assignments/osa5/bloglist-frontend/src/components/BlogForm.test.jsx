import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import BlogForm from './BlogForm'

describe('<BlogForm />', () => {
  test('form calls onSubmit with correct details when a new blog is created', async () => {
    const user = userEvent.setup()
    const createBlog = vi.fn()

    render(<BlogForm createBlog={createBlog} />)

    // Etsi input-kentät
    const titleInput = screen.getByPlaceholderText('title')
    const authorInput = screen.getByPlaceholderText('author')
    const urlInput = screen.getByPlaceholderText('url')
    const submitButton = screen.getByText('Create Blog')

    // Täytä lomake
    await user.type(titleInput, 'Testing forms in React')
    await user.type(authorInput, 'Test Author')
    await user.type(urlInput, 'http://testurl.com')

    // Lähetä lomake
    await user.click(submitButton)

    // Tarkista että createBlog kutsuttiin kerran
    expect(createBlog).toHaveBeenCalledTimes(1)

    // Tarkista että createBlog kutsuttiin oikeilla tiedoilla
    expect(createBlog).toHaveBeenCalledWith({
      title: 'Testing forms in React',
      author: 'Test Author',
      url: 'http://testurl.com'
    })
  })
})