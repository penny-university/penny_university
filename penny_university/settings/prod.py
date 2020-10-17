import os

from django.core.exceptions import ImproperlyConfigured

from penny_university.settings.base import *

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False

SECURE_SSL_REDIRECT = True
# Heroku seems to strip HTTP_X_FORWARDED_PROTO and rewrite it correctly
# https://help.heroku.com/J2R1S4T8/can-heroku-force-an-application-to-use-ssl-tls
# If we move from heroku the following line should be considered insecure b/c
# anyone could lie about the protocol used.
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True

FRONT_END_HOST = os.getenv('FRONT_END_HOST')  # https://www.pennyuniversity.org

if os.environ.get('SENTRY_DSN') is None:
    raise(ImproperlyConfigured('SENTRY_DSN must be set in production.'))
