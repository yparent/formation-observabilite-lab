FROM python:3.13-slim
WORKDIR /app
RUN pip install --no-cache-dir flask==3.1.3 prometheus-client==0.26.0
COPY inbox.py .
EXPOSE 8080
CMD ["python", "-u", "inbox.py"]
