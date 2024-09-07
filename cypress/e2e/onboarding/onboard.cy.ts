import { method } from 'cypress/types/bluebird';
import {v4 as uuidv4} from 'uuid';

describe('Onboarding', () => {
    beforeEach(()=>{
        cy.session('login', ()=>{
            cy.login();
        })
    });

    after(()=>{
        Cypress.session.clearAllSavedSessions();
    });

    it('should automatically redirect to user set up page after login', () => {
        cy.wait(1000);

        cy.visit('/signed-in');
        cy.wait(1000);

        cy.get('#firstName', {timeout: 30000}).should('exist');
        cy.url().should('include', '/onboard');
    });

    it('should save user & project details', ()=>{
        cy.visit('/signed-in').then(()=>{
            //user details segment
            cy.get('#firstName').clear().type('test');
            cy.get('#lastName').clear().type('user');
            cy.get('form').submit();

            //project name segment
            cy.get('#projectName').clear().type(`Cypress Project ${uuidv4()}`);
            cy.get('form').submit();

            //task segment
            cy.get(`#task0`).clear().type('Implement User Authentication and OAuth Integration');
            cy.get(`#task1`).clear().type('Design and Develop Mobile-Responsive Dashboard');
            cy.get(`#task2`).clear().type('Optimize Backend API for Real-Time Data Processing');
            cy.get('#createTask').click();
            cy.get(`#task3`).clear().type('Create Automated Testing Suite for E-commerce Module');

            cy.get('form').submit();

            //stage segment
            cy.get('form').submit();

            //add users
            cy.wait(1500);
            cy.get('#skip').click();

            cy.url().should('contain', '/project')

            cy.get('#activeTaskTable', {timeout: 30000}).should('exist');
        });
    })
})