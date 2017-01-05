# -*- coding: utf-8 -*-
# Generated by Django 1.10.4 on 2017-01-02 23:56
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion
import keops.models.fields


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0008_alter_user_username_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='Action',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', keops.models.fields.CharField(blank=True, max_length=256, null=True)),
                ('action_type', keops.models.fields.CharField(blank=True, max_length=16, null=True)),
                ('usage', keops.models.fields.TextField(blank=True, null=True)),
                ('help', keops.models.fields.TextField(blank=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='BaseModel',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', keops.models.fields.CharField(blank=True, max_length=128, null=True)),
                ('app_label', keops.models.fields.CharField(blank=True, max_length=64, null=True)),
            ],
            options={
                'db_table': 'base_table',
            },
        ),
        migrations.CreateModel(
            name='Menu',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', keops.models.fields.CharField(blank=True, max_length=128, null=True)),
                ('active', models.BooleanField(default=True)),
                ('sequence', keops.models.fields.IntegerField(blank=True, default=100, null=True)),
                ('icon', keops.models.fields.CharField(blank=True, max_length=256, null=True)),
                ('groups', models.ManyToManyField(to='auth.Group')),
                ('parent', keops.models.fields.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='base.Menu')),
            ],
        ),
        migrations.CreateModel(
            name='WindowAction',
            fields=[
                ('action_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='base.Action')),
                ('domain', keops.models.fields.TextField(blank=True, null=True)),
                ('context', keops.models.fields.TextField(blank=True, null=True)),
                ('object_id', keops.models.fields.BigIntegerField(blank=True, null=True)),
                ('target', keops.models.fields.CharField(blank=True, choices=[('current', 'Current Window'), ('new', 'New')], default='current', max_length=16, null=True)),
                ('view_mode', keops.models.fields.CharField(blank=True, default='list,form', max_length=128, null=True)),
                ('view_type', keops.models.fields.CharField(blank=True, choices=[('list', 'List'), ('form', 'Form')], default='form', max_length=16, null=True)),
                ('limit', models.PositiveIntegerField(default=100)),
                ('filter', models.BooleanField(default=False)),
                ('auto_search', models.BooleanField(default=True)),
                ('model', keops.models.fields.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='+', to='base.BaseModel')),
                ('source_model', keops.models.fields.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='+', to='base.BaseModel')),
            ],
            options={
                'db_table': 'base_window_action',
            },
            bases=('base.action',),
        ),
    ]