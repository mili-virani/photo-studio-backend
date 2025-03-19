const faceapi = require("face-api.js");
const canvas = require("canvas");
const fs = require("fs");
const path = require("path");

const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

// Load models once at startup
(async () => {
    await faceapi.nets.ssdMobilenetv1.loadFromDisk("./models");
    await faceapi.nets.faceLandmark68Net.loadFromDisk("./models");
    await faceapi.nets.faceRecognitionNet.loadFromDisk("./models");
    console.log("Face API Models Loaded");
})();

// Store known faces (in-memory for now)
let gallery = [];

exports.uploadGalleryImage = async (req, res) => {
    if (!req.file) return res.status(400).json({ message: "No image uploaded" });

    const imagePath = path.join(__dirname, "uploads", req.file.filename);
    const image = await canvas.loadImage(imagePath);
    const detection = await faceapi.detectSingleFace(image).withFaceLandmarks().withFaceDescriptor();

    if (!detection) {
        fs.unlinkSync(imagePath); // Delete image if no face is detected
        return res.status(400).json({ message: "No face detected" });
    }

    gallery.push({ imagePath: `/uploads/${req.file.filename}`, descriptor: detection.descriptor });
    return res.json({ message: "Image added to gallery", imagePath: `/uploads/${req.file.filename}` });
};

exports.searchFace = async (req, res) => {
    if (!req.file) return res.status(400).json({ message: "No image uploaded" });

    const imagePath = path.join(__dirname, "uploads", req.file.filename);
    const image = await canvas.loadImage(imagePath);
    const queryFace = await faceapi.detectSingleFace(image).withFaceLandmarks().withFaceDescriptor();

    if (!queryFace) {
        fs.unlinkSync(imagePath); // Delete image if no face is detected
        return res.status(400).json({ message: "No face detected" });
    }

    const matches = gallery.filter((item) => {
        const distance = faceapi.euclideanDistance(queryFace.descriptor, item.descriptor);
        return distance < 0.6; // Threshold for matching
    });

    return res.json({ matchedImages: matches.map((match) => match.imagePath) });
};
