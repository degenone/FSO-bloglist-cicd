import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Blog from './Blog';

describe('<Blog/>', () => {
    const blog = {
        title: 'Test Blog',
        author: 'Jane Doe',
        url: 'https://coolblogs.dev/101',
        likes: 5,
        user: {
            username: 'testuser',
            name: 'Test User',
        },
    };

    test('should render blog title and author only', () => {
        const { container } = render(
            <Blog
                blog={blog}
                likeBlog={jest.fn()}
                deleteBlog={jest.fn()}
                username={'testuser'}
            />
        );
        screen.getByText(blog.title);
        screen.getByText(blog.author);
        const details = container.querySelector('.blog-details');
        expect(details.classList).toContain('hidden');
    });

    test('should show blog details after button click', async () => {
        const { container } = render(
            <Blog
                blog={blog}
                likeBlog={jest.fn()}
                deleteBlog={jest.fn()}
                username={'testuser'}
            />
        );
        const btn = container.querySelector('.btn-toggle');
        const user = userEvent.setup();
        await user.click(btn);
        const details = container.querySelector('.blog-details');
        expect(details.classList).not.toContain('hidden');
        screen.getByText(blog.url);
        screen.getByText(`Likes: ${blog.likes}`);
    });

    test('should click like button twice', async () => {
        const likeHandler = jest.fn();
        const { container } = render(
            <Blog
                blog={blog}
                likeBlog={likeHandler}
                deleteBlog={jest.fn()}
                username={'testuser'}
            />
        );
        const btn = container.querySelector('.btn-toggle');
        const user = userEvent.setup();
        await user.click(btn);
        const likeBtn = container.querySelector('.btn-like');
        await user.click(likeBtn);
        await user.click(likeBtn);
        expect(likeHandler.mock.calls).toHaveLength(2);
    });
});
