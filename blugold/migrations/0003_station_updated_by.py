# Generated by Django 4.1 on 2022-08-29 20:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blugold', '0002_station_google_id'),
    ]

    operations = [
        migrations.AddField(
            model_name='station',
            name='updated_by',
            field=models.CharField(default=0, max_length=240, verbose_name='updated_by'),
            preserve_default=False,
        ),
    ]
