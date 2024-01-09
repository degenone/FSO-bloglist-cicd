import { useState, useEffect, useRef } from 'react';
import Blog from './components/Blog';
import blogService from './services/blogs';
import loginService from './services/login';
import LoginForm from './components/LoginForm';
import BlogForm from './components/BlogForm';
import Togglable from './components/Togglable';

const App = () => {
    const [blogs, setBlogs] = useState([]);
    const [user, setUser] = useState(null);
    const [notification, setNotification] = useState(null);
    const blogFormRef = useRef(null);

    useEffect(() => {
        const fetchBlogs = async () => {
            const resp = await blogService.getAll();
            resp.sort((a, b) => {
                if (a.likes > b.likes) return -1;
                else if (a.likes < b.likes) return 1;
                return 0;
            });
            setBlogs(resp);
        };
        fetchBlogs();
    }, []);

    useEffect(() => {
        const userJSON = window.localStorage.getItem('loggedInBloglistUser');
        if (userJSON) {
            const user = JSON.parse(userJSON);
            setUser(user);
            blogService.setToken(user.token);
        }
    }, []);

    const addBlog = async (blogOjb) => {
        try {
            const blog = await blogService.create(blogOjb);
            blog.user = { name: user.name, username: user.username };
            setBlogs((blogs) => [...blogs, blog]);
            showNotification(
                `Added a new blog item: ${blog.title} by ${blog.author}`
            );
            blogFormRef.current.toggleVisibility();
            return true;
        } catch (error) {
            showNotification('error creating a blog list item', true);
        }
        return false;
    };

    const likeBlog = async (id, blogOjb) => {
        try {
            const blog = await blogService.update(id, blogOjb);
            setBlogs(
                blogs.map((b) =>
                    b.id === blog.id ? { ...b, likes: blog.likes } : b
                )
            );
        } catch (error) {
            showNotification('error liking blog item', true);
        }
    };

    const deleteBlog = async (id) => {
        const blog = blogs.find((b) => b.id === id);
        if (
            window.confirm(
                `Are you sure you want to remove "${blog.title}" by ${blog.author}`
            )
        ) {
            try {
                await blogService.deleteBlog(id);
                setBlogs(blogs.filter((b) => b.id !== id));
            } catch (error) {
                showNotification('error deleting blog list item', true);
            }
        }
    };

    const handleLogin = async (userObj) => {
        try {
            const user = await loginService.login(userObj);
            window.localStorage.setItem(
                'loggedInBloglistUser',
                JSON.stringify(user)
            );
            setUser(user);
            blogService.setToken(user.token);
            return true;
        } catch (error) {
            showNotification(
                'Something went wrong... Check your credentials.',
                true
            );
        }
        return false;
    };

    const handleLogout = () => {
        setUser(null);
        window.localStorage.removeItem('loggedInBloglistUser');
    };

    const showNotification = (message, isError = false) => {
        setNotification({
            message,
            isError,
        });
        setTimeout(() => {
            setNotification(null);
        }, 3500);
    };

    return (
        <div>
            {notification !== null && (
                <div
                    className={`notification${
                        notification.isError ? ' error' : ''
                    }`}>
                    {notification.message}
                </div>
            )}
            {user === null ? (
                <LoginForm handleLogin={handleLogin} />
            ) : (
                <div>
                    <div className='titlePanel'>
                        <h2>My Blogs List</h2>
                        <p>User: {user.name}</p>
                        <button
                            id='btn-logout'
                            type='button'
                            onClick={handleLogout}>
                            Log Out
                        </button>
                    </div>
                    <Togglable buttonLabel='Create New Item' ref={blogFormRef}>
                        <BlogForm addBlog={addBlog} />
                    </Togglable>
                    {blogs.map((blog) => (
                        <Blog
                            key={blog.id}
                            blog={blog}
                            likeBlog={likeBlog}
                            deleteBlog={deleteBlog}
                            username={user.username}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default App;
