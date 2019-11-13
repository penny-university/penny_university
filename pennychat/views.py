from django.shortcuts import render
from django.utils import timezone
from django.core.paginator import Paginator
from django.http import HttpResponseRedirect
from .models import PennyChat, FollowUp
from .forms import FollowUpForm


def index(request):
    chats_list = PennyChat.objects.filter(date__lte=timezone.now())
    paginator = Paginator(chats_list, 10)

    page = request.GET.get('page')
    chats = paginator.get_page(page)
    return render(request, 'pennychat/index.html', context={'chats': chats})


def detail(request, pennychat_id):
    chat = PennyChat.objects.get(id=pennychat_id)

    if request.method == 'POST':
        form = FollowUpForm(request.POST)
        if form.is_valid():
            content = form.cleaned_data['follow_up']
            FollowUp.objects.create(content=content, penny_chat=chat, user='Anonymous')
            return HttpResponseRedirect(request.path_info)

    else:
        form = FollowUpForm()

    return render(request, 'pennychat/detail.html', context={'chat': chat, 'form': form})
