# Productivity Score Prediction with ANN
## Project Overview
This project applies **Artificial Neural Networks (ANN)** to predict the productivity score of teams in a clothing manufacturing company. The aim is to explore how deep learning models can capture complex patterns in employee and production-related data, and evaluate whether these models can provide reliable predictions for workforce productivity.

## Dataset
- **Source:** Coursework dataset (not public)  
- **Size:** ~1,200 rows with 15 columns  
- **Features:** demographic attributes, working conditions, time-related features, and production outcomes  
- **Target variable:** Productivity Score  

## Workflow
1. **Exploratory Data Analysis (EDA)**  
   - Handled missing values  
   - Cleaned inconsistent entries  
   - Checked data distributions and identified outliers  

2. **Preprocessing**  
   - Data splitting (train-test split)  
   - Feature scaling and winsorizing to handle extreme outliers  
   - Categorical encoding  
   - Imputation for missing values  

3. **Modeling**  
   - **Baseline Model (Sequential):** 3 hidden layers, 42 neurons each  
   - **Proposed Model (Functional):** 3 hidden layers (64, 64, 42 neurons)  
   - **Hyperparameter Tuning:**  
     - Sequential → best config: 2 hidden layers (168, 336 neurons)  
     - Functional → best config: 2 hidden layers (168, 42 neurons)  

4. **Evaluation**  
   - Compared baseline, proposed, and tuned models  
   - Both tuned models performed **worse** than untuned models  
   - Overall, all models showed **poor performance**  

## Key Insights
- ANN models struggled to capture predictive patterns in this dataset  
- Hyperparameter tuning did not improve performance  
- Indicates potential issues with dataset size, feature richness, or noise  

## Tools & Libraries
- Python, VSCode  
- pandas, numpy  
- matplotlib, seaborn  
- scikit-learn (preprocessing, metrics)  
- TensorFlow / Keras (ANN models)  

## Next Steps
- Explore alternative architectures (regularization, dropout, deeper networks)  
- Compare against ensemble models or gradient boosting  
- Enhance feature engineering (interaction terms, domain-specific aggregates)  
- Improve dataset quality and size for better model generalization  
