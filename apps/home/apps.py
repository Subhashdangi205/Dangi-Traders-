from django.apps import AppConfig


class HomeConfig(AppConfig):
    DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
    name = 'apps.home'

    def ready(self):
        import apps.home.signals