from rest_framework import serializers


class GoogleOAuthSerializer(serializers.Serializer):
    authorization_url = serializers.CharField()


class GCalDateTimeSerializer(serializers.Serializer):
    date_time = serializers.DateTimeField()


class GCalEventSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    html_link = serializers.CharField(read_only=True)
    summary = serializers.CharField()
    description = serializers.CharField()
    start = GCalDateTimeSerializer()
    end = GCalDateTimeSerializer()
    hangout_link = serializers.CharField(read_only=True)
