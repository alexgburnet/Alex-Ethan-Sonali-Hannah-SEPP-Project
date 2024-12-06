#!/bin/bash

cd Frontend
npm install
npm run dev &

cd ../Backend


if command -v python3 &> /dev/null
then
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    python app.py
else
    python -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    python app.py
fi