# Generated by Django 4.2.6 on 2023-11-24 15:27

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("user", "0001_initial"),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="user",
            options={"verbose_name": "user", "verbose_name_plural": "users"},
        ),
        migrations.AlterModelTable(
            name="user",
            table=None,
        ),
    ]
