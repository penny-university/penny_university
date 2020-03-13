from django.core.management.commands.shell import Command as ShellCommand


class Command(ShellCommand):
    def ipython(self, options):
        print("REMINDER - THIS IS JOHN'S HACKED SHELL - EDIT IT TO GAIN SUPERPOWERS")
        from IPython import start_ipython
        argv =  ['-c', 'a=3', '-i']

        start_ipython(argv)

