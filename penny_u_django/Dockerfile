FROM python:3

WORKDIR /usr/src/app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD [ "uwsgi", "--http-socket", "0.0.0.0:80", "--wsgi-file", "penny_u_django/wsgi.py", "--master", "--processes", "4", "--threads", "2"]

