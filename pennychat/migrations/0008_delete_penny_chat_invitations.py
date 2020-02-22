from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('pennychat', '0007_auto_20200210_0424'),
    ]

    operations = [
        migrations.DeleteModel(
            name='PennyChatInvitation',
        ),
    ]
