# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2017-10-06 15:37
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0007_auto_20171006_1531'),
    ]

    operations = [
        migrations.AddField(
            model_name='experiment',
            name='tags',
            field=models.ManyToManyField(to='app.Tag'),
        ),
    ]