# Generated by Django 4.1.1 on 2022-09-16 13:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blugold', '0003_station_updated_by'),
    ]

    operations = [
        migrations.AlterField(
            model_name='station',
            name='station',
            field=models.CharField(max_length=240, verbose_name='Station'),
        ),
    ]
