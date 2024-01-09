import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import LoginForm from '../components/LoginForm';

describe('<LoginForm/>', () => {
    test('should successfully call handler', async () => {
        const handler = jest.fn();
        const { container } = render(<LoginForm handleLogin={handler} />);
        screen.getByText('Log in to the Bloglist Application');
        const username = container.querySelector('#username');
        const user = userEvent.setup();
        await user.type(username, 'testusername');
        const password = container.querySelector('#password');
        await user.type(password, 'testpassword');
        await user.click(container.querySelector('#btn-login'));
        expect(handler.mock.calls).toHaveLength(1);
        expect(handler.mock.calls[0][0]).toEqual({
            username: 'testusername',
            password: 'testpassword',
        });
    });

    test('should not call handler with empty form', async () => {
        const handler = jest.fn();
        const { container } = render(<LoginForm handleLogin={handler} />);
        const user = userEvent.setup();
        await user.click(container.querySelector('#btn-login'));
        expect(handler.mock.calls).toHaveLength(0);
    });

    test('should not call handler with just username', async () => {
        const handler = jest.fn();
        const { container } = render(<LoginForm handleLogin={handler} />);
        const username = container.querySelector('#username');
        const user = userEvent.setup();
        await user.type(username, 'testusername');
        await user.click(container.querySelector('#btn-login'));
        expect(handler.mock.calls).toHaveLength(0);
    });

    test('should not call handler with just password', async () => {
        const handler = jest.fn();
        const { container } = render(<LoginForm handleLogin={handler} />);
        const user = userEvent.setup();
        const password = container.querySelector('#password');
        await user.type(password, 'testpassword');
        await user.click(container.querySelector('#btn-login'));
        expect(handler.mock.calls).toHaveLength(0);
    });
});
