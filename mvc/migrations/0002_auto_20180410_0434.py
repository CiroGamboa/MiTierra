# Generated by Django 2.0.4 on 2018-04-10 04:34

from django.db import migrations
import django_google_maps.fields


class Migration(migrations.Migration):

    dependencies = [
        ('mvc', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='rental',
            name='geolocation',
            field=django_google_maps.fields.GeoLocationField(max_length=100),
        ),
    ]
