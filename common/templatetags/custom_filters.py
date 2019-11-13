from django import template

register = template.Library()


@register.filter(name='range')
def range_filter(value):
    return range(value)


@register.filter(name='human_range')
def human_range_filter(value):
    return range(1, value + 1)


@register.filter(name='user_initials')
def user_initials(value):
    initials = [name[0].upper() for name in value.split(' ')]
    if len(initials) < 2:
        initials.append(initials[0])
    return ''.join(initials[0:2])
