from django.shortcuts import render, HttpResponseRedirect
from django.conf import settings
from .forms import InviteForm
import slack


# Create your views here.
slack_client = slack.WebClient(token=settings.SLACK_API_KEY)


def index(request):
    # if this is a POST request take user to Slack invite link
    if request.method == 'POST':
        return HttpResponseRedirect(settings.SLACK_INVITE_LINK)

    # if a GET (or any other method) we'll create a blank form
    else:
        form = InviteForm()

    return render(request, 'home/index.html', {'form': form})


def thank_you(request):
    return render(request, 'home/thank_you.html')
