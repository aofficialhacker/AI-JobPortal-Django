============================================================
Job Portal Project - README
============================================================

A small web application where recruiters can post jobs and manage applications, 
and candidates can register, view jobs, and apply by uploading a resume. 
A third-party (Gemini) API parses the uploaded resume, and recruiters can see 
the parsed details in their dashboard.

------------------------------------------------------------
1. Project Structure
------------------------------------------------------------

jobportal/
├─ backend/
│  ├─ jobportal/               # Django project root
│  │  ├─ settings.py
│  │  ├─ urls.py
│  │  └─ ...
│  ├─ api/                     # Django app with models, views, serializers
│  │  ├─ models.py
│  │  ├─ views.py
│  │  ├─ serializers.py
│  │  └─ ...
│  └─ manage.py
└─ frontend/
   ├─ package.json
   ├─ src/
   │  ├─ App.js
   │  ├─ components/
   │  │  ├─ NavBar.js
   │  │  ├─ Login.js
   │  │  ├─ JobListings.js
   │  │  ├─ Dashboard.js
   │  │  ├─ ApplyJob.js
   │  │  └─ ...
   └─ ...

------------------------------------------------------------
2. Prerequisites
------------------------------------------------------------

- Python 3.10+ (or a version compatible with Django/djongo)
- Node.js & npm (or yarn)
- MongoDB (local or cloud instance)
- Django, djongo, and other dependencies listed in requirements.txt
- React (Create React App or similar)

------------------------------------------------------------
3. Backend Setup (Django)
------------------------------------------------------------

1) Clone the repository:
   git clone https://github.com/yourusername/jobportal.git
   cd jobportal/backend

2) Create & activate a virtual environment:
   python -m venv env
   source env/bin/activate   # On Windows: env\Scripts\activate

3) Install dependencies:
   pip install -r requirements.txt

4) Configure database in jobportal/settings.py:
   DATABASES = {
       'default': {
           'ENGINE': 'djongo',
           'NAME': 'your_db_name',
           'CLIENT': {
               'host': 'mongodb+srv://user:pass@cluster.mongodb.net/your_db_name?retryWrites=true',
           },
       }
   }

5) Run migrations:
   python manage.py makemigrations
   python manage.py migrate

6) Create a superuser (optional):
   python manage.py createsuperuser

7) Start the server:
   python manage.py runserver
   (Server runs on http://127.0.0.1:8000 by default.)

------------------------------------------------------------
4. Frontend Setup (React)
------------------------------------------------------------

1) Navigate to frontend folder:
   cd ../frontend

2) Install dependencies:
   npm install
   # or yarn

3) Configure proxy or API URLs if needed in package.json.

4) Start the development server:
   npm start
   (Runs on http://localhost:3000 by default.)

------------------------------------------------------------
5. Usage
------------------------------------------------------------

A) Register & Login
   - Visit http://localhost:3000/register to create an account (role: recruiter or candidate).
   - Then http://localhost:3000/login to log in. A JWT token is stored in localStorage.

B) Recruiter Flow
   - Post jobs, view & edit your job postings, and see all candidate applications 
     in the recruiter dashboard or /api/recruiter/applications/.

C) Candidate Flow
   - View available jobs after logging in.
   - Apply by uploading a PDF resume (calls a Gemini resume parser).
   - Check your submitted applications in the candidate dashboard or /api/candidate/applications/.

------------------------------------------------------------
6. API Testing (Postman)
------------------------------------------------------------

1) Register:
   POST /api/auth/register/
   Body (JSON):
   {
     "username": "testuser",
     "email": "test@example.com",
     "password": "testpass",
     "role": "candidate"
   }

2) Login:
   POST /api/auth/login/
   Body (JSON):
   {
     "username": "testuser",
     "password": "testpass"
   }
   Copy the 'access' token from response and use 'Authorization: Bearer <token>' 
   for subsequent requests.

3) Create a Job (recruiter only):
   POST /api/jobs/
   Body (JSON):
   {
     "title": "Data Engineer",
     "description": "We need a data engineer...",
     "status": "open"
   }

4) Get All Jobs:
   GET /api/jobs/

5) Apply for a Job (candidate only):
   POST /api/applications/
   Form-Data:
     - job = <job_id>
     - resume = (file) resume.pdf

6) Recruiter Applications:
   GET /api/recruiter/applications/

7) Candidate Applications:
   GET /api/candidate/applications/

------------------------------------------------------------
7. Troubleshooting
------------------------------------------------------------

- CORS Issues: Install django-cors-headers and configure CORS in settings.py.
- MongoDB ObjectId vs. Integer PK: Make sure your job ID type (ObjectId or integer) 
  matches what you send from the frontend.
- Resume Parsing Fails: Check Gemini API key and logs for errors.
- Permissions: Recruiters can only manage their own jobs/applications; candidates 
  can only apply to jobs and see their own applications.

------------------------------------------------------------
8. Contributing
------------------------------------------------------------

1) Fork the repository.
2) Create a feature branch.
3) Commit your changes.
4) Open a pull request.


Contact
------------------------------------------------------------

Project Maintainer: Vishal Gor
Email: rajgorvishal28@gmail.com
GitHub: https://github.com/aofficialhacker/jobportal
