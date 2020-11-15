# Generated by Django 2.2.13 on 2020-10-30 01:38

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='GoogleCredentials',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('token', models.TextField()),
                ('refresh_token', models.TextField()),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='google_credentials', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='GoogleCredentialsScope',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('scope', models.TextField()),
                ('credentials', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='scopes', to='integrations.GoogleCredentials')),
            ],
        ),
    ]