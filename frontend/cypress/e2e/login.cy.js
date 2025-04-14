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
      // Ir a la página de login
      cy.visit('/login')
      
      // Ingresar credenciales
      cy.get('input[type="string"]').type('admin')
      cy.get('input[type="password"]').type('supersecret123')
      
      // Enviar el formulario
      cy.get('button[type="submit"]').click()
      
      // Verificar redirección al dashboard
      cy.url().should('include', '/dashboard')
      
      // Verificar que se muestra el contenido del dashboard
      cy.contains('Dashboard').should('be.visible')
    })
  
    it('should show error with invalid credentials', () => {
      // Ir a la página de login
      cy.visit('/login')
      
      // Ingresar credenciales inválidas
      cy.get('input[type="string"]').type('wronguser')
      cy.get('input[type="password"]').type('wrongpassword')
      
      // Enviar el formulario
      cy.get('button[type="submit"]').click()
      
      // Verificar que aparece un mensaje de error
      cy.contains('Invalid username or password').should('be.visible')
    })
  })