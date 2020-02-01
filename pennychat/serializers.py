from rest_framework import serializers
from rest_framework.fields import Field
from pennychat.models import (
    PennyChat,
    FollowUp,
    Participant,
)
from users.serializers import UserProfileSerializer


class ChoiceField(Field):
    """
    We couldn't get the rest_framework's ChoiceField to work as expected, so we're building our own.

    Initialized with `choices` a list of tuples like ( (1,"one"), (2, "two") ).
    """
    def __init__(self, choices, **kwargs):
        self.internal_to_representation = {}
        self.representation_to_internal = {}
        for choice in choices:
            self.internal_to_representation[choice[0]] = choice[1]
            self.representation_to_internal[choice[1]] = choice[0]

        super().__init__(**kwargs)

    def to_internal_value(self, data):
        return self.representation_to_internal[data]

    def to_representation(self, value):
        return self.internal_to_representation[value]


class ParticipantSerializer(serializers.ModelSerializer):
    user = UserProfileSerializer(read_only=True)
    role = ChoiceField(choices=Participant.ROLE_CHOICES)

    class Meta:
        model = Participant
        fields = ['user', 'role']


class PennyChatSerializer(serializers.HyperlinkedModelSerializer):
    follow_ups = serializers.HyperlinkedIdentityField(view_name='followup-list')
    participants = ParticipantSerializer(many=True, read_only=True)

    class Meta:
        model = PennyChat
        fields = ['id', 'url', 'title', 'description', 'date', 'follow_ups', 'participants']


class UserChatSerializer(serializers.ModelSerializer):
    penny_chat = serializers.HyperlinkedRelatedField(
        queryset=PennyChat.objects.all(),
        view_name='pennychat-detail'
    )
    role = ChoiceField(choices=Participant.ROLE_CHOICES)

    class Meta:
        model = Participant
        fields = ['penny_chat', 'role']


class FollowUpSerializer(serializers.HyperlinkedModelSerializer):
    penny_chat = serializers.HyperlinkedRelatedField(
        queryset=PennyChat.objects.all(),
        view_name='pennychat-detail'
    )
    user = UserProfileSerializer(read_only=True)

    class Meta:
        model = FollowUp
        fields = ['id', 'url', 'penny_chat', 'content', 'date', 'user']
