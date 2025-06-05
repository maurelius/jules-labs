from rest_framework import generics
from .models import TeeTime
from .serializers import TeeTimeSerializer
from rest_framework.filters import OrderingFilter
import logging

logger = logging.getLogger(__name__)

class TeeTimeList(generics.ListCreateAPIView):
    queryset = TeeTime.objects.all().order_by('start_time')
    serializer_class = TeeTimeSerializer
    filter_backends = [OrderingFilter]
    ordering_fields = ['start_time']
    ordering = ['start_time']  # Default ordering

    def create(self, request, *args, **kwargs):
        logger.info(f"Received tee time creation request with data: {request.data}")
        return super().create(request, *args, **kwargs)

class TeeTimeDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = TeeTime.objects.all()
    serializer_class = TeeTimeSerializer 