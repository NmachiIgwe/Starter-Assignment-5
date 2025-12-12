# Django Boggle Backend

This is the Django backend for the Boggle game application.

## Setup Instructions

### 1. Install Python 3.11 or higher
```bash
python3 --version
```

If not installed or version is less than 3.11:
```bash
sudo apt update
sudo apt install python3.11
```

### 2. Install Django and Dependencies
```bash
pip install django djangorestframework django-cors-headers
```

Or install from requirements.txt:
```bash
pip install -r requirements.txt
```

### 3. Run Migrations
```bash
python3 manage.py makemigrations
python3 manage.py migrate
```

### 4. Create Superuser (Optional)
```bash
python3 manage.py createsuperuser
```

### 5. Update Settings
Before running the server, make sure to:
- Update `CORS_ALLOWED_ORIGINS` in `boggle_backend/settings.py` with your Codio box URL
- Replace `XXXXXXXXXXXXXXXX` in the CORS settings with your actual Codio box name

### 6. Run the Server
```bash
python3 manage.py runserver 0.0.0.0:8000
```

The server will be accessible at: `https://<your-codio-box-name>-8000.codio.io`

## API Endpoints

### Create a Random Game
```
GET /api/game/create/<size>
```
Example: `https://your-box-8000.codio.io/api/game/create/4`

### List All Games
```
GET /api/games/
```
Example: `https://your-box-8000.codio.io/api/games/`

### Get Game by ID
```
GET /api/game/<id>
```
Example: `https://your-box-8000.codio.io/api/game/1`

### Delete Game by ID
```
DELETE /api/game/<id>
```
Example: `DELETE https://your-box-8000.codio.io/api/game/1`

## Project Structure

```
boggle_backend/
├── manage.py
├── boggle_backend/
│   ├── settings.py
│   ├── urls.py
│   └── static/
│       └── data/
│           └── full-wordlist.json
└── api/
    ├── models.py
    ├── views.py
    ├── serializers.py
    ├── urls.py
    ├── randomGen.py
    ├── readJSONFile.py
    └── boggle_solver.py
```

## Notes

- The wordlist file (`full-wordlist.json`) should be located in `boggle_backend/static/data/`
- Games are stored in SQLite database (`db.sqlite3`)
- Grid size must be between 3 and 10 (inclusive)

