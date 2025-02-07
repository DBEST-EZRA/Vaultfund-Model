const Anomaly = require('../schemas/Anomaly');
const Transaction = require("../models/Transaction");
const fs = require("fs");
const path = require("path");
const { predictRiskScore } = require("./riskScoring");

// Load the trained Random Forest model
const modelPath = path.join(__dirname, "../utils/ml_model/random_forest_model.pkl");
let mlModel;

if (fs.existsSync(modelPath)) {
    mlModel = require("joblib").load(modelPath);  // Load the saved ML model
} else {
    console.error("Error: Trained ML model not found!");
}

// Function to detect anomalies using the trained model
exports.detectAnomalies = async (transactionId) => {
    try {
        const transaction = await Transaction.findById(transactionId);
        if (!transaction) {
            console.log(`Transaction ${transactionId} not found`);
            return;
        }

        // Extract transaction features
        const transactionFeatures = [
            transaction.amount,
            transaction.userAge,
            transaction.transactionType,
            transaction.previousTransactions,
            transaction.merchantCategory,
            transaction.deviceType,
            transaction.location,
            transaction.time
        ];  

        let riskScore;
        let detectedBy;

        if (mlModel) {
            // Predict using the trained model
            riskScore = mlModel.predict([transactionFeatures])[0] * 100;  // Normalize to 100
            detectedBy = "ML";
        } else {
            // If model isn't available, fall back to rule-based scoring
            riskScore = predictRiskScore(transaction);
            detectedBy = "Rule-Based";
        }

        // Flag as an anomaly if risk score is high
        if (riskScore >= 80) {
            const anomaly = new Anomaly({
                transactionId,
                riskScore,
                detectedBy,
                notes: "Transaction flagged due to high risk score"
            });
            await anomaly.save();
            console.log(`Anomaly detected for transaction ${transactionId}`);
        }
    } catch (error) {
        console.error("Error detecting anomalies:", error);
    }
};
