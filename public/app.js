document.addEventListener('DOMContentLoaded', function() {
    
    const API_URL = '/api/signature';
    
    
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            
            
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            
            tabContents.forEach(tab => tab.classList.remove('active'));
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    
    const verifyTabButtons = document.querySelectorAll('.verify-tab-btn');
    const verifyContents = document.querySelectorAll('.verify-content');
    
    verifyTabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-verify-tab');
            
            
            verifyTabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            
            verifyContents.forEach(tab => tab.classList.remove('active'));
            document.getElementById(tabId).classList.add('active');
            
            
            document.getElementById('verification-result').classList.add('hidden');
        });
    });
    
    
    const generateKeysBtn = document.getElementById('generate-keys-btn');
    const keysDisplay = document.getElementById('keys-display');
    const publicKeyEl = document.getElementById('public-key');
    const privateKeyEl = document.getElementById('private-key');
    
    generateKeysBtn.addEventListener('click', async () => {
        try {
            generateKeysBtn.disabled = true;
            generateKeysBtn.textContent = 'Generating...';
            
            const response = await fetch(`${API_URL}/generate-keys`);
            const data = await response.json();
            
            if (data.success) {
                publicKeyEl.value = data.publicKey;
                privateKeyEl.value = data.privateKey;
                keysDisplay.classList.remove('hidden');
                showNotification('Key pair generated successfully!');
            } else {
                showNotification('Error generating keys: ' + data.message, true);
            }
        } catch (error) {
            console.error('Error generating keys:', error);
            showNotification('Error generating keys: ' + error.message, true);
        } finally {
            generateKeysBtn.disabled = false;
            generateKeysBtn.textContent = 'Generate Keys';
        }
    });
    
    
    const fileSignForm = document.getElementById('file-sign-form');
    const fileSignatureResult = document.getElementById('file-signature-result');
    const fileHashResult = document.getElementById('file-hash-result');
    const fileSignature = document.getElementById('file-signature');
    
    fileSignForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const fileInput = document.getElementById('file-to-sign');
        const privateKey = document.getElementById('private-key-sign').value;
        
        if (!fileInput.files[0] || !privateKey) {
            showNotification('Please select a file and provide your private key', true);
            return;
        }
        
        try {
            const formData = new FormData();
            formData.append('document', fileInput.files[0]);
            formData.append('privateKey', privateKey);
            
            const submitBtn = fileSignForm.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Signing...';
            
            const response = await fetch(`${API_URL}/sign`, {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            
            if (data.success) {
                fileHashResult.value = data.documentHash;
                fileSignature.value = data.signature;
                fileSignatureResult.classList.remove('hidden');
                showNotification('File signed successfully!');
            } else {
                showNotification('Error signing file: ' + data.message, true);
            }
        } catch (error) {
            console.error('Error signing file:', error);
            showNotification('Error signing file: ' + error.message, true);
        } finally {
            const submitBtn = fileSignForm.querySelector('button[type="submit"]');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Sign File';
        }
    });
    
    
    const textSignForm = document.getElementById('text-sign-form');
    const textSignatureResult = document.getElementById('text-signature-result');
    const textHashResult = document.getElementById('text-hash-result');
    const textSignature = document.getElementById('text-signature');
    
    textSignForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const text = document.getElementById('text-to-sign').value;
        const privateKey = document.getElementById('private-key-text').value;
        
        if (!text || !privateKey) {
            showNotification('Please enter text and provide your private key', true);
            return;
        }
        
        try {
            const submitBtn = textSignForm.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Signing...';
            
            const response = await fetch(`${API_URL}/sign-text`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text, privateKey })
            });
            
            const data = await response.json();
            
            if (data.success) {
                textHashResult.value = data.textHash;
                textSignature.value = data.signature;
                textSignatureResult.classList.remove('hidden');
                showNotification('Text signed successfully!');
            } else {
                showNotification('Error signing text: ' + data.message, true);
            }
        } catch (error) {
            console.error('Error signing text:', error);
            showNotification('Error signing text: ' + error.message, true);
        } finally {
            const submitBtn = textSignForm.querySelector('button[type="submit"]');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Sign Text';
        }
    });
    
    
    const verifyFileForm = document.getElementById('verify-file-form');
    const verificationResult = document.getElementById('verification-result');
    const verificationSuccess = document.getElementById('verification-success');
    const verificationFailure = document.getElementById('verification-failure');
    
    verifyFileForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const fileInput = document.getElementById('file-to-verify');
        const signature = document.getElementById('file-signature-verify').value;
        const publicKey = document.getElementById('public-key-verify').value;
        
        if (!fileInput.files[0] || !signature || !publicKey) {
            showNotification('Please provide file, signature, and public key', true);
            return;
        }
        
        try {
            const formData = new FormData();
            formData.append('document', fileInput.files[0]);
            formData.append('signature', signature);
            formData.append('publicKey', publicKey);
            
            const submitBtn = verifyFileForm.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Verifying...';
            
            const response = await fetch(`${API_URL}/verify`, {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            
            verificationResult.classList.remove('hidden');
            
            if (data.success) {
                if (data.isValid) {
                    verificationSuccess.classList.remove('hidden');
                    verificationFailure.classList.add('hidden');
                } else {
                    verificationSuccess.classList.add('hidden');
                    verificationFailure.classList.remove('hidden');
                }
            } else {
                showNotification('Error verifying file: ' + data.message, true);
            }
        } catch (error) {
            console.error('Error verifying file:', error);
            showNotification('Error verifying file: ' + error.message, true);
        } finally {
            const submitBtn = verifyFileForm.querySelector('button[type="submit"]');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Verify File';
        }
    });
    
    
    const verifyTextForm = document.getElementById('verify-text-form');
    
    verifyTextForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const text = document.getElementById('text-to-verify').value;
        const signature = document.getElementById('text-signature-verify').value;
        const publicKey = document.getElementById('public-key-text-verify').value;
        
        if (!text || !signature || !publicKey) {
            showNotification('Please provide text, signature, and public key', true);
            return;
        }
        
        try {
            const submitBtn = verifyTextForm.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Verifying...';
            
            const response = await fetch(`${API_URL}/verify-text`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text, signature, publicKey })
            });
            
            const data = await response.json();
            
            verificationResult.classList.remove('hidden');
            
            if (data.success) {
                if (data.isValid) {
                    verificationSuccess.classList.remove('hidden');
                    verificationFailure.classList.add('hidden');
                } else {
                    verificationSuccess.classList.add('hidden');
                    verificationFailure.classList.remove('hidden');
                }
            } else {
                showNotification('Error verifying text: ' + data.message, true);
            }
        } catch (error) {
            console.error('Error verifying text:', error);
            showNotification('Error verifying text: ' + error.message, true);
        } finally {
            const submitBtn = verifyTextForm.querySelector('button[type="submit"]');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Verify Text';
        }
    });
    
    
    const refreshHistoryBtn = document.getElementById('refresh-history');
    const historyTableBody = document.getElementById('history-table-body');
    
    const fetchHistory = async () => {
        try {
            const response = await fetch(`${API_URL}`);
            const data = await response.json();
            
            if (data.success) {
                historyTableBody.innerHTML = '';
                
                if (data.signatures.length === 0) {
                    historyTableBody.innerHTML = `
                        <tr>
                            <td colspan="4" style="text-align: center;">No signatures found</td>
                        </tr>
                    `;
                    return;
                }
                
                data.signatures.forEach(signature => {
                    const date = new Date(signature.createdAt).toLocaleString();
                    
                    const row = `
                        <tr>
                            <td>${signature.documentName}</td>
                            <td>${date}</td>
                            <td>
                                <span class="hash-preview">${signature.documentHash.substring(0, 15)}...</span>
                                <button class="copy-btn" data-copy="${signature.documentHash}">Copy</button>
                            </td>
                            <td>
                                <button class="details-btn" data-id="${signature._id}">View Details</button>
                            </td>
                        </tr>
                    `;
                    
                    historyTableBody.insertAdjacentHTML('beforeend', row);
                });
                
                
                document.querySelectorAll('.copy-btn[data-copy]').forEach(btn => {
                    btn.addEventListener('click', () => {
                        const text = btn.getAttribute('data-copy');
                        navigator.clipboard.writeText(text);
                        showNotification('Hash copied to clipboard!');
                    });
                });
                
            } else {
                showNotification('Error fetching history: ' + data.message, true);
            }
        } catch (error) {
            console.error('Error fetching history:', error);
            showNotification('Error fetching history: ' + error.message, true);
        }
    };
    
    refreshHistoryBtn.addEventListener('click', fetchHistory);
    
    
    tabButtons.forEach(button => {
        if (button.getAttribute('data-tab') === 'history') {
            button.addEventListener('click', fetchHistory);
        }
    });
    
    
    
    
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('copy-btn') && e.target.dataset.target) {
            const targetId = e.target.dataset.target;
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.select();
                document.execCommand('copy');
                showNotification('Copied to clipboard!');
            }
        }
    });
    
    
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('download-btn')) {
            const contentId = e.target.dataset.content;
            const filename = e.target.dataset.filename;
            const content = document.getElementById(contentId).value;
            
            if (content) {
                const blob = new Blob([content], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                
                setTimeout(() => {
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                }, 0);
                
                showNotification(`Downloaded as ${filename}`);
            }
        }
    });
    
    
    const notification = document.getElementById('notification');
    
    function showNotification(message, isError = false) {
        notification.textContent = message;
        notification.className = 'notification';
        
        if (isError) {
            notification.classList.add('error');
        }
        
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
});
