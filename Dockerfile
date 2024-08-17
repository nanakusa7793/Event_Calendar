FROM python:3.11-slim
RUN useradd -m appuser
WORKDIR /app
COPY --chown=appuser:appuser requirements.txt requirements.txt
COPY --chown=appuser:appuser . .
RUN chown -R appuser:appuser /app
RUN pip install -r requirements.txt
ENV PYTHONUNBUFFERED=1
ENV DJANGO_SETTINGS_MODULE=EventBoard.settings
USER appuser
RUN python manage.py collectstatic --noinput
RUN python manage.py migrate
RUN chmod +x /app/entrypoint.sh
ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--timeout", "600", "--log-level", "debug", "--access-logfile", "-", "EventBoard.wsgi:application"]

