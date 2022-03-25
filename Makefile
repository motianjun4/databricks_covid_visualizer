run:
	uvicorn main:app --port 8000 --host 0.0.0.0
install:
	pip install -r requirements.txt