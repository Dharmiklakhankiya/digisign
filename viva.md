# DigiSign - Digital Signature Tool: Viva Preparation

## Project Overview

DigiSign is a digital signature application for cryptography and network security, allowing users to generate key pairs, sign files and text messages, and verify signatures. The system is built with a Node.js backend, vanilla JavaScript frontend, and MongoDB for data persistence, without requiring user authentication.
## Libraries and Technologies Used

### Backend (Node.js)
- **express**: Web framework for handling HTTP requests and creating API endpoints
- **mongoose**: MongoDB object modeling tool for data manipulation
- **crypto**: Node.js built-in module for cryptographic operations
- **multer**: Middleware for handling multipart/form-data (file uploads)
- **cors**: Cross-Origin Resource Sharing middleware for enabling cross-origin requests
- **fs**: File system module for file operations
- **path**: Utility for handling file paths

### Frontend (Vanilla JavaScript)
- **Fetch API**: For making HTTP requests to the server
- **DOM Manipulation**: For dynamically updating the UI
- **HTML5 Forms**: For data entry and validation
- **ES6+ Features**: Including async/await, template literals, arrow functions
- **CSS3**: For styling and responsive design

### Database
- **MongoDB**: NoSQL database for storing signature information

## Core Concepts Implemented

### 1. Asymmetric Cryptography (RSA)
- Public and private key pair generation
- Data signing with private keys
- Signature verification with public keys

### 2. Cryptographic Hash Functions
- SHA-256 for generating document fingerprints
- One-way transformation of arbitrary data into fixed-size hash
- Detection of data integrity violations

### 3. Digital Signatures
- Created by encrypting a document's hash with the signer's private key
- Can be verified using the signer's public key
- Provides authentication, non-repudiation, and integrity checking

### 4. File Handling
- Secure file upload and storage
- File hashing for signature creation
- Multi-part form data processing

## Potential Professor Questions and Answers

### 1. What is a digital signature and how does it differ from encryption?

**Answer**: A digital signature is a cryptographic mechanism that provides authentication, non-repudiation, and integrity checking. Unlike encryption (which aims to keep data confidential), digital signatures prove who created or modified a document and verify the document hasn't been altered.

In this project, we create digital signatures by:
1. Generating a unique hash of the document (using SHA-256)
2. Encrypting that hash with the signer's private key
3. The resulting encrypted hash is the digital signature

To verify, we:
1. Decrypt the signature using the signer's public key
2. Generate a new hash of the received document
3. Compare the decrypted hash with the newly generated hash
4. If they match, the signature is valid

### 2. Explain the cryptographic principles behind RSA.

**Answer**: RSA (Rivest–Shamir–Adleman) is an asymmetric cryptographic algorithm based on the mathematical difficulty of factoring the product of two large prime numbers. In our project:

- Key generation involves:
  - Selecting two large prime numbers (p and q)
  - Computing n = p × q
  - Computing the totient φ(n) = (p-1)(q-1)
  - Selecting a public key e where 1 < e < φ(n) and gcd(e, φ(n)) = 1
  - Computing the private key d where d × e ≡ 1 (mod φ(n))

- The public key consists of (n, e), while the private key is (n, d)

- For digital signatures:
  - Signing: signature = message^d mod n
  - Verification: original_message = signature^e mod n

In Node.js, we use the built-in crypto module to handle the mathematical complexity of these operations.

### 3. How do you ensure the integrity of files in your application?

**Answer**: We ensure file integrity through cryptographic hashing using the SHA-256 algorithm. When a file is uploaded:

1. We calculate a hash value (a fixed-size string) that uniquely represents the file's contents
2. Any change to the file, no matter how small, will produce a completely different hash
3. When verifying, we recalculate the hash and compare it with the decrypted signature hash
4. If the hashes match, we can be confident the file hasn't been modified

This process is implemented in our `calculateFileHash` function in the cryptoUtils.js file.

### 4. Explain the role of MongoDB in your digital signature application.

**Answer**: MongoDB serves as our database for:

1. Storing metadata about each signature operation including:
   - Document/text name
   - Hash of the document/text
   - Digital signature
   - Public key used for verification
   - Timestamp of creation
   - Verification status

