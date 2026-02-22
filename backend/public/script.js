// Global variables
let currentUser = null;
let currentBMIData = null; // Store calculated BMI data before saving

// Adjust input values with up/down buttons
function adjustValue(inputId, change) {
    const input = document.getElementById(inputId);
    const currentValue = parseFloat(input.value) || 0;
    const newValue = Math.max(
        parseFloat(input.min) || 0,
        Math.min(parseFloat(input.max) || 999, currentValue + change)
    );
    input.value = newValue;
}

// Submit user information
function submitUserInfo(event) {
    event.preventDefault();
    
    const name = document.getElementById('userName').value.trim();
    const age = parseInt(document.getElementById('userAge').value);
    const gender = document.getElementById('userGender').value;
    
    if (!name || !age || !gender) {
        alert('Please fill in all fields');
        return;
    }
    
    // Store user info
    currentUser = { name, age, gender };
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // Show BMI calculator and hide user form
    document.getElementById('userInfoSection').style.display = 'none';
    document.getElementById('currentUserInfo').style.display = 'block';
    document.getElementById('bmiSection').style.display = 'block';
    document.getElementById('legendSection').style.display = 'block';
    
    // Update user display
    document.getElementById('displayName').textContent = name;
    document.getElementById('displayAge').textContent = age;
    document.getElementById('displayGender').textContent = gender;
    
    // Hide save button initially
    document.getElementById('saveBtn').style.display = 'none';
    
    // Load history
    loadHistory();
}

// Change user
function changeUser() {
    if (confirm('Do you want to change user? This will clear current session.')) {
        currentUser = null;
        localStorage.removeItem('currentUser');
        
        // Reset form
        document.getElementById('userInfoForm').reset();
        
        // Show user form and hide calculator
        document.getElementById('userInfoSection').style.display = 'block';
        document.getElementById('currentUserInfo').style.display = 'none';
        document.getElementById('bmiSection').style.display = 'none';
        document.getElementById('legendSection').style.display = 'none';
        document.getElementById('historySection').style.display = 'none';
    }
}

// Calculate BMI (without saving)
async function calculateBMI() {
    if (!currentUser) {
        alert('Please enter your information first');
        return;
    }
    
    const height = parseFloat(document.getElementById('height').value);
    const weight = parseFloat(document.getElementById('weight').value);
    
    // Validate inputs
    if (!height || !weight || height <= 0 || weight <= 0) {
        alert('Please enter valid height and weight values');
        return;
    }
    
    // Calculate BMI locally first
    const bmi = calculateBMILocal(height, weight);
    const category = getBMICategory(bmi);
    
    // Update BMI result
    document.getElementById('bmiResult').textContent = bmi.toFixed(2);
    
    // Update category banner
    updateCategoryBanner(category, bmi);
    
    // Store the data for saving
    currentBMIData = {
        name: currentUser.name,
        age: currentUser.age,
        gender: currentUser.gender,
        height: height,
        weight: weight,
        bmi: bmi,
        category: category
    };
    
    // Show save button
    document.getElementById('saveBtn').style.display = 'block';
}

