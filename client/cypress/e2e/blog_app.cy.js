describe('Blog app', () => {
    const user = {
        username: 'testuser',
        name: 'Test User',
        password: 'passworD|123',
    };
    beforeEach(function () {
        cy.request('POST', `${Cypress.env('URL')}/testing/reset`);
        cy.visit('');
    });

    it('Login form is showing', function () {
        cy.contains('Log in to the Bloglist Application');
        cy.get('#username');
        cy.get('#password');
        cy.get('#btn-login');
    });

    describe('Login', function () {
        beforeEach(function () {
            cy.request('POST', `${Cypress.env('URL')}/users`, user);
        });

        it('Succeed logging in', function () {
            cy.get('#username').type(user.username);
            cy.get('#password').type(user.password);
            cy.get('#btn-login').click();
            cy.contains(user.name);
            cy.get('html').should(
                'not.contain',
                'Log in to the Bloglist Application'
            );
        });

        it('Fail logging in', function () {
            cy.get('#username').type(user.username);
            cy.get('#password').type('badpass1');
            cy.get('#btn-login').click();
            cy.get('.error').as('error');
            cy.get('@error').should('contain', 'Check your credentials.');
            cy.get('@error').should('have.css', 'color', 'rgb(178, 34, 34)');
        });
    });

    describe('When logged in', function () {
        beforeEach(function () {
            cy.request('POST', `${Cypress.env('URL')}/users`, user);
            cy.login(user.username, user.password);
        });

        it('BlogForm should not be visible', function () {
            cy.contains('Create New Item').should('be.visible');
            cy.contains('Create a new Blog List Item').should('not.be.visible');
        });

        describe('When creating a blog list item', () => {
            it('A blog list item can be created', function () {
                cy.get('.btn-show').click();
                cy.contains('Cancel');
                cy.get('#title').type('Test Blog');
                cy.get('#author').type('Jane Doe');
                cy.get('#url').type('https://example.com/blogs/101');
                cy.get('#btn-create').click();
                cy.contains('Test Blog');
                cy.contains('Jane Doe');
            });

            it('A blog list item can be created without author', function () {
                cy.get('.btn-show').click();
                cy.contains('Cancel');
                cy.get('#title').type('Test Blog');
                cy.get('#url').type('https://example.com/blogs/101');
                cy.get('#btn-create').click();
                cy.contains('Test Blog');
                cy.should('not.contain', 'Jane Doe');
            });
        });

        describe('When blogs exist', () => {
            beforeEach(function () {
                cy.createBlog(
                    'blog 1',
                    'author 1',
                    'https://example.com/blogs/1'
                );
                cy.createBlog(
                    'blog 2',
                    'author 2',
                    'https://example.com/blogs/2'
                );
                cy.createBlog(
                    'blog 3',
                    'author 3',
                    'https://example.com/blogs/3'
                );
            });

            it('User can like a blog', function () {
                cy.get('.blog-header').first().as('header');
                cy.get('@header').should('contain', 'blog 1');
                cy.get('@header').find('.btn-toggle').as('btnToggle');
                cy.get('@btnToggle').should('contain', 'View');
                cy.get('@btnToggle').click();

                cy.get('.blog-details').first().as('details');
                cy.get('@details').get('.blog-likes').as('blogLikes');
                cy.get('@blogLikes').should('contain', 0);
                cy.get('@details').find('.btn-like').click();
                cy.get('@blogLikes').should('contain', 1);
            });

            it('User can delete blog list item', function () {
                cy.get('.blog-header').eq(1).as('header');
                cy.get('@header').should('contain', 'author 2');
                cy.get('@header').find('.btn-toggle').click();

                cy.get('.blog-details').eq(1).find('.btn-delete').click();
                cy.get('.blog-header').should('have.length', 2);
                cy.get('html').should('not.contain', 'author 2');
            });

            it('User can NOT see delete button', function () {
                cy.get('#btn-logout').click();
                const newUser = {
                    username: 'newuser',
                    name: 'New User',
                    password: 'baDpa$$123',
                };
                cy.request('POST', `${Cypress.env('URL')}/users`, newUser);
                cy.login(newUser.username, newUser.password);
                cy.get('.blog-header').eq(1).as('header');
                cy.get('@header').should('contain', 'author 2');
                cy.get('@header').find('.btn-toggle').click();

                cy.get('.blog-details')
                    .eq(1)
                    .find('.btn-delete')
                    .should('not.exist');
            });

            it('blogs are in descending likes order', function () {
                cy.get('.blog-header').first().find('.btn-toggle').click();
                cy.get('.blog-details').first().find('.btn-like').click();

                cy.get('.blog-header').last().find('.btn-toggle').click();
                cy.wait(150, { log: false });
                cy.get('.blog-details')
                    .last()
                    .find('.btn-like')
                    .as('likeBtn')
                    .click();
                cy.wait(150, { log: false });
                cy.get('@likeBtn').click();
                cy.wait(150, { log: false });
                cy.reload();

                cy.get('.blog-header')
                    .first()
                    .should('contain', 'blog 3')
                    .find('.btn-toggle')
                    .click();
                cy.get('.blog-header')
                    .eq(1)
                    .should('contain', 'blog 1')
                    .find('.btn-toggle')
                    .click();
                cy.get('.blog-header')
                    .last()
                    .should('contain', 'blog 2')
                    .find('.btn-toggle')
                    .click();
                cy.get('.blog-details').first().should('contain', 'Likes: 2');
                cy.get('.blog-details').eq(1).should('contain', 'Likes: 1');
                cy.get('.blog-details').last().should('contain', 'Likes: 0');
            });
        });
    });
});
