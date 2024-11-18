Todo Application
A full-stack todo application built with Django REST Framework and React. The application allows users to create projects and manage todos within those projects.
Features

User authentication with JWT tokens
Create, read, update, and delete projects
Manage todos within projects

Prerequisites

Python 3.8+
Node.js 14+
npm or yarn
github token 

Installation
Backend Setup

Clone the repository:

bashCopygit clone <repository-url>
cd todo-application

Create and activate a virtual environment:

bashCopypython -m venv env
# On Windows
env\Scripts\activate
# On Unix or MacOS
source env/bin/activate

Install Python dependencies:

pip install -r requirements.txt

Apply database migrations:

python manage.py migrate

Run the development server:

python manage.py runserver

The backend will be available at http://127.0.0.1:8000/
Frontend Setup

Navigate to the frontend directory:

cd frontend

Install dependencies:
npm install

Start the development server:

npm run dev

# Exporting the summary

For summarizing to markdoms the code is defined in the utils.py in api 

to run this go to the url https://localhost/api/<pk:id>(project id)/export

when going to the url the project summary is exported to the gist
