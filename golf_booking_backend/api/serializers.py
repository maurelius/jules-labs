from rest_framework import serializers
from .models import Golfer, TeeTime, Booking

class GolferSerializer(serializers.ModelSerializer):
    class Meta:
        model = Golfer
        fields = ['id', 'name', 'email', 'phone', 'notes']

class TeeTimeSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeeTime
        fields = ['id', 'start_time', 'course_section', 'available_slots']

class BookingSerializer(serializers.ModelSerializer):
    tee_time = serializers.PrimaryKeyRelatedField(queryset=TeeTime.objects.all())
    golfer = serializers.PrimaryKeyRelatedField(queryset=Golfer.objects.all())
    booking_time = serializers.DateTimeField(read_only=True)

    class Meta:
        model = Booking
        fields = ['id', 'tee_time', 'golfer', 'number_of_players', 'booking_time']
        depth = 1 # For read operations to include nested TeeTime and Golfer details
