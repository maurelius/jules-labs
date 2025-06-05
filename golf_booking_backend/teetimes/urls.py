from django.urls import path
from . import views

urlpatterns = [
    path('teetimes/', views.TeeTimeList.as_view(), name='teetime-list'),
    path('teetimes/<int:pk>/', views.TeeTimeDetail.as_view(), name='teetime-detail'),
] 