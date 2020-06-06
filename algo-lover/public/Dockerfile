FROM python:3.7.7-alpine3.11

WORKDIR /${ALGO_LOVER}/
COPY . /${ALGO_LOVER}/

RUN pip3 install python-dotenv

EXPOSE ${PORT_ALGO_LOVER}

CMD python3 index.py