describe('Authentication Tests', () => {
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

  it('should attempt login and debug request/response', () => {
    // Interceptar la solicitud de login para inspeccionarla
    cy.intercept('POST', '**/token/').as('loginRequest')
    
    // Navegar a la página de login
    cy.visit('/login')
    
    // Ingresar credenciales
    cy.get('form input').first().should('be.visible').type('admin')
    cy.get('form input[type="password"]').should('be.visible').type('supersecret123')
    
    // Enviar formulario
    cy.get('form button[type="submit"]').click()
    
    // Esperar y examinar la respuesta
    cy.wait('@loginRequest').then((interception) => {
      cy.log('Request URL:', interception.request.url)
      cy.log('Request method:', interception.request.method)
      cy.log('Request body:', JSON.stringify(interception.request.body))
      cy.log('Response status:', interception.response?.statusCode)
      cy.log('Response body:', JSON.stringify(interception.response?.body))
    })
  })

  it('should login via direct API call', () => {
    // Autenticar directamente a través de la API
    cy.request({
      method: 'POST',
      url: 'http://localhost:8000/api/v1/token/',
      body: {
        username: 'admin',
        password: 'supersecret123'
      },
      failOnStatusCode: false // Para ver la respuesta incluso si falla
    }).then((response) => {
      cy.log('Direct API response:', JSON.stringify(response.body))
      
      if (response.status === 200) {
        // Guardar tokens en localStorage
        cy.window().then((win) => {
          win.localStorage.setItem('access', response.body.access)
          win.localStorage.setItem('refresh', response.body.refresh)
          win.localStorage.setItem('is_admin', response.body.is_admin ? 'true' : 'false')
        })
        
        // Navegar al dashboard
        cy.visit('/dashboard')
        cy.contains('Dashboard').should('be.visible')
      }
    })
  })

  it('should simulate end-to-end flow', () => {
    // Autenticar directamente
    cy.request({
      method: 'POST',
      url: 'http://localhost:8000/api/v1/token/',
      body: {
        username: 'admin',
        password: 'supersecret123'
      }
    }).then((response) => {
      // Configurar tokens
      cy.window().then((win) => {
        win.localStorage.setItem('access', response.body.access)
        win.localStorage.setItem('refresh', response.body.refresh)
        win.localStorage.setItem('is_admin', 'true')
      })
      
      // Navegar al dashboard
      cy.visit('/dashboard')
      
      // Verificar que estamos en el dashboard
      cy.contains('Dashboard').should('be.visible')
      
      // Verificar que la tabla de inspecciones existe
      cy.get('table').should('exist')
      
      // Verificar que hay botones de acción
      cy.contains('Detalles').should('exist')
      
      // Abrir detalles de una inspección
      cy.contains('Detalles').first().click()
      
      // Verificar que se muestran los detalles
      cy.contains('Detalles de la inspección').should('be.visible')
    })
  })
})