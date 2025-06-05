from rest_framework import serializers
from .models import TeeTime

class TeeTimeSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeeTime
        fields = ['id', 'start_time', 'course_section', 'available_slots', 'created_at', 'updated_at'] 