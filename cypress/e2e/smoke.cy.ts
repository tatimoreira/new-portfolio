describe("smoke tests", () => {
  it("should load the home page", () => {
    cy.visitAndCheck("/");
  });
});
