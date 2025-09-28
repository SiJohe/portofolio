# 🌫️ Air Temperature Prediction using LSTM
## Project Overview
This project focuses on predicting **air temperature** using time series data with **Long Short-Term Memory (LSTM)** models.  
The dataset was provided as part of coursework and represents environmental and weather-related features.  
The goal is to build and compare baseline and modified LSTM architectures for effective time series forecasting.

---

## Dataset
- Source: Provided by lecturer (course assignment).  
- Target variable: **Air Temperature (AT)**.  
- Features: Meteorological and environmental indicators (after feature selection).  
- Data preprocessing involved handling missing values, scaling, imputing with **KNN Imputer**, and transforming into sequential format for LSTM input.  

---

## Workflow
1. **Exploratory Data Analysis (EDA)**  
   - Inspected dataset for missing values and determined their type.  
   - Checked feature distributions and identified outliers.  
   - Visualized **Air Temperature over time** to observe seasonal patterns.  

2. **Preprocessing**  
   - Selected relevant features for modeling.  
   - Split dataset into **80% training**, **10% validation**, and **10% testing**.  
   - Scaled numerical features.  
   - Handled missing values using **KNN Imputer**.  
   - Transformed dataset into sequential format with **window size = 5** for LSTM.  

3. **Modeling**  
   - **Baseline Model:** LSTM with 1 hidden layer (10 units).  
   - **Modified Model:** LSTM with 2 hidden layers (64 and 32 units), followed by **20% dropout**, then a dense layer (16 neurons) before the output.  

4. **Evaluation Metrics**  
   - Mean Absolute Error (MAE)  
   - Mean Squared Error (MSE)  
   - Coefficient of Determination (R²)  

---

## Results
| Model              | MAE    | MSE    | R²     |
|--------------------|--------|--------|--------|
| **Baseline LSTM**  | 0.6641 | 1.0196 | 0.9366 |
| **Modified LSTM**  | 0.6686 | 1.0075 | 0.9373 |

- Both models achieved **strong performance**, explaining over **93% of the variance** in air temperature.  
- The modified model showed slightly lower MSE and higher R², though MAE increased marginally compared to the baseline.  
- The difference between baseline and modified architectures was **minimal**, suggesting the simpler baseline already generalizes well.

---

## Tools & Libraries
- Python, VSCode  
- pandas, numpy, matplotlib, seaborn  
- scikit-learn (KNN Imputer, scaling, metrics)  
- TensorFlow / Keras (LSTM, Sequential)  

---

## Key Insights
- LSTM models are effective in capturing **seasonal and temporal patterns** in air temperature data.  
- Increasing model complexity (more layers, dropout) did not significantly improve performance, highlighting the adequacy of simpler architectures for this dataset.  
- Handling missing values carefully and scaling features were critical preprocessing steps to stabilize model training.  

---

## Next Steps
- Experiment with **GRU** or **Bidirectional LSTM** for comparison.  
- Apply **feature engineering** with domain knowledge to improve predictive signals.  
- Extend forecasting horizon (multi-step prediction).  
- Try advanced hyperparameter optimization frameworks (Optuna, HyperOpt) for deeper tuning.

---
