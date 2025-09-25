# Cirrhosis Prediction
## Project Overview
This project addresses a **multiclass classification** problem: predicting the histologic stage of liver cirrhosis (Stages 1–4) from patient clinical and laboratory features. The study emphasizes the challenges of working with small, imbalanced medical datasets and evaluates the effectiveness of tree-based machine learning models.

## Dataset
- Original dataset: 418 patient records with 20 attributes (clinical and laboratory features).  
- After data cleaning and handling missing values: **276 samples** remained.  
- Target variable: **Stage** (histologic stage of cirrhosis, values 1–4).  
- Key features include: Age, Sex, Bilirubin, Albumin, Copper, Platelets, Prothrombin, etc.  

[Cirrhosis Dataset from Kaggle](https://www.kaggle.com/datasets/fedesoriano/cirrhosis-prediction-dataset)

## Workflow
1. **Exploratory Data Analysis (EDA)**  
   - Dropped identifier column (**ID**).  
   - Removed features with excessive missing values (e.g., **Triglycerides** with 32% missing).  
   - Conducted univariate analysis, distribution checks, and outlier inspection.  
   - Explored correlations between clinical features.  

2. **Preprocessing**  
   - **Encoding** categorical features (e.g., Sex, Drug, Ascites, Edema, etc.) using Label Encoder, Ordinal Encoder, and One Hot Encoder.  
   - Split dataset into training and testing sets.  
   - Scaled numeric features to normalize distribution.  

3. **Modeling**  
   - Implemented **Random Forest** and **XGBoost** classifiers.  
   - Applied **HyperOpt** for hyperparameter tuning.  
   - Addressed class imbalance with oversampling/undersampling methods (e.g., SMOTE).  

4. **Evaluation**  
   - Both Random Forest and XGBoost models struggled with this problem.  
   - Even after hyperparameter tuning, **accuracy, precision, recall, and F1-scores remained low**.  
   - Performance issues mainly stemmed from:  
     - **Small dataset size** (276 samples after cleaning).  
     - **Severe class imbalance** across cirrhosis stages.  
     - **Noisy or weakly predictive features**.  

## 🛠️ Tools & Libraries
- Python, VSCode  
- pandas, numpy, matplotlib, seaborn  
- scikit-learn, XGBoost, imbalanced-learn  
- HyperOpt (hyperparameter tuning)  

## 📈 Key Insights
- This project highlights the **difficulty of predicting cirrhosis stages** from limited clinical data.  
- Tree-based models (Random Forest, XGBoost) performed poorly despite careful tuning and resampling.  
- **Recall and F1-scores were low across all classes**, showing the models failed to generalize.  
- Future improvements may include:  
  - Collecting more data or using **data augmentation/resampling** techniques.  
  - Trying **ensemble stacking** or **deep learning models** with regularization.  
  - Incorporating **domain knowledge for feature engineering**.  

---
