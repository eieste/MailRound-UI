FROM node:8.16.0-jessie


COPY . /app/

RUN cd /app ; \
    npm install; \
    npm run build


FROM python:3.6.8

COPY --from=0 /app/build/ /usr/src/app/

COPY ./app.py /usr/src/app/

RUN pip3 install Flask==1.0.3 Flask-Caching==1.7.2 Flask-Cors==3.0.7 gunicorn

WORKDIR /usr/src/app/


# ENV FLASK_APP=
ENTRYPOINT ["flask"]


CMD ["run", "-h", "0.0.0.0", "-p", "80" ]


