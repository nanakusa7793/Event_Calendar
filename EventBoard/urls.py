from django.contrib import admin
from django.urls import path, include
from events.views import calendar_view
from django.views.generic.base import RedirectView
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('events/calendar/', calendar_view, name='calendar'),
    path('api/', include('events.urls')),
    path('events/', include('events.urls')),
    path('', RedirectView.as_view(url='/events/calendar/', permanent=True)),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
