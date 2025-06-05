from django.db import models

class TeeTime(models.Model):
    start_time = models.DateTimeField()
    course_section = models.CharField(max_length=100, default='Main Course')
    available_slots = models.IntegerField(default=4)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['start_time']

    def __str__(self):
        return f"{self.start_time} - {self.course_section}" 