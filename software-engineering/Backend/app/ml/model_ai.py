import torch
import torch.nn as nn
import torch.nn.functional as F
from torchvision import models, transforms
from PIL import Image
from pathlib import Path

LABELS = [
    "battery","biological","cardboard","clothes",
    "glass","metal","paper","plastic","shoes","trash"
]

class WasteClassifier:
    def __init__(self, model_path="models/best_model.pt"):
        self.device = torch.device("cpu")

        # 1. buat ulang struktur EfficientNetV2-S
        self.model = models.efficientnet_v2_s(weights="IMAGENET1K_V1")
        for p in self.model.features.parameters():
            p.requires_grad = False

        self.model.classifier = nn.Sequential(
            nn.Dropout(0.3),
            nn.Linear(self.model.classifier[1].in_features, 128),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(128, len(LABELS))
        )

        # 2. muat bobot dari file .pt hasil training di Kaggle
        state_dict = torch.load(model_path, map_location=self.device)
        self.model.load_state_dict(state_dict)
        self.model.eval()
        self.model.to(self.device)

        # 3. preprocessing harus sama seperti waktu training
        self.transform = transforms.Compose([
            transforms.Resize((400,400)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485,0.456,0.406],
                                 std=[0.229,0.224,0.225])
        ])

    def predict(self, image_path:str):
        img = Image.open(image_path).convert("RGB")
        x = self.transform(img).unsqueeze(0).to(self.device)
        with torch.no_grad():
            logits = self.model(x)
            probs = F.softmax(logits, dim=1)[0]
            idx = int(torch.argmax(probs))
        return LABELS[idx], float(probs[idx])

model_service = WasteClassifier("models/best_model.pt")
