
describe('HomePageView Tests', () => {
    // Mock data for photos to be stored in localStorage
    const mockPhotos = [
        { id: '1', filepath: 'file:///path/to/photo1.jpeg', createdAt: new Date('2025-07-24T10:30:00Z').getTime() },
        { id: '2', filepath: 'file:///path/to/photo2.jpeg', createdAt: new Date('2025-07-23T15:00:00Z').getTime() },
        { id: '3', filepath: 'file:///path/to/photo3.jpeg', createdAt: new Date('2025-07-24T11:00:00Z').getTime() },
    ];

    beforeEach(() => {
        cy.clearLocalStorage();
        cy.visit('/');
    });

    it('should display the main title', () => {
        cy.get('ion-title.home-title', { includeShadowDom: true }).should('be.visible').and('contain.text', 'Fotos');
    });

    it('should display an empty gallery message when no photos are available', () => {
        cy.get('.empty-gallery').should('be.visible').and('contain.text', 'Noch keine Fotos vorhanden.');
    });

    it('should display photo groups correctly when photos are in localStorage', () => {
        // Set mock photos in localStorage to test the gallery view
        localStorage.setItem('photos', JSON.stringify(mockPhotos));
        // Re-visit the page to trigger the component to load the data
        cy.visit('/');

        cy.get('.date-header').should('contain.text', '24.07.2025');
        cy.get('.date-header').should('contain.text', '23.07.2025');

        // Verify that the correct number of images is displayed
        cy.get('ion-img').should('have.length', mockPhotos.length);
    });

    it('should navigate to the detail view when a photo is clicked', () => {
        // Set mock photos in localStorage
        localStorage.setItem('photos', JSON.stringify(mockPhotos));
        cy.visit('/');

        cy.get('ion-img').first().click();
        // Check if the URL has changed to the detail view for the correct photo
        cy.url().should('include', `/detail/${mockPhotos.find(p => p.createdAt === Math.max(...mockPhotos.map(p => p.createdAt)))?.id}`);
    });

});