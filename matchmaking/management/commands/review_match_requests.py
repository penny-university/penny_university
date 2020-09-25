from datetime import timedelta

from django.core.management.base import BaseCommand
from django.utils import timezone

from matchmaking.models import MatchRequest


class Command(BaseCommand):
    help = (
        'Pretty print a list of people recently signed up for a discussion match.'
    )

    def add_arguments(self, parser):
        parser.add_argument(
            '--since_days_ago',
            dest='since_days_ago',
            type=int,
            default=7,
            help='get matches since this many days ago',
            required=False,
        )

    def handle(self, *args, **options):
        print(get_recent_matches(options['since_days_ago']))


def get_recent_matches(since_days_ago):
    match_requests = MatchRequest.objects.filter(date__gte=timezone.now() - timedelta(days=since_days_ago))\
        .select_related('topic_channel', 'profile')

    topic_channel_to_profile = {}
    profile_to_topic_channel = {}
    for match in match_requests:
        topic_channel_to_profile.setdefault(match.topic_channel, []).append(match.profile)
        profile_to_topic_channel.setdefault(match.profile, []).append(match.topic_channel)

    output_str = []
    output_str.append("PROFILE TO TOPICS")
    for profile, topic_channels in profile_to_topic_channel.items():
        output_str.append(f'{profile.email} ({profile.real_name}) requested a match for:')
        for topic_channel in topic_channels:
            output_str.append(f'\ttopic {topic_channel.name} in channel {topic_channel.channel_id}')
        output_str.append('\n')

    output_str.append("\n\nTOPIC TO PROFILES")
    for topic_channel, profiles in topic_channel_to_profile.items():
        output_str.append(f'Channel {topic_channel.channel_id} with topic {topic_channel.name} has interested people:')
        for profile in profiles:
            output_str.append(f'\ttopic {profile.email} ({profile.real_name})')
        output_str.append('\n')

    return '\n'.join(output_str)
