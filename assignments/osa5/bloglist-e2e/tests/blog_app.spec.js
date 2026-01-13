const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /log in/i })).toBeVisible()
    await expect(page.getByRole('textbox').first()).toBeVisible()
    await expect(page.getByRole('button', { name: /login/i })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByRole('textbox').first().fill('mluukkai')
      await page.getByRole('textbox').last().fill('salainen')
      await page.getByRole('button', { name: /login/i }).click()

      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByRole('textbox').first().fill('mluukkai')
      await page.getByRole('textbox').last().fill('wrong')
      await page.getByRole('button', { name: /login/i }).click()

      await expect(page.getByText(/wrong/i)).toBeVisible()
      await expect(page.getByText('Matti Luukkainen logged in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.getByRole('textbox').first().fill('mluukkai')
      await page.getByRole('textbox').last().fill('salainen')
      await page.getByRole('button', { name: /login/i }).click()
      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })

    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: /create a new blog/i }).click()
      
      await page.getByPlaceholder('title').fill('Test Blog Title')
      await page.getByPlaceholder('author').fill('Test Author')
      await page.getByPlaceholder('url').fill('http://testurl.com')
      
      await page.getByRole('button', { name: /create/i }).click()

      await expect(page.getByText('Test Blog Title Test Author')).toBeVisible()
    })

    describe('and a blog exists', () => {
      beforeEach(async ({ page }) => {
        await page.getByRole('button', { name: /create a new blog/i }).click()
        await page.getByPlaceholder('title').fill('First Blog')
        await page.getByPlaceholder('author').fill('Author')
        await page.getByPlaceholder('url').fill('http://test.com')
        await page.getByRole('button', { name: /create/i }).click()
        await expect(page.getByText('First Blog Author')).toBeVisible()
      })

      test('a blog can be liked', async ({ page }) => {
        await page.getByRole('button', { name: 'view' }).click()
        
        await expect(page.getByText('likes 0')).toBeVisible()
        
        await page.getByRole('button', { name: 'like' }).click()
        
        await expect(page.getByText('likes 1')).toBeVisible()
      })

      test('user who created blog can delete it', async ({ page }) => {
        await page.getByRole('button', { name: 'view' }).click()
        
        await expect(page.getByRole('button', { name: 'remove' })).toBeVisible()
        
        page.on('dialog', dialog => dialog.accept())
        
        await page.getByRole('button', { name: 'remove' }).click()
        
        await expect(page.getByText('First Blog Author')).not.toBeVisible()
      })

      test('only creator sees delete button', async ({ page, request }) => {
        await page.getByRole('button', { name: 'log out' }).click()

        await request.post('http://localhost:3003/api/users', {
          data: {
            name: 'Another User',
            username: 'another',
            password: 'password'
          }
        })

        await page.getByRole('textbox').first().fill('another')
        await page.getByRole('textbox').last().fill('password')
        await page.getByRole('button', { name: /login/i }).click()

        await page.getByRole('button', { name: 'view' }).click()

        await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible()
      })
    })

    describe('and multiple blogs exist', () => {
      beforeEach(async ({ page }) => {
        await page.getByRole('button', { name: /create a new blog/i }).click()
        await page.getByPlaceholder('title').fill('First Blog')
        await page.getByPlaceholder('author').fill('Author 1')
        await page.getByPlaceholder('url').fill('http://test1.com')
        await page.getByRole('button', { name: /create/i }).click()
        await expect(page.getByText('First Blog Author 1')).toBeVisible()

        await page.getByRole('button', { name: /create a new blog/i }).click()
        await page.getByPlaceholder('title').fill('Second Blog')
        await page.getByPlaceholder('author').fill('Author 2')
        await page.getByPlaceholder('url').fill('http://test2.com')
        await page.getByRole('button', { name: /create/i }).click()
        await expect(page.getByText('Second Blog Author 2')).toBeVisible()

        await page.getByRole('button', { name: /create a new blog/i }).click()
        await page.getByPlaceholder('title').fill('Third Blog')
        await page.getByPlaceholder('author').fill('Author 3')
        await page.getByPlaceholder('url').fill('http://test3.com')
        await page.getByRole('button', { name: /create/i }).click()
        await expect(page.getByText('Third Blog Author 3')).toBeVisible()
      })

      test('blogs are ordered by likes', async ({ page }) => {
        const secondBlog = page.locator('text=Second Blog Author 2').locator('..')
        await secondBlog.getByRole('button', { name: 'view' }).click()
        
        for (let i = 0; i < 3; i++) {
          await secondBlog.getByRole('button', { name: 'like' }).click()
          await expect(secondBlog.getByText(`likes ${i + 1}`)).toBeVisible()
        }
        
        await secondBlog.getByRole('button', { name: 'hide' }).click()

        const thirdBlog = page.locator('text=Third Blog Author 3').locator('..')
        await thirdBlog.getByRole('button', { name: 'view' }).click()
        
        for (let i = 0; i < 5; i++) {
          await thirdBlog.getByRole('button', { name: 'like' }).click()
          await expect(thirdBlog.getByText(`likes ${i + 1}`)).toBeVisible()
        }
        
        await thirdBlog.getByRole('button', { name: 'hide' }).click()

        const firstBlog = page.locator('text=First Blog Author 1').locator('..')
        await firstBlog.getByRole('button', { name: 'view' }).click()
        await firstBlog.getByRole('button', { name: 'like' }).click()
        await expect(firstBlog.getByText('likes 1')).toBeVisible()

        const blogs = await page.locator('div').filter({ hasText: /Blog Author/ }).allTextContents()
        
        expect(blogs[0]).toContain('Third Blog')  
        expect(blogs[1]).toContain('Second Blog') 
        expect(blogs[2]).toContain('First Blog')  
      })
    })
  })
})