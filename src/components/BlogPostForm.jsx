import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../styles/BlogPostForm.css'; // Update the import path

function BlogPostForm({ onSubmit }) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState('');
    const [images, setImages] = useState([]);

    const handleImageChange = (e) => {
        setImages([...e.target.files]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newPost = {
            title,
            content,
            tags: tags.split(',').map(tag => tag.trim()),
            images: Array.from(images).map(image => URL.createObjectURL(image)),
        };
        onSubmit(newPost);
        setTitle('');
        setContent('');
        setTags('');
        setImages([]);
    };

    return (
        <div>

            <form className="blog-post-form" onSubmit={handleSubmit}>
                <h2>Add New Post</h2>

                <div>
                    <label>Title:</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>

                <div className='tag-editor'>
                    <label>Tags (comma separated):</label>
                    <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} />
                </div>

                <div className='quill-editor'>
                    <label>Content:</label>
                    <ReactQuill className="quill-editor" value={content} onChange={setContent} required />
                </div>

                <div>
                    <label>Upload Images:</label>
                    <input type="file" multiple onChange={handleImageChange} />
                </div>

                <button type="submit">Submit</button>
            </form>
        </div>
    );
}

export default BlogPostForm;