// Save BMI to database
async function saveBMI() {
    if (!currentBMIData) {
        alert('Please calculate your BMI first');
        return;
    }
    
    if (!currentUser) {
        alert('Please enter your information first');
        return;
    }
    
    // Disable save button to prevent double-clicking
    const saveBtn = document.getElementById('saveBtn');
    saveBtn.disabled = true;
    saveBtn.textContent = 'Saving...';
    
    // Test server connection first
    const serverRunning = await testServerConnection();
    if (!serverRunning) {
        alert('⚠️ Server is not running!\n\nPlease start the server:\n1. Open terminal in backend folder\n2. Run: npm run dev\n3. Wait for "Server running on port 3000"');
        saveBtn.disabled = false;
        saveBtn.textContent = '💾 Save to History';
        return;
    }
    
    try {
        console.log('Saving BMI data:', currentBMIData);
        
        // Call API to save BMI
        const response = await fetch('http://localhost:3000/api/bmi/calculate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: currentBMIData.name,
                age: currentBMIData.age,
                gender: currentBMIData.gender,
                height: currentBMIData.height,
                weight: currentBMIData.weight
            })
        });
        
        console.log('Save response status:', response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Server error response:', errorText);
            throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }
        
        const data = await response.json();
        console.log('Save API response:', data);
        
        if (data.success) {
            // Hide save button
            saveBtn.style.display = 'none';
            saveBtn.disabled = false;
            saveBtn.textContent = '💾 Save to History';
            
            // Clear current BMI data
            currentBMIData = null;
            
            // Small delay to ensure database transaction is committed
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Check if history section is currently visible
            const historySection = document.getElementById('historySection');
            const isHistoryVisible = historySection && historySection.style.display !== 'none';
            
            // Always reload history to ensure it's up to date
            await loadHistory();
            
            // Log success for debugging
            console.log('BMI saved successfully. Record ID:', data.recordId);
            
            // If history is already visible, keep it visible and show success
            if (isHistoryVisible) {
                alert('✅ BMI saved successfully!\n\nRecord ID: ' + data.recordId + '\n\nYour history has been updated.');
            } else {
                // Show success message and ask if user wants to view history
                const viewHistory = confirm('✅ BMI saved successfully to database!\n\nRecord ID: ' + data.recordId + '\n\nWould you like to view your history now?');
                if (viewHistory) {
                    showHistory();
                }
            }
        } else {
            alert('❌ Error saving BMI: ' + (data.error || 'Unknown error'));
            saveBtn.disabled = false;
            saveBtn.textContent = '💾 Save to History';
        }
    } catch (error) {
        console.error('Error saving BMI:', error);
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            alert('⚠️ Cannot connect to server!\n\nPlease make sure:\n1. Server is running (npm run dev)\n2. Server is on port 3000\n3. No firewall blocking the connection');
        } else {
            alert('❌ Error saving BMI: ' + error.message);
        }
        saveBtn.disabled = false;
        saveBtn.textContent = '💾 Save to History';
    }
}

// Local BMI calculation (fallback)
function calculateBMILocal(height, weight) {
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    return parseFloat(bmi.toFixed(2));
}

// Get BMI category
function getBMICategory(bmi) {
    if (bmi < 18.5) {
        return 'UNDERWEIGHT';
    } else if (bmi >= 18.5 && bmi < 25) {
        return 'NORMAL';
    } else if (bmi >= 25 && bmi < 30) {
        return 'OVERWEIGHT';
    } else {
        return 'OBESE';
    }
}

// Update category banner
function updateCategoryBanner(category, bmi) {
    const banner = document.getElementById('categoryBanner');
    const categoryText = document.getElementById('categoryText');
    
    // Remove all category classes
    banner.classList.remove('normal', 'underweight', 'overweight', 'obese');
    
    // Add appropriate class
    banner.classList.add(category.toLowerCase());
    
    // Update text
    categoryText.textContent = category;
}

// Show history
function showHistory() {
    document.getElementById('bmiSection').style.display = 'none';
    document.getElementById('legendSection').style.display = 'none';
    document.getElementById('historySection').style.display = 'block';
    // Always reload history when showing the history section
    loadHistory();
}

// Hide history and show calculator
function hideHistory() {
    document.getElementById('historySection').style.display = 'none';
    document.getElementById('bmiSection').style.display = 'block';
    document.getElementById('legendSection').style.display = 'block';
}

// Test server connection
async function testServerConnection() {
    try {
        const response = await fetch('http://localhost:3000/students');
        return response.ok;
    } catch (error) {
        return false;
    }
}

// Load history from API
async function loadHistory() {
    if (!currentUser) {
        const historyList = document.getElementById('historyList');
        if (historyList) {
            historyList.innerHTML = '<div class="empty-history">Please enter your information first.</div>';
        }
        return;
    }
    
    const historyList = document.getElementById('historyList');
    if (!historyList) {
        return;
    }
    
    historyList.innerHTML = '<div class="empty-history">Loading history...</div>';
    
    // First test if server is running
    const serverRunning = await testServerConnection();
    if (!serverRunning) {
        historyList.innerHTML = '<div class="empty-history" style="color: red;">⚠️ Server is not running. Please start the server first:<br><br>1. Open terminal in the backend folder<br>2. Run: npm run dev<br>3. Wait for "Server running on port 3000"<br>4. Refresh this page</div>';
        return;
    }
    
    try {
        const url = `http://localhost:3000/api/bmi/history/${encodeURIComponent(currentUser.name)}`;
        console.log('Fetching history from:', url);
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        console.log('Response status:', response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Server error response:', errorText);
            throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }
        
        const data = await response.json();
        console.log('History API response:', data);
        
        if (data.success) {
            if (data.records && data.records.length > 0) {
                console.log(`Loaded ${data.records.length} history records`);
                displayHistory(data.records);
            } else {
                console.log('No history records found');
                historyList.innerHTML = '<div class="empty-history">No history found. Calculate and save your BMI to create a record!</div>';
            }
        } else {
            console.error('API returned error:', data);
            historyList.innerHTML = `<div class="empty-history" style="color: red;">Error: ${data.error || 'Unknown error'}</div>`;
        }
    } catch (error) {
        console.error('Error loading history:', error);
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            historyList.innerHTML = '<div class="empty-history" style="color: red;">⚠️ Cannot connect to server. Please make sure:<br><br>1. Server is running (npm run dev)<br>2. Server is on port 3000<br>3. No firewall blocking the connection</div>';
        } else {
            historyList.innerHTML = `<div class="empty-history" style="color: red;">Error loading history: ${error.message}</div>`;
        }
    }
}

