// DOM Elements
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const previewSection = document.getElementById('previewSection');
const imagePreview = document.getElementById('imagePreview');
const fileName = document.getElementById('fileName');
const analyzeBtn = document.getElementById('analyzeBtn');
const resetBtn = document.getElementById('resetBtn');
const resultsSection = document.getElementById('resultsSection');
const loading = document.getElementById('loading');
const resultContent = document.getElementById('resultContent');
const confidenceCircle = document.getElementById('confidenceCircle');
const confidenceText = document.getElementById('confidenceText');
const predictionIcon = document.getElementById('predictionIcon');
const predictionTitle = document.getElementById('predictionTitle');
const predictionText = document.getElementById('predictionText');
const riskIndicators = document.getElementById('riskIndicators');
const progressFill = document.getElementById('progressFill');
const loadingStatus = document.getElementById('loadingStatus');

// Navigation
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// Tab functionality
const tabBtns = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');

// Event Listeners
uploadArea.addEventListener('click', () => fileInput.click());
uploadArea.addEventListener('dragover', handleDragOver);
uploadArea.addEventListener('dragleave', handleDragLeave);
uploadArea.addEventListener('drop', handleDrop);
fileInput.addEventListener('change', handleFileSelect);
analyzeBtn.addEventListener('click', analyzeImage);
resetBtn.addEventListener('click', resetUpload);

// Navigation toggle
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Tab functionality
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const tabId = btn.dataset.tab;
        
        // Remove active class from all tabs and panels
        tabBtns.forEach(b => b.classList.remove('active'));
        tabPanels.forEach(p => p.classList.remove('active'));
        
        // Add active class to clicked tab and corresponding panel
        btn.classList.add('active');
        document.getElementById(tabId).classList.add('active');
    });
});

// File upload handling
function handleDragOver(e) {
    e.preventDefault();
    uploadArea.classList.add('dragover');
}

function handleDragLeave(e) {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
}

function handleDrop(e) {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFile(files[0]);
    }
}

function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
        handleFile(file);
    }
}

function handleFile(file) {
    if (!file.type.startsWith('image/')) {
        showNotification('Please select an image file.', 'error');
        return;
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
        showNotification('File size must be less than 10MB.', 'error');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        imagePreview.src = e.target.result;
        fileName.textContent = file.name;
        previewSection.style.display = 'block';
        resultsSection.style.display = 'none';
        
        // Add animation
        previewSection.style.opacity = '0';
        previewSection.style.transform = 'translateY(20px)';
        setTimeout(() => {
            previewSection.style.transition = 'all 0.5s ease';
            previewSection.style.opacity = '1';
            previewSection.style.transform = 'translateY(0)';
        }, 100);
    };
    reader.readAsDataURL(file);
}

function resetUpload() {
    previewSection.style.display = 'none';
    resultsSection.style.display = 'none';
    fileInput.value = '';
    uploadArea.classList.remove('dragover');
}

async function analyzeImage() {
    resultsSection.style.display = 'block';
    loading.style.display = 'block';
    resultContent.style.display = 'none';

    // Animate results section appearance
    resultsSection.style.opacity = '0';
    resultsSection.style.transform = 'translateY(20px)';
    setTimeout(() => {
        resultsSection.style.transition = 'all 0.5s ease';
        resultsSection.style.opacity = '1';
        resultsSection.style.transform = 'translateY(0)';
    }, 100);

    try {
        await simulateAnalysis();
    } catch (error) {
        console.error('Error analyzing image:', error);
        showError('Failed to analyze image. Please try again.');
    }
}

async function simulateAnalysis() {
    const loadingMessages = [
        'Initializing neural network...',
        'Processing satellite imagery...',
        'Analyzing vegetation patterns...',
        'Detecting heat signatures...',
        'Calculating fire probability...',
        'Generating risk assessment...',
        'Finalizing results...'
    ];

    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 100) progress = 100;
        
        progressFill.style.width = `${progress}%`;
        
        if (progress < 100) {
            const messageIndex = Math.floor((progress / 100) * loadingMessages.length);
            loadingStatus.textContent = loadingMessages[messageIndex] || loadingMessages[0];
        }
    }, 300);

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 4000));
    
    clearInterval(progressInterval);
    progressFill.style.width = '100%';
    loadingStatus.textContent = 'Analysis complete!';
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Generate prediction results
    const isWildfire = Math.random() > 0.6;
    const confidence = Math.random() * 40 + 60; // 60-100% confidence
    
    showResult(isWildfire, confidence);
}

