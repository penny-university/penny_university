# Generated by Django 2.2.10 on 2020-10-15 02:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('matchmaking', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='match',
            name='date',
            field=models.DateTimeField(auto_now_add=True, default='2020-10-03'),
            preserve_default=False,
        ),
    ]