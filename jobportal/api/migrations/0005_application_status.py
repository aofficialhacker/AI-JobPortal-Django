# Generated by Django 4.1.13 on 2025-03-07 15:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_job_posted_by'),
    ]

    operations = [
        migrations.AddField(
            model_name='application',
            name='status',
            field=models.CharField(choices=[('Applied', 'Applied'), ('Interviewed', 'Interviewed'), ('Selected', 'Selected'), ('Rejected', 'Rejected'), ('On Hold', 'On Hold')], default='Applied', max_length=20),
        ),
    ]
