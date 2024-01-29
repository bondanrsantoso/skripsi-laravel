import { fakerID_ID as faker } from "@faker-js/faker";

describe(
    "Board list testing",
    {
        testIsolation: false,
    },
    () => {
        beforeEach(() => {
            cy.login("rmayasari@example.com", "password");
        });

        it("Opens board list", () => {
            // cy.login("foo@example.com", "password");
            cy.visit("/dashboard/boards");
            cy.contains("Tambah baru");
        });

        it("Add new board and sets its title", () => {
            // cy.login("foo@example.com", "password");
            cy.visit("/dashboard/boards");
            cy.contains("Tambah baru").click();
            cy.get("#board-title").clear();
            for (let i = 0; i < 10; i++) {
                cy.get("#board-title").clear().type(faker.company.buzzPhrase());
                cy.wait(666); //ms
            }
            cy.get("#board-title").clear().type("TEST-BOARD");

            cy.wait(1500); // wait for all update sync to finish
        });

        it("update existing board", () => {
            cy.visit("/dashboard/boards");
            cy.contains("TEST-BOARD").click();

            const randomTitle = "UPDATED-BOARD-" + faker.string.alpha(5);
            cy.get("#board-title").clear().type(randomTitle);

            cy.wait(1500);
            cy.visit("/dashboard/boards");
            cy.contains(randomTitle).click();
        });
    }
);
