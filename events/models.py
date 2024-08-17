from django.db import models

class Event(models.Model):
    title = models.CharField(max_length=100)
    start_date = models.DateField()
    start_time = models.TimeField(null=True, blank=True)
    end_date = models.DateField()
    end_time = models.TimeField(null=True, blank=True)
    content = models.TextField()
    url = models.URLField(blank=True, null=True)

    def __str__(self):
        return self.title
