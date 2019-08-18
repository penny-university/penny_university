from django.shortcuts import render, HttpResponseRedirect
from .forms import InviteForm

# Create your views here.


def index(request):
    # if this is a POST request we need to process the form data
    if request.method == 'POST':
        # create a form instance and populate it with data from the request:
        form = InviteForm(request.POST)
        # check whether it's valid:
        if form.is_valid():
            # process the data in form.cleaned_data as required
            # ...
            # redirect to a new URL:
            return HttpResponseRedirect('/thank-you/')

    # if a GET (or any other method) we'll create a blank form
    else:
        form = InviteForm()

    return render(request, 'home/index.html', {'form': form})


def thank_you(request):
    return render(request, 'home/thank_you.html')