// Display history records
function displayHistory(records) {
    const historyList = document.getElementById('historyList');
    historyList.innerHTML = '';
    
    if (records.length === 0) {
        historyList.innerHTML = '<div class="empty-history">No history found. Calculate and save your BMI to create a record!</div>';
        return;
    }
    
    records.forEach(record => {
        const historyItem = document.createElement('div');
        historyItem.className = `history-item ${record.category.toLowerCase()}`;
        
        const date = new Date(record.created_at);
        const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        historyItem.innerHTML = `
            <div class="history-item-header">
                <div class="history-item-title">BMI Record #${record.id}</div>
                <div class="history-item-date">${formattedDate}</div>
            </div>
            <div class="history-item-details">
                <div class="history-detail">
                    <div class="history-detail-label">BMI Value</div>
                    <div class="history-detail-value">${record.bmi_value}</div>
                </div>
                <div class="history-detail">
                    <div class="history-detail-label">Category</div>
                    <div class="history-detail-value">${record.category}</div>
                </div>
                <div class="history-detail">
                    <div class="history-detail-label">Height</div>
                    <div class="history-detail-value">${record.height_cm} cm</div>
                </div>
                <div class="history-detail">
                    <div class="history-detail-label">Weight</div>
                    <div class="history-detail-value">${record.weight_kg} kg</div>
                </div>
            </div>
        `;
        
        historyList.appendChild(historyItem);
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', async function() {
    // Test server connection on page load
    console.log('Testing server connection...');
    const serverRunning = await testServerConnection();
    if (!serverRunning) {
        console.warn('⚠️ Server is not running!');
        // Show a notification but don't block the UI
    } else {
        console.log('✅ Server is running');
    }
    
    // Check if user info exists in localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        
        // Show calculator and hide form
        document.getElementById('userInfoSection').style.display = 'none';
        document.getElementById('currentUserInfo').style.display = 'block';
        document.getElementById('bmiSection').style.display = 'block';
        document.getElementById('legendSection').style.display = 'block';
        
        // Update user display
        document.getElementById('displayName').textContent = currentUser.name;
        document.getElementById('displayAge').textContent = currentUser.age;
        document.getElementById('displayGender').textContent = currentUser.gender;
        
        // Hide save button initially
        const saveBtn = document.getElementById('saveBtn');
        if (saveBtn) {
            saveBtn.style.display = 'none';
        }
        
        // Load history (but don't show error if server is down, user will see it when they click View History)
        if (serverRunning) {
            loadHistory();
        }
    } else {
        // Show user form
        document.getElementById('userInfoSection').style.display = 'block';
        document.getElementById('currentUserInfo').style.display = 'none';
        document.getElementById('bmiSection').style.display = 'none';
        document.getElementById('legendSection').style.display = 'none';
        document.getElementById('historySection').style.display = 'none';
    }
    
    // Add event listeners for input changes (auto-calculate)
    const heightInput = document.getElementById('height');
    const weightInput = document.getElementById('weight');
    
    if (heightInput) {
        heightInput.addEventListener('input', function() {
            if (this.value && currentUser) {
                // Auto-calculate can be enabled here if needed
            }
        });
    }
    
    if (weightInput) {
        weightInput.addEventListener('input', function() {
            if (this.value && currentUser) {
                // Auto-calculate can be enabled here if needed
            }
        });
    }
    
    // Window controls (optional - just for UI)
    const closeBtn = document.querySelector('.close');
    const minimizeBtn = document.querySelector('.minimize');
    const maximizeBtn = document.querySelector('.maximize');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            if (confirm('Do you want to close this window?')) {
                window.close();
            }
        });
    }
    
    if (minimizeBtn) {
        minimizeBtn.addEventListener('click', function() {
            alert('Minimize functionality would be implemented in a desktop app');
        });
    }
    
    if (maximizeBtn) {
        maximizeBtn.addEventListener('click', function() {
            alert('Maximize functionality would be implemented in a desktop app');
        });
    }
});
