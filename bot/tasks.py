from background_task import background


@background
def do_thing():
    print('XXXXXXXXX')
    with open('/tmp/x', 'w') as f:
        f.write('there')
