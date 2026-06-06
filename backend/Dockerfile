FROM python:3.11-slim

RUN apt-get update && apt-get upgrade -y && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .

RUN pip install --upgrade pip

RUN pip install --no-cache-dir -r requirements.txt
RUN pip install playwright \
&& playwright install --with-deps
COPY . .

RUN apt-get update && apt-get install -y tzdata
ENV TZ=Asia/Manila


CMD ["gunicorn", "app.main:app","-k","uvicorn.workers.UvicornWorker","-w","4", "--bind","0.0.0.0:8001"]

EXPOSE 8001
