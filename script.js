import { GoogleGenerativeAI } from "@google/generative-ai";
// Replace "YOUR_API_KEY" with your actual API key
const API_KEY = "AIzaSyC1sIUelhqJQDqNisqumofefg-ScB9YgdQ";

async function fileToGenerativePart(file) {
    const base64EncodedDataPromise = new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(',')[1]);
        reader.readAsDataURL(file);
    });
    return {
        inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
    };
}

async function analyzePrescription() {
    const model = new GoogleGenerativeAI(API_KEY).getGenerativeModel({
        model: "gemini-pro-vision" 
    });
    const fileInputEl = document.querySelector("#prescriptionImage");
    const imageParts = await Promise.all([...fileInputEl.files].map(fileToGenerativePart));

    // Assuming the prescription image itself is the prompt
    const result = await model.generateContent(imageParts); 
    const response = await result.response;
    const text = response.text();

    document.getElementById("apiResponse").textContent = text;
}

document.getElementById("submitButton").addEventListener("click", analyzePrescription);