# Generated by Django 4.1.13 on 2025-03-06 14:55

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='application',
            name='parsed_fields',
        ),
    ]
