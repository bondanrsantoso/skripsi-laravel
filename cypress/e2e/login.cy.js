describe("Login Page Testing", () => {
    before(() => {
        cy.exec("php artisan migrate:fresh --step --seed");
    });

    it("Opens login page", () => {
        cy.visit("/login");
    });

    function interceptRedirect() {
        cy.intercept({
            method: "GET",
            url: "/dashboard/boards",
        }).as("loginRequestCheck");
    }

    function interceptLogin() {
        cy.intercept({
            method: "POST",
            url: "/login",
        }).as("loginRequest");
    }

    it("Test empty form", () => {
        interceptLogin();
        cy.visit("/login");
        cy.get("button").contains("Log in").click();

        // It doesn't redirect
        cy.wait("@loginRequest");
        cy.location().its("pathname").should("equal", "/login");
    });

    it("Leaves out password", () => {
        interceptLogin();
        cy.visit("/login");
        cy.get("input[type=email]").type("test_user@example.com");
        cy.get("button").contains("Log in").click();

        // It doesn't redirect
        cy.wait("@loginRequest");
        cy.location().its("pathname").should("equal", "/login");
    });

    it("Leaves out email", () => {
        interceptLogin();
        cy.visit("/login");
        cy.get("input[type=password]").type("password");
        cy.get("button").contains("Log in").click();

        // It doesn't redirect
        cy.wait("@loginRequest");
        cy.location().its("pathname").should("equal", "/login");
    });

    it("Test wrong email", () => {
        interceptLogin();
        cy.visit("/login");
        cy.get("input[type=email]").type("not_test_user@example.com");
        cy.get("input[type=password]").type("password");
        cy.get("button").contains("Log in").click();

        // It doesn't redirect
        cy.wait("@loginRequest");
        cy.location().its("pathname").should("equal", "/login");
    });

    it("Test wrong password", () => {
        interceptLogin();
        cy.visit("/login");
        cy.get("input[type=email]").type("test_user@example.com");
        cy.get("input[type=password]").type("wrongpassword");
        cy.get("button").contains("Log in").click();

        // It doesn't redirect
        cy.wait("@loginRequest");
        cy.location().its("pathname").should("equal", "/login");
    });

    it("Test wrong email and password", () => {
        interceptLogin();
        cy.visit("/login");
        cy.get("input[type=email]").type("not_test_user@example.com");
        cy.get("input[type=password]").type("wrongpassword");
        cy.get("button").contains("Log in").click();

        // It doesn't redirect
        cy.wait("@loginRequest");
        cy.location().its("pathname").should("equal", "/login");
    });

    it("Login with correct email and password", () => {
        interceptRedirect();
        cy.visit("/login");
        cy.get("input[type=email]").type("test_user@example.com");
        cy.get("input[type=password]").type("password");
        cy.get("button").contains("Log in").click();

        // cy.visit("/dashboard/boards");
        // cy.contains("Tambah baru").should("not.exist");
        cy.wait("@loginRequestCheck")
            .its("response.statusCode")
            .should("equal", 200);
    });

    it("Login with correct email and password and remember me", () => {
        interceptRedirect();
        cy.visit("/login");
        cy.get("input[type=email]").type("test_user@example.com");
        cy.get("input[type=password]").type("password");
        cy.get("input[type=checkbox]").check();
        cy.get("button").contains("Log in").click();

        // cy.visit("/dashboard/boards");
        // cy.contains("Tambah baru").should("not.exist");
        cy.wait("@loginRequestCheck")
            .its("response.statusCode")
            .should("equal", 200);
    });
});
