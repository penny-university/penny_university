from django.core.management.commands.shell import Command as ShellCommand


class Command(ShellCommand):
    def ipython(self, options):
        print("REMINDER - THIS IS JOHN'S HACKED SHELL - EDIT IT TO GAIN SUPERPOWERS")
        from IPython import start_ipython

        script_to_run_on_startup = """
        from pennychat.models import PennyChat, PennyChatSlackInvitation, FollowUp, Participant

        from users.models import SocialProfile

        from slack import WebClient
        from django.conf import settings
        slack = WebClient(settings.SLACK_API_KEY)

        expected_variables = ['WebClient']

        expected_variables = expected_variables + ['In','Out','get_ipython','exit','quit', 'expected_variables']
        available_variables = [k for k in locals().keys() if k[0] != '_' and k not in expected_variables]

        print(f'\\navailable_variables:\\n{available_variables}')
        """

        argv = ['-c', script_to_run_on_startup, '-i']

        start_ipython(argv)