function showResult(isWildfire, confidence) {
    loading.style.display = 'none';
    resultContent.style.display = 'block';
    
    // Animate confidence circle
    const circumference = 2 * Math.PI * 54;
    const offset = circumference - (confidence / 100) * circumference;
    confidenceCircle.style.strokeDashoffset = offset;
    
    // Animate confidence text
    animateNumber(confidenceText, 0, confidence, 1500, '%');
    
    // Update prediction content
    if (isWildfire) {
        predictionIcon.innerHTML = '<i class="fas fa-fire"></i>';
        predictionIcon.className = 'prediction-icon fire';
        predictionTitle.textContent = 'WILDFIRE DETECTED';
        predictionText.textContent = 'High probability wildfire activity detected in the analyzed satellite image. Immediate attention and response may be required.';
        
        // Add risk indicators
        riskIndicators.innerHTML = `
            <span class="risk-indicator risk-high">High Risk</span>
            <span class="risk-indicator risk-medium">Vegetation Dry</span>
            <span class="risk-indicator risk-high">Heat Detected</span>
        `;
        
        // Update progress ring color for fire
        confidenceCircle.style.stroke = '#e74c3c';
    } else {
        predictionIcon.innerHTML = '<i class="fas fa-shield-alt"></i>';
        predictionIcon.className = 'prediction-icon safe';
        predictionTitle.textContent = 'NO WILDFIRE DETECTED';
        predictionText.textContent = 'The analyzed satellite image shows no signs of wildfire activity. The area appears to be safe from immediate fire threats.';
        
        // Add risk indicators
        riskIndicators.innerHTML = `
            <span class="risk-indicator risk-low">Low Risk</span>
            <span class="risk-indicator risk-low">Normal Vegetation</span>
            <span class="risk-indicator risk-low">Safe Zone</span>
        `;
        
        // Update progress ring color for safe
        confidenceCircle.style.stroke = '#27ae60';
    }
    
    // Populate additional information tabs
    populateDetailTab(isWildfire, confidence);
    populateRecommendationTab(isWildfire);
    populateMetadataTab();
    
    // Add entrance animation
    resultContent.style.opacity = '0';
    resultContent.style.transform = 'translateY(20px)';
    setTimeout(() => {
        resultContent.style.transition = 'all 0.6s ease';
        resultContent.style.opacity = '1';
        resultContent.style.transform = 'translateY(0)';
    }, 200);
}

function populateDetailTab(isWildfire, confidence) {
    const detailItems = document.getElementById('detailItems');
    const temperature = Math.floor(Math.random() * 20) + 25; // 25-45°C
    const humidity = Math.floor(Math.random() * 40) + 30; // 30-70%
    const windSpeed = Math.floor(Math.random() * 15) + 5; // 5-20 km/h
    const vegetation = isWildfire ? 'Dry/Stressed' : 'Healthy';
    
    detailItems.innerHTML = `
        <div class="detail-item">
            <span>Detection Confidence</span>
            <strong>${confidence.toFixed(1)}%</strong>
        </div>
        <div class="detail-item">
            <span>Surface Temperature</span>
            <strong>${temperature}°C</strong>
        </div>
        <div class="detail-item">
            <span>Humidity Level</span>
            <strong>${humidity}%</strong>
        </div>
        <div class="detail-item">
            <span>Wind Speed</span>
            <strong>${windSpeed} km/h</strong>
        </div>
        <div class="detail-item">
            <span>Vegetation Status</span>
            <strong>${vegetation}</strong>
        </div>
        <div class="detail-item">
            <span>Analysis Time</span>
            <strong>2.3 seconds</strong>
        </div>
    `;
}

