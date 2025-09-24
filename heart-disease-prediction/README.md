# Heart Disease Classification
This project focuses on building a binary classification model to predict the presence of heart disease based on patient health data. The objective is to apply machine learning techniques, from data exploration to model evaluation, and achieve a reliable prediction system.

## Workflow
1. **Exploratory Data Analysis (EDA)**  
   - Checked missing values, feature distribution, and data normality.  
   - Identified key patterns in numeric features.  

2. **Preprocessing**  
   - Split dataset into training and test sets.  
   - Scaled numeric features using **RobustScaler** to handle outliers.  

3. **Modeling**  
   - Trained a **Support Vector Machine (SVM)** model, chosen for small dataset size.  
   - Performed hyperparameter tuning for optimal performance.  

4. **Evaluation**  
   - Precision: **87%**  
   - Recall: **87%**  
   - F1-score: **87%**  
   - AUC: **0.95**, indicating the model effectively learned the patterns and is not predicting randomly.  

## 🛠️ Tools & Libraries
- Python, VSCode  
- pandas, numpy, scikit-learn, matplotlib, seaborn, scipy  

## 📈 Key Insight
- The model achieved 87% precision, 87% recall (macro avg), and 87% F1-score, indicating balanced performance.
- Recall for class 1 (heart disease positive) reached 91%, meaning most true positive cases were correctly identified.
- This high recall is especially important in medical contexts, as it reduces false negatives (patients with heart disease incorrectly predicted as healthy).
- Overall, the model provides reliable predictions and demonstrates strong potential for assisting early detection of heart disease.

---
