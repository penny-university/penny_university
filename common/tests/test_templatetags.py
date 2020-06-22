from django.template import Context, Template


def test_build_url():
    context = Context({
        'base': 'http://test.com',
        'endpoint': 'verify',
        'first': 'param1',
        'second': 'param2'
    })
    template_to_render = Template(
        '{% load urls %}'
        '{% build_url base endpoint first_param=first second_param=second as url %}'
        '<a href="{{url}}"></a>'
    )
    rendered_template = template_to_render.render(context)
    assert 'http://test.com/verify?first_param=param1&amp;second_param=param2' in rendered_template
