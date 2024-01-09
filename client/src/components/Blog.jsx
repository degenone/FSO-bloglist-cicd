import { useState } from 'react';
import PropTypes from 'prop-types';

const Blog = (props) => {
    const { blog, likeBlog, deleteBlog, username } = props;
    const [visible, setVisible] = useState(false);
    const blogStyle = {
        paddingTop: '0.4rem',
        paddingBottom: '0.4rem',
        paddingLeft: '0.5rem',
        border: 'dashed',
        borderWidth: '2px',
        marginBottom: 5,
    };
    const handleLike = async () => {
        await likeBlog(blog.id, {
            likes: blog.likes + 1,
        });
    };
    const handleDelete = async () => {
        await deleteBlog(blog.id);
    };
    return (
        <div style={blogStyle}>
            <div className='blog-header'>
                <strong>{blog.title}</strong> by <i>{blog.author}</i>{' '}
                <button
                    className='btn-toggle'
                    type='button'
                    onClick={() => setVisible(!visible)}>
                    {visible ? 'Hide' : 'View'}
                </button>
            </div>
            <div className={`blog-details${visible ? '' : ' hidden'}`}>
                <p className='blog-url'>
                    <a href={blog.url} target='_blank' rel='noreferrer'>
                        {blog.url}
                    </a>
                </p>
                <p className='blog-likes'>
                    Likes: {blog.likes}{' '}
                    <button
                        className='btn-like'
                        type='button'
                        onClick={handleLike}>
                        Like
                    </button>
                </p>
                <p>{blog.user.name}</p>
                {blog.user.username === username && (
                    <button
                        className='btn-delete'
                        type='button'
                        onClick={handleDelete}>
                        Delete This
                    </button>
                )}
            </div>
        </div>
    );
};
Blog.propTypes = {
    blog: PropTypes.object.isRequired,
    likeBlog: PropTypes.func.isRequired,
    deleteBlog: PropTypes.func.isRequired,
    username: PropTypes.string.isRequired,
};

export default Blog;
