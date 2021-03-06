# -*- coding: utf-8 -*-
# Generated by Django 1.11.8 on 2017-12-18 21:55
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('accounts', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Item',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('description', models.CharField(max_length=255)),
                ('company', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='accounts.Company')),
            ],
        ),
        migrations.CreateModel(
            name='ItemField',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('field_type', models.CharField(max_length=255)),
                ('field_value', models.CharField(max_length=255)),
                ('item_pointer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='inventory.Item')),
            ],
        ),
    ]
