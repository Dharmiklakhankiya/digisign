const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const Signature = require('../models/signature');
const { 
    generateKeyPair, 
    calculateFileHash, 
    calculateHash,
    signData, 
    verifySignature 
} = require('../utils/cryptoUtils');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = './uploads';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });


router.get('/generate-keys', (req, res) => {
    try {
        const { publicKey, privateKey } = generateKeyPair();
        res.json({ 
            success: true, 
            publicKey, 
            privateKey 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Error generating key pair', 
            error: error.message 
        });
    }
});


router.post('/sign', upload.single('document'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ 
                success: false, 
                message: 'No file uploaded' 
            });
        }

        const { privateKey } = req.body;
        
        if (!privateKey) {
            return res.status(400).json({ 
                success: false, 
                message: 'Private key is required' 
            });
        }

        const filePath = req.file.path;
        const documentHash = await calculateFileHash(filePath);
        const signature = signData(documentHash, privateKey);
        
        
        
        
        const { publicKey } = generateKeyPair();
        
        
        const newSignature = new Signature({
            documentName: req.file.originalname,
            documentHash,
            signature,
            publicKey
        });
        
        await newSignature.save();
        
        res.json({
            success: true,
            documentName: req.file.originalname,
            documentHash,
            signature,
            publicKey,
            signatureId: newSignature._id
        });
        
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Error signing document', 
            error: error.message 
        });
    }
});


router.post('/verify', upload.single('document'), async (req, res) => {
    try {
        const { signature, publicKey } = req.body;
        
        if (!req.file || !signature || !publicKey) {
            return res.status(400).json({ 
                success: false, 
                message: 'Document, signature, and public key are required' 
            });
        }

        const filePath = req.file.path;
        const documentHash = await calculateFileHash(filePath);
        const isValid = verifySignature(documentHash, signature, publicKey);
        
        res.json({
            success: true,
            isValid,
            documentName: req.file.originalname,
            documentHash
        });
        
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Error verifying signature', 
            error: error.message 
        });
    }
});


router.get('/', async (req, res) => {
    try {
        const signatures = await Signature.find().sort({ createdAt: -1 });
        res.json({ 
            success: true, 
            signatures 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching signatures', 
            error: error.message 
        });
    }
});


router.post('/sign-text', async (req, res) => {
    try {
        const { text, privateKey } = req.body;
        
        if (!text || !privateKey) {
            return res.status(400).json({ 
                success: false, 
                message: 'Text and private key are required' 
            });
        }
        
        const textHash = calculateHash(text);
        const signature = signData(textHash, privateKey);
        
        
        
        
        const { publicKey } = generateKeyPair();
        
        
        const newSignature = new Signature({
            documentName: 'text_' + Date.now(),
            documentHash: textHash,
            signature,
            publicKey
        });
        
        await newSignature.save();
        
        res.json({
            success: true,
            textHash,
            signature,
            publicKey,
            signatureId: newSignature._id
        });
        
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Error signing text', 
            error: error.message 
        });
    }
});


router.post('/verify-text', async (req, res) => {
    try {
        const { text, signature, publicKey } = req.body;
        
        if (!text || !signature || !publicKey) {
            return res.status(400).json({ 
                success: false, 
                message: 'Text, signature, and public key are required' 
            });
        }
        
        const textHash = calculateHash(text);
        const isValid = verifySignature(textHash, signature, publicKey);
        
        res.json({
            success: true,
            isValid,
            textHash
        });
        
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Error verifying text signature', 
            error: error.message 
        });
    }
});


router.delete('/:id', async (req, res) => {
    const signatureId = req.params.id;
    console.log(`Attempting to delete signature with ID: ${signatureId}`); 

    try {
        const result = await Signature.findByIdAndDelete(signatureId);

        if (!result) {
            console.log(`Signature not found for ID: ${signatureId}`); 
            return res.status(404).json({
                success: false,
                message: 'Signature not found'
            });
        }

        console.log(`Successfully deleted signature with ID: ${signatureId}`); 
        res.json({
            success: true,
            message: 'Signature deleted successfully'
        });

    } catch (error) {
        
        if (error.name === 'CastError' && error.kind === 'ObjectId') { 
             console.error(`Invalid Signature ID format: ${signatureId}`, error); 
             return res.status(400).json({
                success: false,
                message: 'Invalid Signature ID format'
            });
        }
        console.error(`Error deleting signature ID ${signatureId}:`, error); 
        res.status(500).json({
            success: false,
            message: 'Error deleting signature',
            error: error.message
        });
    }
});


module.exports = router;
