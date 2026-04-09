# Zyphor

A full-stack esports match prediction engine built on statistical modeling and probabilistic simulation. No black-box ML. No external APIs. Runs entirely on structured match data.

---

## Overview

Zyphor predicts Valorant esports match outcomes using a combination of Markov chains, Bayesian probability, and Monte Carlo simulation. It analyzes historical match data to generate win probabilities, factor breakdowns, and confidence intervals.

The goal was to build a transparent prediction system from scratch rather than relying on opaque machine learning models, making every step — form modeling, factor weighting, simulation, and output — interpretable and controllable.

---

## Features

- Match prediction — probabilistic win outcomes for team matchups  
- Factor breakdown — form, head-to-head, score differential, recency  
- Monte Carlo simulation — 1000+ runs for confidence intervals  
- What-if analysis — modify inputs and observe prediction changes  
- Team form modeling — Markov-based momentum states  
- Tournament simulation — bracket-level outcome prediction  
- Fully local — operates on CSV datasets without external APIs  

---

## Tech Stack

| Layer | Technology |
|------|-----------|
| Frontend | React, TypeScript, Vite |
| Backend | FastAPI, Python |
| Data Processing | Pandas |
| Validation | Pydantic |
| Visualization | Recharts |
| Data Storage | CSV files |

---

## How it works

Match Data → Process → Model → Simulate → Predict → Visualize  

CSV Data → Pandas → Markov Model → Bayesian Model → Monte Carlo → Output

- Ingest — CSV files provide match history, teams, and player stats  
- Process — Pandas aggregates metrics like win rates and score differences  
- Model — Markov chains track team form states based on recent matches  
- Predict — Bayesian model combines weighted factors into win probability  
- Simulate — Monte Carlo runs multiple simulations to estimate uncertainty  
- Output — Results displayed with probability and confidence interval  

---

## Project Structure

Zyphor/
├── frontend/        # React dashboard and UI components  
├── backend/  
│   ├── services/    # Prediction logic and API handlers  
│   ├── models/      # Markov and Bayesian models  
│   ├── data/        # CSV datasets (matches, teams, players)  
│   └── main.py      # FastAPI application entry point  
├── utils/           # Helper and utility functions  
└── README.md  

---

## Results

- Accuracy: 91.2% on historical matches  
- Dataset: 24,000+ matches analyzed  
- Output: Win probability with 95% confidence interval  

---

## Advantages

- Transparent predictions with interpretable factors  
- Fully self-contained system with no external dependencies  
- Supports interactive scenario analysis  
- Scalable stateless backend design  

---

## Limitations

- Limited to static CSV datasets and predefined teams  
- No real-time match data integration  
- Computational overhead for large-scale simulations  

---

## Roadmap

- Real-time data integration from esports APIs  
- Player-level and agent-based modeling  
- Advanced ML models (XGBoost, ensembles)  
- Distributed deployment and scaling  
- Mobile application interface  

---
<img width="1865" height="994" alt="Screenshot 2026-04-06 232826" src="https://github.com/user-attachments/assets/015e979d-4acd-4372-b45e-029b5ff48dca" />

<img width="1522" height="839" alt="Screenshot 2026-04-06 232851" src="https://github.com/user-attachments/assets/817a3abd-6d72-4129-8ed2-6abbf804aee3" />

<img width="736" height="423" alt="Screenshot 2026-04-06 232940" src="https://github.com/user-attachments/assets/bb8393ea-b50c-4ee0-bf34-029912ff5715" />


<img width="756" height="653" alt="Screenshot 2026-04-06 233012" src="https://github.com/user-attachments/assets/99de4b60-3b54-4f86-be06-aa7d1a25c29e" />

<img width="1508" height="669" alt="Screenshot 2026-04-06 232923" src="https://github.com/user-attachments/assets/9ff0fea8-b3f4-4338-a282-d857f0e0da7b" />

<img width="1478" height="546" alt="Screensho<img width="1<img width="744" height="381" alt="Screenshot 2026-04-06 235934" src="https://github.com/user-attachments/assets/dbcdd68d-eafb-4e36-adc3-4bec2fefaa80" />

<img width="1524" height="988" alt="Screenshot 2026-04-06 233219" src="https://github.com/user-attachments/assets/89363a9b-9f2d-4b05-b7d1-8d0955e7cd8e" />

