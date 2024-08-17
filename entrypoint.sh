if [ -f /app/db.sqlite3 ]; then
  chown appuser:appuser /app/db.sqlite3 || true
  chmod 664 /app/db.sqlite3 || true
fi

echo "Starting entrypoint.sh"
echo "Current directory:"
pwd
echo "Current directory contents:"
ls -la

if [ -f /app/db.sqlite3 ]; then
  echo "Database file /app/db.sqlite3 found"
else
  echo "Database file /app/db.sqlite3 not found"
fi

python manage.py migrate
python manage.py collectstatic --noinput

exec "$@"
