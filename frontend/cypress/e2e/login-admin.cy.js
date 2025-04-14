describe('Login Flow', () => {
    beforeEach(() => {
      // Visitar la página principal antes de cada prueba
      cy.visit('/')
    })
  
    it('should navigate to login page', () => {
      // Buscar el botón de login y hacer clic en él
      cy.contains('Login').click()
      
      // Verificar que estamos en la página de login
      cy.url().should('include', '/login')
      
      // Verificar que el formulario está presente
      cy.get('form').should('be.visible')
    })
  
    it('should login with valid credentials', () => {
      cy.visit('/login')
      
      // Añadir pausa para inspeccionar visualmente
      cy.wait(1000)
      
      // Verificar que los campos existen y son visibles
      cy.get('form').should('be.visible')
      
      // Tomar capturas de pantalla para verificar
      cy.screenshot('login-form')
      
      // Ser muy específicos con los selectores
      cy.get('form input').first().should('be.visible').type('admin')
      cy.get('form input[type="password"]').should('be.visible').type('supersecret123')
      cy.get('form button[type="submit"]').should('be.visible').click()
    })
  })