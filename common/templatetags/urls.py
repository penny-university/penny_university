from urllib.parse import urlencode

from django import template

register = template.Library()


@register.simple_tag
def build_url(base, endpoint, **kwargs):
    """
    Generates a url for the user to visit in the web app. If FRONT_END_HOST is not set, an exception will be raised.
    :param base: The url base, i.e. https://pennyuniversity.org
    :param endpoint: Unique token to verify user email
    """
    return f'{base}/{endpoint}?{urlencode(kwargs)}'
