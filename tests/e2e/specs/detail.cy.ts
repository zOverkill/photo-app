
describe('DetailView Tests', () => {
    const mockPhotos = [
        { id: 'photo-1', filepath: 'file:///path/to/photo1.jpeg', createdAt: new Date('2025-07-24T10:30:00Z').getTime() },
        { id: 'photo-2', filepath: 'file:///path/to/photo2.jpeg', createdAt: new Date('2025-07-23T15:00:00Z').getTime() },
    ];

    beforeEach(() => {
        cy.clearLocalStorage();
        localStorage.setItem('photos', JSON.stringify(mockPhotos));
        cy.visit(`/detail/${mockPhotos[0].id}`);

        cy.get('ion-header', { includeShadowDom: true }).should('be.visible');
    });

    it('should have functional Edit and Delete buttons', () => {
        cy.get('ion-button').contains('Bearbeiten').should('be.visible');
        cy.get('ion-button').contains('Löschen').should('be.visible');
    });

});