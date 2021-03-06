import os

from django.shortcuts import render, HttpResponse, HttpResponseRedirect
from django.conf import settings

from common.utils import get_slack_client
from .forms import InviteForm

from bot.utils import notify_admins

# Create your views here.
slack_client = get_slack_client()


def index(request):
    # if this is a POST request we need to process the form data
    if request.method == 'POST':
        if settings.SLACK_INVITE_LINK:
            message = 'Somebody clicked join.'
            notify_admins(slack_client, message)
            return HttpResponseRedirect(settings.SLACK_INVITE_LINK)
        else:
            # create a form instance and populate it with data from the request:
            form = InviteForm(request.POST)
            # check whether it's valid:
            if form.is_valid():
                # process the data in form.cleaned_data as required
                # send John and Nick a slack message with the person's information
                email = form.cleaned_data["email"]
                found_us = form.cleaned_data["how_did_you_find_us"]
                message = f'Somebody just submitted a form!\nEmail: {email}\nHow They Found Us: {found_us}'
                notify_admins(slack_client, message)
                # redirect to a new URL:
                return HttpResponseRedirect('/thank-you/')

    # if a GET (or any other method) we'll create a blank form
    else:
        form = InviteForm()

    return render(request, 'home/index.html', {'form': form, 'invite_link': settings.SLACK_INVITE_LINK})


def privacy(request):
    return render(request, 'home/privacy.html')


def thank_you(request):
    return render(request, 'home/thank_you.html')


def frontend(request):
    try:
        with open(os.path.join(settings.REACT_APP_DIR, 'build', 'index.html')) as f:
            return HttpResponse(f.read())
    except FileNotFoundError:
        return HttpResponse(
            """
            This URL is only used when you have built the production
            version of the app. Visit http://localhost:3000/ instead, or
            run `npm run build` to test the production version.
            """,
            status=501,
        )
