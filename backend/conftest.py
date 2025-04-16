import pytest
import datetime
import os
import time
from dotenv import load_dotenv
from office365.runtime.auth.authentication_context import AuthenticationContext
from office365.sharepoint.client_context import ClientContext

# Detectar si estamos en entorno CI/CD
IN_CI = os.environ.get('CI', 'false').lower() == 'true' or os.environ.get('GITHUB_ACTIONS', 'false').lower() == 'true'

# Cargar variables de entorno
load_dotenv()

# Configuración de SharePoint
SHAREPOINT_SITE_URL = os.environ.get('SHAREPOINT_SITE_URL')
SHAREPOINT_USERNAME = os.environ.get('SHAREPOINT_USERNAME')
SHAREPOINT_PASSWORD = os.environ.get('SHAREPOINT_PASSWORD')
SHAREPOINT_LIST_NAME = os.environ.get('SHAREPOINT_LIST_NAME', 'Control Pruebas - GEIICO- IDT')

class SharePointReporter:
    def __init__(self):
        self.test_results = {
            'total': 0,
            'passed': 0,
            'failed': 0,
            'skipped': 0,
            'duration': 0,
            'timestamp': datetime.datetime.now().isoformat()
        }
        self.start_time = time.time()
    
    def upload_to_sharepoint(self):
        if not all([SHAREPOINT_SITE_URL, SHAREPOINT_USERNAME, SHAREPOINT_PASSWORD]):
            if IN_CI:
                print("Ejecutando en entorno CI/CD. Credenciales de SharePoint no configuradas correctamente.")
            else:
                print("Credenciales de SharePoint no configuradas. No se subirán los resultados.")
            return False
            
        try:
            ctx_auth = AuthenticationContext(SHAREPOINT_SITE_URL)
            if ctx_auth.acquire_token_for_user(SHAREPOINT_USERNAME, SHAREPOINT_PASSWORD):
                ctx = ClientContext(SHAREPOINT_SITE_URL, ctx_auth)
                print("Autenticación exitosa en SharePoint")
            else:
                error_msg = ctx_auth.get_last_error() if hasattr(ctx_auth, 'get_last_error') else "Error desconocido"
                print(f"Error al autenticar: {error_msg}")
                return False
                
            # Crear el mensaje con el resumen de las pruebas
            summary = (
                f"Ejecución de pruebas - {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')} - "
                f"Total: {self.test_results['total']}, "
                f"Pasaron: {self.test_results['passed']}, "
                f"Fallaron: {self.test_results['failed']}, "
                f"Omitidas: {self.test_results['skipped']}, "
                f"Duración: {self.test_results['duration']:.2f} segundos"
            )
            
            if IN_CI:
                summary = f"[CI/CD] {summary}"
            
            # Acceder a la lista de SharePoint
            print(f"Intentando acceder a la lista '{SHAREPOINT_LIST_NAME}'...")
            target_list = ctx.web.lists.get_by_title(SHAREPOINT_LIST_NAME)
            
            item_properties = {
                'Title': summary[:255]
            }
            
            print(f"Intentando crear un nuevo elemento en la lista '{SHAREPOINT_LIST_NAME}'...")
            
            target_list.add_item(item_properties)
            ctx.execute_query()
            
            print(f"Resultados subidos exitosamente a la lista '{SHAREPOINT_LIST_NAME}' en SharePoint")
            return True
        except Exception as e:
            print(f"Error al subir los resultados a SharePoint: {str(e)}")
            if IN_CI:
                print("Este error ocurrió durante la ejecución en CI/CD y no afectará el resultado de las pruebas.")
            return False

# Hooks de pytest
@pytest.hookimpl(trylast=True)
def pytest_configure(config):
    """Registra el plugin al inicio de las pruebas"""
    config._sharepoint_reporter = SharePointReporter()
    config.pluginmanager.register(config._sharepoint_reporter)

@pytest.hookimpl(trylast=True)
def pytest_unconfigure(config):
    """Sube los resultados al finalizar todas las pruebas"""
    sharepoint_reporter = getattr(config, "_sharepoint_reporter", None)
    if sharepoint_reporter:
        try:
            sharepoint_reporter.upload_to_sharepoint()
        except Exception as e:
            print(f"Error al ejecutar upload_to_sharepoint: {str(e)}")
            if IN_CI:
                print("Este error ocurrió durante la ejecución en CI/CD y no afectará el resultado de las pruebas.")
        config.pluginmanager.unregister(sharepoint_reporter)

@pytest.hookimpl(hookwrapper=True)
def pytest_runtest_protocol(item, nextitem):
    """Contabiliza cada prueba ejecutada"""
    outcome = yield
    reporter = item.config._sharepoint_reporter
    reporter.test_results['total'] += 1

@pytest.hookimpl(hookwrapper=True)
def pytest_runtest_makereport(item, call):
    """Procesa el resultado de cada prueba"""
    outcome = yield
    report = outcome.get_result()
    reporter = item.config._sharepoint_reporter
    
    if report.when == 'call':
        if report.passed:
            reporter.test_results['passed'] += 1
        elif report.failed:
            reporter.test_results['failed'] += 1
        elif report.skipped:
            reporter.test_results['skipped'] += 1

@pytest.hookimpl(trylast=True)
def pytest_terminal_summary(terminalreporter, exitstatus, config):
    reporter = config._sharepoint_reporter

    reporter.test_results['duration'] = time.time() - reporter.start_time
    
    print("\nResumen de resultados:")
    print(f"  Total: {reporter.test_results['total']}")
    print(f"  Pasaron: {reporter.test_results['passed']}")
    print(f"  Fallaron: {reporter.test_results['failed']}")
    print(f"  Omitidas: {reporter.test_results['skipped']}")
    print(f"  Duración: {reporter.test_results['duration']:.2f} segundos")