import { useState } from "react";
import styles from '../styles/BlogForm.module.css'

const BlogForm = ({ createBlog }) => {
    const [title, setTitle] = useState('')
    const [author,setAuthor] = useState('')
    const [url, setUrl] = useState('')

    const addBlog = (event) => {
        event.preventDefault()
        createBlog({
            title: title,
            author: author,
            url: url
        })

        setTitle('')
        setAuthor('')
        setUrl('')
    }

    return (
        <div className={styles.formContainer}>
            <h2 className={styles.formTitle}>Create a new Blog</h2>
            <form onSubmit={addBlog}>
                <div className={styles.formGroup}>
                    <label className={styles.label}>
                        Title:
                    </label>
                    <input className={styles.input}
                        type='text'
                        value={title}
                        name='Title'
                        onChange={({target}) => setTitle(target.value)}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>
                        Author:
                    </label>
                    <input className={styles.input}
                    type='text'
                    value={author}
                    name='Author'
                    onChange={({target}) => setAuthor(target.value)}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>
                        Url:
                    </label>
                    <input className={styles.input}
                        type="text"
                        value={url}
                        name="Url"
                        onChange={({target}) => setUrl(target.value)}
                    />
                </div>
                <button className={styles.submitButton} type='submit'>Create Blog</button>
            </form>
        </div>
    )
}

export default BlogForm