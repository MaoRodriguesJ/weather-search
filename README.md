# weather-search

This is a project for a challenge in a hiring process. It was made within one week (around 20~25hrs of work) following this main requirements:

- Python for the backend
- React for the frontend
- Search for a location using google maps api
- Search for a weather using open weather api
- Search only for locations with a zipcode
- Assume that a weather does not change within one hour gap
- Display a list of last searches

The project uses Python with fastapi, React and PostgreSQL

To be able to run the project you will need to generate a key within google and change it in `frontend/public/index.html`

## Running with Docker and docker-compose

First you can build the docker images with `docker-compose build`

Then you should start the Postgres database with `docker-compose up postgres -d`. After a few seconds the database should be up and ready to go.

After the database is running, you will need to migrate it with `docker-compose run api alembic upgrade head`.

With that the application is ready to run, so you can use `docker-compose up`. The api will be running under localhost:8000 and the frontend under localhost:3000

## Running locally

If you want to run this locally and be able to make changes to the api and to the frontend you will need Python, Node and Yarn.

For the database Docker and docker-compose still are a better option. So you can just start with `docker-compose up postgres -d`

For the frontend you will need to change the proxy config from `package.json`. Change it to `"proxy": "http://127.0.0.1:8000"`. Then you can use `yarn install` and `yarn start`.

For the backend is better to create a virtualenv for the python requirements. You can create and activate one with `python -m venv env` and `source env/bin/activate`. The you can install the dependencies with `pip install -r requirements.txt`. You will also need to update the `.env` file in the root directory with the following `DATABASE_URL = postgresql+psycopg2://dev:dev@localhost:5432`.

With that you can run the database migrations with `alembic upgrade head` and start the fastapi with `python app.py`
