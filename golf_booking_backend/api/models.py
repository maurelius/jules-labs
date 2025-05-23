from django.db import models

class Golfer(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    notes = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name

class TeeTime(models.Model):
    start_time = models.DateTimeField(unique=True)
    course_section = models.CharField(max_length=50, default='Main Course')
    available_slots = models.IntegerField(default=4)

    def __str__(self):
        return f"{self.course_section} - {self.start_time.strftime('%Y-%m-%d %H:%M')}"

class Booking(models.Model):
    tee_time = models.ForeignKey(TeeTime, on_delete=models.CASCADE, related_name='bookings')
    golfer = models.ForeignKey(Golfer, on_delete=models.CASCADE, related_name='bookings')
    number_of_players = models.IntegerField(default=1)
    booking_time = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Booking for {self.golfer.name} at {self.tee_time.start_time.strftime('%Y-%m-%d %H:%M')}"