2. This allows us to maintain a history of signatures created in the system, enabling users to:
   - Reference previously created signatures
   - Re-verify signatures later
   - Track when and what was signed

We use Mongoose as an ODM (Object Document Mapper) to model our data and interact with MongoDB.

### 5. How does your application handle file uploads securely?

**Answer**: Our application handles file uploads securely through:

1. Using Multer middleware to manage file uploads
2. Storing files in a controlled directory with proper permissions
3. Generating random filenames based on timestamps to prevent naming conflicts
4. Processing files in memory for cryptographic operations rather than storing the complete files long-term
5. Only storing metadata and signatures in the database, not the actual files
6. Validating file types and sizes (though this could be enhanced further)

### 6. What are the security limitations of your current implementation and how would you improve them?

**Answer**: Current limitations include:

1. **No user authentication**: Anyone can use the system
   - Improvement: Add JWT or OAuth-based authentication

2. **Private keys transmitted to server**:
   - Improvement: Implement client-side signing where private keys never leave the user's browser

3. **Basic error handling**:
   - Improvement: More robust error handling and input validation

4. **No key management system**:
   - Improvement: Secure storage for key pairs with proper access controls

5. **Limited protection against timing attacks**:
   - Improvement: Implement constant-time comparison algorithms

6. **No protection against CSRF/XSS**:
   - Improvement: Add CSRF tokens and Content Security Policy

### 7. Explain the difference between symmetric and asymmetric encryption and why you chose asymmetric for this project.

**Answer**: 
- **Symmetric encryption** uses a single key for both encryption and decryption. It's fast but has key distribution problems.
- **Asymmetric encryption** uses a key pair (public and private). It's slower but solves the key distribution problem.

We chose asymmetric encryption (RSA) for this project because:
1. It enables digital signatures, where only the owner of the private key can create a signature
2. The public key can be freely distributed for verification without compromising security
3. It provides non-repudiation - the signer cannot deny signing the document
4. It doesn't require a secure channel to exchange keys between parties

### 8. What is the significance of hashing in digital signatures and why did you choose SHA-256?

**Answer**: Hashing is crucial for digital signatures because:
1. It creates a fixed-size "fingerprint" of variable-length data
2. It's more efficient to sign a small hash than a large document
3. It ensures integrity - any changes to the document will change the hash

We chose SHA-256 because:
1. It's widely accepted as cryptographically secure (as of 2023)
2. It produces a 256-bit hash value, resistant to collision attacks
3. It's built into Node.js crypto library, making implementation straightforward
4. It offers a good balance between security and performance
5. It's NIST approved and widely used in security applications

### 9. How does your application handle the verification process?

**Answer**: Our verification process works as follows:

1. The user provides:
   - The original document/text
   - The digital signature
   - The signer's public key

2. For document verification:
   - We compute the hash of the provided document
   - We decrypt the signature using the provided public key
   - We compare the computed hash with the decrypted hash
   - If they match, the verification is successful

3. The code for this is in the `verifySignature` function in cryptoUtils.js and the verification routes in signature.js

4. The frontend displays a clear success/failure message based on the verification result

### 10. What improvements or additional features would you add to enhance this project?

**Answer**: Potential improvements include:

1. **Authentication and authorization**: Add user accounts and permission controls
2. **Client-side cryptography**: Process private keys in the browser to avoid transmitting them
3. **Key management**: Secure storage and management of key pairs
4. **Batch signing**: Allow multiple files to be signed at once
5. **Certificate integration**: Support for X.509 certificates from trusted CAs
6. **Blockchain integration**: Store signature hashes on a blockchain for immutable record-keeping
7. **PDF/Office document support**: Special handling for common document formats
8. **Timestamping service**: Integration with a trusted timestamping authority
9. **Signature expiration**: Add expiration dates to signatures
10. **Multi-signature support**: Allow documents to be signed by multiple parties
11. **Enhanced security measures**: CSRF protection, rate limiting, and more robust input validation

## Implementation Details

### Key Generation

```javascript
const generateKeyPair = () => {
    return crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem'
        }
    });
};
```

### Troubleshooting Common Errors

#### 500 Internal Server Error During File Signing

