# Generated by Django 2.2.6 on 2019-10-11 04:28

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('bot', '0003_auto_20190715_0138'),
    ]

    operations = [
        migrations.SeparateDatabaseAndState(
            state_operations=[migrations.DeleteModel(name='User')]
        )
    ]