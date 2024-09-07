describe('Taskboard', () => {
    beforeEach(()=>{
        cy.session('login', ()=>{
            cy.login();
        })
    });

    before(()=>{
        cy.request({
            method: 'POST',
            url: '/api/test/setup'
        });
    })

    after(()=>{
        Cypress.session.clearAllSavedSessions();
        cy.request({
            method: 'DELETE',
            url: '/api/test/teardown'
        });
    });

    it('should showcase task details for each task on click.', () => {
        cy.visit('/signed-in');
        cy.get('#Implement-User-Authentication-and-OAuth-Integration', {timeout: 30000}).click();
        cy.get('#taskDetails', {timeout: 10000}).should('exist');
    });

    it('should change status, when dragged into a new stage.', () => {
        cy.visit('/signed-in');
        cy.get('#Implement-User-Authentication-and-OAuth-Integration').drag('#Doing', {force: true});
        cy.get('#Doing').should('contain', 'Implement User Authentication and OAuth Integration');
        cy.get('#Implement-User-Authentication-and-OAuth-Integration').click();
        cy.get('#taskDetails', {timeout: 10000}).should('contain', 'Doing');
    });

    it('should give users the ability to edit the description', ()=>{
        const newDescription = 'new description';
        cy.visit('/signed-in');
        cy.get('#Implement-User-Authentication-and-OAuth-Integration', {timeout: 30000}).click();
        cy.get('#description-editor').click()
        cy.get('#description-editor > div.ck.ck-reset.ck-editor.ck-rounded-corners > div.ck.ck-editor__main > div', {timeout: 30000}).click().realType(newDescription);
        cy.get('#taskDetails > span').click();

        cy.get('#description-editor > div > p').should('contain', newDescription);
    });

    it('should give the users the ability to create comments under a given task', ()=>{
        const comment = 'this is a test comment!!!';

        cy.visit('/signed-in');
        cy.get('#Implement-User-Authentication-and-OAuth-Integration', {timeout: 30000}).click();
        cy.get('#comment-section').click();
        cy.get('#editor > button', {timeout: 3000}).should('exist');
        cy.wait(500);
        cy.get('#comment-section').realType(comment);
        cy.get('#editor > button').realClick();

        cy.get('#comment-section > div').should('contain', comment);
    })
})