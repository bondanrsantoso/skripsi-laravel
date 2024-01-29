import { fakerID_ID as faker, fakerEN_US } from "@faker-js/faker";

describe(
    "Board list testing",
    {
        testIsolation: false,
    },
    () => {
        before(() => {
            cy.exec("php artisan migrate:fresh --step --seed");
        });
        beforeEach(() => {
            cy.login("test_user@example.com", "password");
        });

        it("Opens board list", () => {
            // cy.login("foo@example.com", "password");
            cy.visit("/dashboard/boards");
            cy.contains("Tambah baru");
        });

        it("Add new board and sets its title", () => {
            interceptSync();

            cy.visit("/dashboard/boards");
            cy.contains("Tambah baru").click();
            cy.get("#board-title").clear();

            for (let i = 0; i < 10; i++) {
                cy.get("#board-title").clear().type(faker.company.buzzPhrase());
                cy.wait("@boardUpdate")
                    .its("response.statusCode")
                    .should("be.within", 200, 399);
            }
            cy.get("#board-title").clear().type(faker.string.alphanumeric(256));
            cy.wait("@boardUpdate")
                .its("response.statusCode")
                .should("be.within", 200, 399);

            cy.get("#board-title").clear().type("TEST-BOARD");

            cy.wait("@boardUpdate")
                .its("response.statusCode")
                .should("be.within", 200, 399);
        });

        it("Clear out board's title", () => {
            interceptSync();
            cy.visit("/dashboard/boards");
            cy.contains("TEST-BOARD").click();

            // const randomTitle = "UPDATED-BOARD-" + faker.string.alpha(5);
            cy.get("#board-title").clear();

            cy.contains("Tanpa Judul").should("exist");
            cy.get("#board-title").clear().type("TEST-BOARD");
            cy.wait("@boardUpdate")
                .its("response.statusCode")
                .should("be.within", 200, 399);
        });

        it("update existing board", () => {
            interceptSync();
            cy.visit("/dashboard/boards");
            cy.contains("TEST-BOARD").click();

            const randomTitle = "UPDATED-BOARD-" + faker.string.alpha(5);
            cy.get("#board-title").clear().type(randomTitle);

            cy.wait("@boardUpdate")
                .its("response.statusCode")
                .should("be.within", 200, 399);

            cy.visit("/dashboard/boards");
            cy.contains(randomTitle).click();
        });

        it("Fill out notes", () => {
            // interceptSync();
            interceptNewNoteRequest();
            interceptNoteUpdate();

            cy.visit("/dashboard/boards");
            cy.contains("UPDATED-BOARD").last().click();

            for (let i = 0; i < 3; i++) {
                cy.contains("Tambah Teks").click();
                cy.wait("@newNoteRequest")
                    .its("response.statusCode")
                    .should("be.within", 200, 399);
            }

            cy.get(".ql-editor").each(($node, i, $nodes) => {
                cy.wrap($node).focus().type(faker.word.words(100));
                cy.wait("@noteUpdateRequest")
                    .its("response.statusCode")
                    .should("be.within", 200, 399);
            });
        });
    }
);

function interceptNoteUpdate() {
    cy.intercept({
        url: "/dashboard/boards/*/board_notes/*",
        method: "PUT",
    }).as("noteUpdateRequest");
}

function interceptNewNoteRequest() {
    cy.intercept({ url: "/dashboard/boards/*/board_notes", method: "POST" }).as(
        "newNoteRequest"
    );
}

function interceptSync() {
    cy.intercept({
        method: "PUT",
        url: "/dashboard/boards/*",
    }).as("boardUpdate");
}
