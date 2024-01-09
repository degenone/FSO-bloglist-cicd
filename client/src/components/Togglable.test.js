import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import Togglable from '../components/Togglable';

describe('<Togglable/>', () => {
    let container;
    beforeEach(() => {
        container = render(
            <Togglable buttonLabel='Show Test'>My Test Content...</Togglable>
        ).container;
    });

    test('should be closed on render', () => {
        screen.getByText('Show Test');
        const result = container.querySelector('.togglable-content');
        expect(result.classList).toContain('hidden');
    });

    test('should show content on click', async () => {
        const user = userEvent.setup();
        await user.click(container.querySelector('.btn-show'));
        const content = container.querySelector('.togglable-content');
        expect(content.classList).not.toContain('hidden');
        const header = container.querySelector('.togglable-header');
        expect(header.classList).toContain('hidden');
    });

    test('should hide content on click', async () => {
        const contentHidden = container.querySelector('.togglable-content');
        expect(contentHidden.classList).toContain('hidden');
        const user = userEvent.setup();
        await user.click(container.querySelector('.btn-show'));
        const content = container.querySelector('.togglable-content');
        expect(content.classList).not.toContain('hidden');
        await user.click(container.querySelector('.btn-hide'));
        const contentHiddenAgain =
            container.querySelector('.togglable-content');
        expect(contentHiddenAgain.classList).toContain('hidden');
    });
});
