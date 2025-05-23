from rest_framework import viewsets, permissions, serializers
from .models import Golfer, TeeTime, Booking
from .serializers import GolferSerializer, TeeTimeSerializer, BookingSerializer

class GolferViewSet(viewsets.ModelViewSet):
    queryset = Golfer.objects.all()
    serializer_class = GolferSerializer
    permission_classes = [permissions.AllowAny] # For now, allow any access.

class TeeTimeViewSet(viewsets.ModelViewSet):
    queryset = TeeTime.objects.all().order_by('start_time')
    serializer_class = TeeTimeSerializer
    permission_classes = [permissions.AllowAny] # For now, allow any access.

class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [permissions.AllowAny] # For now, allow any access.

    def perform_create(self, serializer):
        tee_time = serializer.validated_data['tee_time']
        number_of_players = serializer.validated_data['number_of_players']

        if tee_time.available_slots >= number_of_players:
            tee_time.available_slots -= number_of_players
            tee_time.save()
            serializer.save()
        else:
            raise serializers.ValidationError("Not enough available slots for this tee time.")

    def perform_destroy(self, instance):
        tee_time = instance.tee_time
        number_of_players = instance.number_of_players
        tee_time.available_slots += number_of_players
        tee_time.save()
        instance.delete()
