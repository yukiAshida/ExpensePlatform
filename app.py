from app import app
from config import LOCAL_DEBUG

if LOCAL_DEBUG:
    app.run(debug=True, host="127.0.0.1", port=8000)

    