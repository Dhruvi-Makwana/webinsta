# Generated by Django 4.1.7 on 2023-03-22 04:51

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("user", "0007_alter_comment_options"),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="comment",
            options={"verbose_name": "comment", "verbose_name_plural": "commens"},
        ),
    ]