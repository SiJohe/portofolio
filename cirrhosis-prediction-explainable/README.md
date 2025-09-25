# Cirrhosis Prediction with Explainable Machine Learning
## Project Overview  
This project tackles a **multiclass classification** problem: predicting cirrhosis stages from a clinical dataset provided by faculty.  
Unlike the previous cirrhosis project (Kaggle dataset), this study integrates **explainability techniques** (SHAP values) to understand how features influence predictions.  

## 📊 Dataset  
- Source: Provided by faculty (confidential dataset, not publicly available).  
- Data cleaning and preprocessing were applied (removing duplicates, handling missing values, encoding categorical variables, scaling numerical features).  
- Target variable: **Stage** (multiple cirrhosis stages).  

## 🔄 Workflow  
1. **Exploratory Data Analysis (EDA)**  
   - Inspected missing values, distributions, and outliers.  
   - Explored feature correlations.  

2. **Preprocessing**  
   - Train-test split.
   - Encoded categorical variables.  
   - Scaled numerical features.  

4. **Modeling**  
   - Implemented **Random Forest** and **XGBoost** classifiers.  
   - Conducted hyperparameter tuning to optimize performance.  

5. **Explainability**  
   - Applied **SHAP values** to analyze feature importance and interpret model predictions.  
   - Identified clinical features contributing most to prediction outcomes.  

6. **Evaluation**  
   - Model performance remained modest, primarily due to:  
     - Small dataset size.  
     - Class imbalance across cirrhosis stages.  
   - However, SHAP analysis provided valuable insights into feature contributions.  

## 🛠️ Tools & Libraries  
- Python, VSCode  
- pandas, numpy, matplotlib, seaborn  
- scikit-learn, XGBoost  
- SHAP (explainability)  

## 📈 Key Insights  
- Predicting cirrhosis stages from limited medical data is challenging; models struggled to achieve strong accuracy and recall.  
- **Model interpretability (SHAP)** revealed meaningful clinical feature contributions, making results more actionable.  
- This project demonstrates the importance of **balancing performance with explainability** in healthcare machine learning applications.  
