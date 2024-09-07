require('@4tw/cypress-drag-drop');
require("cypress-real-events");
/// <reference types="cypress" />

declare namespace Cypress {
    interface Chainable<Subject = any> {
      login(): Chainable<any>;
      logout(): Chainable<any>;
      cleanupDb(): Chainable<any>;
      dragTo(targetEl:any): Chainable<any>;
    }
  }

Cypress.Commands.add('login', ()=>{
    const username = "remoteflow56@gmail.com";
    const password = "te$t112358"
    const loginUrl = "http://localhost:3000/api/auth/signin"
    const cookieName = "authjs.session-token"
    const socialLoginOptions = {
      username,
      password,
      loginUrl,
      headless: false,
      logs: true,
      loginSelector: 'body > div > div > div > div > form > button',
      postLoginClick: '#submit_approve_access > div > button',
      postLoginSelector: '[id="navigation bar"]',
      cookieDelay: 2000,
    }

    return cy.task("GoogleSocialLogin", socialLoginOptions)
      .then(({ cookies }: any) => {
        const cookie = cookies
            .filter((cookie: any) => cookie.name === cookieName)
            .pop()
        if (cookie) {
            cy.session('login', ()=>{
              cy.log('test ' + cookie);

              cy.setCookie(cookie.name, cookie.value, {
                  domain: cookie.domain,
                  expiry: cookie.expires,
                  httpOnly: cookie.httpOnly,
                  path: cookie.path,
                  secure: cookie.secure,
              });
            });
        }
    })
    
});

Cypress.Commands.add('logout', ()=>{
    cy.visit('/api/auth/signout').then(()=>{
      cy.get("form").submit();
    });
});

Cypress.Commands.add('cleanupDb', ()=>{
    cy.task("clearDb");
});

Cypress.Commands.add("dragTo", { prevSubject: "element" }, (subject, targetEl) => {
  console.log(targetEl);

  subject.trigger("mousemove");
  cy.get(targetEl)
      .trigger("mousemove")
      .trigger("mouseup");
}
);


// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }