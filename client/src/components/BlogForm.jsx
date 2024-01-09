import { useState } from 'react';
import PropTypes from 'prop-types';

const BlogForm = (props) => {
    const { addBlog } = props;
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [url, setUrl] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const blog = {
            title,
            author,
            url,
        };
        if (addBlog(blog)) {
            setTitle('');
            setAuthor('');
            setUrl('');
        }
    };
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <fieldset>
                    <legend>Create a new Blog List Item</legend>
                    <div className='formGroup'>
                        <label htmlFor='title'>Title:</label>
                        <input
                            type='text'
                            name='title'
                            id='title'
                            value={title}
                            placeholder='Blog title...'
                            onChange={({ target }) => setTitle(target.value)}
                            required
                        />
                    </div>
                    <div className='formGroup'>
                        <label htmlFor='author'>Author:</label>
                        <input
                            type='text'
                            name='author'
                            id='author'
                            value={author}
                            placeholder='Blog author...'
                            onChange={({ target }) => setAuthor(target.value)}
                        />
                    </div>
                    <div className='formGroup'>
                        <label htmlFor='url'>Url:</label>
                        <input
                            type='text'
                            name='url'
                            id='url'
                            value={url}
                            placeholder='Blog url...'
                            onChange={({ target }) => setUrl(target.value)}
                            required
                        />
                    </div>
                    <div>
                        <input id='btn-create' type='submit' value='Create' />
                    </div>
                </fieldset>
            </form>
        </div>
    );
};
BlogForm.propTypes = { addBlog: PropTypes.func.isRequired };

export default BlogForm;
