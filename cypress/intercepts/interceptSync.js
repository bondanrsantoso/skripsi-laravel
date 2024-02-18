function interceptSync() {
    cy.intercept({
        method: "PUT",
        url: "/dashboard/boards/*",
    }).as("boardUpdate");
}

module.exports = { interceptSync };
