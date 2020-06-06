FROM python:3.7.7-alpine3.11

WORKDIR /${BLIND_SQL}/
COPY . /${BLIND_SQL}/

RUN export FLASK_ENV=production

RUN pip3 install python-dotenv flask mysql-connector-python

EXPOSE ${PORT_BLIND_SQL}

CMD python3 index.py