from . import fields as models
from django.db.models import CASCADE


class Report(models.Model):
    name = models.CharField(max_length=256)

    class Meta:
        db_table = 'keops_report'

    def __str__(self):
        return self.name


class UserReport(models.Model):
    name = models.CharField(max_length=256)
    report = models.ForeignKey(Report, on_delete=CASCADE)
    empresa_id = models.IntegerField(blank=True, null=True)
    user_id = models.IntegerField(blank=True, null=True)
    user_params = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'keops_user_report'

    def __str__(self):
        return self.name
