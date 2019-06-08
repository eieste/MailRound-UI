FROM node:8.16.0-jessie


COPY ./src /app/src
COPY ./public /app/public
COPY ./package.json /app/package.json
COPY ./package-lock.json /app/package-lock.json

RUN cd /app ; npm install
RUN cd /app ; npm run build


FROM tiangolo/uwsgi-nginx-flask:python3.7

RUN pip3 install Flask-Caching==1.7.2 Flask-Cors==3.0.7 gunicorn

COPY --from=0 /app/build/ /app/
COPY main.py /app/
ENV UWSGI_INI /app/uwsgi.ini
COPY uwsgi.ini /app/
WORKDIR /app
