FROM python:3.7.7-alpine3.11

WORKDIR /secret-directory/
COPY . /secret-directory/

RUN export FLASK_ENV=production

RUN pip3 install python-dotenv flask

EXPOSE ${PORT}

CMD python3 index.py