# Inspection system  API

This RestAPI was made using Django RESTframework. This document will explain you all you need in order to be able to run it locally

## Prerequisites

- Python 3.10 or higher
- `pip` (Python package installer)
- (Recommended) A virtual environment tool such as `venv`

## Setup Instructions

1. **Create and Activate a Virtual Environment (Recommended)**   
    is recommended to use a virual envorment but if you like to install all of this dependencies locally and they work just fine for you you can skip this step.

```bash
    python3 -m venv venv
    source venv/bin/activate
```

2. **Install Dependencies**  
Install the required packages inside the `requirements.txt` file.

```bash
    pip install -r requirements.txt
```

3. **Apply Database migrations**   
    By the way the database to be used for this project is SQLite meaning that if at any time you want to explore it further you can see the file created on the root folder called db.sqlite3

```bash
    python3 manage.py makemigrations
    python3 manage.py migrate
```

4. **Run seeders to populate test data**   
`NOTE: IS REALLY IMPORTANT FOR YOU TO KEEP IN MIND THAT FOR THIS VERSION THE BACKEND OR FRONTEND DOES NOT HAVE A REGISTER FEATURE SO YOU WILL HAVE TO USE THE ONES PROVIDED BY THE SEEDER THAT I WILL LEAVE AT THE END OF THE DOCUMENT`

```bash
    python3 manage.py seed_db
```

5. **Run the Development Server**
```bash
    python3 manage.py runserver
```
The backend API should now be accessible at http://localhost:8000/.

## Additional details
- **CORS configuraton:**  
    in the root folder you'll be able to find a folder called `backend/`,  inside you will find a file called `settings.py` by default for this project the front will be runing on http://localhost:5173/ but in case you are already on production or you have different configurations and the front end is exposed at a different port you just have to edit the following line with your front end URL to consume the API or the URL and port of your feont running locally.

```python
    CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173", # React
    ]
```

- **Credentials for test users**

    `Admin user:`  
username: admin  
password: supersecret123

    `Inspector user:`  
username: inspector  
password: supersecret123