# -*- coding: utf-8 -*-
# Generated by Django 1.11.8 on 2017-12-13 18:41
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0006_fields_empty'),
    ]

    operations = [
        migrations.AddField(
            model_name='template',
            name='metadata',
            field=models.ManyToManyField(related_name='metadata_fields', to='app.Fields'),
        ),
    ]