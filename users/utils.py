from pennychat.models import Participant, FollowUp
from users.models import SocialProfile


def merge_users(from_user, to_user):
    participants = Participant.objects.filter(user=from_user)
    for participant in participants:
        participant.user = to_user
        participant.save()
        print(f'Participation in "{participant.penny_chat.title}" merged to {to_user.email}')
    follow_ups = FollowUp.objects.filter(user=from_user)
    for follow_up in follow_ups:
        follow_up.user = to_user
        follow_up.save()
        print(f'Follow Up from "{follow_up.penny_chat.title}" merged to {to_user.email}')
    profiles = SocialProfile.objects.filter(user=from_user)
    for profile in profiles:
        profile.user = to_user
        profile.save()
        print(f'Profile {profile.email} merged to {to_user.email}')
