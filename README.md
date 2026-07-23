# Automated Answer Script Evaluation

## Overview

Automated Answer Script Evaluation is an AI-powered web application developed to simplify the evaluation of handwritten student answer scripts. The system aims to reduce faculty workload by automating answer assessment, storing results, and providing marks in an organized format.

This project was developed using **React**, **FastAPI**, and **SQLite**, with planned OCR integration for handwritten text extraction.

---

## Features

- Faculty login authentication
- Student answer script upload
- Question paper upload
- AI-based answer evaluation
- Evaluation with or without teacher answer key
- Marks generation
- Downloadable evaluation results
- React frontend with FastAPI backend

---

## Tech Stack

### Frontend
- React (Vite)
- JavaScript
- CSS

### Backend
- FastAPI
- Python
- SQLAlchemy
- SQLite

### AI & NLP
- Sentence Transformers (all-MiniLM-L6-v2)
- Groq LLM API (Llama 3.1)
- Semantic similarity evaluation

---

## Project Structure

```
backend/
    app/
        routes/
        evaluation.py
        models.py
        schemas.py
        database.py
        main.py

frontend/
    src/
        pages/
        api/
```

---

## Evaluation Modes

### 1. Teacher Answer Available
- Splits teacher answer into concepts
- Computes semantic similarity using Sentence Transformers
- Detects missing concepts
- Generates marks out of 10

### 2. Teacher Answer Not Available
- Uses Groq Llama 3.1
- Evaluates answer quality
- Returns marks and feedback

---

## OCR Integration Status

OCR integration is **partially completed**.

### Completed
- Initial OCR research and experimentation
- Google Vision OCR testing
- docTR OCR implementation
- OCR preprocessing pipeline

### Current Status
Fine-tuning the **docTR OCR model** was attempted to improve handwritten text recognition. However, due to limited time and dataset constraints during development, the fine-tuning process was **not successful**, and the OCR pipeline has **not yet been fully integrated** into the application.

The current repository therefore focuses on the evaluation pipeline, while OCR integration remains a future enhancement.

---

## Future Improvements

- Complete handwritten OCR integration
- Successfully fine-tune the docTR model
- Automatic question segmentation
- Multi-page answer sheet support
- Faculty dashboard with analytics
- Export marks to Excel/PDF
- Student transcript download
- Support for multiple subjects

---

## Installation

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Environment Variables

Create a `.env` file or set the following environment variable:

```
GROQ_API_KEY=your_api_key
```

---

## Project Status

⚠️ This project is currently under active development.

The answer evaluation module is functional. OCR integration is incomplete, with fine-tuning of the docTR handwritten OCR model remaining as future work.

---

## License

This project is intended for academic and educational purposes.
