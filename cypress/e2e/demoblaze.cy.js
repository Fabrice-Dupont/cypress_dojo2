import { faker } from "@faker-js/faker";
import { expect } from "chai";

const userName = faker.internet.userName();
const password = faker.internet.password();
let articleName;
let cartArticleName;

describe("user creation", () => {
  beforeEach(() => {
    cy.visit("https://www.demoblaze.com");
  });
  it("should sign up", () => {
    cy.get("#signin2").click();
    cy.get("#sign-username").type(userName);
    cy.get("#sign-password").type(password);
    cy.get(
      "#signInModal > .modal-dialog > .modal-content > .modal-footer > .btn-primary"
    ).click();
  });
  it("should sign in", () => {
    cy.get("#login2").click();
    cy.get("#loginusername").type(userName);
    cy.get("#loginpassword").type(password);
    cy.get(
      "#logInModal > .modal-dialog > .modal-content > .modal-footer > .btn-primary"
    ).click();
  });
  it("add a product to cart", () => {
    cy.intercept("POST", "**/addtocart").as("addToCart");
    cy.get(
      ":nth-child(1) > .card > .card-block > .card-title > .hrefch"
    ).click();
    cy.url().should("include", "https://www.demoblaze.com/prod.html");
    cy.get(".name")
      .invoke("text")
      .then((text) => {
        articleName = text;
        cy.get(".col-sm-12 > .btn").click(); // add to cart
        cy.wait("@addToCart");
        cy.get(":nth-child(4) > .nav-link").click();
        cy.url().should("include", "https://www.demoblaze.com/cart.html");
        cy.get(".success > :nth-child(2)")
          .invoke("text")
          .then((text2) => {
            cartArticleName = text2;
            expect(articleName).to.equal(cartArticleName);
          });
        cy.get(".col-lg-1 > .btn").click();
        cy.wait(500);
        cy.get("#name").type(faker.name.fullName());
        cy.get("#country").type(faker.address.country());
        cy.get("#city").type(faker.address.city());
        cy.get("#card").type(faker.finance.creditCardNumber());
        cy.get("#month").type(faker.date.month());
        cy.get("#year").type("2024");
        cy.get("#orderModal").find(".btn-primary").click({ force: true });
        cy.wait(1000);
        cy.get(".confirm").click({ force: true });
        cy.url().should("include", "https://www.demoblaze.com/index.html");
      });
  });
});
