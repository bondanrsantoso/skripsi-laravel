describe("Login Page Testing", () => {
    it("Opens login page", () => {
        cy.visit("/login");
    });

    it("Fills out the login form", () => {
        cy.visit("/login");
        cy.get("input[type=email]").type("raina34@example.com");
        cy.get("input[type=password]").type("password");
        cy.get("button").contains("Log in").click();
    });
});