If you encounter a 500 Internal Server Error when using the signing functionality (particularly with errors like `Failed to load resource: the server responded with a status of 500`), this typically indicates a server-side issue with processing the signature request. Common causes and solutions include:

1. **Invalid Private Key Format**: 
   - Ensure the private key is in the correct PKCS#8 PEM format
   - The key should begin with `-----BEGIN PRIVATE KEY-----` and end with `-----END PRIVATE KEY-----`
   - Do not modify or truncate the key content

2. **MongoDB Connection Issues**:
   - Verify MongoDB is running with `mongod --version` in terminal
   - Check the MongoDB connection string in `server.js`
   - Ensure the MongoDB service is active with `systemctl status mongodb` (Linux) or through Services (Windows)

3. **File Upload Problems**:
   - Large files might exceed default size limits
   - Add a size limit to multer: `const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });` (sets 10MB limit)
   - Check if the upload directory exists and has proper write permissions

4. **Missing Dependencies**:
   - Run `npm install` to ensure all required packages are installed
   - Check for compatibility issues between package versions

5. **Server Error Logging Improvements**:
   Adding the following code to the server error handler will provide more detailed error information:

```javascript
// Enhanced error handling in server.js
app.use((err, req, res, next) => {
    console.error('Error details:', err);
    console.error('Stack trace:', err.stack);
    res.status(500).json({
        success: false,
        message: 'Server error',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
});
```

6. **Client-Side Debugging**:
   - In the browser developer console, open the Network tab
   - Look at the Response body of the failed request for more specific error information
   - Add more detailed error handling in the client code:

```javascript
try {
    const response = await fetch(`${API_URL}/sign`, {
        method: 'POST',
        body: formData
    });
    
    const data = await response.json();
    
    if (!response.ok) {
        throw new Error(data.error || 'Unknown server error');
    }
    
    if (data.success) {
        // Handle success
    }
} catch (error) {
    console.error('Detailed error:', error);
    showNotification('Error signing file: ' + error.message, true);
}
```

### File Types Supported for Signing

The DigiSign tool is designed to sign any file type, regardless of format or content. This is possible because the digital signature process works with the binary data of the file rather than its formatting or structure. Common file types that can be signed include:

- **Document Files**: PDF, DOCX, TXT, RTF, etc.
- **Image Files**: JPG, PNG, GIF, BMP, TIFF, etc.
- **Audio/Video Files**: MP3, MP4, WAV, AVI, etc.
- **Compressed Files**: ZIP, RAR, 7Z, etc.
- **Executable Files**: EXE, DLL, etc.
- **Database Files**: SQL, DB, etc.
- **Spreadsheets and Presentations**: XLSX, PPTX, etc.
- **Source Code Files**: JS, PY, JAVA, HTML, CSS, etc.

The file signing process calculates a cryptographic hash (SHA-256) of the file's contents, which works as a unique fingerprint for any file type. This hash is then signed with the user's private key, creating a digital signature that can be used to verify the file's integrity and authenticity later.

### File Hashing

```javascript
const calculateFileHash = (filePath) => {
    return new Promise((resolve, reject) => {
        const hash = crypto.createHash('sha256');
        const stream = fs.createReadStream(filePath);
        
        stream.on('error', err => reject(err));
        stream.on('data', chunk => hash.update(chunk));
        stream.on('end', () => resolve(hash.digest('hex')));
    });
};
```

### Digital Signature Creation

```javascript
const signData = (data, privateKey) => {
    const sign = crypto.createSign('SHA256');
    sign.update(data);
    sign.end();
    return sign.sign(privateKey, 'base64');
};
```

### Signature Verification

```javascript
const verifySignature = (data, signature, publicKey) => {
    const verify = crypto.createVerify('SHA256');
    verify.update(data);
    verify.end();
    return verify.verify(publicKey, signature, 'base64');
};
```

## References

1. Node.js Crypto Documentation: https://nodejs.org/api/crypto.html
2. RSA Algorithm: https://en.wikipedia.org/wiki/RSA_(cryptosystem)
3. Digital Signatures: https://en.wikipedia.org/wiki/Digital_signature
4. SHA-256 Algorithm: https://en.wikipedia.org/wiki/SHA-2
5. Express.js Documentation: https://expressjs.com/
6. MongoDB Documentation: https://docs.mongodb.com/