function populateRecommendationTab(isWildfire) {
    const recommendationList = document.getElementById('recommendationList');
    
    if (isWildfire) {
        recommendationList.innerHTML = `
            <div class="recommendation-item">
                <h5>🚨 Immediate Action Required</h5>
                <p>Contact local fire authorities and emergency services immediately.</p>
            </div>
            <div class="recommendation-item">
                <h5>📍 Area Monitoring</h5>
                <p>Continue monitoring the area with additional satellite passes and ground verification.</p>
            </div>
            <div class="recommendation-item">
                <h5>🚁 Resource Deployment</h5>
                <p>Consider deploying firefighting resources and evacuation procedures if necessary.</p>
            </div>
            <div class="recommendation-item">
                <h5>📊 Data Collection</h5>
                <p>Gather additional meteorological data and wind patterns for fire behavior prediction.</p>
            </div>
        `;
    } else {
        recommendationList.innerHTML = `
            <div class="recommendation-item">
                <h5>✅ Continue Monitoring</h5>
                <p>Maintain regular surveillance of the area for any changes in fire risk conditions.</p>
            </div>
            <div class="recommendation-item">
                <h5>🌿 Vegetation Management</h5>
                <p>Consider preventive vegetation management to maintain low fire risk status.</p>
            </div>
            <div class="recommendation-item">
                <h5>📈 Seasonal Awareness</h5>
                <p>Increase monitoring frequency during high-risk fire seasons.</p>
            </div>
            <div class="recommendation-item">
                <h5>🎯 Preparedness</h5>
                <p>Ensure fire prevention measures and emergency plans are up to date.</p>
            </div>
        `;
    }
}

function populateMetadataTab() {
    const metadataGrid = document.getElementById('metadataGrid');
    const currentDate = new Date().toISOString().split('T')[0];
    const coordinates = `${(Math.random() * 180 - 90).toFixed(4)}°, ${(Math.random() * 360 - 180).toFixed(4)}°`;
    
    metadataGrid.innerHTML = `
        <div class="metadata-item">
            <span>Image Resolution</span>
            <strong>10m/pixel</strong>
        </div>
        <div class="metadata-item">
            <span>Satellite Source</span>
            <strong>Sentinel-2</strong>
        </div>
        <div class="metadata-item">
            <span>Capture Date</span>
            <strong>${currentDate}</strong>
        </div>
        <div class="metadata-item">
            <span>Coordinates</span>
            <strong>${coordinates}</strong>
        </div>
        <div class="metadata-item">
            <span>Cloud Coverage</span>
            <strong>${Math.floor(Math.random() * 20)}%</strong>
        </div>
        <div class="metadata-item">
            <span>Processing Time</span>
            <strong>2.3s</strong>
        </div>
        <div class="metadata-item">
            <span>Model Version</span>
            <strong>WildfireAI v2.1</strong>
        </div>
        <div class="metadata-item">
            <span>Accuracy Rating</span>
            <strong>99.2%</strong>
        </div>
    `;
}

function showError(message) {
    loading.style.display = 'none';
    resultContent.style.display = 'block';
    
    predictionIcon.innerHTML = '<i class="fas fa-exclamation-triangle"></i>';
    predictionIcon.className = 'prediction-icon';
    predictionIcon.style.background = '#e74c3c';
    predictionTitle.textContent = 'ANALYSIS ERROR';
    predictionText.textContent = message;
    riskIndicators.innerHTML = '';
    
    confidenceCircle.style.strokeDashoffset = '339.292';
    confidenceText.textContent = '0%';
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    if (type === 'error') {
        notification.style.background = '#e74c3c';
    } else if (type === 'success') {
        notification.style.background = '#27ae60';
    } else {
        notification.style.background = '#3498db';
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

function animateNumber(element, start, end, duration, suffix = '') {
    const startTime = performance.now();
    const range = end - start;
    
    function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = start + (range * easeOutQuart);
        
        element.textContent = Math.floor(current) + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        } else {
            element.textContent = Math.floor(end) + suffix;
        }
    }
    
    requestAnimationFrame(updateNumber);
}

// Navbar scroll effect
function handleNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });
}

// Initialize animations and effects
document.addEventListener('DOMContentLoaded', function() {
    // Animate elements on page load
    const animatedElements = document.querySelectorAll('.page-header, .upload-main');
    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        setTimeout(() => {
            el.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, index * 200);
    });
    
    // Initialize navbar scroll effect
    handleNavbarScroll();
});