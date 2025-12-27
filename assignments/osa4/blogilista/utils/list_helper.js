const dummy = (blogs) => {
    return 1
  }
  
  const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0)
  }
  
  const favoriteBlog = (blogs) => {
    if (blogs.length === 0) {
      return null
    }
  
    const favorite = blogs.reduce((prev, current) => {
      return (current.likes > prev.likes) ? current : prev
    })
  
    return {
      title: favorite.title,
      author: favorite.author,
      likes: favorite.likes
    }
  }
  
  const mostBlogs = (blogs) => {
    if (blogs.length === 0) {
      return null
    }
  
    const blogCounts = {}
    
    blogs.forEach(blog => {
      blogCounts[blog.author] = (blogCounts[blog.author] || 0) + 1
    })
  
    const authors = Object.keys(blogCounts)
    const topAuthor = authors.reduce((prev, current) => {
      return blogCounts[current] > blogCounts[prev] ? current : prev
    })
  
    return {
      author: topAuthor,
      blogs: blogCounts[topAuthor]
    }
  }
  
  const mostLikes = (blogs) => {
    if (blogs.length === 0) {
      return null
    }
  
    //tykkäysten yhteismäärä per kirjoittaja
    const likesByAuthor = {}
    
    blogs.forEach(blog => {
      likesByAuthor[blog.author] = (likesByAuthor[blog.author] || 0) + blog.likes
    })
  
    //kirjoittaja jonka blogeilla eniten tykkäyksiä
    const authors = Object.keys(likesByAuthor)
    const topAuthor = authors.reduce((prev, current) => {
      return likesByAuthor[current] > likesByAuthor[prev] ? current : prev
    })
  
    return {
      author: topAuthor,
      likes: likesByAuthor[topAuthor]
    }
  }
  
  module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
  }