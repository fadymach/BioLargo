# -*- coding: utf-8 -*-
# Generated by Django 1.11.5 on 2017-09-18 21:53
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='experiment',
            name='scientist',
        ),
    ]
