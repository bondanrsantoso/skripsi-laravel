import { fakerID_ID } from "@faker-js/faker";

function interceptSync() {
    cy.intercept({
        method: "PUT",
        url: "/dashboard/boards/*",
    }).as("boardUpdate");
}

function interceptPersonSearch() {
    cy.intercept({
        url: "/dashboard/users*",
        method: "GET",
    }).as("personSearch");
}

describe("template spec", { testIsolation: false }, () => {
    before(() => {
        cy.login("test_user@example.com", "password");
    });
    it("Add Users", () => {
        interceptSync();
        interceptPersonSearch();

        cy.visit("/dashboard/boards");
        cy.contains("UPDATED-BOARD").last().click();

        cy.get("button").contains("Atur akses").click();

        cy.contains("Akses Pengguna").should("exist");

        for (let i = 0; i < 3; i++) {
            cy.get("input[role=combobox][type=text]")
                .clear()
                .type(fakerID_ID.person.firstName());

            cy.wait("@personSearch")
                .its("response.statusCode")
                .should("be.within", 200, 399);
        }

        for (let i = 0; i < 1; i++) {
            cy.get("input[role=combobox][type=text]").clear().type("example");
            cy.wait("@personSearch")
                .its("response.statusCode")
                .should("be.within", 200, 399);

            cy.wait(250);
            cy.get("input[role=combobox][type=text]").type("{enter}");
        }

        for (let i = 0; i < 1; i++) {
            cy.get("input[role=combobox][type=text]").clear().type("example");
            cy.wait("@personSearch")
                .its("response.statusCode")
                .should("be.within", 200, 399);

            cy.wait(250);
            cy.get("li[role=option]").first().click();
        }

        for (let i = 0; i < 1; i++) {
            cy.get("input[role=combobox][type=text]").clear().type("example");
            cy.wait("@personSearch")
                .its("response.statusCode")
                .should("be.within", 200, 399);

            cy.wait(250);
            cy.get("li[role=option]").last().click();
        }

        cy.get("select:not([disabled])").each(($node, i, $nodes) => {
            cy.wrap($node).select(Math.round(Math.random()));
        });

        cy.get("button").contains("Simpan Perubahan").click();

        cy.wait("@boardUpdate")
            .its("response.statusCode")
            .should("be.within", 200, 399);
        cy.wait(1000);
    });

    it("Update user permission", () => {
        interceptSync();
        interceptPersonSearch();

        cy.visit("/dashboard/boards");
        cy.contains("UPDATED-BOARD").last().click();

        cy.get("button").contains("Atur akses").click();

        cy.contains("Akses Pengguna").should("exist");

        cy.get("select:not([disabled])").each(($node, i, $nodes) => {
            cy.wrap($node).select(Math.round(Math.random()));
        });

        cy.get("button").contains("Simpan Perubahan").click();

        cy.wait("@boardUpdate")
            .its("response.statusCode")
            .should("be.within", 200, 399);
        cy.wait(1000);
    });

    // it("Remove Last and first user", () => {
    //     interceptSync();
    //     interceptPersonSearch();

    //     cy.visit("/dashboard/boards");
    //     cy.contains("UPDATED-BOARD").last().click();

    //     cy.get("button").contains("Atur akses").click();

    //     cy.contains("Akses Pengguna").should("exist");

    //     cy.get("td button:not([disabled])").first().click();
    //     cy.get("td button:not([disabled])").last().click();
    //     cy.get("button").contains("Simpan Perubahan").click();

    //     cy.wait("@boardUpdate")
    //         .its("response.statusCode")
    //         .should("be.within", 200, 399);
    // });

    it("Remove all users then add back", () => {
        interceptSync();
        interceptPersonSearch();

        cy.visit("/dashboard/boards");
        cy.contains("UPDATED-BOARD").last().click();

        cy.get("button").contains("Atur akses").click();

        cy.contains("Akses Pengguna").should("exist");

        cy.get("td button:not([disabled])").each(($node, i, $nodes) => {
            cy.wrap($node).click();
        });
        cy.get("button").contains("Simpan Perubahan").click();

        cy.wait("@boardUpdate")
            .its("response.statusCode")
            .should("be.within", 200, 399);
        cy.wait(1000);

        cy.get("button").contains("Atur akses").click();

        cy.contains("Akses Pengguna").should("exist");

        for (let i = 0; i < 3; i++) {
            cy.get("input[role=combobox][type=text]").clear().type("example");
            cy.wait("@personSearch")
                .its("response.statusCode")
                .should("be.within", 200, 399);

            cy.wait(1000);
            cy.get("input[role=combobox][type=text]").type("{enter}");
        }

        cy.get("select:not([disabled])").each(($node, i, $nodes) => {
            cy.wrap($node).select(Math.round(Math.random()));
        });
        cy.get("button").contains("Simpan Perubahan").click();

        cy.wait("@boardUpdate")
            .its("response.statusCode")
            .should("be.within", 200, 399);
        cy.wait(1000);
    });

    it("Test Read Only Permission", () => {
        interceptSync();
        interceptPersonSearch();

        cy.visit("/dashboard/boards");
        cy.contains("UPDATED-BOARD").last().click();

        cy.get("button").contains("Atur akses").click();

        cy.contains("Akses Pengguna").should("exist");

        cy.get("td button:not([disabled])").each(($node, i, $nodes) => {
            cy.wrap($node).click();
        });
        // cy.get("button").contains("Simpan Perubahan").click();

        // cy.wait("@boardUpdate")
        //     .its("response.statusCode")
        //     .should("be.within", 200, 399);

        // cy.get("button").contains("Atur akses").click();

        // cy.contains("Akses Pengguna").should("exist");

        cy.get("input[role=combobox][type=text]").clear().type("READ");
        cy.wait("@personSearch")
            .its("response.statusCode")
            .should("be.within", 200, 399);

        cy.wait(1000);
        cy.get("input[role=combobox][type=text]").type("{enter}");

        cy.get("select:not([disabled])").each(($node, i, $nodes) => {
            cy.wrap($node).select(0);
        });
        cy.get("button").contains("Simpan Perubahan").click();

        cy.wait("@boardUpdate")
            .its("response.statusCode")
            .should("be.within", 200, 399);

        cy.wait(1000);

        cy.login("test_user_reader@example.com", "password");
        cy.contains("UPDATED-BOARD").last().click();
        cy.contains("Tambah Teks").should("not.exist");
    });
});
