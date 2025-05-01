document.addEventListener('DOMContentLoaded', function() {
    const API_URL = '/api/signature';
    const signaturesTableBody = document.getElementById('signatures-table-body');
    const refreshButton = document.getElementById('refresh-signatures');
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

    
    const fetchSignatures = async () => {
        signaturesTableBody.innerHTML = '<tr><td colspan="5" style="text-align: center;">Loading signatures...</td></tr>'; 
        try {
            const response = await fetch(API_URL);
            const data = await response.json();

            if (data.success) {
                signaturesTableBody.innerHTML = ''; 

                if (data.signatures.length === 0) {
                    signaturesTableBody.innerHTML = `
                        <tr>
                            <td colspan="5" style="text-align: center;">No signatures found</td>
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
                            <td>${signature.documentHash.substring(0, 15)}...</td>
                            <td>${signature._id}</td>
                            <td>
                                <button class="delete-btn secondary-btn" data-id="${signature._id}" style="background-color: var(--error-color); color: white;">Delete</button>
                            </td>
                        </tr>
                    `;
                    signaturesTableBody.insertAdjacentHTML('beforeend', row);
                });
            } else {
                showNotification('Error fetching signatures: ' + data.message, true);
                signaturesTableBody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: var(--error-color);">Failed to load signatures</td></tr>';
            }
        } catch (error) {
            console.error('Error fetching signatures:', error);
            showNotification('Error fetching signatures: ' + error.message, true);
            signaturesTableBody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: var(--error-color);">Failed to load signatures</td></tr>';
        }
    };

    
    signaturesTableBody.addEventListener('click', async (e) => {
        if (e.target.classList.contains('delete-btn')) {
            const signatureId = e.target.getAttribute('data-id');
            const row = e.target.closest('tr'); 

            if (confirm(`Are you sure you want to delete signature ${signatureId}?`)) {
                const deleteButton = e.target; 
                try {
                    deleteButton.disabled = true; 
                    deleteButton.textContent = 'Deleting...';

                    const response = await fetch(`${API_URL}/${signatureId}`, {
                        method: 'DELETE'
                    });

                    
                    if (response.ok) {
                        const data = await response.json(); 

                        if (data.success) {
                            showNotification('Signature deleted successfully!');
                            row.remove(); 
                            
                            if (signaturesTableBody.rows.length === 0) {
                                 signaturesTableBody.innerHTML = `
                                    <tr>
                                        <td colspan="5" style="text-align: center;">No signatures found</td>
                                    </tr>
                                `;
                            }
                        } else {
                            
                            showNotification('Error deleting signature: ' + (data.message || 'Unknown API error'), true);
                            deleteButton.disabled = false; 
                            deleteButton.textContent = 'Delete';
                        }
                    } else {
                        
                        const errorText = await response.text(); 
                        console.error('Server responded with non-OK status:', response.status, response.statusText, errorText);
                        showNotification(`Error deleting signature: Server responded with ${response.status} ${response.statusText}`, true);
                        deleteButton.disabled = false; 
                        deleteButton.textContent = 'Delete';
                    }

                } catch (error) {
                    
                    console.error('Error during delete request:', error);
                    showNotification('Error deleting signature: ' + error.message, true);
                    if (deleteButton) { 
                        deleteButton.disabled = false; 
                        deleteButton.textContent = 'Delete';
                    }
                }
            }
        }
    });

    
    refreshButton.addEventListener('click', fetchSignatures);

    
    fetchSignatures();
});
