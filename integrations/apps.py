from django.apps import AppConfig


class IntegrationsConfig(AppConfig):
    name = 'integrations'

    def ready(self):
        import integrations.signals  # noqa
