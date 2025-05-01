# DigiSign - Digital Signature Tool

A simple yet powerful digital signature tool built for a cryptography and network security project. This tool allows users to generate cryptographic key pairs, sign files and text messages, and verify signatures without requiring authentication.

## Features

- **Key Generation**: Create RSA public/private key pairs
- **File Signing**: Sign any file using your private key
- **Text Signing**: Sign text messages using your private key
- **Signature Verification**: Verify both file and text signatures using the signer's public key
- **Signature History**: View previously created signatures

## Technologies Used

- Node.js and Express for the backend server
- Vanilla JavaScript for the frontend
- MongoDB Atlas for cloud database storage
- Native Node.js crypto module for cryptographic operations

## Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/digisign.git
   cd digisign
   ```

2. Install dependencies
   ```
   npm install
   ```

3. MongoDB Atlas Setup
   - Create a MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
   - Create a new cluster
   - Click on "Connect" and select "Connect your application"
   - Copy the connection string
   - Create a `.env` file in the project root (see `.env.example`)
   - Add your MongoDB Atlas connection string to the `.env` file:
     ```
     MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/digisign?retryWrites=true&w=majority
     PORT=3000
     ```

4. Start the application
   ```
   npm start
   ```

5. Access the application in your browser at http://localhost:3000

## Usage

### Generating Keys
1. Navigate to the "Key Generator" tab
2. Click on "Generate Keys"
3. Copy or download the public and private keys (keep your private key secure!)

### Signing a File
1. Navigate to the "File Signing" tab
2. Select the file you want to sign
3. Paste your private key
4. Click "Sign File"
5. The file's hash and signature will be displayed

### Signing a Text Message
1. Navigate to the "Text Signing" tab
2. Enter the text you want to sign
3. Paste your private key
4. Click "Sign Text"
5. The text's hash and signature will be displayed

### Verifying a Signature
1. Navigate to the "Verification" tab
2. Choose between "Verify File" or "Verify Text"
3. Provide the original file/text, signature, and the signer's public key
4. Click "Verify"
5. The verification result will be displayed

## Security Considerations

This tool is designed for educational purposes as part of a cryptography and network security project. In a production environment:

- Don't transmit private keys over the network
- Implement proper user authentication and authorization
- Use secure connections (HTTPS)
- Add more robust error handling and validation

## License

MIT
