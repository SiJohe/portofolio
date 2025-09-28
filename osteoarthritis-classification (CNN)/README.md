# 🦴 Osteoarthritis Image Classification using CNN
## Project Overview
This project focuses on **multiclass image classification** of osteoarthritis severity levels using deep learning. The dataset consists of X-ray images categorized into 5 classes:
- **Normal**
- **Doubtful**
- **Mild**
- **Moderate**
- **Severe**

The goal is to evaluate the performance of different CNN architectures in classifying osteoarthritis severity, which is a challenging medical imaging task.

---

## Dataset
- Medical X-ray dataset.  
- 5 balanced categories representing different osteoarthritis stages.  
- Images are grayscale but stored in 3-channel (RGB) format.  
- Image sizes are consistent with no anomalies, moderate brightness levels.  

---

## Workflow
1. **Exploratory Data Analysis (EDA)**  
   - Checked class distribution (reasonably balanced).  
   - Inspected image color histograms → grayscale despite RGB format.  
   - Verified resolution uniformity and absence of corrupted files.  
   - Brightness analysis showed moderate, consistent contrast across samples.  

2. **Preprocessing**  
   - Split dataset: **15% of training set allocated for validation**.  
   - Applied image data augmentation:  
     - Horizontal flip, zoom, shear, rotation, rescaling.  
   - Normalized pixel values (rescale 1/255).  

3. **Modeling**  
   - **Baseline model:** Custom **AlexNet** (built from scratch, no transfer learning).  
   - **Proposed model:** **DenseNet121** (built from scratch).  
   - DenseNet hyperparameter tuning planned for:  
     - Growth rate  
     - Learning rate  
     - Block repeats  
   - Due to high computational cost, only pre-tuning DenseNet was used for comparison.  

4. **Evaluation**  
   - **AlexNet:** failed to learn meaningful patterns, performance close to random guessing.  
   - **DenseNet121:** significantly better than AlexNet, but **precision and recall still < 70%**, indicating room for improvement.  
   - Performance bottlenecks likely due to:  
     - Limited dataset size  
     - No transfer learning  
     - Complex class distinctions in medical imaging  

---

## Tools & Libraries
- Python, Jupyter Notebook  
- TensorFlow / Keras  
- NumPy, Pandas  
- Matplotlib, Seaborn  

---

## Key Insights
- **DenseNet121 outperformed AlexNet**, showing the importance of deeper and more connected architectures for medical image classification.  
- Without transfer learning, model performance was limited, with precision/recall < 70%.  
- Data augmentation helped but was insufficient to overcome dataset limitations.  

---

## Future Work
- Implement **transfer learning** with pre-trained DenseNet or ResNet.  
- Explore additional augmentation and normalization techniques (e.g., CLAHE for contrast enhancement).  
- Use class-weight balancing or focal loss to handle subtle class differences.  
- Evaluate on larger datasets for better generalization.  

---
