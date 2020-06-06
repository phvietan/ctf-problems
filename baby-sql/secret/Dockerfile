FROM python:3.7.7-alpine3.11

WORKDIR /${BABY_SQL}/
COPY . /${BABY_SQL}/

RUN export FLASK_ENV=development

RUN pip3 install python-dotenv flask mysql-connector-python

EXPOSE ${PORT_BABY_SQL}

CMD python3 index.py