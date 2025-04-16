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
        # Lista para almacenar información de cada prueba individual
        self.individual_tests = []
        
    def add_test_result(self, test_name, result, duration, error_message=None):
        self.individual_tests.append({
            'name': test_name,
            'result': result,  # 'passed', 'failed', 'skipped'
            'duration': duration,
            'error_message': error_message,
            'timestamp': datetime.datetime.now().isoformat()
        })
    
    def upload_to_sharepoint(self):
        if not all([SHAREPOINT_SITE_URL, SHAREPOINT_USERNAME, SHAREPOINT_PASSWORD]):
            if IN_CI:
                print("Ejecutando en entorno CI/CD. Credenciales de SharePoint no configuradas correctamente.")
            else:
                print("Credenciales de SharePoint no configuradas. No se subirán los resultados.")
            return False
            
        try:
            # Autenticación en SharePoint
            ctx_auth = AuthenticationContext(SHAREPOINT_SITE_URL)
            if ctx_auth.acquire_token_for_user(SHAREPOINT_USERNAME, SHAREPOINT_PASSWORD):
                ctx = ClientContext(SHAREPOINT_SITE_URL, ctx_auth)
                print("Autenticación exitosa en SharePoint")
            else:
                error_msg = ctx_auth.get_last_error() if hasattr(ctx_auth, 'get_last_error') else "Error desconocido"
                print(f"Error al autenticar: {error_msg}")
                return False
            
            # Acceder a la lista de SharePoint
            print(f"Intentando acceder a la lista '{SHAREPOINT_LIST_NAME}'...")
            target_list = ctx.web.lists.get_by_title(SHAREPOINT_LIST_NAME)
            
            # Subir cada prueba como un elemento individual
            print(f"Subiendo {len(self.individual_tests)} pruebas individuales a SharePoint...")
            
            successful_uploads = 0
            for test_info in self.individual_tests:
                try:
                    # Determinar qué poner en la descripción según el resultado
                    if test_info['result'] == 'failed' and test_info['error_message']:
                        description = f"ERROR: {test_info['error_message']}"
                        if IN_CI:
                            description = f"[CI/CD] {description}"
                    else:
                        description = ""
                    
                    # Preparar propiedades del elemento
                    item_properties = {
                        'Modulo_x0020__x002f__x0020_Ruta': test_info['name'][:100],  # Modulo / Ruta
                        'Descripci_x00f3_n_x0020_del_x002': description[:255] if description else None,  # Descripción
                        'Etapa': 'Construccion',  # Etapa
                        'Tipo': 'PRUEBA AUTOMATIZADA',  # Tipo
                        'Version': '1.0',  # Versión
                    }
                    
                    # Añadir el elemento a la lista
                    target_list.add_item(item_properties)
                    ctx.execute_query()
                    successful_uploads += 1
                    
                except Exception as e:
                    print(f"Error al subir la prueba '{test_info['name']}' a SharePoint: {str(e)}")
            
            print(f"Se subieron exitosamente {successful_uploads} de {len(self.individual_tests)} pruebas a SharePoint")
            return True
            
        except Exception as e:
            print(f"Error al subir los resultados a SharePoint: {str(e)}")
            if IN_CI:
                print("Este error ocurrió durante la ejecución en CI/CD y no afectará el resultado de las pruebas.")
            return False

# Hooks de pytest
@pytest.hookimpl(trylast=True)
def pytest_configure(config):
    # Registra el plugin al inicio de las pruebas
    config._sharepoint_reporter = SharePointReporter()
    config.pluginmanager.register(config._sharepoint_reporter)

@pytest.hookimpl(trylast=True)
def pytest_unconfigure(config):
    # Sube los resultados al finalizar todas las pruebas
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
    # Contabiliza cada prueba ejecutada
    outcome = yield
    reporter = item.config._sharepoint_reporter
    reporter.test_results['total'] += 1

@pytest.hookimpl(hookwrapper=True)
def pytest_runtest_makereport(item, call):
    start_time = time.time()
    outcome = yield
    duration = time.time() - start_time
    
    report = outcome.get_result()
    reporter = item.config._sharepoint_reporter
    
    if report.when == 'call':
        test_name = f"{item.parent.name}.{item.name}"
        
        if report.passed:
            reporter.test_results['passed'] += 1
            reporter.add_test_result(test_name, 'passed', duration)
        elif report.failed:
            reporter.test_results['failed'] += 1
            error_message = str(report.longrepr) if hasattr(report, 'longrepr') else "Error desconocido"
            reporter.add_test_result(test_name, 'failed', duration, error_message)
        elif report.skipped:
            reporter.test_results['skipped'] += 1
            skip_reason = report.longrepr[2] if hasattr(report, 'longrepr') and isinstance(report.longrepr, tuple) and len(report.longrepr) > 2 else "Prueba omitida"
            reporter.add_test_result(test_name, 'skipped', duration, skip_reason)

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
    print(f"  Pruebas individuales recopiladas: {len(reporter.individual_tests)}")