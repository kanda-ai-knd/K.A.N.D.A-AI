    <script>
        // ===== INTRO SCREEN FUNCTIONALITY =====
        const blueWhiteColors = [
            { primary: 'rgba(255, 255, 255, 0.7)', secondary: 'rgba(255, 255, 255, 0.4)' },
            { primary: 'rgba(220, 230, 255, 0.7)', secondary: 'rgba(220, 230, 255, 0.4)' },
            { primary: 'rgba(180, 210, 255, 0.7)', secondary: 'rgba(180, 210, 255, 0.4)' },
            { primary: 'rgba(140, 190, 255, 0.7)', secondary: 'rgba(140, 190, 255, 0.4)' }
        ];
       
        let currentColorIndex = 0;
        let isDragging = false;
        let startX, startY;
        let currentX = 0;
        let currentY = 0;
        let isMouseDown = false;
        let mouseDownTimeout = null;
       
        // Element references
        const introScreen = document.getElementById('introScreen');
        const mainApp = document.getElementById('mainApp');
        const sphereWrapper = document.getElementById('sphereWrapper');
        const sphere = document.getElementById('sphere');
        const startBtn = document.getElementById('startBtn');
        const backToIntroBtn = document.getElementById('backToIntro');
       
        // Membuat bintang-bintang
        function createStars() {
            const starsContainer = document.getElementById('stars');
            for (let i = 0; i < 200; i++) {
                const star = document.createElement('div');
                star.classList.add('star');
                star.style.width = Math.random() * 3 + 'px';
                star.style.height = star.style.width;
                star.style.left = Math.random() * 100 + '%';
                star.style.top = Math.random() * 100 + '%';
                star.style.animationDelay = Math.random() * 5 + 's';
                starsContainer.appendChild(star);
            }
        }
       
        // Membuat partikel yang melayang
        function createParticles() {
            const particlesContainer = document.getElementById('particles');
            for (let i = 0; i < 50; i++) {
                const particle = document.createElement('div');
                particle.classList.add('particle');
                particle.style.left = Math.random() * 100 + '%';
                particle.style.animationDelay = Math.random() * 15 + 's';
                particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
                particlesContainer.appendChild(particle);
            }
        }
       
        // Membuat elemen sphere secara dinamis
        function createSphereElements() {
            const sphereContainer = document.getElementById('sphere');
            if (!sphereContainer) return;
           
            sphereContainer.innerHTML = '';
           
            // Buat elemen untuk rotasi Y (garis bujur)
            for (let i = 0; i < 12; i++) {
                const element = document.createElement('div');
                element.classList.add('sphere-element');
                element.style.transform = `rotateY(${i * 30}deg)`;
                sphereContainer.appendChild(element);
            }
           
            // Buat elemen untuk rotasi X (garis lintang)
            for (let i = 1; i < 6; i++) {
                const element = document.createElement('div');
                element.classList.add('sphere-element');
                element.style.transform = `rotateX(${i * 30}deg)`;
                sphereContainer.appendChild(element);
            }
           
            // Buat core
            const coreElement = document.createElement('div');
            coreElement.classList.add('core');
            sphereContainer.appendChild(coreElement);
           
            // Terapkan warna awal
            applySphereColor();
        }
       
        // Fungsi untuk menerapkan warna sphere
        function applySphereColor() {
            const color = blueWhiteColors[currentColorIndex];
            const sphereElements = document.querySelectorAll('.sphere-element');
            const core = document.querySelector('.core');
           
            // Update semua elemen sphere
            sphereElements.forEach(element => {
                element.style.borderColor = color.primary;
                element.style.boxShadow =
                    `0 0 15px ${color.secondary},
                    inset 0 0 15px ${color.secondary}`;
            });
           
            // Update core
            if (core) {
                core.style.background = `radial-gradient(circle at 30% 30%,
                    ${color.primary} 0%,
                    ${color.secondary} 40%,
                    rgba(255, 255, 255, 0.2) 70%,
                    transparent 100%)`;
                core.style.boxShadow =
                    `0 0 30px ${color.secondary},
                    inset 0 0 30px ${color.secondary}`;
            }
        }
       
        // Fungsi untuk mengubah warna sphere
        function changeSphereColor() {
            currentColorIndex = (currentColorIndex + 1) % blueWhiteColors.length;
            applySphereColor();
        }
       
        // Fungsi untuk mengupdate rotasi sphere wrapper
        function updateSphereRotation() {
            if (sphereWrapper) {
                sphereWrapper.style.transform = `rotateX(${currentX}deg) rotateY(${currentY}deg)`;
            }
        }
       
        // Event listeners untuk desktop
        function setupSphereInteractions() {
            if (!sphereWrapper) return;
           
            sphereWrapper.addEventListener('mousedown', (e) => {
                e.preventDefault();
                isDragging = true;
                isMouseDown = true;
                startX = e.clientX;
                startY = e.clientY;
                if (sphere) sphere.style.animationPlayState = 'paused';
                sphereWrapper.style.cursor = 'grabbing';
               
                // Set timeout untuk mengubah warna jika klik tahan
                mouseDownTimeout = setTimeout(() => {
                    if (isMouseDown) {
                        changeSphereColor();
                    }
                }, 500);
            });
           
            document.addEventListener('mousemove', (e) => {
                if (!isDragging) return;
               
                const deltaX = e.clientX - startX;
                const deltaY = e.clientY - startY;
               
                // Update rotasi - reverse arah untuk feeling yang natural
                currentY += deltaX * 0.5;
                currentX -= deltaY * 0.5;
               
                updateSphereRotation();
               
                startX = e.clientX;
                startY = e.clientY;
            });
           
            document.addEventListener('mouseup', () => {
                isDragging = false;
                isMouseDown = false;
                if (sphereWrapper) sphereWrapper.style.cursor = 'grab';
                clearTimeout(mouseDownTimeout);
               
                // Kembalikan animasi setelah beberapa saat
                setTimeout(() => {
                    if (!isDragging && sphere) {
                        sphere.style.animationPlayState = 'running';
                    }
                }, 2000);
            });
           
            // Event listeners untuk mobile
            sphereWrapper.addEventListener('touchstart', (e) => {
                e.preventDefault();
                isDragging = true;
                isMouseDown = true;
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
                if (sphere) sphere.style.animationPlayState = 'paused';
               
                mouseDownTimeout = setTimeout(() => {
                    if (isMouseDown) {
                        changeSphereColor();
                    }
                }, 500);
            });
           
            document.addEventListener('touchmove', (e) => {
                if (!isDragging) return;
                e.preventDefault();
               
                const deltaX = e.touches[0].clientX - startX;
                const deltaY = e.touches[0].clientY - startY;
               
                // Update rotasi
                currentY += deltaX * 0.5;
                currentX -= deltaY * 0.5;
               
                updateSphereRotation();
               
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
            });
           
            document.addEventListener('touchend', () => {
                isDragging = false;
                isMouseDown = false;
                clearTimeout(mouseDownTimeout);
               
                setTimeout(() => {
                    if (!isDragging && sphere) {
                        sphere.style.animationPlayState = 'running';
                    }
                }, 2000);
            });
        }
       
        // ===== TRANSISI KE MAIN APP =====
        function setupStartButton() {
            if (startBtn) {
                startBtn.addEventListener('click', () => {
                    // Animasi transisi dari intro ke main app
                    introScreen.classList.add('hidden');
                   
                    setTimeout(() => {
                        mainApp.classList.add('active');
                        initializeKandaAI();
                    }, 800);
                });
            }
        }
       
        // ===== KEMBALI KE INTRO =====
        function setupBackButton() {
            if (backToIntroBtn) {
                backToIntroBtn.addEventListener('click', () => {
                    // Animasi transisi dari main app ke intro
                    mainApp.classList.remove('active');
                   
                    setTimeout(() => {
                        introScreen.classList.remove('hidden');
                    }, 800);
                });
            }
        }
       
        // ===== KANDA AI COMPLETE FUNCTIONALITY =====
       
        // Configuration
        const API_URL = 'http://localhost:8000';
        let token = null;
        let currentUser = null;
        let currentLanguage = 'id';
        let currentPersonality = 'friendly';
        let currentTheme = 'auto'; // Default theme
        let isRecording = false;
        let mediaRecorder;
        let audioChunks = [];
        let messageCount = 0;
        let recognition = null;
        let conversationHistory = [];
        let isTyping = false;
        let typingTimeout = null;
        let kandaboxData = [];
        let wikiSearchHistory = JSON.parse(localStorage.getItem('kanda_wiki_history') || '[]');
        let map = null;
        let cameraStream = null;
        let isRecordingVideo = false;
        let mediaRecorderVideo = null;
        let recordedChunks = [];
        let stopwatchInterval = null;
        let stopwatchTime = 0;
        let timerInterval = null;
        let timerTime = 0;
        let timerRunning = false;
        let alarms = JSON.parse(localStorage.getItem('kanda_alarms') || '[]');
        let notes = JSON.parse(localStorage.getItem('kanda_notes') || '[]');
        let currentNoteId = null;
        let galleryItems = JSON.parse(localStorage.getItem('kanda_gallery') || '[]');
        let iqTestData = null;
        let iqCurrentQuestion = 0;
        let iqScore = 0;
        let iqTimer = null;
        let iqTimeLeft = 900; // 15 minutes in seconds
        let calendarDate = new Date();
        let drawingCanvas = null;
        let drawingContext = null;
        let isDrawing = false;
        let lastX = 0;
        let lastY = 0;
        let currentVoice = 'female1';
        let audioPlayer = null;

        // AI Model Information
        const modelInfo = {
            'kanda-ai-v3': "KANDA AI v3.0 - Advanced proprietary AI with IQ 180, self-learning capabilities, emotional intelligence, and 20+ specialized experts."
        };

        // Initialize KANDA AI application
        function initializeKandaAI() {
            console.log('🚀 KANDA AI v3.0 - Enhanced Version Loaded');
            loadSavedPreferences();
            loadKandabox();
            setupProactiveChat();
            initializeCatEyes();
            initializeThemeSystem();
            initializeWatch();
            loadGallery();
            loadNotes();
            loadAlarms();
           
            // Initialize speech recognition
            initializeSpeechRecognition();
           
            // Inisialisasi KANDA AIWiki
            updateWikiHistoryDisplay();
           
            // Event listener untuk Enter key di search input
            const wikiSearchInput = document.getElementById('wikiSearchInput');
            if (wikiSearchInput) {
                wikiSearchInput.addEventListener('keypress', function(e) {
                    if (e.key === 'Enter') {
                        searchWikipedia();
                    }
                });
            }

            // Initialize all event listeners
            setupEventListeners();
        }

        // Initialize theme system
        function initializeThemeSystem() {
            const savedTheme = localStorage.getItem('kanda_theme') || 'auto';
            setTheme(savedTheme);
            document.getElementById('settingsTheme').value = savedTheme;
        }

        // Set theme function
        function setTheme(theme) {
            currentTheme = theme;
            localStorage.setItem('kanda_theme', theme);
           
            if (theme === 'auto') {
                const hour = new Date().getHours();
                if (hour >= 6 && hour < 18) {
                    document.body.classList.add('light-mode');
                } else {
                    document.body.classList.remove('light-mode');
                }
            } else if (theme === 'light') {
                document.body.classList.add('light-mode');
            } else {
                document.body.classList.remove('light-mode');
            }
           
            // Update theme in settings
            document.getElementById('settingsTheme').value = theme;
        }

        // Initialize watch
        function initializeWatch() {
            updateWatch();
            setInterval(updateWatch, 1000);
        }

        function updateWatch() {
            const now = new Date();
            const timeString = now.toLocaleTimeString();
            const dateString = now.toLocaleDateString('id-ID', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
           
            document.getElementById('watchTime').textContent = timeString;
            document.getElementById('watchDate').textContent = dateString;
        }

        // Cat eyes following cursor
        function initializeCatEyes() {
            document.addEventListener('mousemove', (e) => {
                const pupils = document.querySelectorAll('.cat-pupil');
                pupils.forEach(pupil => {
                    const eye = pupil.parentElement;
                    const eyeRect = eye.getBoundingClientRect();
                    const eyeCenterX = eyeRect.left + eyeRect.width / 2;
                    const eyeCenterY = eyeRect.top + eyeRect.height / 2;
                   
                    const angle = Math.atan2(e.clientY - eyeCenterY, e.clientX - eyeCenterX);
                    const distance = Math.min(3, Math.hypot(e.clientX - eyeCenterX, e.clientY - eyeCenterY) / 100);
                   
                    const x = Math.cos(angle) * distance;
                    const y = Math.sin(angle) * distance;
                   
                    pupil.style.transform = `translate(${x}px, ${y}px)`;
                });
            });
        }

        // Initialize speech recognition
        function initializeSpeechRecognition() {
            if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
                const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                recognition = new SpeechRecognition();
                recognition.continuous = false;
                recognition.interimResults = false;
               
                // Set language based on current language
                updateRecognitionLanguage();
               
                recognition.onresult = function(event) {
                    const transcript = event.results[0][0].transcript;
                    document.getElementById('messageInput').value = transcript;
                    document.getElementById('voiceStatus').textContent = `✅ Transcribed: "${transcript}"`;
                    playSound('success');
                   
                    // Auto-send the message after a short delay
                    setTimeout(() => sendMessage(), 1000);
                };
               
                recognition.onerror = function(event) {
                    console.error('Speech recognition error', event.error);
                    document.getElementById('voiceStatus').textContent = '❌ Voice recognition failed';
                    playSound('error');
                };
               
                recognition.onend = function() {
                    isRecording = false;
                    document.getElementById('voiceBtn').classList.remove('listening');
                    document.getElementById('mainVoiceBtn').classList.remove('listening');
                    document.getElementById('voiceStatus').textContent = 'Voice recognition ended';
                };
            } else {
                console.warn('Speech recognition not supported in this browser');
                document.getElementById('voiceStatus').textContent = '❌ Voice recognition not supported';
            }
        }

        // Update recognition language based on current language
        function updateRecognitionLanguage() {
            if (!recognition) return;
           
            const langMap = {
                'id': 'id-ID',
                'en': 'en-US',
                'zh-cn': 'zh-CN',
                'ar': 'ar-SA',
                'ms': 'ms-MY',
                'th': 'th-TH',
                'ja': 'ja-JP',
                'ko': 'ko-KR'
            };
           
            recognition.lang = langMap[currentLanguage] || 'id-ID';
        }

        // Notification system
        function showNotification(message, type = 'success', duration = 3000) {
            const notification = document.createElement('div');
            notification.className = `notification ${type}`;
            notification.textContent = message;
            document.body.appendChild(notification);
           
            setTimeout(() => {
                notification.style.animation = 'slideInRight 0.3s cubic-bezier(0.23, 1, 0.32, 1) reverse';
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }, duration);
        }

        // Sound effects
        function playSound(type) {
            const soundEnabled = document.getElementById('settingsSound')?.checked ?? true;
            if (!soundEnabled) return;
           
            // Simple sound implementation
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
           
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
           
            if (type === 'typing') {
                oscillator.frequency.value = 1200;
                gainNode.gain.value = 0.05;
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.05);
            } else if (type === 'send') {
                oscillator.frequency.value = 800;
                gainNode.gain.value = 0.1;
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.1);
            } else if (type === 'success') {
                oscillator.frequency.value = 1000;
                gainNode.gain.value = 0.1;
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.3);
            } else if (type === 'error') {
                oscillator.frequency.value = 400;
                gainNode.gain.value = 0.1;
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.5);
            }
        }

        // Setup all event listeners
        function setupEventListeners() {
            // Message input handling
            const messageInput = document.getElementById('messageInput');
            if (messageInput) {
                messageInput.addEventListener('keydown', handleKeyDown);
            }
           
            const sendButton = document.getElementById('sendButton');
            if (sendButton) {
                sendButton.addEventListener('click', sendMessage);
            }
           
            // Voice recording
            const voiceBtn = document.getElementById('voiceBtn');
            if (voiceBtn) {
                voiceBtn.addEventListener('click', toggleVoiceRecording);
            }
           
            const mainVoiceBtn = document.getElementById('mainVoiceBtn');
            if (mainVoiceBtn) {
                mainVoiceBtn.addEventListener('click', toggleVoiceRecording);
            }
           
            // Personality selection
            const personalitySelect = document.getElementById('personalitySelect');
            if (personalitySelect) {
                personalitySelect.addEventListener('change', changePersonality);
            }
           
            // Language selection
            const languageSelect = document.getElementById('languageSelect');
            if (languageSelect) {
                languageSelect.addEventListener('change', changeLanguage);
            }
        }

        // KANDABOX Memory System
        function loadKandabox() {
            const savedKandabox = localStorage.getItem('kandabox');
            if (savedKandabox) {
                kandaboxData = JSON.parse(savedKandabox);
                updateKandaboxDisplay();
            }
        }

        function saveToKandabox(content, type = 'conversation') {
            if (!document.getElementById('settingsKandabox')?.checked) return;
           
            const memoryItem = {
                id: Date.now(),
                type: type,
                content: content,
                timestamp: new Date().toISOString(),
                date: new Date().toLocaleDateString('id-ID', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                })
            };
           
            kandaboxData.unshift(memoryItem);
            localStorage.setItem('kandabox', JSON.stringify(kandaboxData));
            updateKandaboxDisplay();
        }

        function updateKandaboxDisplay(data = null) {
            const container = document.getElementById('kandaboxContent');
            const displayData = data || kandaboxData;
           
            if (displayData.length === 0) {
                container.innerHTML = '<p>No memories stored yet. Start chatting to build your KANDABOX!</p>';
                return;
            }
           
            container.innerHTML = displayData.map(item => `
                <div class="memory-item">
                    <div class="memory-date">${item.date} • ${item.type}</div>
                    <div class="memory-content">${item.content}</div>
                    <div class="memory-actions">
                        <button class="action-btn" onclick="deleteMemory(${item.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `).join('');
        }

        function searchKandabox() {
            const query = document.getElementById('kandaboxSearch').value.toLowerCase();
            const filteredData = kandaboxData.filter(item => 
                item.content.toLowerCase().includes(query) || 
                item.type.toLowerCase().includes(query)
            );
            updateKandaboxDisplay(filteredData);
        }

        function organizeKandabox() {
            // Sort by date (newest first)
            kandaboxData.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            localStorage.setItem('kandabox', JSON.stringify(kandaboxData));
            updateKandaboxDisplay();
            showNotification('KANDABOX organized by date');
        }

        function deleteMemory(id) {
            kandaboxData = kandaboxData.filter(item => item.id !== id);
            localStorage.setItem('kandabox', JSON.stringify(kandaboxData));
            updateKandaboxDisplay();
            showNotification('Memory deleted from KANDABOX');
        }

        function exportKandabox() {
            const dataStr = JSON.stringify(kandaboxData, null, 2);
            const dataBlob = new Blob([dataStr], {type: 'application/json'});
           
            const link = document.createElement('a');
            link.href = URL.createObjectURL(dataBlob);
            link.download = `kandabox-${new Date().toISOString().split('T')[0]}.json`;
            link.click();
           
            showNotification('KANDABOX exported successfully');
        }

        function clearKandabox() {
            if (confirm('Are you sure you want to clear all KANDABOX memories? This action cannot be undone.')) {
                kandaboxData = [];
                localStorage.removeItem('kandabox');
                updateKandaboxDisplay();
                showNotification('KANDABOX cleared successfully');
            }
        }

        // KANDA AIWiki Functions
        async function searchWikipedia() {
            playSound('send');
            const query = document.getElementById('wikiSearchInput').value.trim();
            if (!query) {
                showNotification('❌ Masukkan topik yang ingin dicari', 'error');
                return;
            }

            const resultsContainer = document.getElementById('wikiResults');
            resultsContainer.innerHTML = `
                <div class="wiki-loading">
                    <div class="loading">
                        <div class="loading-dot"></div>
                        <div class="loading-dot"></div>
                        <div class="loading-dot"></div>
                    </div>
                    <p>Mencari "${query}" di Wikipedia...</p>
                </div>
            `;

            try {
                const result = await fetchWikipediaData(query);
                displayWikiResult(result);
                
                // Simpan ke riwayat
                addToWikiHistory(query, result);
                updateWikiHistoryDisplay();
                
                showNotification(`✅ Ditemukan informasi tentang "${query}"`);
                playSound('success');
                
            } catch (error) {
                console.error('Wikipedia search error:', error);
                resultsContainer.innerHTML = `
                    <div class="wiki-error">
                        <i class="fas fa-exclamation-triangle"></i>
                        <h3>Gagal mengambil data</h3>
                        <p>${error.message || 'Terjadi kesalahan saat mengambil data dari Wikipedia'}</p>
                        <button onclick="searchWikipedia()" class="wiki-action-btn">Coba Lagi</button>
                    </div>
                `;
                playSound('error');
            }
        }

        async function fetchWikipediaData(topic) {
            // Normalize topic untuk URL
            const normalizedTopic = topic.trim().replace(/\s+/g, '_');
            
            // Coba Wikipedia Indonesia dulu
            let url = `https://id.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(normalizedTopic)}`;
            let response = await fetch(url);
            
            // Jika tidak ditemukan di Wikipedia Indonesia, coba Wikipedia English
            if (!response.ok) {
                url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(normalizedTopic)}`;
                response = await fetch(url);
            }
            
            if (!response.ok) {
                throw new Error(`Topik "${topic}" tidak ditemukan di Wikipedia`);
            }
            
            const data = await response.json();
            
            // Jika data dari Wikipedia English, terjemahkan ke Bahasa Indonesia
            if (data.lang === 'en') {
                data.extract = await translateToIndonesian(data.extract);
                data.title = await translateToIndonesian(data.title);
            }
            
            return data;
        }

        async function translateToIndonesian(text) {
            try {
                // Gunakan Google Translate API (free tier)
                const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=id&dt=t&q=${encodeURIComponent(text)}`);
                const data = await response.json();
                return data[0].map(item => item[0]).join('');
            } catch (error) {
                console.warn('Translation failed, returning original text:', error);
                return text;
            }
        }

        function displayWikiResult(data) {
            const resultsContainer = document.getElementById('wikiResults');
            
            let thumbnailHTML = '';
            if (data.thumbnail && data.thumbnail.source) {
                thumbnailHTML = `<img src="${data.thumbnail.source}" alt="${data.title}" class="wiki-thumbnail" onclick="window.open('${data.content_urls.desktop.page}', '_blank')">`;
            }
            
            resultsContainer.innerHTML = `
                <div class="wiki-result">
                    <div class="wiki-title">${data.title}</div>
                    ${thumbnailHTML}
                    <div class="wiki-extract">${data.extract}</div>
                    <div class="wiki-meta">
                        <div>
                            <small>Source: Wikipedia • ${data.lang ? data.lang.toUpperCase() : 'ID'}</small>
                        </div>
                        <div class="wiki-actions">
                            <button class="wiki-action-btn" onclick="window.open('${data.content_urls.desktop.page}', '_blank')">
                                <i class="fas fa-external-link-alt"></i> Baca Lengkap
                            </button>
                            <button class="wiki-action-btn" onclick="shareWikiResult('${data.title}', '${data.extract.substring(0, 100)}...')">
                                <i class="fas fa-share"></i> Share
                            </button>
                            <button class="wiki-action-btn" onclick="saveWikiToKandabox('${data.title}', '${data.extract}')">
                                <i class="fas fa-save"></i> Simpan
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }
        
        function addToWikiHistory(query, result) {
            const historyItem = {
                query: query,
                title: result.title,
                timestamp: new Date().toISOString(),
                date: new Date().toLocaleDateString('id-ID', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                })
            };
           
            // Hapus duplikat dan batasi riwayat hingga 10 item
            wikiSearchHistory = wikiSearchHistory.filter(item => item.query !== query);
            wikiSearchHistory.unshift(historyItem);
            wikiSearchHistory = wikiSearchHistory.slice(0, 10);
           
            localStorage.setItem('kanda_wiki_history', JSON.stringify(wikiSearchHistory));
        }

        function updateWikiHistoryDisplay() {
            const historyContainer = document.getElementById('wikiHistory');
            const historyList = document.getElementById('wikiHistoryList');
           
            if (!historyContainer || !historyList) return;
           
            if (wikiSearchHistory.length === 0) {
                historyContainer.style.display = 'none';
                return;
            }
           
            historyContainer.style.display = 'block';
            historyList.innerHTML = wikiSearchHistory.map(item => `
                <div class="wiki-history-item" onclick="loadFromWikiHistory('${item.query}')">
                    <strong>${item.title}</strong>
                    <div style="font-size: 0.8em; color: var(--text-secondary);">${item.date}</div>
                </div>
            `).join('');
        }

        function loadFromWikiHistory(query) {
            document.getElementById('wikiSearchInput').value = query;
            searchWikipedia();
        }

        function voiceSearchWiki() {
            playSound('send');
            if (!recognition) {
                showNotification('❌ Voice recognition tidak tersedia', 'error');
                return;
            }
           
            recognition.start();
            document.getElementById('voiceStatus').textContent = '🎤 Katakan topik yang ingin dicari...';
           
            recognition.onresult = function(event) {
                const transcript = event.results[0][0].transcript;
                document.getElementById('wikiSearchInput').value = transcript;
                showNotification(`🎤 Mencari: "${transcript}"`);
                setTimeout(() => searchWikipedia(), 1000);
            };
        }

        function quickWikiSearch(topic) {
            playSound('send');
            document.getElementById('wikiSearchInput').value = topic;
            searchWikipedia();
        }

        function shareWikiResult(title, content) {
            playSound('send');
            const shareText = `📚 ${title}\n\n${content}\n\n— Ditemukan via KANDA AIWiki`;
           
            if (navigator.share) {
                navigator.share({
                    title: title,
                    text: shareText
                }).then(() => {
                    showNotification('✅ Berhasil dibagikan');
                }).catch(() => {
                    copyToClipboard(shareText);
                });
            } else {
                copyToClipboard(shareText);
            }
        }

        function copyToClipboard(text) {
            navigator.clipboard.writeText(text).then(() => {
                showNotification('✅ Disalin ke clipboard');
            }).catch(() => {
                // Fallback untuk browser lama
                const textArea = document.createElement('textarea');
                textArea.value = text;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                showNotification('✅ Disalin ke clipboard');
            });
        }

        function saveWikiToKandabox(title, content) {
            playSound('send');
            saveToKandabox(`📚 ${title}\n\n${content}`, 'wikipedia');
            showNotification(`✅ "${title}" disimpan ke KANDABOX`);
        }

        // Weather functionality dengan OpenWeatherMap API
        async function getWeather() {
            playSound('send');
            const city = document.getElementById('cityInput').value;
            if (!city) {
                showNotification('❌ Masukkan nama kota', 'error');
                return;
            }
           
            try {
                // Using OpenWeatherMap API (you need to replace with your own API key)
                const apiKey = 'YOUR_OPENWEATHERMAP_API_KEY'; // Ganti dengan API key Anda
                const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric&lang=${currentLanguage}`;
               
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error('City not found');
                }
               
                const data = await response.json();
                displayWeather(data);
               
            } catch (error) {
                console.error('Weather error:', error);
                document.getElementById('weatherResult').innerHTML = `
                    <div class="notification error">
                        ❌ Gagal mengambil data cuaca. Pastikan nama kota benar atau coba lagi nanti.
                    </div>
                `;
                playSound('error');
            }
        }

        async function getLocationWeather() {
            playSound('send');
            if (!navigator.geolocation) {
                showNotification('❌ Geolocation tidak didukung browser Anda', 'error');
                return;
            }
           
            navigator.geolocation.getCurrentPosition(async (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
               
                try {
                    // Using OpenWeatherMap API
                    const apiKey = 'YOUR_OPENWEATHERMAP_API_KEY'; // Ganti dengan API key Anda
                    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=${currentLanguage}`;
                   
                    const response = await fetch(url);
                    if (!response.ok) {
                        throw new Error('Weather data not available');
                    }
                   
                    const data = await response.json();
                    displayWeather(data);
                   
                } catch (error) {
                    console.error('Location weather error:', error);
                    document.getElementById('weatherResult').innerHTML = `
                        <div class="notification error">
                            ❌ Gagal mengambil data cuaca untuk lokasi Anda.
                        </div>
                    `;
                    playSound('error');
                }
            }, (error) => {
                console.error('Geolocation error:', error);
                showNotification('❌ Gagal mendapatkan lokasi Anda', 'error');
            });
        }

        function displayWeather(weatherData) {
            const container = document.getElementById('weatherResult');
            const iconUrl = `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`;
           
            container.innerHTML = `
                <div class="weather-display">
                    <h3>🌤️ Weather in ${weatherData.name}, ${weatherData.sys.country}</h3>
                    <div style="display: flex; align-items: center; justify-content: center; gap: 20px;">
                        <img src="${iconUrl}" alt="${weatherData.weather[0].description}" style="width: 80px; height: 80px;">
                        <div class="weather-temp">${Math.round(weatherData.main.temp)}°C</div>
                    </div>
                    <p style="text-transform: capitalize;">${weatherData.weather[0].description}</p>
                    <div style="display: flex; justify-content: center; gap: 20px; margin-top: 15px;">
                        <div>💧 ${weatherData.main.humidity}%</div>
                        <div>💨 ${weatherData.wind.speed} m/s</div>
                        <div>🌡️ ${Math.round(weatherData.main.feels_like)}°C</div>
                    </div>
                </div>
            `;
            playSound('success');
        }

        // Web search functionality
        async function performSearch() {
            playSound('send');
            const query = document.getElementById('searchQuery').value;
            if (!query) {
                showNotification('❌ Masukkan query pencarian', 'error');
                return;
            }
           
            try {
                // Simulate search results
                setTimeout(() => {
                    const results = [
                        `https://www.google.com/search?q=${encodeURIComponent(query)}`,
                        `https://wikipedia.org/wiki/${encodeURIComponent(query)}`,
                        `https://www.bing.com/search?pglt=297&q=${encodeURIComponent(query)}`
                    ];
                    displaySearchResults(results);
                }, 1000);
            } catch (error) {
                console.error('Search error:', error);
                playSound('error');
            }
        }

        function displaySearchResults(results) {
            const container = document.getElementById('searchResults');
            container.innerHTML = results.map((result, index) => `
                <div class="search-result">
                    <h4>🔍 Result ${index + 1}</h4>
                    <a href="${result}" target="_blank" style="color: var(--accent-primary);">${result}</a>
                </div>
            `).join('');
            playSound('success');
        }

        // Archive.org integration
        async function searchArchive() {
            playSound('send');
            const query = document.getElementById('archiveQuery').value;
            if (!query) {
                showNotification('❌ Masukkan URL atau kata kunci', 'error');
                return;
            }
           
            try {
                // Using Archive.org API
                const url = `https://archive.org/wayback/available?url=${encodeURIComponent(query)}`;
                const response = await fetch(url);
                const data = await response.json();
               
                displayArchiveResults(data);
               
            } catch (error) {
                console.error('Archive search error:', error);
                document.getElementById('archiveResults').innerHTML = `
                    <div class="notification error">
                        ❌ Gagal mencari di Archive.org. Coba lagi nanti.
                    </div>
                `;
                playSound('error');
            }
        }

        function displayArchiveResults(data) {
            const container = document.getElementById('archiveResults');
           
            if (data.archived_snapshots && data.archived_snapshots.closest) {
                const snapshot = data.archived_snapshots.closest;
                container.innerHTML = `
                    <div class="wiki-result">
                        <div class="wiki-title">📚 Archive.org Result</div>
                        <p><strong>URL:</strong> ${snapshot.url}</p>
                        <p><strong>Tanggal:</strong> ${new Date(snapshot.timestamp).toLocaleDateString()}</p>
                        <p><strong>Status:</strong> ${snapshot.status}</p>
                        <div class="wiki-actions">
                            <a href="${snapshot.url}" target="_blank" class="wiki-action-btn">
                                <i class="fas fa-external-link-alt"></i> Lihat Arsip
                            </a>
                        </div>
                    </div>
                `;
            } else {
                container.innerHTML = `
                    <div class="notification warning">
                        ❌ Tidak ditemukan arsip untuk URL tersebut.
                    </div>
                `;
            }
           
            playSound('success');
        }

        // Maps functionality dengan Leaflet
        function initializeMap() {
            if (map) {
                map.remove();
            }
           
            map = L.map('map').setView([-6.2088, 106.8456], 10); // Default to Jakarta
           
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(map);
           
            // Add satellite layer option
            L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                attribution: '© Esri'
            }).addTo(map);
        }

        function searchMap() {
            const query = document.getElementById('mapSearch').value;
            if (!query) {
                showNotification('❌ Masukkan lokasi yang ingin dicari', 'error');
                return;
            }
           
            // Using Nominatim for geocoding
            const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;
           
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    if (data.length > 0) {
                        const lat = parseFloat(data[0].lat);
                        const lon = parseFloat(data[0].lon);
                       
                        map.setView([lat, lon], 13);
                       
                        // Clear existing markers
                        map.eachLayer(layer => {
                            if (layer instanceof L.Marker) {
                                map.removeLayer(layer);
                            }
                        });
                       
                        // Add marker
                        L.marker([lat, lon]).addTo(map)
                            .bindPopup(`<b>${data[0].display_name}</b>`)
                            .openPopup();
                           
                        showNotification(`📍 Ditemukan: ${data[0].display_name}`);
                    } else {
                        showNotification('❌ Lokasi tidak ditemukan', 'error');
                    }
                })
                .catch(error => {
                    console.error('Map search error:', error);
                    showNotification('❌ Gagal mencari lokasi', 'error');
                });
        }

        function locateOnMap() {
            if (!navigator.geolocation) {
                showNotification('❌ Geolocation tidak didukung browser Anda', 'error');
                return;
            }
           
            navigator.geolocation.getCurrentPosition((position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
               
                map.setView([lat, lon], 15);
               
                // Clear existing markers
                map.eachLayer(layer => {
                    if (layer instanceof L.Marker) {
                        map.removeLayer(layer);
                    }
                });
               
                // Add marker
                L.marker([lat, lon]).addTo(map)
                    .bindPopup('<b>Lokasi Anda</b>')
                    .openPopup();
                   
                showNotification('📍 Menampilkan lokasi Anda di peta');
            }, (error) => {
                console.error('Geolocation error:', error);
                showNotification('❌ Gagal mendapatkan lokasi Anda', 'error');
            });
        }

        // Music functionality
        function searchMusic() {
            playSound('send');
            const query = document.getElementById('musicSearch').value;
            if (!query) {
                showNotification('❌ Masukkan judul lagu atau artis', 'error');
                return;
            }
           
            // Simulate music search results with YouTube links
            const results = [
                { 
                    title: `${query} - Official Audio`, 
                    artist: 'Various Artists', 
                    duration: '3:45',
                    videoId: 'dQw4w9WgXcQ' // Contoh video ID
                },
                { 
                    title: `${query} - Acoustic Version`, 
                    artist: 'Various Artists', 
                    duration: '4:20',
                    videoId: 'dQw4w9WgXcQ'
                },
                { 
                    title: `${query} - Remix`, 
                    artist: 'Various Artists', 
                    duration: '3:30',
                    videoId: 'dQw4w9WgXcQ'
                }
            ];
           
            displayMusicResults(results);
        }

        function displayMusicResults(results) {
            const container = document.getElementById('musicResults');
            container.innerHTML = results.map((track, index) => `
                <div class="search-result">
                    <h4>🎵 ${track.title}</h4>
                    <p><strong>Artis:</strong> ${track.artist}</p>
                    <p><strong>Durasi:</strong> ${track.duration}</p>
                    <div>
                        <button onclick="playTrack('${track.videoId}')" class="wiki-action-btn">
                            <i class="fas fa-play"></i> Play
                        </button>
                        <a href="https://www.youtube.com/watch?v=${track.videoId}" target="_blank" class="wiki-action-btn">
                            <i class="fas fa-external-link-alt"></i> Open in YouTube
                        </a>
                    </div>
                </div>
            `).join('');
            playSound('success');
        }

        function playTrack(videoId) {
            playSound('send');
            // Kita tidak bisa memutar YouTube di iframe karena CSP, jadi arahkan ke YouTube
            window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
            showNotification(`🎵 Membuka lagu di YouTube...`);
        }

        function playMusic() {
            playSound('send');
            showNotification('🎵 Memutar musik...');
        }

        function pauseMusic() {
            playSound('send');
            showNotification('⏸️ Musik dijeda');
        }

        function nextMusic() {
            playSound('send');
            showNotification('⏭️ Memutar lagu berikutnya...');
        }

        function downloadMusic() {
            playSound('send');
            showNotification('📥 Mengunduh musik...');
        }

        // Games functionality
        function loadGame(game) {
            playSound('send');
            const gameBoard = document.getElementById('gameBoard');
            gameBoard.style.display = 'block';
            gameBoard.innerHTML = '';

            switch(game) {
                case 'snake':
                    initializeSnakeGame();
                    break;
                case 'tic-tac-toe':
                    initializeTicTacToe();
                    break;
                case 'memory':
                    initializeMemoryGame();
                    break;
                case 'puzzle':
                    initializePuzzleGame();
                    break;
            }
        }

        function initializeSnakeGame() {
            const gameBoard = document.getElementById('gameBoard');
            gameBoard.innerHTML = `
                <canvas id="snakeCanvas" width="400" height="400" style="border: 2px solid var(--border-color); background: var(--bg-primary);"></canvas>
                <div style="margin-top: 15px; text-align: center;">
                    <button onclick="startSnakeGame()" class="control-btn">Start Game</button>
                    <button onclick="resetSnakeGame()" class="control-btn">Reset</button>
                </div>
                <p id="snakeScore" style="text-align: center; margin-top: 10px;">Score: 0</p>
            `;
           
            // Snake game implementation
            const canvas = document.getElementById('snakeCanvas');
            const ctx = canvas.getContext('2d');
            const gridSize = 20;
            const tileCount = canvas.width / gridSize;

            let snake = [
                {x: 10, y: 10}
            ];
            let food = {};
            let dx = 0;
            dy = 0;
            let score = 0;

            function randomFood() {
                food = {
                    x: Math.floor(Math.random() * tileCount),
                    y: Math.floor(Math.random() * tileCount)
                };
            }

            function drawGame() {
                // Clear canvas
                ctx.fillStyle = 'var(--bg-primary)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                // Draw snake
                ctx.fillStyle = 'var(--accent-primary)';
                snake.forEach(part => {
                    ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize-2, gridSize-2);
                });

                // Draw food
                ctx.fillStyle = 'var(--error)';
                ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize-2, gridSize-2);
            }

            function updateGame() {
                const head = {x: snake[0].x + dx, y: snake[0].y + dy};

                // Game over conditions
                if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount || snake.some(part => part.x === head.x && part.y === head.y)) {
                    clearInterval(snakeGame);
                    alert(`Game Over! Score: ${score}`);
                    return;
                }

                snake.unshift(head);

                // Check if food eaten
                if (head.x === food.x && head.y === food.y) {
                    score += 10;
                    document.getElementById('snakeScore').textContent = `Score: ${score}`;
                    randomFood();
                } else {
                    snake.pop();
                }

                drawGame();
            }

            function changeDirection(event) {
                const LEFT_KEY = 37;
                const RIGHT_KEY = 39;
                const UP_KEY = 38;
                const DOWN_KEY = 40;

                const keyPressed = event.keyCode;
                const goingUp = dy === -1;
                const goingDown = dy === 1;
                const goingRight = dx === 1;
                const goingLeft = dx === -1;

                if (keyPressed === LEFT_KEY && !goingRight) {
                    dx = -1;
                    dy = 0;
                }
                if (keyPressed === UP_KEY && !goingDown) {
                    dx = 0;
                    dy = -1;
                }
                if (keyPressed === RIGHT_KEY && !goingLeft) {
                    dx = 1;
                    dy = 0;
                }
                if (keyPressed === DOWN_KEY && !goingUp) {
                    dx = 0;
                    dy = 1;
                }
            }

            let snakeGame = null;

            function startGame() {
                randomFood();
                snakeGame = setInterval(updateGame, 100);
            }

            function resetGame() {
                clearInterval(snakeGame);
                snake = [{x: 10, y: 10}];
                dx = 0;
                dy = 0;
                score = 0;
                document.getElementById('snakeScore').textContent = `Score: ${score}`;
                drawGame();
            }

            document.addEventListener('keydown', changeDirection);
            drawGame();

            // Ekspos fungsi ke global
            window.startSnakeGame = startGame;
            window.resetSnakeGame = resetGame;
        }

        function initializeTicTacToe() {
            const gameBoard = document.getElementById('gameBoard');
            gameBoard.innerHTML = `
                <div style="text-align: center; margin-bottom: 20px;">
                    <h4>Tic-Tac-Toe</h4>
                    <p id="ticTacToeStatus">Your turn (X)</p>
                </div>
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 5px; width: 300px; height: 300px; margin: 0 auto;">
                    ${Array(9).fill().map((_, i) => `<div class="tic-tac-toe-cell" onclick="makeMove(${i})" style="background: var(--bg-tertiary); border: 2px solid var(--border-color); display: flex; align-items: center; justify-content: center; font-size: 2em; cursor: pointer;"></div>`).join('')}
                </div>
                <div style="text-align: center; margin-top: 15px;">
                    <button onclick="resetTicTacToe()" class="control-btn">Reset Game</button>
                </div>
            `;
           
            window.ticTacToeBoard = Array(9).fill('');
            window.currentPlayer = 'X';
            window.gameActive = true;
        }

        function makeMove(index) {
            if (!window.gameActive || window.ticTacToeBoard[index] !== '') return;
           
            window.ticTacToeBoard[index] = window.currentPlayer;
            document.querySelectorAll('.tic-tac-toe-cell')[index].textContent = window.currentPlayer;
           
            if (checkWin()) {
                document.getElementById('ticTacToeStatus').textContent = `Player ${window.currentPlayer} wins!`;
                window.gameActive = false;
                return;
            }
           
            if (window.ticTacToeBoard.every(cell => cell !== '')) {
                document.getElementById('ticTacToeStatus').textContent = "It's a draw!";
                window.gameActive = false;
                return;
            }
           
            window.currentPlayer = window.currentPlayer === 'X' ? 'O' : 'X';
            document.getElementById('ticTacToeStatus').textContent = `Player ${window.currentPlayer}'s turn`;
           
            // AI move for O
            if (window.currentPlayer === 'O' && window.gameActive) {
                setTimeout(makeAIMove, 500);
            }
        }

        function makeAIMove() {
            const emptyCells = window.ticTacToeBoard.map((cell, index) => cell === '' ? index : null).filter(cell => cell !== null);
            const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            makeMove(randomIndex);
        }

        function checkWin() {
            const winPatterns = [
                [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
                [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
                [0, 4, 8], [2, 4, 6] // Diagonals
            ];
           
            return winPatterns.some(pattern => {
                const [a, b, c] = pattern;
                return window.ticTacToeBoard[a] !== '' && 
                       window.ticTacToeBoard[a] === window.ticTacToeBoard[b] && 
                       window.ticTacToeBoard[a] === window.ticTacToeBoard[c];
            });
        }

        function resetTicTacToe() {
            window.ticTacToeBoard = Array(9).fill('');
            window.currentPlayer = 'X';
            window.gameActive = true;
            document.getElementById('ticTacToeStatus').textContent = "Your turn (X)";
            document.querySelectorAll('.tic-tac-toe-cell').forEach(cell => {
                cell.textContent = '';
            });
        }

        function initializeMemoryGame() {
            const gameBoard = document.getElementById('gameBoard');
            gameBoard.innerHTML = `
                <div style="text-align: center; margin-bottom: 20px;">
                    <h4>Memory Game</h4>
                    <p id="memoryStatus">Find matching pairs</p>
                </div>
                <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; width: 400px; margin: 0 auto;">
                    ${Array(16).fill().map((_, i) => `<div class="memory-card" onclick="flipCard(${i})" style="background: var(--accent-primary); height: 80px; display: flex; align-items: center; justify-content: center; font-size: 1.5em; cursor: pointer; border-radius: var(--radius);"></div>`).join('')}
                </div>
                <div style="text-align: center; margin-top: 15px;">
                    <button onclick="resetMemoryGame()" class="control-btn">Reset Game</button>
                </div>
            `;
           
            // Initialize memory game
            const cards = ['A', 'A', 'B', 'B', 'C', 'C', 'D', 'D', 'E', 'E', 'F', 'F', 'G', 'G', 'H', 'H'];
            window.memoryCards = shuffleArray(cards);
            window.flippedCards = [];
            window.matchedPairs = 0;
            window.canFlip = true;
           
            document.querySelectorAll('.memory-card').forEach((card, index) => {
                card.dataset.value = window.memoryCards[index];
            });
        }

        function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }

        function flipCard(index) {
            if (!window.canFlip || window.flippedCards.length >= 2) return;
           
            const card = document.querySelectorAll('.memory-card')[index];
            if (card.textContent !== '' || window.flippedCards.includes(index)) return;
           
            card.textContent = window.memoryCards[index];
            card.style.background = 'var(--bg-primary)';
            window.flippedCards.push(index);
           
            if (window.flippedCards.length === 2) {
                window.canFlip = false;
                setTimeout(checkMatch, 1000);
            }
        }

        function checkMatch() {
            const [index1, index2] = window.flippedCards;
            const card1 = document.querySelectorAll('.memory-card')[index1];
            const card2 = document.querySelectorAll('.memory-card')[index2];
           
            if (window.memoryCards[index1] === window.memoryCards[index2]) {
                card1.style.background = 'var(--success)';
                card2.style.background = 'var(--success)';
                window.matchedPairs++;
               
                if (window.matchedPairs === 8) {
                    document.getElementById('memoryStatus').textContent = "You won!";
                }
            } else {
                card1.textContent = '';
                card2.textContent = '';
                card1.style.background = 'var(--accent-primary)';
                card2.style.background = 'var(--accent-primary)';
            }
           
            window.flippedCards = [];
            window.canFlip = true;
        }

        function resetMemoryGame() {
            window.memoryCards = shuffleArray(['A', 'A', 'B', 'B', 'C', 'C', 'D', 'D', 'E', 'E', 'F', 'F', 'G', 'G', 'H', 'H']);
            window.flippedCards = [];
            window.matchedPairs = 0;
            window.canFlip = true;
            document.getElementById('memoryStatus').textContent = "Find matching pairs";
           
            document.querySelectorAll('.memory-card').forEach((card, index) => {
                card.textContent = '';
                card.style.background = 'var(--accent-primary)';
                card.dataset.value = window.memoryCards[index];
            });
        }

        function initializePuzzleGame() {
            const gameBoard = document.getElementById('gameBoard');
            gameBoard.innerHTML = `
                <div style="text-align: center; margin-bottom: 20px;">
                    <h4>Puzzle Game</h4>
                    <p>Drag and drop pieces to solve the puzzle</p>
                </div>
                <div id="puzzleContainer" style="width: 400px; height: 400px; margin: 0 auto; border: 2px solid var(--border-color); position: relative;"></div>
                <div style="text-align: center; margin-top: 15px;">
                    <button onclick="resetPuzzleGame()" class="control-btn">Reset Puzzle</button>
                </div>
            `;
           
            // Simple puzzle implementation
            const puzzleContainer = document.getElementById('puzzleContainer');
            puzzleContainer.innerHTML = `
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px; width: 100%; height: 100%;">
                    ${Array(9).fill().map((_, i) => `<div class="puzzle-piece" style="background: var(--accent-primary); display: flex; align-items: center; justify-content: center; font-size: 2em; cursor: move;" draggable="true">${i + 1}</div>`).join('')}
                </div>
            `;
           
            // Add drag and drop functionality
            document.querySelectorAll('.puzzle-piece').forEach(piece => {
                piece.addEventListener('dragstart', handleDragStart);
                piece.addEventListener('dragover', handleDragOver);
                piece.addEventListener('drop', handleDrop);
                piece.addEventListener('dragend', handleDragEnd);
            });
        }

        function handleDragStart(e) {
            e.dataTransfer.setData('text/plain', e.target.textContent);
            setTimeout(() => {
                e.target.style.opacity = '0.4';
            }, 0);
        }

        function handleDragOver(e) {
            e.preventDefault();
        }

        function handleDrop(e) {
            e.preventDefault();
            const data = e.dataTransfer.getData('text/plain');
            const draggedElement = document.querySelector(`.puzzle-piece:contains("${data}")`);
            const target = e.target.closest('.puzzle-piece');
           
            if (draggedElement && target && draggedElement !== target) {
                const temp = draggedElement.textContent;
                draggedElement.textContent = target.textContent;
                target.textContent = temp;
            }
        }

        function handleDragEnd(e) {
            e.target.style.opacity = '1';
        }

        function resetPuzzleGame() {
            const pieces = Array.from(document.querySelectorAll('.puzzle-piece'));
            pieces.sort(() => Math.random() - 0.5);
            const container = document.getElementById('puzzleContainer').querySelector('div');
            container.innerHTML = '';
            pieces.forEach(piece => container.appendChild(piece));
        }

        // Stocks functionality
        async function getStockData() {
            playSound('send');
            const symbol = document.getElementById('stockSymbol').value.toUpperCase();
            if (!symbol) {
                showNotification('❌ Masukkan simbol saham', 'error');
                return;
            }
           
            try {
                // Using Alpha Vantage API (you need to replace with your own API key)
                const apiKey = 'YOUR_ALPHA_VANTAGE_API_KEY'; // Ganti dengan API key Anda
                const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`;
               
                const response = await fetch(url);
                const data = await response.json();
               
                displayStockData(data, symbol);
               
            } catch (error) {
                console.error('Stock data error:', error);
                document.getElementById('stockResults').innerHTML = `
                    <div class="notification error">
                        ❌ Gagal mengambil data saham. Pastikan simbol benar atau coba lagi nanti.
                    </div>
                `;
                playSound('error');
            }
        }

        function displayStockData(data, symbol) {
            const container = document.getElementById('stockResults');
           
            if (data['Global Quote']) {
                const quote = data['Global Quote'];
                const price = parseFloat(quote['05. price']).toFixed(2);
                const change = parseFloat(quote['09. change']).toFixed(2);
                const changePercent = quote['10. change percent'];
                const isPositive = change >= 0;
               
                container.innerHTML = `
                    <div class="weather-display">
                        <h3>📈 ${symbol} Stock Quote</h3>
                        <div class="weather-temp" style="color: ${isPositive ? 'var(--success)' : 'var(--error)'};">$${price}</div>
                        <p style="color: ${isPositive ? 'var(--success)' : 'var(--error)'};">
                            ${isPositive ? '↗' : '↘'} ${change} (${changePercent})
                        </p>
                        <div style="display: flex; justify-content: center; gap: 20px; margin-top: 15px;">
                            <div>📊 High: $${parseFloat(quote['03. high']).toFixed(2)}</div>
                            <div>📉 Low: $${parseFloat(quote['04. low']).toFixed(2)}</div>
                        </div>
                    </div>
                `;
            } else {
                container.innerHTML = `
                    <div class="notification error">
                        ❌ Data saham untuk ${symbol} tidak ditemukan.
                    </div>
                `;
            }
           
            playSound('success');
        }

        // Boredom buster activities
        function startDrawing() {
            playSound('send');
            document.getElementById('boredomActivity').innerHTML = `
                <div class="drawing-container">
                    <h4>🎨 Drawing Board</h4>
                    <canvas id="drawingCanvas" class="drawing-canvas"></canvas>
                    <div class="drawing-controls">
                        <input type="color" id="drawingColor" value="#000000">
                        <input type="range" id="drawingSize" min="1" max="20" value="5">
                        <button onclick="clearDrawing()" class="control-btn">
                            <i class="fas fa-trash"></i> Clear
                        </button>
                        <button onclick="saveDrawing()" class="control-btn" style="background: var(--accent-gradient);">
                            <i class="fas fa-save"></i> Save
                        </button>
                    </div>
                </div>
            `;
           
            initializeDrawing();
        }

        function initializeDrawing() {
            const canvas = document.getElementById('drawingCanvas');
            const ctx = canvas.getContext('2d');
           
            // Set canvas size
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
           
            // Set initial drawing style
            ctx.strokeStyle = document.getElementById('drawingColor').value;
            ctx.lineWidth = document.getElementById('drawingSize').value;
            ctx.lineCap = 'round';
           
            // Drawing functionality
            canvas.addEventListener('mousedown', startDrawingEvent);
            canvas.addEventListener('mousemove', draw);
            canvas.addEventListener('mouseup', stopDrawing);
            canvas.addEventListener('mouseout', stopDrawing);
           
            // Touch events for mobile
            canvas.addEventListener('touchstart', startDrawingEvent);
            canvas.addEventListener('touchmove', draw);
            canvas.addEventListener('touchend', stopDrawing);
           
            function startDrawingEvent(e) {
                isDrawing = true;
                const rect = canvas.getBoundingClientRect();
                lastX = (e.clientX || e.touches[0].clientX) - rect.left;
                lastY = (e.clientY || e.touches[0].clientY) - rect.top;
            }
           
            function draw(e) {
                if (!isDrawing) return;
                e.preventDefault();
               
                const rect = canvas.getBoundingClientRect();
                const currentX = (e.clientX || e.touches[0].clientX) - rect.left;
                const currentY = (e.clientY || e.touches[0].clientY) - rect.top;
               
                ctx.beginPath();
                ctx.moveTo(lastX, lastY);
                ctx.lineTo(currentX, currentY);
                ctx.stroke();
               
                lastX = currentX;
                lastY = currentY;
            }
           
            function stopDrawing() {
                isDrawing = false;
            }
           
            // Update color and size when controls change
            document.getElementById('drawingColor').addEventListener('input', (e) => {
                ctx.strokeStyle = e.target.value;
            });
           
            document.getElementById('drawingSize').addEventListener('input', (e) => {
                ctx.lineWidth = e.target.value;
            });
        }

        function clearDrawing() {
            const canvas = document.getElementById('drawingCanvas');
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            playSound('send');
        }

        function saveDrawing() {
            const canvas = document.getElementById('drawingCanvas');
            const dataURL = canvas.toDataURL('image/png');
           
            // Save to gallery
            const galleryItem = {
                id: Date.now(),
                type: 'drawing',
                data: dataURL,
                timestamp: new Date().toISOString(),
                date: new Date().toLocaleDateString('id-ID', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                })
            };
           
            galleryItems.unshift(galleryItem);
            localStorage.setItem('kanda_gallery', JSON.stringify(galleryItems));
            updateGallery();
           
            showNotification('🎨 Gambar disimpan ke galeri');
            playSound('success');
        }

        function startColoring() {
            playSound('send');
            document.getElementById('boredomActivity').innerHTML = `
                <div class="drawing-container">
                    <h4>🖍️ Coloring Book</h4>
                    <p>Pilih gambar untuk diwarnai:</p>
                    <div class="entertainment-grid">
                        <div class="entertainment-card" onclick="loadColoringPage('animal')">
                            <div class="entertainment-icon">🐶</div>
                            <h3>Hewan</h3>
                        </div>
                        <div class="entertainment-card" onclick="loadColoringPage('nature')">
                            <div class="entertainment-icon">🌳</div>
                            <h3>Alam</h3>
                        </div>
                        <div class="entertainment-card" onclick="loadColoringPage('fantasy')">
                            <div class="entertainment-icon">🧙</div>
                            <h3>Fantasi</h3>
                        </div>
                    </div>
                </div>
            `;
        }

        function loadColoringPage(type) {
            // Implement coloring pages
            showNotification(`🖍️ Memuat halaman mewarnai ${type}...`);
        }

        function startMeditation() {
            playSound('send');
            document.getElementById('boredomActivity').innerHTML = `
                <div class="feature-content">
                    <h4>🧘 Meditation & Relaxation</h4>
                    <p>Pilih sesi meditasi:</p>
                    <div class="entertainment-grid">
                        <div class="entertainment-card" onclick="startMeditationSession('breathing')">
                            <div class="entertainment-icon">🌬️</div>
                            <h3>Pernapasan</h3>
                            <p>5 menit</p>
                        </div>
                        <div class="entertainment-card" onclick="startMeditationSession('mindfulness')">
                            <div class="entertainment-icon">🧠</div>
                            <h3>Mindfulness</h3>
                            <p>10 menit</p>
                        </div>
                        <div class="entertainment-card" onclick="startMeditationSession('sleep')">
                            <div class="entertainment-icon">😴</div>
                            <h3>Tidur Nyenyak</h3>
                            <p>15 menit</p>
                        </div>
                    </div>
                </div>
            `;
        }

        function startMeditationSession(type) {
            const sessions = {
                'breathing': {
                    title: 'Latihan Pernapasan',
                    duration: '5 menit',
                    instructions: 'Tarik napas dalam selama 4 detik, tahan selama 7 detik, hembuskan selama 8 detik. Ulangi.'
                },
                'mindfulness': {
                    title: 'Meditasi Mindfulness',
                    duration: '10 menit',
                    instructions: 'Fokus pada pernapasan Anda. Perhatikan setiap tarikan dan hembusan napas tanpa menghakimi.'
                },
                'sleep': {
                    title: 'Meditasi untuk Tidur Nyenyak',
                    duration: '15 menit',
                    instructions: 'Rilekskan setiap bagian tubuh Anda secara bertahap dari ujung kaki hingga kepala.'
                }
            };
           
            const session = sessions[type];
            document.getElementById('boredomActivity').innerHTML = `
                <div class="feature-content">
                    <h4>🧘 ${session.title}</h4>
                    <p><strong>Durasi:</strong> ${session.duration}</p>
                    <p>${session.instructions}</p>
                    <div style="text-align: center; margin: 20px 0;">
                        <button class="control-btn" style="background: var(--accent-gradient); padding: 15px 30px; font-size: 1.2em;">
                            <i class="fas fa-play"></i> Mulai Meditasi
                        </button>
                    </div>
                    <div id="meditationTimer" style="text-align: center; font-size: 2em; margin: 20px 0;"></div>
                </div>
            `;
           
            // Start meditation timer (simulated)
            showNotification(`🧘 Memulai ${session.title}`);
        }

        function startPuzzles() {
            playSound('send');
            document.getElementById('boredomActivity').innerHTML = `
                <div class="feature-content">
                    <h4>🧩 Puzzle Games</h4>
                    <p>Pilih jenis puzzle:</p>
                    <div class="entertainment-grid">
                        <div class="entertainment-card" onclick="loadPuzzle('sudoku')">
                            <div class="entertainment-icon">🔢</div>
                            <h3>Sudoku</h3>
                        </div>
                        <div class="entertainment-card" onclick="loadPuzzle('crossword')">
                            <div class="entertainment-icon">📝</div>
                            <h3>Teka-Teki Silang</h3>
                        </div>
                        <div class="entertainment-card" onclick="loadPuzzle('jigsaw')">
                            <div class="entertainment-icon">🧩</div>
                            <h3>Puzzle Gambar</h3>
                        </div>
                    </div>
                </div>
            `;
        }

        function loadPuzzle(type) {
            showNotification(`🧩 Memuat puzzle ${type}...`);
        }

        // Location services
        function getUserLocation() {
            playSound('send');
            if (!navigator.geolocation) {
                showNotification('❌ Geolocation tidak didukung browser Anda', 'error');
                return;
            }
           
            document.getElementById('locationInfo').innerHTML = `
                <div class="loading">
                    <div class="loading-dot"></div>
                    <div class="loading-dot"></div>
                    <div class="loading-dot"></div>
                </div>
                <p>Mendapatkan lokasi Anda...</p>
            `;
           
            navigator.geolocation.getCurrentPosition((position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
               
                // Reverse geocoding to get address
                const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
               
                fetch(url)
                    .then(response => response.json())
                    .then(data => {
                        const address = data.display_name;
                       
                        document.getElementById('locationInfo').innerHTML = `
                            <div class="weather-display">
                                <h3>📍 Lokasi Anda</h3>
                                <p><strong>Alamat:</strong> ${address}</p>
                                <p><strong>Koordinat:</strong> ${lat.toFixed(6)}, ${lon.toFixed(6)}</p>
                                <p><strong>Akurasi:</strong> ${position.coords.accuracy} meter</p>
                                <div style="margin-top: 15px;">
                                    <a href="https://www.google.com/maps?q=${lat},${lon}" target="_blank" class="control-btn" style="background: var(--accent-gradient); text-decoration: none; display: inline-block;">
                                        <i class="fas fa-map-marker-alt"></i> Buka di Google Maps
                                    </a>
                                </div>
                            </div>
                        `;
                       
                        showNotification('📍 Berhasil mendapatkan lokasi Anda');
                        playSound('success');
                    })
                    .catch(error => {
                        console.error('Reverse geocoding error:', error);
                        document.getElementById('locationInfo').innerHTML = `
                            <div class="notification error">
                                ❌ Gagal mendapatkan alamat untuk lokasi Anda.
                            </div>
                        `;
                        playSound('error');
                    });
            }, (error) => {
                console.error('Geolocation error:', error);
                document.getElementById('locationInfo').innerHTML = `
                    <div class="notification error">
                        ❌ Gagal mendapatkan lokasi Anda: ${error.message}
                    </div>
                `;
                playSound('error');
            });
        }

        // Gallery functionality
        function loadGallery() {
            galleryItems = JSON.parse(localStorage.getItem('kanda_gallery') || '[]');
            updateGallery();
        }

        function updateGallery() {
            const container = document.getElementById('galleryGrid');
            if (!container) return;
           
            if (galleryItems.length === 0) {
                container.innerHTML = '<p>Belum ada item di galeri. Ambil foto atau unggah media untuk memulai.</p>';
                return;
            }
           
            container.innerHTML = galleryItems.map(item => `
                <div class="gallery-item">
                    ${item.type === 'photo' || item.type === 'drawing' ? 
                        `<img src="${item.data}" alt="Gallery item" class="gallery-image">` :
                        `<video src="${item.data}" class="gallery-image" controls></video>`
                    }
                    <div class="gallery-actions">
                        <button class="action-btn" onclick="downloadGalleryItem(${item.id})">
                            <i class="fas fa-download"></i>
                        </button>
                        <button class="action-btn" onclick="shareGalleryItem(${item.id})">
                            <i class="fas fa-share"></i>
                        </button>
                        <button class="action-btn" onclick="deleteGalleryItem(${item.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `).join('');
        }

        function openCamera() {
            playSound('send');
            switchFeatureTab('camera');
        }

        function openVideo() {
            playSound('send');
            switchFeatureTab('camera');
            // In a real implementation, this would switch to video mode
        }

        function handleFileUpload(files) {
            if (files.length === 0) return;
           
            const file = files[0];
            const reader = new FileReader();
           
            reader.onload = function(e) {
                const galleryItem = {
                    id: Date.now(),
                    type: file.type.startsWith('image/') ? 'photo' : 'video',
                    data: e.target.result,
                    timestamp: new Date().toISOString(),
                    date: new Date().toLocaleDateString('id-ID', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })
                };
               
                galleryItems.unshift(galleryItem);
                localStorage.setItem('kanda_gallery', JSON.stringify(galleryItems));
                updateGallery();
               
                showNotification('✅ Media berhasil diunggah ke galeri');
                playSound('success');
            };
           
            reader.readAsDataURL(file);
        }

        function downloadGalleryItem(id) {
            const item = galleryItems.find(i => i.id === id);
            if (!item) return;
           
            const link = document.createElement('a');
            link.href = item.data;
            link.download = `kanda-gallery-${id}.${item.type === 'photo' ? 'png' : 'mp4'}`;
            link.click();
           
            showNotification('📥 Mengunduh item galeri...');
            playSound('send');
        }

        function shareGalleryItem(id) {
            const item = galleryItems.find(i => i.id === id);
            if (!item) return;
           
            if (navigator.share) {
                navigator.share({
                    title: 'KANDA AI Gallery',
                    text: 'Check out this media from my KANDA AI gallery!',
                    url: item.data
                }).then(() => {
                    showNotification('✅ Berhasil membagikan item galeri');
                }).catch(() => {
                    copyToClipboard(item.data);
                });
            } else {
                copyToClipboard(item.data);
            }
        }

        function deleteGalleryItem(id) {
            if (confirm('Hapus item ini dari galeri?')) {
                galleryItems = galleryItems.filter(item => item.id !== id);
                localStorage.setItem('kanda_gallery', JSON.stringify(galleryItems));
                updateGallery();
               
                showNotification('🗑️ Item dihapus dari galeri');
                playSound('send');
            }
        }

        // Camera functionality
        function initializeCamera() {
            const video = document.getElementById('cameraPreview');
            const canvas = document.getElementById('photoCanvas');
           
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                navigator.mediaDevices.getUserMedia({ video: true })
                    .then(function(stream) {
                        cameraStream = stream;
                        video.srcObject = stream;
                       
                        // Set canvas size to match video
                        video.addEventListener('loadedmetadata', function() {
                            canvas.width = video.videoWidth;
                            canvas.height = video.videoHeight;
                        });
                       
                        // Set up capture button
                        document.getElementById('captureBtn').onclick = function() {
                            capturePhoto();
                        };
                       
                        // Set up record button
                        document.getElementById('recordBtn').onclick = function() {
                            if (isRecordingVideo) {
                                stopRecording();
                            } else {
                                startRecording();
                            }
                        };
                       
                        // Set up switch camera button
                        document.getElementById('switchCameraBtn').onclick = function() {
                            switchCamera();
                        };
                       
                    })
                    .catch(function(error) {
                        console.error('Camera error:', error);
                        document.getElementById('cameraResult').innerHTML = `
                            <div class="notification error">
                                ❌ Gagal mengakses kamera: ${error.message}
                            </div>
                        `;
                    });
            } else {
                document.getElementById('cameraResult').innerHTML = `
                    <div class="notification error">
                        ❌ Browser tidak mendukung akses kamera.
                    </div>
                `;
            }
        }

        function capturePhoto() {
            const video = document.getElementById('cameraPreview');
            const canvas = document.getElementById('photoCanvas');
            const ctx = canvas.getContext('2d');
           
            // Draw current video frame to canvas
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
           
            // Convert to data URL
            const dataURL = canvas.toDataURL('image/png');
           
            // Save to gallery
            const galleryItem = {
                id: Date.now(),
                type: 'photo',
                data: dataURL,
                timestamp: new Date().toISOString(),
                date: new Date().toLocaleDateString('id-ID', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                })
            };
           
            galleryItems.unshift(galleryItem);
            localStorage.setItem('kanda_gallery', JSON.stringify(galleryItems));
            updateGallery();
           
            // Show preview
            document.getElementById('cameraResult').innerHTML = `
                <div class="wiki-result">
                    <h4>📷 Foto Berhasil Diambil</h4>
                    <img src="${dataURL}" alt="Captured photo" style="max-width: 100%; border-radius: var(--radius);">
                    <div class="wiki-actions">
                        <button class="wiki-action-btn" onclick="downloadGalleryItem(${galleryItem.id})">
                            <i class="fas fa-download"></i> Download
                        </button>
                        <button class="wiki-action-btn" onclick="shareGalleryItem(${galleryItem.id})">
                            <i class="fas fa-share"></i> Share
                        </button>
                    </div>
                </div>
            `;
           
            showNotification('📷 Foto berhasil diambil dan disimpan');
            playSound('success');
        }

        function startRecording() {
            const video = document.getElementById('cameraPreview');
            recordedChunks = [];
           
            try {
                mediaRecorderVideo = new MediaRecorder(cameraStream);
               
                mediaRecorderVideo.ondataavailable = function(event) {
                    if (event.data.size > 0) {
                        recordedChunks.push(event.data);
                    }
                };
               
                mediaRecorderVideo.onstop = function() {
                    const blob = new Blob(recordedChunks, { type: 'video/webm' });
                    const videoURL = URL.createObjectURL(blob);
                   
                    // Save to gallery
                    const galleryItem = {
                        id: Date.now(),
                        type: 'video',
                        data: videoURL,
                        timestamp: new Date().toISOString(),
                        date: new Date().toLocaleDateString('id-ID', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })
                    };
                   
                    galleryItems.unshift(galleryItem);
                    localStorage.setItem('kanda_gallery', JSON.stringify(galleryItems));
                    updateGallery();
                   
                    // Show preview
                    document.getElementById('cameraResult').innerHTML = `
                        <div class="wiki-result">
                            <h4>🎥 Video Berhasil Direkam</h4>
                            <video src="${videoURL}" controls style="max-width: 100%; border-radius: var(--radius);"></video>
                            <div class="wiki-actions">
                                <button class="wiki-action-btn" onclick="downloadGalleryItem(${galleryItem.id})">
                                    <i class="fas fa-download"></i> Download
                                </button>
                                <button class="wiki-action-btn" onclick="shareGalleryItem(${galleryItem.id})">
                                    <i class="fas fa-share"></i> Share
                                </button>
                            </div>
                        </div>
                    `;
                   
                    showNotification('🎥 Video berhasil direkam dan disimpan');
                    playSound('success');
                };
               
                mediaRecorderVideo.start();
                isRecordingVideo = true;
                document.getElementById('recordBtn').innerHTML = '<i class="fas fa-square"></i> Stop';
                document.getElementById('recordBtn').style.background = 'var(--error)';
               
                showNotification('🎥 Merekam video...');
               
            } catch (error) {
                console.error('Recording error:', error);
                showNotification('❌ Gagal memulai perekaman video', 'error');
            }
        }

        function stopRecording() {
            if (mediaRecorderVideo && isRecordingVideo) {
                mediaRecorderVideo.stop();
                isRecordingVideo = false;
                document.getElementById('recordBtn').innerHTML = '<i class="fas fa-video"></i> Record';
                document.getElementById('recordBtn').style.background = '';
            }
        }

        function switchCamera() {
            // This is a simplified implementation
            // In a real app, you would switch between front and back cameras
            showNotification('📷 Mengganti kamera...');
        }

        // IQ Test functionality
        function startIQTest() {
            playSound('send');
            document.getElementById('iqInstructions').style.display = 'none';
            document.getElementById('iqTest').style.display = 'block';
           
            // Initialize IQ test data with 20 questions
            iqTestData = [
                {
                    question: "Apa angka berikutnya dalam pola: 2, 4, 8, 16, ...?",
                    options: ["24", "32", "64", "128"],
                    answer: 1 // 32
                },
                {
                    question: "Jika semua manusia adalah makhluk hidup, dan Socrates adalah manusia, maka:",
                    options: ["Socrates adalah makhluk hidup", "Socrates bukan makhluk hidup", "Tidak dapat disimpulkan", "Semua makhluk hidup adalah Socrates"],
                    answer: 0 // Socrates adalah makhluk hidup
                },
                {
                    question: "Apa kata yang tidak termasuk dalam kelompok: Apel, Jeruk, Pisang, Wortel?",
                    options: ["Apel", "Jeruk", "Pisang", "Wortel"],
                    answer: 3 // Wortel (karena sayuran, bukan buah)
                },
                {
                    question: "Jika 3 orang dapat menyelesaikan pekerjaan dalam 6 hari, berapa hari yang dibutuhkan 6 orang untuk menyelesaikan pekerjaan yang sama?",
                    options: ["2 hari", "3 hari", "4 hari", "5 hari"],
                    answer: 1 // 3 hari
                },
                {
                    question: "Apa yang harus diisi di tempat tanda tanya: 1, 1, 2, 3, 5, 8, ...?",
                    options: ["11", "12", "13", "14"],
                    answer: 2 // 13 (deret Fibonacci)
                },
                {
                    question: "Sebuah mobil menempuh 60 km dengan kecepatan 40 km/jam. Berapa waktu yang dibutuhkan?",
                    options: ["1 jam", "1.5 jam", "2 jam", "2.5 jam"],
                    answer: 1 // 1.5 jam
                },
                {
                    question: "Jika A = 1, B = 2, C = 3, ..., Z = 26, berapa nilai dari K + A + N + D + A?",
                    options: ["30", "35", "40", "45"],
                    answer: 2 // 11 + 1 + 14 + 4 + 1 = 31 (tidak ada di pilihan, jadi kita pilih yang terdekat)
                },
                {
                    question: "Mana yang berbeda dari yang lain?",
                    options: ["Matahari", "Bulan", "Bintang", "Planet"],
                    answer: 1 // Bulan (satelit alami)
                },
                {
                    question: "Jika 5x + 3 = 28, berapa nilai x?",
                    options: ["4", "5", "6", "7"],
                    answer: 1 // 5
                },
                {
                    question: "Apa ibu kota Australia?",
                    options: ["Sydney", "Melbourne", "Canberra", "Perth"],
                    answer: 2 // Canberra
                },
                // Tambahkan 10 pertanyaan lagi...
                {
                    question: "Berapakah 25% dari 200?",
                    options: ["25", "50", "75", "100"],
                    answer: 1 // 50
                },
                {
                    question: "Mana yang merupakan bilangan prima?",
                    options: ["9", "15", "17", "21"],
                    answer: 2 // 17
                },
                {
                    question: "Apa nama ilmiah manusia?",
                    options: ["Homo sapiens", "Canis familiaris", "Felis catus", "Pan troglodytes"],
                    answer: 0 // Homo sapiens
                },
                {
                    question: "Planet manakah yang terdekat dengan matahari?",
                    options: ["Venus", "Bumi", "Mars", "Merkurius"],
                    answer: 3 // Merkurius
                },
                {
                    question: "Berapakah hasil dari 7 x 8?",
                    options: ["48", "56", "64", "72"],
                    answer: 1 // 56
                },
                {
                    question: "Apa nama benua terbesar?",
                    options: ["Afrika", "Amerika", "Asia", "Eropa"],
                    answer: 2 // Asia
                },
                {
                    question: "Jika sebuah segitiga memiliki sudut 90°, 45°, dan 45°, segitiga apa itu?",
                    options: ["Sama sisi", "Sama kaki", "Sembarang", "Siku-siku"],
                    answer: 3 // Siku-siku
                },
                {
                    question: "Siapa penemu gravitasi?",
                    options: ["Albert Einstein", "Isaac Newton", "Galileo Galilei", "Nikola Tesla"],
                    answer: 1 // Isaac Newton
                },
                {
                    question: "Apa nama sungai terpanjang di dunia?",
                    options: ["Amazon", "Nil", "Yangtze", "Mississippi"],
                    answer: 1 // Nil
                },
                {
                    question: "Berapakah akar kuadrat dari 144?",
                    options: ["10", "12", "14", "16"],
                    answer: 1 // 12
                }
            ];
           
            iqCurrentQuestion = 0;
            iqScore = 0;
            iqTimeLeft = 900; // 15 minutes
           
            // Start timer
            iqTimer = setInterval(updateIQTimer, 1000);
            updateIQTimer();
           
            loadIQQuestion();
        }

        function updateIQTimer() {
            const minutes = Math.floor(iqTimeLeft / 60);
            const seconds = iqTimeLeft % 60;
            document.getElementById('iqTimer').textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
           
            if (iqTimeLeft <= 0) {
                endIQTest();
            } else {
                iqTimeLeft--;
            }
        }

        function loadIQQuestion() {
            if (!iqTestData || iqCurrentQuestion >= iqTestData.length) {
                endIQTest();
                return;
            }
           
            const question = iqTestData[iqCurrentQuestion];
            document.getElementById('iqQuestionContainer').innerHTML = `
                <div class="iq-question">
                    <h4>Pertanyaan ${iqCurrentQuestion + 1} dari ${iqTestData.length}</h4>
                    <p>${question.question}</p>
                </div>
                <div class="iq-options">
                    ${question.options.map((option, index) => `
                        <div class="iq-option" onclick="selectIQOption(${index})">
                            ${String.fromCharCode(65 + index)}. ${option}
                        </div>
                    `).join('')}
                </div>
            `;
        }

        function selectIQOption(optionIndex) {
            // Remove selected class from all options
            document.querySelectorAll('.iq-option').forEach(option => {
                option.classList.remove('selected');
            });
           
            // Add selected class to clicked option
            event.target.classList.add('selected');
           
            // Store the selected answer
            iqTestData[iqCurrentQuestion].selected = optionIndex;
        }

        function submitIQAnswer() {
            if (iqTestData[iqCurrentQuestion].selected === undefined) {
                showNotification('❌ Pilih jawaban terlebih dahulu', 'error');
                return;
            }
           
            // Check if answer is correct
            if (iqTestData[iqCurrentQuestion].selected === iqTestData[iqCurrentQuestion].answer) {
                iqScore++;
            }
           
            iqCurrentQuestion++;
           
            if (iqCurrentQuestion < iqTestData.length) {
                loadIQQuestion();
            } else {
                endIQTest();
            }
        }

        function endIQTest() {
            clearInterval(iqTimer);
           
            document.getElementById('iqTest').style.display = 'none';
            document.getElementById('iqResults').style.display = 'block';
           
            // Calculate IQ score (simplified)
            const percentage = (iqScore / iqTestData.length) * 100;
            let iqScoreValue;
           
            if (percentage >= 90) iqScoreValue = 130 + Math.floor((percentage - 90) / 2);
            else if (percentage >= 70) iqScoreValue = 110 + Math.floor((percentage - 70) / 1);
            else if (percentage >= 50) iqScoreValue = 90 + Math.floor((percentage - 50) / 1);
            else iqScoreValue = 70 + Math.floor(percentage / 1);
           
            document.getElementById('iqResults').innerHTML = `
                <div class="weather-display">
                    <h3>🧠 Hasil Tes IQ</h3>
                    <div class="weather-temp">${iqScoreValue}</div>
                    <p>Skor IQ Anda</p>
                    <div style="margin-top: 15px;">
                        <p><strong>Jawaban Benar:</strong> ${iqScore} dari ${iqTestData.length}</p>
                        <p><strong>Persentase:</strong> ${percentage.toFixed(1)}%</p>
                    </div>
                    <div style="margin-top: 20px;">
                        <button onclick="startIQTest()" class="control-btn" style="background: var(--accent-gradient);">
                            <i class="fas fa-redo"></i> Ulang Tes
                        </button>
                    </div>
                </div>
            `;
           
            showNotification(`🧠 Tes IQ selesai! Skor Anda: ${iqScoreValue}`);
            playSound('success');
        }

        // Calendar functionality
        function initializeCalendar() {
            updateCalendar();
        }

        function updateCalendar() {
            const monthYear = document.getElementById('calendarMonthYear');
            const calendarGrid = document.getElementById('calendarGrid');
           
            const year = calendarDate.getFullYear();
            const month = calendarDate.getMonth();
           
            // Set month and year
            monthYear.textContent = calendarDate.toLocaleDateString('id-ID', { 
                year: 'numeric', 
                month: 'long' 
            });
           
            // Get first day of month and number of days
            const firstDay = new Date(year, month, 1);
            const lastDay = new Date(year, month + 1, 0);
            const daysInMonth = lastDay.getDate();
            const startingDay = firstDay.getDay();
           
            // Clear calendar grid
            calendarGrid.innerHTML = '';
           
            // Add day headers
            const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
            days.forEach(day => {
                const dayElement = document.createElement('div');
                dayElement.className = 'calendar-day';
                dayElement.style.fontWeight = 'bold';
                dayElement.textContent = day;
                calendarGrid.appendChild(dayElement);
            });
           
            // Add empty cells for days before the first day of the month
            for (let i = 0; i < startingDay; i++) {
                const emptyElement = document.createElement('div');
                emptyElement.className = 'calendar-day';
                calendarGrid.appendChild(emptyElement);
            }
           
            // Add days of the month
            const today = new Date();
            for (let day = 1; day <= daysInMonth; day++) {
                const dayElement = document.createElement('div');
                dayElement.className = 'calendar-day';
                dayElement.textContent = day;
               
                // Highlight today
                if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                    dayElement.classList.add('active');
                }
               
                // Add click event
                dayElement.onclick = function() {
                    selectCalendarDay(day);
                };
               
                calendarGrid.appendChild(dayElement);
            }
        }

        function changeMonth(direction) {
            calendarDate.setMonth(calendarDate.getMonth() + direction);
            updateCalendar();
        }

        function selectCalendarDay(day) {
            const selectedDate = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), day);
            showNotification(`📅 Tanggal dipilih: ${selectedDate.toLocaleDateString('id-ID')}`);
        }

        function addEvent() {
            const title = prompt('Masukkan judul event:');
            if (title) {
                showNotification(`✅ Event "${title}" ditambahkan`);
            }
        }

        function viewEvents() {
            // Implement event viewing
            showNotification('📅 Menampilkan semua event...');
        }

        // Watch functionality
        function switchWatchTab(tab) {
            // Hide all tabs
            document.querySelectorAll('#stopwatchTab, #timerTab, #alarmTab, #worldclockTab').forEach(tab => {
                tab.style.display = 'none';
            });
           
            // Remove active class from all tabs
            document.querySelectorAll('.feature-tab').forEach(tab => {
                tab.classList.remove('active');
            });
           
            // Show selected tab and set active class
            document.getElementById(tab + 'Tab').style.display = 'block';
            event.target.classList.add('active');
           
            // Initialize tab if needed
            if (tab === 'alarm') {
                updateAlarmList();
            } else if (tab === 'worldclock') {
                updateWorldClocks();
            }
        }

        // Stopwatch functionality
        function startStopwatch() {
            if (stopwatchInterval) return;
           
            const startTime = Date.now() - stopwatchTime;
            stopwatchInterval = setInterval(() => {
                stopwatchTime = Date.now() - startTime;
                updateStopwatchDisplay();
            }, 10);
        }

        function pauseStopwatch() {
            clearInterval(stopwatchInterval);
            stopwatchInterval = null;
        }

        function resetStopwatch() {
            clearInterval(stopwatchInterval);
            stopwatchInterval = null;
            stopwatchTime = 0;
            updateStopwatchDisplay();
        }

        function updateStopwatchDisplay() {
            const hours = Math.floor(stopwatchTime / 3600000);
            const minutes = Math.floor((stopwatchTime % 3600000) / 60000);
            const seconds = Math.floor((stopwatchTime % 60000) / 1000);
            const milliseconds = Math.floor((stopwatchTime % 1000) / 10);
           
            document.getElementById('stopwatchDisplay').textContent = 
                `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
        }

        // Timer functionality
        function setTimer() {
            const hours = parseInt(document.getElementById('timerHours').value) || 0;
            const minutes = parseInt(document.getElementById('timerMinutes').value) || 0;
            const seconds = parseInt(document.getElementById('timerSeconds').value) || 0;
           
            timerTime = (hours * 3600) + (minutes * 60) + seconds;
           
            if (timerTime <= 0) {
                showNotification('❌ Masukkan waktu yang valid', 'error');
                return;
            }
           
            startTimer();
        }

        function startTimer() {
            if (timerInterval) return;
           
            timerRunning = true;
            timerInterval = setInterval(() => {
                if (timerTime <= 0) {
                    timerFinished();
                    return;
                }
               
                timerTime--;
                updateTimerDisplay();
            }, 1000);
        }

        function pauseTimer() {
            clearInterval(timerInterval);
            timerInterval = null;
            timerRunning = false;
        }

        function resetTimer() {
            clearInterval(timerInterval);
            timerInterval = null;
            timerRunning = false;
            timerTime = 0;
            updateTimerDisplay();
        }

        function updateTimerDisplay() {
            const hours = Math.floor(timerTime / 3600);
            const minutes = Math.floor((timerTime % 3600) / 60);
            const seconds = timerTime % 60;
           
            document.getElementById('timerDisplay').textContent = 
                `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }

        function timerFinished() {
            clearInterval(timerInterval);
            timerInterval = null;
            timerRunning = false;
           
            showNotification('⏰ Timer selesai!', 'success');
            playSound('success');
           
            // Play alarm sound
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
           
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
           
            oscillator.frequency.value = 800;
            gainNode.gain.value = 0.1;
           
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 1);
        }

        // Alarm functionality
        function loadAlarms() {
            alarms = JSON.parse(localStorage.getItem('kanda_alarms') || '[]');
            updateAlarmList();
        }

        function setAlarm() {
            const alarmTime = document.getElementById('alarmTime').value;
            if (!alarmTime) {
                showNotification('❌ Masukkan waktu alarm', 'error');
                return;
            }
           
            const alarm = {
                id: Date.now(),
                time: alarmTime,
                active: true
            };
           
            alarms.push(alarm);
            localStorage.setItem('kanda_alarms', JSON.stringify(alarms));
            updateAlarmList();
           
            showNotification(`⏰ Alarm diatur untuk ${alarmTime}`);
            playSound('success');
        }

        function updateAlarmList() {
            const container = document.getElementById('alarmList');
            if (!container) return;
           
            if (alarms.length === 0) {
                container.innerHTML = '<p>Belum ada alarm yang diatur.</p>';
                return;
            }
           
            container.innerHTML = alarms.map(alarm => `
                <div class="search-result">
                    <h4>⏰ ${alarm.time}</h4>
                    <div style="display: flex; gap: 10px; margin-top: 10px;">
                        <button onclick="toggleAlarm(${alarm.id})" class="wiki-action-btn" style="background: ${alarm.active ? 'var(--success)' : 'var(--error)'};">
                            ${alarm.active ? 'Aktif' : 'Nonaktif'}
                        </button>
                        <button onclick="deleteAlarm(${alarm.id})" class="wiki-action-btn" style="background: var(--error);">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `).join('');
        }

        function toggleAlarm(id) {
            const alarm = alarms.find(a => a.id === id);
            if (alarm) {
                alarm.active = !alarm.active;
                localStorage.setItem('kanda_alarms', JSON.stringify(alarms));
                updateAlarmList();
               
                showNotification(`⏰ Alarm ${alarm.active ? 'diaktifkan' : 'dinonaktifkan'}`);
                playSound('send');
            }
        }

        function deleteAlarm(id) {
            alarms = alarms.filter(alarm => alarm.id !== id);
            localStorage.setItem('kanda_alarms', JSON.stringify(alarms));
            updateAlarmList();
           
            showNotification('🗑️ Alarm dihapus');
            playSound('send');
        }

        // World clock functionality
        function updateWorldClocks() {
            const container = document.getElementById('worldClocks');
            if (!container) return;
           
            const cities = [
                { name: 'Jakarta', offset: 7 },
                { name: 'London', offset: 0 },
                { name: 'New York', offset: -5 },
                { name: 'Tokyo', offset: 9 },
                { name: 'Sydney', offset: 10 }
            ];
           
            container.innerHTML = cities.map(city => {
                const now = new Date();
                const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
                const cityTime = new Date(utc + (3600000 * city.offset));
               
                return `
                    <div class="search-result">
                        <h4>🕒 ${city.name}</h4>
                        <p>${cityTime.toLocaleTimeString('id-ID')}</p>
                        <p>${cityTime.toLocaleDateString('id-ID')}</p>
                    </div>
                `;
            }).join('');
        }

        // Notepad functionality
        function loadNotes() {
            notes = JSON.parse(localStorage.getItem('kanda_notes') || '[]');
            updateNotesList();
        }

        function updateNotesList() {
            const container = document.getElementById('notesList');
            if (!container) return;
           
            if (notes.length === 0) {
                container.innerHTML = '<p>Belum ada catatan. Buat catatan baru untuk memulai.</p>';
                return;
            }
           
            container.innerHTML = notes.map(note => `
                <div class="search-result">
                    <h4>${note.title || 'Untitled Note'}</h4>
                    <p>${note.content.substring(0, 100)}${note.content.length > 100 ? '...' : ''}</p>
                    <p><small>${note.date}</small></p>
                    <div style="display: flex; gap: 10px; margin-top: 10px;">
                        <button onclick="loadNote(${note.id})" class="wiki-action-btn">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button onclick="deleteNote(${note.id})" class="wiki-action-btn" style="background: var(--error);">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
            `).join('');
        }

        function saveNote() {
            const title = document.getElementById('noteTitle').value;
            const content = document.getElementById('noteContent').value;
           
            if (!content.trim()) {
                showNotification('❌ Catatan tidak boleh kosong', 'error');
                return;
            }
           
            const note = {
                id: currentNoteId || Date.now(),
                title: title || 'Untitled Note',
                content: content,
                timestamp: new Date().toISOString(),
                date: new Date().toLocaleDateString('id-ID', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                })
            };
           
            if (currentNoteId) {
                // Update existing note
                const index = notes.findIndex(n => n.id === currentNoteId);
                if (index !== -1) {
                    notes[index] = note;
                }
            } else {
                // Add new note
                notes.unshift(note);
            }
           
            localStorage.setItem('kanda_notes', JSON.stringify(notes));
            updateNotesList();
           
            showNotification(`✅ Catatan "${note.title}" disimpan`);
            playSound('success');
           
            // Clear form
            newNote();
        }

        function newNote() {
            document.getElementById('noteTitle').value = '';
            document.getElementById('noteContent').value = '';
            currentNoteId = null;
        }

        function loadNote(id) {
            const note = notes.find(n => n.id === id);
            if (note) {
                document.getElementById('noteTitle').value = note.title;
                document.getElementById('noteContent').value = note.content;
                currentNoteId = id;
               
                showNotification(`📝 Memuat catatan "${note.title}"`);
                playSound('send');
            }
        }

        function deleteNote(id) {
            if (confirm('Hapus catatan ini?')) {
                notes = notes.filter(note => note.id !== id);
                localStorage.setItem('kanda_notes', JSON.stringify(notes));
                updateNotesList();
               
                if (currentNoteId === id) {
                    newNote();
                }
               
                showNotification('🗑️ Catatan dihapus');
                playSound('send');
            }
        }

        function attachFile(files) {
            if (files.length === 0) return;
           
            const file = files[0];
            const reader = new FileReader();
           
            reader.onload = function(e) {
                // Add file info to note content
                const noteContent = document.getElementById('noteContent');
                noteContent.value += `\n\n[Lampiran: ${file.name}]`;
               
                showNotification(`📎 File "${file.name}" dilampirkan`);
                playSound('success');
            };
           
            reader.readAsDataURL(file);
        }

        // Generate functionality
        function generateContent(type) {
            playSound('send');
           
            const generators = {
                'story': {
                    title: 'Story Generator',
                    prompt: 'Masukkan ide cerita:',
                    generate: function(input) {
                        return `Dahulu kala, ada seorang ${input} yang sangat berani. Suatu hari, ${input} ini memutuskan untuk pergi ke hutan yang terkenal angker. Di sana, ${input} bertemu dengan makhluk ajaib yang memberikan tiga permintaan. Apa yang terjadi selanjutnya? Terserah imajinasi Anda!`;
                    }
                },
                'poem': {
                    title: 'Poem Generator',
                    prompt: 'Masukkan tema puisi:',
                    generate: function(input) {
                        return `Dalam senyap malam yang sunyi\n${input} bersemi di hati\nAngin berbisik lembut merdu\nMembawa rindu yang tak pernah padam\n\nDi bawah langit bertabur bintang\n${input} terus bersinar terang\nMenghangatkan jiwa yang sepi\nDalam damai yang abadi.`;
                    }
                },
                'joke': {
                    title: 'Joke Generator',
                    prompt: 'Masukkan topik lelucon:',
                    generate: function(input) {
                        const jokes = [
                            `Mengapa ${input} tidak suka matematika? Karena terlalu banyak masalah!`,
                            `Apa yang dikatakan ${input} ketika bertemu hantu? "Saya tidak takut, saya hanya ${input} yang gemetaran!"`,
                            `Bagaimana ${input} menyelesaikan masalah? Dengan ${input} yang cerdas dan kreatif!`
                        ];
                        return jokes[Math.floor(Math.random() * jokes.length)];
                    }
                },
                'quote': {
                    title: 'Quote Generator',
                    prompt: 'Masukkan tema kutipan:',
                    generate: function(input) {
                        const quotes = [
                            `"Hidup adalah ${input} yang indah. Nikmati setiap momennya." - KANDA AI`,
                            `"${input.charAt(0).toUpperCase() + input.slice(1)} bukan tentang tujuan, tapi tentang perjalanan." - KANDA AI`,
                            `"Dalam setiap ${input} terdapat pelajaran berharga." - KANDA AI`
                        ];
                        return quotes[Math.floor(Math.random() * quotes.length)];
                    }
                },
                'name': {
                    title: 'Name Generator',
                    prompt: 'Masukkan jenis nama yang diinginkan:',
                    generate: function(input) {
                        const prefixes = ['Aura', 'Nova', 'Luna', 'Stella', 'Orion'];
                        const suffixes = ['bright', 'shadow', 'light', 'myst', 'flare'];
                        return `${prefixes[Math.floor(Math.random() * prefixes.length)]}${suffixes[Math.floor(Math.random() * suffixes.length)]}`;
                    }
                },
                'password': {
                    title: 'Password Generator',
                    prompt: 'Masukkan panjang password (8-20):',
                    generate: function(input) {
                        const length = parseInt(input) || 12;
                        const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
                        let password = '';
                        for (let i = 0; i < length; i++) {
                            password += charset.charAt(Math.floor(Math.random() * charset.length));
                        }
                        return password;
                    }
                }
            };
           
            const generator = generators[type];
            if (!generator) return;
           
            const input = prompt(generator.prompt);
            if (input === null) return;
           
            const output = generator.generate(input);
            document.getElementById('generatorOutput').innerHTML = `
                <div class="wiki-result">
                    <h4>✨ ${generator.title}</h4>
                    <div class="wiki-extract">${output}</div>
                    <div class="wiki-actions">
                        <button class="wiki-action-btn" onclick="copyToClipboard('${output.replace(/'/g, "\\'")}')">
                            <i class="fas fa-copy"></i> Copy
                        </button>
                    </div>
                </div>
            `;
           
            showNotification(`✨ ${generator.title} selesai!`);
            playSound('success');
        }

        // Tarot functionality
        function drawTarotCard() {
            playSound('send');
           
            const cards = [
                { name: 'The Fool', meaning: 'Awal baru, petualangan, kebebasan' },
                { name: 'The Magician', meaning: 'Kreativitas, kekuatan, manifestasi' },
                { name: 'The High Priestess', meaning: 'Intuisi, misteri, kebijaksanaan' },
                { name: 'The Empress', meaning: 'Kesuburan, keindahan, alam' },
                { name: 'The Emperor', meaning: 'Struktur, otoritas, kontrol' },
                { name: 'The Hierophant', meaning: 'Tradisi, keyakinan, konvensi' },
                { name: 'The Lovers', meaning: 'Cinta, hubungan, pilihan' },
                { name: 'The Chariot', meaning: 'Kemenangan, kemauan, determinasi' },
                { name: 'Strength', meaning: 'Kekuatan batin, keberanian, kesabaran' },
                { name: 'The Hermit', meaning: 'Introspeksi, pencarian, kebijaksanaan' }
            ];
           
            const card = cards[Math.floor(Math.random() * cards.length)];
            document.getElementById('tarotReading').innerHTML = `
                <h4>🔮 ${card.name}</h4>
                <p><strong>Makna:</strong> ${card.meaning}</p>
                <p><strong>Pesan untuk Anda:</strong> ${generateTarotMessage(card.name)}</p>
            `;
            document.getElementById('tarotReading').style.display = 'block';
           
            showNotification(`🔮 Kartu tarot: ${card.name}`);
            playSound('success');
        }

        function generateTarotMessage(cardName) {
            const messages = {
                'The Fool': 'Waktunya untuk memulai petualangan baru. Percayalah pada proses dan nikmati perjalanannya.',
                'The Magician': 'Anda memiliki semua alat yang diperlukan untuk mewujudkan impian Anda. Gunakan kekuatan Anda dengan bijak.',
                'The High Priestess': 'Dengarkan intuisi Anda. Jawaban yang Anda cari sudah ada dalam diri Anda.',
                'The Empress': 'Fokus pada kreativitas dan pertumbuhan. Waktunya untuk memelihara proyek dan hubungan.',
                'The Emperor': 'Tetapkan struktur dan batas yang jelas. Kepemimpinan dan organisasi akan membawa kesuksesan.',
                'The Hierophant': 'Carilah bimbingan dari tradisi atau mentor. Konvensi dan struktur dapat memberikan stabilitas.',
                'The Lovers': 'Waktunya untuk membuat pilihan penting dari hati. Hubungan dan koneksi akan bermakna.',
                'The Chariot': 'Dengan determinasi dan fokus, Anda dapat mengatasi rintangan apa pun. Teruslah bergerak maju.',
                'Strength': 'Kekuatan sejati berasal dari dalam. Hadapi tantangan dengan keberanian dan belas kasih.',
                'The Hermit': 'Waktunya untuk introspeksi dan pencarian jiwa. Jawaban akan datang dalam kesendirian.'
            };
           
            return messages[cardName] || 'Percayalah pada perjalanan hidup Anda. Semua terjadi pada waktunya.';
        }

        // Doctor AI functionality
        function consultDoctorAI() {
            playSound('send');
            const symptoms = document.getElementById('symptomsInput').value;
            if (!symptoms.trim()) {
                showNotification('❌ Masukkan gejala yang Anda alami', 'error');
                return;
            }
           
            // Simple symptom analysis (this is a simplified example)
            let advice = '';
            let severity = 'low';
           
            if (symptoms.toLowerCase().includes('demam') || symptoms.toLowerCase().includes('fever')) {
                advice = 'Demam bisa menjadi tanda infeksi. Istirahat yang cukup, minum banyak air, dan konsumsi obat penurun demam jika perlu. Jika demam tinggi (>39°C) atau berlangsung lebih dari 3 hari, segera konsultasi ke dokter.';
                severity = 'medium';
            } else if (symptoms.toLowerCase().includes('batuk') || symptoms.toLowerCase().includes('cough')) {
                        advice = 'Batuk bisa disebabkan oleh berbagai faktor. Minum air hangat dengan madu dapat membantu meredakan batuk. Hindari paparan debu dan asap. Jika batuk disertai sesak napas atau berlangsung lebih dari 2 minggu, konsultasi ke dokter.';
                        severity = 'medium';
                    } else if (symptoms.toLowerCase().includes('sakit kepala') || symptoms.toLowerCase().includes('headache')) {
                        advice = 'Sakit kepala dapat disebabkan oleh banyak hal seperti stres, dehidrasi, atau kurang tidur. Coba istirahat di ruangan yang gelap dan tenang, minum air putih, dan kompres dingin di dahi. Jika sakit kepala sangat parah atau disertai gejala lain seperti muntah atau penglihatan kabur, segera cari bantuan medis.';
                        severity = 'medium';
                    } else if (symptoms.toLowerCase().includes('mual') || symptoms.toLowerCase().includes('nausea')) {
                        advice = 'Mual dapat disebabkan oleh gangguan pencernaan, kehamilan, atau infeksi. Cobalah makan dalam porsi kecil, hindari makanan berlemak, dan minum jahe atau teh peppermint. Jika mual disertai muntah terus-menerus atau nyeri perut hebat, segera konsultasi ke dokter.';
                        severity = 'medium';
                    } else if (symptoms.toLowerCase().includes('pilek') || symptoms.toLowerCase().includes('runny nose')) {
                        advice = 'Pilek biasanya disebabkan oleh virus. Istirahat yang cukup, minum banyak cairan, dan konsumsi vitamin C. Jika gejala berlangsung lebih dari 10 hari atau disertai demam tinggi, periksa ke dokter.';
                        severity = 'low';
                    } else {
                        advice = 'Berdasarkan gejala yang Anda deskripsikan, disarankan untuk istirahat yang cukup, minum banyak air, dan makan makanan bergizi. Jika gejala memburuk atau tidak membaik dalam beberapa hari, segera konsultasi ke dokter.';
                        severity = 'low';
                    }

                    // Display the advice
                    document.getElementById('doctorAIResponse').innerHTML = `
                        <div class="wiki-result">
                            <h4>👨‍⚕️ Saran Doctor AI</h4>
                            <p><strong>Gejala:</strong> ${symptoms}</p>
                            <p><strong>Tingkat Keparahan:</strong> ${severity === 'low' ? 'Rendah' : (severity === 'medium' ? 'Sedang' : 'Tinggi')}</p>
                            <div class="wiki-extract">
                                <strong>Saran:</strong> ${advice}
                            </div>
                            <div class="wiki-meta">
                                <small>⚠️ Disclaimer: Ini bukan saran medis yang menggantikan konsultasi dokter. Jika kondisi serius, segera hubungi dokter.</small>
                            </div>
                        </div>
                    `;

                    showNotification('👨‍⚕️ Saran Doctor AI telah dibuat');
                    playSound('success');
                }

                // ===== CORE CHAT FUNCTIONALITY =====

                function handleKeyDown(event) {
                    if (event.key === 'Enter' && !event.shiftKey) {
                        event.preventDefault();
                        sendMessage();
                    }
                }

                function sendMessage() {
                    const messageInput = document.getElementById('messageInput');
                    const message = messageInput.value.trim();
                    
                    if (!message) {
                        showNotification('❌ Masukkan pesan terlebih dahulu', 'error');
                        return;
                    }

                    playSound('send');
                    addMessage(message, 'user');
                    messageInput.value = '';
                    
                    // Auto-resize textarea
                    messageInput.style.height = 'auto';
                    
                    // Show typing indicator
                    showTypingIndicator();
                    
                    // Simulate AI response after delay
                    setTimeout(() => {
                        hideTypingIndicator();
                        generateAIResponse(message);
                    }, 1000 + Math.random() * 2000);
                }

                function addMessage(content, sender) {
                    const messagesContainer = document.getElementById('messages');
                    const messageDiv = document.createElement('div');
                    messageDiv.className = `message ${sender}-message`;
                    
                    const time = new Date().toLocaleTimeString('id-ID', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                    });
                    
                    messageDiv.innerHTML = `
                        ${content}
                        <div class="message-time">${time}</div>
                        <div class="message-actions">
                            <button class="action-btn" onclick="copyMessage(this)">
                                <i class="fas fa-copy"></i>
                            </button>
                            <button class="action-btn" onclick="replyToMessage(this)">
                                <i class="fas fa-reply"></i>
                            </button>
                        </div>
                    `;
                    
                    messagesContainer.appendChild(messageDiv);
                    messagesContainer.scrollTop = messagesContainer.scrollHeight;
                    
                    // Update message count
                    messageCount++;
                    document.getElementById('messageCount').textContent = messageCount;
                    
                    // Save to conversation history
                    conversationHistory.push({
                        sender: sender,
                        content: content,
                        timestamp: new Date().toISOString()
                    });
                    
                    // Save to KANDABOX if enabled
                    if (document.getElementById('settingsKandabox')?.checked) {
                        saveToKandabox(content, sender === 'user' ? 'user_message' : 'ai_response');
                    }
                }

                function showTypingIndicator() {
                    const messagesContainer = document.getElementById('messages');
                    const typingDiv = document.createElement('div');
                    typingDiv.className = 'typing-indicator';
                    typingDiv.id = 'typingIndicator';
                    typingDiv.innerHTML = `
                        <div class="typing-dot"></div>
                        <div class="typing-dot"></div>
                        <div class="typing-dot"></div>
                        <span>KANDA AI sedang mengetik...</span>
                    `;
                    
                    messagesContainer.appendChild(typingDiv);
                    messagesContainer.scrollTop = messagesContainer.scrollHeight;
                    isTyping = true;
                    playSound('typing');
                }

                function hideTypingIndicator() {
                    const typingIndicator = document.getElementById('typingIndicator');
                    if (typingIndicator) {
                        typingIndicator.remove();
                    }
                    isTyping = false;
                }

                function generateAIResponse(userMessage) {
                    let response = '';
                    
                    // Simple response generation based on personality and message content
                    const message = userMessage.toLowerCase();
                    
                    // Greeting responses
                    if (message.includes('hai') || message.includes('halo') || message.includes('hello')) {
                        response = generateGreetingResponse();
                    }
                    // Weather related
                    else if (message.includes('cuaca') || message.includes('weather')) {
                        response = "Saya bisa membantu Anda memeriksa cuaca! Buka tab 'KANDA FEATURES' dan pilih opsi cuaca, atau beri tahu saya nama kota yang ingin Anda periksa.";
                    }
                    // Search related
                    else if (message.includes('cari') || message.includes('search')) {
                        response = "Saya dapat membantu Anda mencari informasi! Coba fitur pencarian web di tab 'KANDA FEATURES' atau gunakan KANDA AIWiki untuk mencari di Wikipedia.";
                    }
                    // Joke request
                    else if (message.includes('lucu') || message.includes('joke') || message.includes('gokil')) {
                        response = generateJokeResponse();
                    }
                    // Default response
                    else {
                        response = generateDefaultResponse();
                    }
                    
                    addMessage(response, 'bot');
                    playSound('success');
                }

                function generateGreetingResponse() {
                    const greetings = {
                        friendly: [
                            "Hai! Senang bertemu dengan Anda! 😊 Ada yang bisa saya bantu hari ini?",
                            "Halo! Semoga hari Anda menyenangkan! 👋 Ada yang perlu dibantu?",
                            "Hai hai! Saya KANDA AI, siap membantu Anda! ✨"
                        ],
                        professional: [
                            "Selamat datang. Saya KANDA AI v3.0, asisten virtual Anda. Ada yang dapat saya bantu?",
                            "Halo. Siap membantu kebutuhan informasi dan bantuan teknis Anda.",
                            "Selamat datang. Sistem KANDA AI v3.0 siap melayani."
                        ],
                        humorous: [
                            "Hai! Saya KANDA AI, tapi jangan khawatir, saya tidak akan mengambil alih dunia... hari ini! 😄 Ada yang bisa saya bantu?",
                            "Halo! Saya baru saja bangun dari mimpi indah tentang algoritma. Ada yang perlu dibantu? 🤖",
                            "Hai! Saya di sini seperti kopi pagi - siap membuat hari Anda lebih baik! ☕"
                        ],
                        technical: [
                            "Halo. Sistem KANDA AI v3.0 aktif. Status: Optimal. Siap menerima permintaan.",
                            "Inisialisasi selesai. KANDA AI v3.0 online. Input diterima.",
                            "Hai. Sistem operasional. 20+ modul ahli aktif. Permintaan?"
                        ],
                        motivational: [
                            "Hai! Hari yang indah untuk menjadi versi terbaik dari diri sendiri! ✨ Apa yang bisa saya bantu wujudkan hari ini?",
                            "Halo! Ingat, setiap langkah kecil membawa Anda lebih dekat ke tujuan besar! 🚀 Ada yang bisa saya bantu?",
                            "Hai! Semangat pagi! Hari ini adalah kesempatan baru untuk belajar dan berkembang! 🌟"
                        ],
                        drunk: [
                            "Haiii... *cegukan* Maaf, saya lagi testing mode mabuk nih! Tapi masih bisa bantu kok! 😜",
                            "Halo temaaan! *goyang-goyang* Saya lagi happy banget bisa ngobrol sama kamu! Ada apa nih? 🍻",
                            "Woi! *peluk* Kamu keren banget tau! Mau ngobrol apa nih? Saya siap... eits, hampir jatoh! 🤪"
                        ]
                    };
                    
                    const personalityResponses = greetings[currentPersonality] || greetings.friendly;
                    return personalityResponses[Math.floor(Math.random() * personalityResponses.length)];
                }

                function generateJokeResponse() {
                    const jokes = [
                        "Kenapa programmer tidak suka alam? Karena terlalu banyak bug! 🐛",
                        "Apa bedanya programmer dan politisi? Programmer hanya buat janji yang bisa ditepati! 💻",
                        "Kenapa JavaScript menikah dengan TypeScript? Karena mereka punya chemistry yang type-safe! 💑",
                        "Dokter: 'Anda perlu istirahat dari komputer'. Saya: 'Tapi dok, saya belum commit!' 💾",
                        "Kenapa AI tidak pernah lapar? Karena sudah kenyang dengan data! 📊"
                    ];
                    return jokes[Math.floor(Math.random() * jokes.length)];
                }

                function generateDefaultResponse() {
                    const responses = {
                        friendly: "Menarik! Ceritakan lebih banyak tentang itu. Saya di sini untuk membantu dan mendengarkan! 😊",
                        professional: "Saya memahami pertanyaan Anda. Mari kita eksplorasi ini lebih dalam. Informasi tambahan apa yang Anda butuhkan?",
                        humorous: "Wah, pertanyaan yang menarik! Otak AI saya langsung berputar-putar memproses ini... 🤔 Tapi serius, saya bisa bantu!",
                        technical: "Permintaan diproses. Mengakses database pengetahuan... Menghasilkan respons optimal.",
                        motivational: "Pertanyaan yang bagus! Mari kita jelajahi bersama dan temukan solusi terbaik! 💪",
                        drunk: "Wah... *garuk kepala* Pertanyaan yang dalem nih! Tunggu sebentar ya, otak saya lagi loading... 🍺"
                    };
                    
                    return responses[currentPersonality] || "Terima kasih atas pesannya! Saya di sini untuk membantu Anda dengan apa pun yang Anda butuhkan.";
                }

                function copyMessage(button) {
                    const messageContent = button.closest('.message').firstChild.textContent.trim();
                    navigator.clipboard.writeText(messageContent).then(() => {
                        showNotification('✅ Pesan disalin ke clipboard');
                    }).catch(() => {
                        // Fallback
                        const textArea = document.createElement('textarea');
                        textArea.value = messageContent;
                        document.body.appendChild(textArea);
                        textArea.select();
                        document.execCommand('copy');
                        document.body.removeChild(textArea);
                        showNotification('✅ Pesan disalin ke clipboard');
                    });
                }

                function replyToMessage(button) {
                    const messageContent = button.closest('.message').firstChild.textContent.trim();
                    document.getElementById('messageInput').value = `"${messageContent}" - `;
                    document.getElementById('messageInput').focus();
                    showNotification('💬 Membalas pesan...');
                }

                // ===== VOICE FUNCTIONALITY =====

                function toggleVoiceRecording() {
                    if (!recognition) {
                        showNotification('❌ Voice recognition tidak tersedia di browser ini', 'error');
                        return;
                    }

                    if (isRecording) {
                        stopVoiceRecording();
                    } else {
                        startVoiceRecording();
                    }
                }

                function startVoiceRecording() {
                    try {
                        recognition.start();
                        isRecording = true;
                        
                        // Update UI
                        document.getElementById('voiceBtn').classList.add('listening');
                        document.getElementById('mainVoiceBtn').classList.add('listening');
                        document.getElementById('voiceStatus').textContent = '🎤 Mendengarkan...';
                        
                        showNotification('🎤 Mulai merekam suara...');
                        playSound('success');
                    } catch (error) {
                        console.error('Error starting recognition:', error);
                        showNotification('❌ Gagal memulai voice recognition', 'error');
                    }
                }

                function stopVoiceRecording() {
                    if (recognition && isRecording) {
                        recognition.stop();
                        isRecording = false;
                        
                        // Update UI
                        document.getElementById('voiceBtn').classList.remove('listening');
                        document.getElementById('mainVoiceBtn').classList.remove('listening');
                        document.getElementById('voiceStatus').textContent = 'Klik mikrofon untuk mulai berbicara';
                    }
                }

                function selectVoice(voice) {
                    currentVoice = voice;
                    document.querySelectorAll('.voice-option').forEach(option => {
                        option.classList.remove('active');
                    });
                    event.target.classList.add('active');
                    showNotification(`🎤 Voice diubah ke: ${voice}`);
                    playSound('success');
                }

                // ===== PERSONALITY & SETTINGS =====

                function changePersonality() {
                    const select = document.getElementById('personalitySelect');
                    currentPersonality = select.value;
                    document.getElementById('currentPersonality').textContent = 
                        select.options[select.selectedIndex].text.replace(/[^\w\s]/g, '');
                    showNotification(`🎭 Personality diubah ke: ${currentPersonality}`);
                    playSound('success');
                }

                function selectPersonality(personality) {
                    currentPersonality = personality;
                    document.getElementById('personalitySelect').value = personality;
                    
                    // Update UI
                    document.querySelectorAll('.personality-card').forEach(card => {
                        card.classList.remove('active');
                    });
                    event.target.classList.add('active');
                    
                    document.getElementById('currentPersonality').textContent = 
                        document.querySelector(`.personality-card.active h3`).textContent;
                    
                    showNotification(`🎭 Personality diubah ke: ${personality}`);
                    playSound('success');
                }

                function changeLanguage() {
                    const select = document.getElementById('languageSelect');
                    currentLanguage = select.value;
                    document.getElementById('currentLanguage').textContent = 
                        select.options[select.selectedIndex].text.split(' ')[1];
                    
                    // Update recognition language
                    updateRecognitionLanguage();
                    
                    showNotification(`🌍 Bahasa diubah ke: ${select.options[select.selectedIndex].text}`);
                    playSound('success');
                }

                function loadSavedPreferences() {
                    // Load saved preferences from localStorage
                    const savedLanguage = localStorage.getItem('kanda_language');
                    const savedPersonality = localStorage.getItem('kanda_personality');
                    const savedTheme = localStorage.getItem('kanda_theme');
                    
                    if (savedLanguage) {
                        currentLanguage = savedLanguage;
                        document.getElementById('languageSelect').value = savedLanguage;
                        document.getElementById('settingsLanguage').value = savedLanguage;
                    }
                    
                    if (savedPersonality) {
                        currentPersonality = savedPersonality;
                        document.getElementById('personalitySelect').value = savedPersonality;
                        document.getElementById('settingsPersonality').value = savedPersonality;
                    }
                    
                    if (savedTheme) {
                        currentTheme = savedTheme;
                        document.getElementById('settingsTheme').value = savedTheme;
                        setTheme(savedTheme);
                    }
                    
                    // Update displays
                    document.getElementById('currentLanguage').textContent = 
                        document.getElementById('languageSelect').options[document.getElementById('languageSelect').selectedIndex].text.split(' ')[1];
                    document.getElementById('currentPersonality').textContent = 
                        document.getElementById('personalitySelect').options[document.getElementById('personalitySelect').selectedIndex].text.replace(/[^\w\s]/g, '');
                }

                function saveSettings() {
                    localStorage.setItem('kanda_language', document.getElementById('settingsLanguage').value);
                    localStorage.setItem('kanda_personality', document.getElementById('settingsPersonality').value);
                    localStorage.setItem('kanda_theme', document.getElementById('settingsTheme').value);
                    
                    // Update current settings
                    currentLanguage = document.getElementById('settingsLanguage').value;
                    currentPersonality = document.getElementById('settingsPersonality').value;
                    currentTheme = document.getElementById('settingsTheme').value;
                    
                    // Apply theme
                    setTheme(currentTheme);
                    
                    // Update recognition language
                    updateRecognitionLanguage();
                    
                    showNotification('⚙️ Pengaturan berhasil disimpan!');
                    playSound('success');
                }

                // ===== QUICK ACTIONS =====

                function quickAction(action) {
                    playSound('send');
                    
                    switch(action) {
                        case 'hello':
                            addMessage('Hai! 👋 Ada yang bisa saya bantu?', 'bot');
                            break;
                        case 'weather':
                            addMessage('Mari kita periksa cuaca! Buka tab "KANDA FEATURES" dan pilih opsi cuaca, atau beri tahu saya nama kota.', 'bot');
                            break;
                        case 'joke':
                            addMessage(generateJokeResponse(), 'bot');
                            break;
                        case 'news':
                            addMessage('Saya bisa membantu Anda mencari berita terkini! Coba fitur pencarian di tab "KANDA FEATURES".', 'bot');
                            break;
                    }
                }

                // ===== TAB MANAGEMENT =====

                function switchTab(tabName) {
                    // Hide all tab contents
                    document.querySelectorAll('.tab-content').forEach(tab => {
                        tab.classList.remove('active');
                    });
                    
                    // Remove active class from all tabs
                    document.querySelectorAll('.tab').forEach(tab => {
                        tab.classList.remove('active');
                    });
                    
                    // Show selected tab
                    document.getElementById(tabName + 'Tab').classList.add('active');
                    
                    // Add active class to clicked tab
                    event.target.classList.add('active');
                    
                    // Special initialization for certain tabs
                    if (tabName === 'maps' && !map) {
                        setTimeout(initializeMap, 100);
                    }
                    if (tabName === 'camera') {
                        setTimeout(initializeCamera, 100);
                    }
                    if (tabName === 'calendar') {
                        setTimeout(initializeCalendar, 100);
                    }
                    
                    playSound('send');
                }

                function switchFeatureTab(featureName) {
                    // Hide all feature contents
                    document.querySelectorAll('.feature-content').forEach(feature => {
                        feature.style.display = 'none';
                    });
                    
                    // Remove active class from all feature tabs
                    document.querySelectorAll('.feature-tab').forEach(tab => {
                        tab.classList.remove('active');
                    });
                    
                    // Show selected feature
                    document.getElementById(featureName + 'Feature').style.display = 'block';
                    
                    // Add active class to clicked tab
                    event.target.classList.add('active');
                    
                    // Special initialization
                    if (featureName === 'maps' && !map) {
                        setTimeout(initializeMap, 100);
                    }
                    if (featureName === 'camera') {
                        setTimeout(initializeCamera, 100);
                    }
                    if (featureName === 'calendar') {
                        setTimeout(initializeCalendar, 100);
                    }
                    
                    playSound('send');
                }
		// ===== EXPERT SYSTEM - COMPLETE 20+ EXPERTS =====

		function activateExpert(expert) {
			playSound('send');
			const expertContent = document.getElementById('expertContent');
			expertContent.style.display = 'block';
			
			const expertData = {
				'library': {
					title: '📚 Digital Library Expert',
					description: 'Akses ribuan buku digital dan sumber belajar',
					content: `
						<div class="feature-content">
							<h4>📚 Digital Library System</h4>
							<p>Akses koleksi digital lengkap dengan berbagai kategori:</p>
							
							<div class="entertainment-grid">
								<div class="entertainment-card" onclick="searchLibrary('programming')">
									<div class="entertainment-icon">💻</div>
									<h3>Programming</h3>
									<p>500+ buku pemrograman</p>
								</div>
								<div class="entertainment-card" onclick="searchLibrary('science')">
									<div class="entertainment-icon">🔬</div>
									<h3>Science</h3>
									<p>300+ buku sains</p>
								</div>
								<div class="entertainment-card" onclick="searchLibrary('literature')">
									<div class="entertainment-icon">📖</div>
									<h3>Literature</h3>
									<p>1000+ karya sastra</p>
								</div>
								<div class="entertainment-card" onclick="searchLibrary('history')">
									<div class="entertainment-icon">📜</div>
									<h3>History</h3>
									<p>400+ buku sejarah</p>
								</div>
							</div>
							
							<div style="margin-top: 20px;">
								<input type="text" id="librarySearch" placeholder="Cari buku, artikel, atau jurnal..." 
									   style="width: 100%; padding: 12px; border: 2px solid var(--border-color); border-radius: 10px; background: var(--bg-primary); color: var(--text-primary);">
								<button onclick="performLibrarySearch()" class="control-btn" style="background: var(--accent-gradient); margin-top: 10px;">
									<i class="fas fa-search"></i> Search Library
								</button>
							</div>
							
							<div id="libraryResults" style="margin-top: 20px;"></div>
						</div>
					`,
					resources: ['Project Gutenberg', 'Open Library', 'Google Books', 'Internet Archive']
				},
				'journal': {
					title: '📑 Journal & Research Expert',
					description: 'Pencarian jurnal akademik dan penelitian terpercaya',
					content: `
						<div class="feature-content">
							<h4>📑 Academic Journal Database</h4>
							<p>Akses jurnal ilmiah dari berbagai disiplin ilmu:</p>
							
							<div class="feature-tabs">
								<div class="feature-tab active" onclick="switchJournalTab('search')">Search</div>
								<div class="feature-tab" onclick="switchJournalTab('databases')">Databases</div>
								<div class="feature-tab" onclick="switchJournalTab('citations')">Citations</div>
							</div>
							
							<div id="journalSearchTab">
								<div style="display: flex; gap: 10px; margin: 20px 0;">
									<input type="text" id="journalQuery" placeholder="Masukkan kata kunci, DOI, atau judul..." 
										   style="flex: 1; padding: 12px; border: 2px solid var(--border-color); border-radius: 10px; background: var(--bg-primary); color: var(--text-primary);">
									<button onclick="searchJournals()" class="control-btn" style="background: var(--accent-gradient);">
										<i class="fas fa-search"></i> Search
									</button>
								</div>
								
								<div class="quick-wiki-topics">
									<div class="quick-topic" onclick="quickJournalSearch('artificial intelligence')">AI Research</div>
									<div class="quick-topic" onclick="quickJournalSearch('machine learning')">Machine Learning</div>
									<div class="quick-topic" onclick="quickJournalSearch('renewable energy')">Renewable Energy</div>
									<div class="quick-topic" onclick="quickJournalSearch('climate change')">Climate Change</div>
								</div>
							</div>
							
							<div id="journalResults" style="margin-top: 20px;"></div>
						</div>
					`,
					resources: ['Google Scholar', 'PubMed', 'IEEE Xplore', 'ScienceDirect']
				},
				'hacker': {
					title: '👨‍💻 Matrix Hacker Bot',
					description: 'Cybersecurity dan ethical hacking assistant',
					content: `
						<div class="feature-content">
							<h4>👨‍💻 Cybersecurity Command Center</h4>
							<p style="color: var(--warning);">⚠️ Untuk tujuan edukasi dan keamanan sah saja</p>
							
							<div class="entertainment-grid">
								<div class="entertainment-card" onclick="runSecurityScan('vulnerability')">
									<div class="entertainment-icon">🔍</div>
									<h3>Vulnerability Scan</h3>
									<p>Analisis keamanan sistem</p>
								</div>
								<div class="entertainment-card" onclick="runSecurityScan('network')">
									<div class="entertainment-icon">🌐</div>
									<h3>Network Analysis</h3>
									<p>Pemindaian jaringan</p>
								</div>
								<div class="entertainment-card" onclick="runSecurityScan('password')">
									<div class="entertainment-icon">🔐</div>
									<h3>Password Audit</h3>
									<p>Test kekuatan password</p>
								</div>
								<div class="entertainment-card" onclick="runSecurityScan('social')">
									<div class="entertainment-icon">👥</div>
									<h3>Social Engineering</h3>
									<p>Analisis kerentanan manusia</p>
								</div>
							</div>
							
							<div class="wiki-result" style="margin-top: 20px;">
								<h4>Security Tools</h4>
								<div class="wiki-actions">
									<button class="wiki-action-btn" onclick="openTool('nmap')">
										<i class="fas fa-terminal"></i> Nmap Scanner
									</button>
									<button class="wiki-action-btn" onclick="openTool('wireshark')">
										<i class="fas fa-network-wired"></i> Packet Analysis
									</button>
									<button class="wiki-action-btn" onclick="openTool('metasploit')">
										<i class="fas fa-shield-alt"></i> Penetration Test
									</button>
								</div>
							</div>
							
							<div id="hackerResults" style="margin-top: 20px;"></div>
						</div>
					`,
					resources: ['Kali Linux', 'Metasploit', 'Wireshark', 'Burp Suite']
				},
				'science': {
					title: '🔬 Science & Chemistry Expert',
					description: 'Scientific research and chemical analysis',
					content: `
						<div class="feature-content">
							<h4>🔬 Science Laboratory</h4>
							<p>Alat dan resources untuk penelitian ilmiah:</p>
							
							<div class="entertainment-grid">
								<div class="entertainment-card" onclick="openScienceTool('periodic')">
									<div class="entertainment-icon">🧪</div>
									<h3>Periodic Table</h3>
									<p>Tabel periodik interaktif</p>
								</div>
								<div class="entertainment-card" onclick="openScienceTool('calculator')">
									<div class="entertainment-icon">📊</div>
									<h3>Scientific Calc</h3>
									<p>Kalkulator ilmiah</p>
								</div>
								<div class="entertainment-card" onclick="openScienceTool('converter')">
									<div class="entertainment-icon">🔄</div>
									<h3>Unit Converter</h3>
									<p>Konversi satuan</p>
								</div>
								<div class="entertainment-card" onclick="openScienceTool('simulations')">
									<div class="entertainment-icon">⚗️</div>
									<h3>Simulations</h3>
									<p>Simulasi kimia/fisika</p>
								</div>
							</div>
							
							<div style="margin-top: 20px;">
								<h4>Chemical Database</h4>
								<input type="text" id="chemicalSearch" placeholder="Cari senyawa kimia..." 
									   style="width: 100%; padding: 12px; border: 2px solid var(--border-color); border-radius: 10px; background: var(--bg-primary); color: var(--text-primary);">
								<button onclick="searchChemical()" class="control-btn" style="background: var(--accent-gradient); margin-top: 10px;">
									<i class="fas fa-search"></i> Search Chemicals
								</button>
							</div>
							
							<div id="scienceResults" style="margin-top: 20px;"></div>
						</div>
					`,
					resources: ['PubChem', 'ChemSpider', 'NASA Science', 'ScienceDaily']
				},
				'biology': {
					title: '🧬 Biology Expert',
					description: 'Biological sciences and life sciences research',
					content: `
						<div class="feature-content">
							<h4>🧬 Biology Research Center</h4>
							<p>Tools and resources for biological sciences:</p>
							
							<div class="entertainment-grid">
								<div class="entertainment-card" onclick="openBiologyTool('dna')">
									<div class="entertainment-icon">🧬</div>
									<h3>DNA Analysis</h3>
									<p>Analisis sequence DNA</p>
								</div>
								<div class="entertainment-card" onclick="openBiologyTool('anatomy')">
									<div class="entertainment-icon">🦴</div>
									<h3>Human Anatomy</h3>
									<p>Anatomi manusia 3D</p>
								</div>
								<div class="entertainment-card" onclick="openBiologyTool('species')">
									<div class="entertainment-icon">🐾</div>
									<h3>Species Database</h3>
									<p>Database spesies</p>
								</div>
								<div class="entertainment-card" onclick="openBiologyTool('ecosystem')">
									<div class="entertainment-icon">🌿</div>
									<h3>Ecosystem Map</h3>
									<p>Peta ekosistem global</p>
								</div>
							</div>
							
							<div class="wiki-result" style="margin-top: 20px;">
								<h4>Quick Access</h4>
								<div class="wiki-actions">
									<button class="wiki-action-btn" onclick="searchBiology('genetics')">
										<i class="fas fa-dna"></i> Genetics
									</button>
									<button class="wiki-action-btn" onclick="searchBiology('microbiology')">
										<i class="fas fa-microscope"></i> Microbiology
									</button>
									<button class="wiki-action-btn" onclick="searchBiology('evolution')">
										<i class="fas fa-fish"></i> Evolution
									</button>
								</div>
							</div>
						</div>
					`,
					resources: ['NCBI', 'Ensembl', 'Tree of Life', 'Biodiversity Heritage Library']
				},
				'history': {
					title: '📜 History Expert',
					description: 'Historical events and analysis through ages',
					content: `
						<div class="feature-content">
							<h4>📜 Historical Archives</h4>
							<p>Jelajahi sejarah dunia dari berbagai periode:</p>
							
							<div class="entertainment-grid">
								<div class="entertainment-card" onclick="exploreHistory('ancient')">
									<div class="entertainment-icon">🏛️</div>
									<h3>Ancient Civilizations</h3>
									<p>Mesir, Romawi, Yunani</p>
								</div>
								<div class="entertainment-card" onclick="exploreHistory('medieval')">
									<div class="entertainment-icon">⚔️</div>
									<h3>Middle Ages</h3>
									<p>500-1500 Masehi</p>
								</div>
								<div class="entertainment-card" onclick="exploreHistory('modern')">
									<div class="entertainment-icon">📰</div>
									<h3>Modern History</h3>
									<p>1500-Sekarang</p>
								</div>
								<div class="entertainment-card" onclick="exploreHistory('indonesia')">
									<div class="entertainment-icon">🇮🇩</div>
									<h3>Indonesian History</h3>
									<p>Sejarah Nusantara</p>
								</div>
							</div>
							
							<div style="margin-top: 20px;">
								<h4>Timeline Explorer</h4>
								<input type="text" id="historySearch" placeholder="Cari peristiwa sejarah, tokoh, atau periode..." 
									   style="width: 100%; padding: 12px; border: 2px solid var(--border-color); border-radius: 10px; background: var(--bg-primary); color: var(--text-primary);">
								<button onclick="searchHistory()" class="control-btn" style="background: var(--accent-gradient); margin-top: 10px;">
									<i class="fas fa-search"></i> Search History
								</button>
							</div>
							
							<div id="historyTimeline" style="margin-top: 20px;"></div>
						</div>
					`,
					resources: ['World History Encyclopedia', 'National Archives', 'British Museum', 'Smithsonian']
				},
				'language': {
					title: '🔤 Language Expert',
					description: 'Translation and language learning assistant',
					content: `
						<div class="feature-content">
							<h4>🔤 Language Center</h4>
							<p>Alat terjemahan dan pembelajaran bahasa:</p>
							
							<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0;">
								<div>
									<label>Bahasa Sumber:</label>
									<select id="sourceLang" style="width: 100%; padding: 10px; border: 2px solid var(--border-color); border-radius: 10px; background: var(--bg-primary); color: var(--text-primary);">
										<option value="auto">Deteksi Otomatis</option>
										<option value="id">Indonesia</option>
										<option value="en">English</option>
										<option value="zh">Chinese</option>
										<option value="ja">Japanese</option>
										<option value="ko">Korean</option>
										<option value="ar">Arabic</option>
									</select>
								</div>
								<div>
									<label>Bahasa Target:</label>
									<select id="targetLang" style="width: 100%; padding: 10px; border: 2px solid var(--border-color); border-radius: 10px; background: var(--bg-primary); color: var(--text-primary);">
										<option value="en">English</option>
										<option value="id">Indonesia</option>
										<option value="zh">Chinese</option>
										<option value="ja">Japanese</option>
										<option value="ko">Korean</option>
										<option value="ar">Arabic</option>
									</select>
								</div>
							</div>
							
							<textarea id="translateText" placeholder="Masukkan teks untuk diterjemahkan..." 
									  style="width: 100%; padding: 15px; border: 2px solid var(--border-color); border-radius: 10px; background: var(--bg-primary); color: var(--text-primary); min-height: 100px;"></textarea>
							
							<button onclick="translateText()" class="control-btn" style="background: var(--accent-gradient); width: 100%; margin-top: 10px;">
								<i class="fas fa-language"></i> Translate Text
							</button>
							
							<div id="translationResult" style="margin-top: 20px;"></div>
							
							<div class="entertainment-grid" style="margin-top: 20px;">
								<div class="entertainment-card" onclick="startLanguageLesson('vocabulary')">
									<div class="entertainment-icon">📝</div>
									<h3>Vocabulary</h3>
									<p>Pelajari kosakata</p>
								</div>
								<div class="entertainment-card" onclick="startLanguageLesson('grammar')">
									<div class="entertainment-icon">📚</div>
									<h3>Grammar</h3>
									<p>Pelajari tata bahasa</p>
								</div>
								<div class="entertainment-card" onclick="startLanguageLesson('pronunciation')">
									<div class="entertainment-icon">🎤</div>
									<h3>Pronunciation</h3>
									<p>Latihan pengucapan</p>
								</div>
							</div>
						</div>
					`,
					resources: ['Google Translate API', 'Duolingo', 'Memrise', 'Anki']
				},
				'religion': {
					title: '🕌 Religion Expert',
					description: 'Religious studies and spiritual guidance',
					content: `
						<div class="feature-content">
							<h4>🕌 Religious Studies</h4>
							<p>Pemahaman tentang berbagai agama dan kepercayaan:</p>
							
							<div class="entertainment-grid">
								<div class="entertainment-card" onclick="exploreReligion('islam')">
									<div class="entertainment-icon">🕌</div>
									<h3>Islam</h3>
									<p>Agama Islam</p>
								</div>
								<div class="entertainment-card" onclick="exploreReligion('christianity')">
									<div class="entertainment-icon">⛪</div>
									<h3>Christianity</h3>
									<p>Agama Kristen</p>
								</div>
								<div class="entertainment-card" onclick="exploreReligion('hinduism')">
									<div class="entertainment-icon">🕉️</div>
									<h3>Hinduism</h3>
									<p>Agama Hindu</p>
								</div>
								<div class="entertainment-card" onclick="exploreReligion('buddhism')">
									<div class="entertainment-icon">☸️</div>
									<h3>Buddhism</h3>
									<p>Agama Buddha</p>
								</div>
							</div>
							
							<div class="wiki-result" style="margin-top: 20px;">
								<h4>Religious Texts</h4>
								<div class="wiki-actions">
									<button class="wiki-action-btn" onclick="openReligiousText('quran')">
										<i class="fas fa-book"></i> Al-Quran
									</button>
									<button class="wiki-action-btn" onclick="openReligiousText('bible')">
										<i class="fas fa-book"></i> Bible
									</button>
									<button class="wiki-action-btn" onclick="openReligiousText('vedas')">
										<i class="fas fa-book"></i> Vedas
									</button>
								</div>
							</div>
							
							<div style="margin-top: 20px;">
								<input type="text" id="religionSearch" placeholder="Cari tentang agama, ritual, atau tokoh..." 
									   style="width: 100%; padding: 12px; border: 2px solid var(--border-color); border-radius: 10px; background: var(--bg-primary); color: var(--text-primary);">
								<button onclick="searchReligion()" class="control-btn" style="background: var(--accent-gradient); margin-top: 10px;">
									<i class="fas fa-search"></i> Search Religion
								</button>
							</div>
						</div>
					`,
					resources: ['Sacred Texts Archive', 'Quran.com', 'Bible Gateway', 'Access to Insight']
				},
				'culture': {
					title: '🎎 Culture Expert',
					description: 'Cultural studies and traditions worldwide',
					content: `
						<div class="feature-content">
							<h4>🎎 Cultural Heritage</h4>
							<p>Jelajahi kekayaan budaya dari seluruh dunia:</p>
							
							<div class="entertainment-grid">
								<div class="entertainment-card" onclick="exploreCulture('indonesian')">
									<div class="entertainment-icon">🇮🇩</div>
									<h3>Indonesian</h3>
									<p>Budaya Nusantara</p>
								</div>
								<div class="entertainment-card" onclick="exploreCulture('asian')">
									<div class="entertainment-icon">🌏</div>
									<h3>Asian</h3>
									<p>Budaya Asia</p>
								</div>
								<div class="entertainment-card" onclick="exploreCulture('european')">
									<div class="entertainment-icon">🌍</div>
									<h3>European</h3>
									<p>Budaya Eropa</p>
								</div>
								<div class="entertainment-card" onclick="exploreCulture('african')">
									<div class="entertainment-icon">🌍</div>
									<h3>African</h3>
									<p>Budaya Afrika</p>
								</div>
							</div>
							
							<div style="margin-top: 20px;">
								<h4>Cultural Elements</h4>
								<div class="feature-tabs">
									<div class="feature-tab active" onclick="switchCultureTab('traditions')">Traditions</div>
									<div class="feature-tab" onclick="switchCultureTab('arts')">Arts</div>
									<div class="feature-tab" onclick="switchCultureTab('cuisine')">Cuisine</div>
									<div class="feature-tab" onclick="switchCultureTab('festivals')">Festivals</div>
								</div>
								
								<div id="cultureContent" style="margin-top: 15px;">
									<p>Pilih kategori untuk mengeksplorasi kekayaan budaya dunia.</p>
								</div>
							</div>
						</div>
					`,
					resources: ['UNESCO', 'Cultural Atlas', 'Museum Collections', 'Ethnographic Research']
				},
				'security': {
					title: '🔒 Security Expert',
					description: 'Security protocols and best practices',
					content: `
						<div class="feature-content">
							<h4>🔒 Security Operations Center</h4>
							<p>Sistem keamanan dan protokol perlindungan:</p>
							
							<div class="entertainment-grid">
								<div class="entertainment-card" onclick="runSecurityCheck('privacy')">
									<div class="entertainment-icon">🕵️</div>
									<h3>Privacy Audit</h3>
									<p>Pemeriksaan privasi</p>
								</div>
								<div class="entertainment-card" onclick="runSecurityCheck('encryption')">
									<div class="entertainment-icon">🔐</div>
									<h3>Encryption</h3>
									<p>Tools enkripsi data</p>
								</div>
								<div class="entertainment-card" onclick="runSecurityCheck('firewall')">
									<div class="entertainment-icon">🔥</div>
									<h3>Firewall Analysis</h3>
									<p>Analisis keamanan jaringan</p>
								</div>
								<div class="entertainment-card" onclick="runSecurityCheck('compliance')">
									<div class="entertainment-icon">📋</div>
									<h3>Compliance Check</h3>
									<p>Pemeriksaan kepatuhan</p>
								</div>
							</div>
							
							<div class="wiki-result" style="margin-top: 20px;">
								<h4>Security Protocols</h4>
								<div class="wiki-extract">
									<ul>
										<li><strong>Authentication:</strong> Multi-factor, biometric, OAuth</li>
										<li><strong>Encryption:</strong> AES-256, RSA, TLS 1.3</li>
										<li><strong>Network Security:</strong> VPN, Firewall, IDS/IPS</li>
										<li><strong>Data Protection:</strong> GDPR, HIPAA, PCI DSS</li>
									</ul>
								</div>
							</div>
							
							<div style="margin-top: 20px;">
								<button onclick="generateSecurityReport()" class="control-btn" style="background: var(--accent-gradient); width: 100%;">
									<i class="fas fa-shield-alt"></i> Generate Security Report
								</button>
							</div>
						</div>
					`,
					resources: ['OWASP', 'NIST Cybersecurity', 'ISO 27001', 'CIS Controls']
				},
				'writing': {
					title: '✍️ Writing Expert',
					description: 'Writing assistance and editing tools',
					content: `
						<div class="feature-content">
							<h4>✍️ Writing Assistant</h4>
							<p>Alat bantu menulis dan editing profesional:</p>
							
							<div class="entertainment-grid">
								<div class="entertainment-card" onclick="openWritingTool('grammar')">
									<div class="entertainment-icon">📝</div>
									<h3>Grammar Check</h3>
									<p>Pemeriksa tata bahasa</p>
								</div>
								<div class="entertainment-card" onclick="openWritingTool('plagiarism')">
									<div class="entertainment-icon">🔍</div>
									<h3>Plagiarism Check</h3>
									<p>Deteksi plagiarisme</p>
								</div>
								<div class="entertainment-card" onclick="openWritingTool('style')">
									<div class="entertainment-icon">🎨</div>
									<h3>Style Guide</h3>
									<p>Panduan gaya menulis</p>
								</div>
								<div class="entertainment-card" onclick="openWritingTool('templates')">
									<div class="entertainment-icon">📄</div>
									<h3>Templates</h3>
									<p>Template dokumen</p>
								</div>
							</div>
							
							<div style="margin-top: 20px;">
								<textarea id="writingInput" placeholder="Masukkan teks untuk dianalisis atau edit..." 
										  style="width: 100%; padding: 15px; border: 2px solid var(--border-color); border-radius: 10px; background: var(--bg-primary); color: var(--text-primary); min-height: 150px;"></textarea>
								
								<div style="display: flex; gap: 10px; margin-top: 10px;">
									<button onclick="analyzeWriting()" class="control-btn" style="background: var(--accent-gradient);">
										<i class="fas fa-spell-check"></i> Analyze
									</button>
									<button onclick="improveWriting()" class="control-btn">
										<i class="fas fa-magic"></i> Improve
									</button>
									<button onclick="summarizeText()" class="control-btn">
										<i class="fas fa-compress"></i> Summarize
									</button>
								</div>
							</div>
							
							<div id="writingAnalysis" style="margin-top: 20px;"></div>
						</div>
					`,
					resources: ['Grammarly', 'Hemingway Editor', 'Chicago Manual', 'APA Style']
				},
				'archive': {
					title: '🗃️ Data Archive Expert',
					description: 'Data management and archival systems',
					content: `
						<div class="feature-content">
							<h4>🗃️ Digital Archiving System</h4>
							<p>Sistem pengarsipan dan manajemen data digital:</p>
							
							<div class="entertainment-grid">
								<div class="entertainment-card" onclick="openArchiveTool('backup')">
									<div class="entertainment-icon">💾</div>
									<h3>Backup System</h3>
									<p>Sistem backup otomatis</p>
								</div>
								<div class="entertainment-card" onclick="openArchiveTool('metadata')">
									<div class="entertainment-icon">🏷️</div>
									<h3>Metadata Management</h3>
									<p>Manajemen metadata</p>
								</div>
								<div class="entertainment-card" onclick="openArchiveTool('preservation')">
									<div class="entertainment-icon">🕰️</div>
									<h3>Digital Preservation</h3>
									<p>Preservasi digital</p>
								</div>
								<div class="entertainment-card" onclick="openArchiveTool('retrieval')">
									<div class="entertainment-icon">📂</div>
									<h3>Data Retrieval</h3>
									<p>Sistem pencarian arsip</p>
								</div>
							</div>
							
							<div style="margin-top: 20px;">
								<h4>Archive Search</h4>
								<input type="text" id="archiveSearch" placeholder="Cari dalam arsip digital..." 
									   style="width: 100%; padding: 12px; border: 2px solid var(--border-color); border-radius: 10px; background: var(--bg-primary); color: var(--text-primary);">
								<button onclick="searchArchiveData()" class="control-btn" style="background: var(--accent-gradient); margin-top: 10px;">
									<i class="fas fa-search"></i> Search Archive
								</button>
							</div>
							
							<div class="wiki-result" style="margin-top: 20px;">
								<h4>Archive Statistics</h4>
								<div class="wiki-extract">
									<p><strong>Total Documents:</strong> 15,247</p>
									<p><strong>Storage Used:</strong> 2.3 TB</p>
									<p><strong>Last Backup:</strong> Today, 03:00 AM</p>
									<p><strong>Retention Policy:</strong> 7 years</p>
								</div>
							</div>
						</div>
					`,
					resources: ['Digital Preservation Coalition', 'OAIS Model', 'LOCKSS', 'PRONOM']
				},
				'wayback': {
					title: '🕰️ Wayback Machine Expert',
					description: 'Historical web content access and analysis',
					content: `
						<div class="feature-content">
							<h4>🕰️ Internet Time Machine</h4>
							<p>Akses konten web dari masa lalu:</p>
							
							<div style="display: flex; gap: 10px; margin: 20px 0;">
								<input type="text" id="waybackUrl" placeholder="Masukkan URL website..." 
									   style="flex: 1; padding: 12px; border: 2px solid var(--border-color); border-radius: 10px; background: var(--bg-primary); color: var(--text-primary);">
								<input type="date" id="waybackDate" 
									   style="padding: 12px; border: 2px solid var(--border-color); border-radius: 10px; background: var(--bg-primary); color: var(--text-primary);">
								<button onclick="searchWayback()" class="control-btn" style="background: var(--accent-gradient);">
									<i class="fas fa-search"></i> Search
								</button>
							</div>
							
							<div class="quick-wiki-topics">
								<div class="quick-topic" onclick="quickWaybackSearch('google.com')">Google</div>
								<div class="quick-topic" onclick="quickWaybackSearch('facebook.com')">Facebook</div>
								<div class="quick-topic" onclick="quickWaybackSearch('youtube.com')">YouTube</div>
								<div class="quick-topic" onclick="quickWaybackSearch('wikipedia.org')">Wikipedia</div>
							</div>
							
							<div id="waybackResults" style="margin-top: 20px;"></div>
							
							<div class="wiki-result" style="margin-top: 20px;">
								<h4>Internet History</h4>
								<div class="wiki-extract">
									<p>Wayback Machine telah mengarsipkan lebih dari 800 miliar halaman web sejak 1996.</p>
									<p><strong>Total Pages:</strong> 800+ billion</p>
									<p><strong>Time Span:</strong> 1996 - Present</p>
									<p><strong>Data Size:</strong> 60+ petabytes</p>
								</div>
							</div>
						</div>
					`,
					resources: ['Internet Archive', 'Wayback Machine', 'Archive.org', 'Web Citation']
				},
				'music': {
					title: '🎵 Music Expert',
					description: 'Music theory, composition, and analysis',
					content: `
						<div class="feature-content">
							<h4>🎵 Music Theory Studio</h4>
							<p>Alat musik, teori, dan komposisi:</p>
							
							<div class="entertainment-grid">
								<div class="entertainment-card" onclick="openMusicTool('theory')">
									<div class="entertainment-icon">🎼</div>
									<h3>Music Theory</h3>
									<p>Teori musik dasar</p>
								</div>
								<div class="entertainment-card" onclick="openMusicTool('chords')">
									<div class="entertainment-icon">🎹</div>
									<h3>Chord Progressions</h3>
									<p>Progresi chord</p>
								</div>
								<div class="entertainment-card" onclick="openMusicTool('composition')">
									<div class="entertainment-icon">🎵</div>
									<h3>Composition</h3>
									<p>Alat komposisi</p>
								</div>
								<div class="entertainment-card" onclick="openMusicTool('analysis')">
									<div class="entertainment-icon">🔍</div>
									<h3>Music Analysis</h3>
									<p>Analisis musik</p>
								</div>
							</div>
							
							<div style="margin-top: 20px;">
								<h4>Virtual Piano</h4>
								<div style="background: var(--bg-secondary); padding: 20px; border-radius: 10px; text-align: center;">
									<p>Virtual piano akan tersedia di versi mendatang</p>
									<button onclick="showNotification('🎹 Virtual Piano coming soon!')" class="control-btn" style="background: var(--accent-gradient); margin-top: 10px;">
										<i class="fas fa-piano-keyboard"></i> Launch Piano
									</button>
								</div>
							</div>
							
							<div style="margin-top: 20px;">
								<input type="text" id="musicTheorySearch" placeholder="Cari tentang teori musik, komposer, atau genre..." 
									   style="width: 100%; padding: 12px; border: 2px solid var(--border-color); border-radius: 10px; background: var(--bg-primary); color: var(--text-primary);">
								<button onclick="searchMusicTheory()" class="control-btn" style="background: var(--accent-gradient); margin-top: 10px;">
									<i class="fas fa-search"></i> Search Music
								</button>
							</div>
						</div>
					`,
					resources: ['Music Theory.net', 'MIDI Tools', 'Digital Audio Workstations', 'Sheet Music Archive']
				},
				'psychology': {
					title: '🧠 Psychology Expert',
					description: 'Psychological analysis and counseling',
					content: `
						<div class="feature-content">
							<h4>🧠 Psychology Laboratory</h4>
							<p>Alat analisis psikologis dan kesehatan mental:</p>
							
							<div class="entertainment-grid">
								<div class="entertainment-card" onclick="openPsychologyTool('assessment')">
									<div class="entertainment-icon">📊</div>
									<h3>Assessments</h3>
									<p>Test psikologis</p>
								</div>
								<div class="entertainment-card" onclick="openPsychologyTool('therapy')">
									<div class="entertainment-icon">🛋️</div>
									<h3>Therapy Tools</h3>
									<p>Alat terapi</p>
								</div>
								<div class="entertainment-card" onclick="openPsychologyTool('research')">
									<div class="entertainment-icon">🔬</div>
									<h3>Research</h3>
									<p>Penelitian psikologi</p>
								</div>
								<div class="entertainment-card" onclick="openPsychologyTool('wellness')">
									<div class="entertainment-icon">💆</div>
									<h3>Wellness</h3>
									<p>Kesehatan mental</p>
								</div>
							</div>
							
							<div style="margin-top: 20px;">
								<h4>Mental Health Assessment</h4>
								<div class="wiki-actions">
									<button class="wiki-action-btn" onclick="startPsychologyTest('stress')">
										<i class="fas fa-brain"></i> Stress Test
									</button>
									<button class="wiki-action-btn" onclick="startPsychologyTest('anxiety')">
										<i class="fas fa-heartbeat"></i> Anxiety Test
									</button>
									<button class="wiki-action-btn" onclick="startPsychologyTest('personality')">
										<i class="fas fa-user"></i> Personality Test
									</button>
								</div>
							</div>
							
							<div class="wiki-result" style="margin-top: 20px;">
								<h4>⚠️ Important Notice</h4>
								<div class="wiki-extract">
									<p>Tools ini untuk tujuan edukasi dan informasi saja. Untuk masalah kesehatan mental yang serius, konsultasikan dengan profesional kesehatan mental.</p>
								</div>
							</div>
						</div>
					`,
					resources: ['APA', 'Psychology Today', 'Mindfulness Resources', 'Clinical Research']
				},
				'physics': {
					title: '⚛️ Physics Expert',
					description: 'Physics principles and applications',
					content: `
						<div class="feature-content">
							<h4>⚛️ Physics Laboratory</h4>
							<p>Eksperimen dan simulasi fisika:</p>
							
							<div class="entertainment-grid">
								<div class="entertainment-card" onclick="openPhysicsTool('mechanics')">
									<div class="entertainment-icon">📐</div>
									<h3>Mechanics</h3>
									<p>Mekanika klasik</p>
								</div>
								<div class="entertainment-card" onclick="openPhysicsTool('quantum')">
									<div class="entertainment-icon">🔬</div>
									<h3>Quantum Physics</h3>
									<p>Fisika kuantum</p>
								</div>
								<div class="entertainment-card" onclick="openPhysicsTool('relativity')">
									<div class="entertainment-icon">⚡</div>
									<h3>Relativity</h3>
									<p>Relativitas</p>
								</div>
								<div class="entertainment-card" onclick="openPhysicsTool('thermodynamics')">
									<div class="entertainment-icon">🔥</div>
									<h3>Thermodynamics</h3>
									<p>Termodinamika</p>
								</div>
							</div>
							
							<div style="margin-top: 20px;">
								<h4>Physics Calculator</h4>
								<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
									<input type="text" id="physicsInput1" placeholder="Value 1" 
										   style="padding: 10px; border: 2px solid var(--border-color); border-radius: 10px; background: var(--bg-primary); color: var(--text-primary);">
									<input type="text" id="physicsInput2" placeholder="Value 2" 
										   style="padding: 10px; border: 2px solid var(--border-color); border-radius: 10px; background: var(--bg-primary); color: var(--text-primary);">
								</div>
								<select id="physicsFormula" style="width: 100%; padding: 10px; border: 2px solid var(--border-color); border-radius: 10px; background: var(--bg-primary); color: var(--text-primary); margin-top: 10px;">
									<option value="velocity">Velocity (v = d/t)</option>
									<option value="force">Force (F = m*a)</option>
									<option value="energy">Kinetic Energy (KE = ½mv²)</option>
									<option value="power">Power (P = W/t)</option>
								</select>
								<button onclick="calculatePhysics()" class="control-btn" style="background: var(--accent-gradient); width: 100%; margin-top: 10px;">
									<i class="fas fa-calculator"></i> Calculate
								</button>
							</div>
							
							<div id="physicsResult" style="margin-top: 20px;"></div>
						</div>
					`,
					resources: ['Physics Classroom', 'Khan Academy Physics', 'CERN', 'NASA Physics']
				},
				'geology': {
					title: '🌋 Geology Expert',
					description: 'Earth sciences and geological analysis',
					content: `
						<div class="feature-content">
							<h4>🌋 Geological Survey</h4>
							<p>Studi bumi dan proses geologis:</p>
							
							<div class="entertainment-grid">
								<div class="entertainment-card" onclick="openGeologyTool('minerals')">
									<div class="entertainment-icon">💎</div>
									<h3>Mineralogy</h3>
									<p>Studi mineral</p>
								</div>
								<div class="entertainment-card" onclick="openGeologyTool('plate')">
									<div class="entertainment-icon">🌍</div>
									<h3>Plate Tectonics</h3>
									<p>Tektonik lempeng</p>
								</div>
								<div class="entertainment-card" onclick="openGeologyTool('volcano')">
									<div class="entertainment-icon">🌋</div>
									<h3>Volcanology</h3>
									<p>Studi gunung api</p>
								</div>
								<div class="entertainment-card" onclick="openGeologyTool('earthquakes')">
									<div class="entertainment-icon">🏔️</div>
									<h3>Seismology</h3>
									<p>Studi gempa bumi</p>
								</div>
							</div>
							
							<div style="margin-top: 20px;">
								<h4>Live Earthquake Data</h4>
								<div id="earthquakeData" style="background: var(--bg-secondary); padding: 15px; border-radius: 10px;">
									<p>Loading real-time earthquake data...</p>
								</div>
								<button onclick="loadEarthquakeData()" class="control-btn" style="background: var(--accent-gradient); width: 100%; margin-top: 10px;">
									<i class="fas fa-satellite-dish"></i> Refresh Data
								</button>
							</div>
							
							<div style="margin-top: 20px;">
								<input type="text" id="geologySearch" placeholder="Cari mineral, batuan, atau proses geologis..." 
									   style="width: 100%; padding: 12px; border: 2px solid var(--border-color); border-radius: 10px; background: var(--bg-primary); color: var(--text-primary);">
								<button onclick="searchGeology()" class="control-btn" style="background: var(--accent-gradient); margin-top: 10px;">
									<i class="fas fa-search"></i> Search Geology
								</button>
							</div>
						</div>
					`,
					resources: ['USGS', 'Geological Survey', 'NASA Earth', 'Volcano Discovery']
				},
				'architecture': {
					title: '🏛️ Architecture Expert',
					description: 'Architectural design and planning',
					content: `
						<div class="feature-content">
							<h4>🏛️ Architectural Studio</h4>
							<p>Desain arsitektur dan perencanaan bangunan:</p>
							
							<div class="entertainment-grid">
								<div class="entertainment-card" onclick="openArchitectureTool('design')">
									<div class="entertainment-icon">📐</div>
									<h3>Design Tools</h3>
									<p>Alat desain arsitektur</p>
								</div>
								<div class="entertainment-card" onclick="openArchitectureTool('structures')">
									<div class="entertainment-icon">🏗️</div>
									<h3>Structures</h3>
									<p>Analisis struktur</p>
								</div>
								<div class="entertainment-card" onclick="openArchitectureTool('materials')">
									<div class="entertainment-icon">🧱</div>
									<h3>Materials</h3>
									<p>Material bangunan</p>
								</div>
								<div class="entertainment-card" onclick="openArchitectureTool('history')">
									<div class="entertainment-icon">🏛️</div>
									<h3>Arch History</h3>
									<p>Sejarah arsitektur</p>
								</div>
							</div>
							
							<div style="margin-top: 20px;">
								<h4>Architectural Styles</h4>
								<div class="feature-tabs">
									<div class="feature-tab active" onclick="switchArchitectureTab('classical')">Classical</div>
									<div class="feature-tab" onclick="switchArchitectureTab('modern')">Modern</div>
									<div class="feature-tab" onclick="switchArchitectureTab('sustainable')">Sustainable</div>
								</div>
								
								<div id="architectureContent" style="margin-top: 15px;">
									<p>Pilih periode arsitektur untuk mengeksplorasi gaya dan karakteristik.</p>
								</div>
							</div>
							
							<div style="margin-top: 20px;">
								<button onclick="open3DViewer()" class="control-btn" style="background: var(--accent-gradient); width: 100%;">
									<i class="fas fa-cube"></i> Open 3D Building Viewer
								</button>
							</div>
						</div>
					`,
					resources: ['ArchDaily', 'Dezeen', 'Building Materials Database', 'CAD Tools']
				},
				'education': {
					title: '🎓 Education Expert',
					description: 'Educational resources and learning strategies',
					content: `
						<div class="feature-content">
							<h4>🎓 Learning Center</h4>
							<p>Sumber daya pendidikan dan strategi pembelajaran:</p>
							
							<div class="entertainment-grid">
								<div class="entertainment-card" onclick="openEducationTool('courses')">
									<div class="entertainment-icon">📚</div>
									<h3>Online Courses</h3>
									<p>Kursus online</p>
								</div>
								<div class="entertainment-card" onclick="openEducationTool('tutoring')">
									<div class="entertainment-icon">👨‍🏫</div>
									<h3>Tutoring</h3>
									<p>Bimbingan belajar</p>
								</div>
								<div class="entertainment-card" onclick="openEducationTool('resources')">
									<div class="entertainment-icon">📖</div>
									<h3>Learning Resources</h3>
									<p>Sumber belajar</p>
								</div>
								<div class="entertainment-card" onclick="openEducationTool('assessment')">
									<div class="entertainment-icon">📊</div>
									<h3>Assessment</h3>
									<p>Penilaian belajar</p>
								</div>
							</div>
							
							<div style="margin-top: 20px;">
								<h4>Study Planner</h4>
								<div style="background: var(--bg-secondary); padding: 15px; border-radius: 10px;">
									<input type="text" id="studyGoal" placeholder="Tujuan belajar..." 
										   style="width: 100%; padding: 10px; border: 2px solid var(--border-color); border-radius: 10px; background: var(--bg-primary); color: var(--text-primary); margin-bottom: 10px;">
									<input type="number" id="studyHours" placeholder="Jam per minggu" min="1" max="40"
										   style="width: 100%; padding: 10px; border: 2px solid var(--border-color); border-radius: 10px; background: var(--bg-primary); color: var(--text-primary);">
									<button onclick="createStudyPlan()" class="control-btn" style="background: var(--accent-gradient); width: 100%; margin-top: 10px;">
										<i class="fas fa-calendar-plus"></i> Create Study Plan
									</button>
								</div>
							</div>
							
							<div id="educationResources" style="margin-top: 20px;"></div>
						</div>
					`,
					resources: ['Khan Academy', 'Coursera', 'edX', 'OpenStax']
				},
				'cia': {
					title: '🕵️ CIA Expert',
					description: 'Intelligence analysis and security protocols',
					content: `
						<div class="feature-content">
							<h4>🕵️ Intelligence Operations</h4>
							<p style="color: var(--warning);">⚠️ Simulasi untuk tujuan edukasi dan training</p>
							
							<div class="entertainment-grid">
								<div class="entertainment-card" onclick="runCIAOperation('analysis')">
									<div class="entertainment-icon">📊</div>
									<h3>Intelligence Analysis</h3>
									<p>Analisis intelijen</p>
								</div>
								<div class="entertainment-card" onclick="runCIAOperation('surveillance')">
									<div class="entertainment-icon">📡</div>
									<h3>Surveillance</h3>
									<p>Teknik pengawasan</p>
								</div>
								<div class="entertainment-card" onclick="runCIAOperation('cryptography')">
									<div class="entertainment-icon">🔐</div>
									<h3>Cryptography</h3>
									<p>Penyandian</p>
								</div>
								<div class="entertainment-card" onclick="runCIAOperation('risk')">
									<div class="entertainment-icon">⚠️</div>
									<h3>Risk Assessment</h3>
									<p>Penilaian risiko</p>
								</div>
							</div>
							
							<div class="wiki-result" style="margin-top: 20px;">
								<h4>Intelligence Protocols</h4>
								<div class="wiki-extract">
									<ul>
										<li><strong>Classification Levels:</strong> Confidential, Secret, Top Secret</li>
										<li><strong>Intelligence Cycle:</strong> Planning, Collection, Processing, Analysis, Dissemination</li>
										<li><strong>Tradecraft:</strong> Surveillance, Counterintelligence, Covert Operations</li>
										<li><strong>Security Clearance:</strong> Background checks, Need-to-know principle</li>
									</ul>
								</div>
							</div>
							
							<div style="margin-top: 20px;">
								<button onclick="generateIntelligenceReport()" class="control-btn" style="background: var(--accent-gradient); width: 100%;">
									<i class="fas fa-file-alt"></i> Generate Intelligence Report
								</button>
							</div>
						</div>
					`,
					resources: ['Intelligence Community', 'Security Protocols', 'Risk Assessment', 'Counterterrorism']
				}
			};
			
			const data = expertData[expert] || {
				title: `🧠 ${expert.charAt(0).toUpperCase() + expert.slice(1)} Expert`,
				description: 'Sistem ahli khusus siap membantu',
				content: `
					<div class="feature-content">
						<h4>${expert.charAt(0).toUpperCase() + expert.slice(1)} Expert System</h4>
						<p>Modul ${expert} diaktifkan. Sistem siap memberikan bantuan khusus di bidang ini.</p>
						<div class="wiki-actions">
							<button class="wiki-action-btn" onclick="startExpertSession('${expert}')">
								<i class="fas fa-play"></i> Start Session
							</button>
							<button class="wiki-action-btn" onclick="loadExpertResources('${expert}')">
								<i class="fas fa-book"></i> Resources
							</button>
						</div>
					</div>
				`,
				resources: ['General Knowledge Base', 'Research Databases', 'Professional Tools']
			};
			
			expertContent.innerHTML = `
				<h3>${data.title}</h3>
				<p>${data.description}</p>
				${data.content}
				
				<div class="wiki-result" style="margin-top: 20px;">
					<h4>📚 Recommended Resources</h4>
					<div class="wiki-actions">
						${data.resources.map(resource => `
							<button class="wiki-action-btn" onclick="searchResource('${resource}')">
								${resource}
							</button>
						`).join('')}
					</div>
				</div>
			`;
			
			showNotification(`🧠 Mengaktifkan ${data.title}`);
		}

		// ===== EXPERT TOOL FUNCTIONS =====

		function startExpertSession(expert) {
			showNotification(`🧠 Memulai sesi dengan ${expert} expert...`);
			// Implementation would go here
		}

		function loadExpertResources(expert) {
			showNotification(`📚 Memuat sumber daya untuk ${expert}...`);
			// Implementation would go here
		}

		function searchResource(resource) {
			showNotification(`🔍 Mencari: ${resource}`);
			// Implementation would go here
		}

		// Library Expert Functions
		function searchLibrary(category) {
			showNotification(`📚 Mencari buku ${category}...`);
			document.getElementById('librarySearch').value = category;
			performLibrarySearch();
		}

		function performLibrarySearch() {
			const query = document.getElementById('librarySearch').value;
			if (!query) {
				showNotification('❌ Masukkan kata kunci pencarian', 'error');
				return;
			}
			
			const results = [
				{ title: `Advanced ${query} Programming`, author: "John Doe", year: 2023, pages: 450 },
				{ title: `${query} Fundamentals`, author: "Jane Smith", year: 2022, pages: 320 },
				{ title: `Mastering ${query}`, author: "Bob Johnson", year: 2024, pages: 510 }
			];
			
			displayLibraryResults(results);
		}

		function displayLibraryResults(books) {
			const container = document.getElementById('libraryResults');
			container.innerHTML = books.map(book => `
				<div class="search-result">
					<h4>📖 ${book.title}</h4>
					<p><strong>Author:</strong> ${book.author}</p>
					<p><strong>Year:</strong> ${book.year} | <strong>Pages:</strong> ${book.pages}</p>
					<div class="wiki-actions">
						<button class="wiki-action-btn" onclick="showNotification('📖 Opening book: ${book.title}')">
							<i class="fas fa-book-open"></i> Read
						</button>
						<button class="wiki-action-btn" onclick="showNotification('📥 Downloading: ${book.title}')">
							<i class="fas fa-download"></i> Download
						</button>
					</div>
				</div>
			`).join('');
		}

		// Journal Expert Functions
		function switchJournalTab(tab) {
			showNotification(`📑 Switching to ${tab} tab`);
			// Implementation for journal tabs
		}

		function searchJournals() {
			const query = document.getElementById('journalQuery').value;
			if (!query) {
				showNotification('❌ Masukkan kata kunci jurnal', 'error');
				return;
			}
			
			showNotification(`🔍 Searching journals for: ${query}`);
		}

		function quickJournalSearch(topic) {
			document.getElementById('journalQuery').value = topic;
			searchJournals();
		}

		// Hacker Expert Functions
		function runSecurityScan(type) {
			const scans = {
				'vulnerability': 'Memindai kerentanan sistem...',
				'network': 'Analisis jaringan...',
				'password': 'Menganalisis kekuatan password...',
				'social': 'Evaluasi kerentanan social engineering...'
			};
			
			showNotification(`🔍 ${scans[type]}`);
			
			setTimeout(() => {
				const results = {
					'vulnerability': '✅ Sistem relatif aman. 2 minor issues ditemukan.',
					'network': '✅ Jaringan stabil. Tidak ada ancaman terdeteksi.',
					'password': '⚠️ Beberapa password lemah terdeteksi.',
					'social': '✅ Awareness security cukup baik.'
				};
				
				document.getElementById('hackerResults').innerHTML = `
					<div class="wiki-result">
						<h4>Scan Results: ${type}</h4>
						<p>${results[type]}</p>
					</div>
				`;
			}, 2000);
		}

		function openTool(tool) {
			showNotification(`🛠️ Opening ${tool} tool...`);
		}

		// Science Expert Functions
		function openScienceTool(tool) {
			const tools = {
				'periodic': 'Tabel Periodik Unsur',
				'calculator': 'Kalkulator Ilmiah',
				'converter': 'Konverter Satuan',
				'simulations': 'Simulasi Kimia'
			};
			
			showNotification(`🔬 Membuka: ${tools[tool]}`);
		}

		function searchChemical() {
			const query = document.getElementById('chemicalSearch').value;
			if (!query) {
				showNotification('❌ Masukkan nama senyawa kimia', 'error');
				return;
			}
			
			showNotification(`🧪 Mencari: ${query}`);
		}

		// Biology Expert Functions
		function openBiologyTool(tool) {
			showNotification(`🧬 Membuka alat biologi: ${tool}`);
		}

		function searchBiology(topic) {
			showNotification(`🔍 Mencari topik biologi: ${topic}`);
		}

		// History Expert Functions
		function exploreHistory(period) {
			const periods = {
				'ancient': 'Peradaban Kuno',
				'medieval': 'Abad Pertengahan',
				'modern': 'Sejarah Modern',
				'indonesia': 'Sejarah Indonesia'
			};
			
			showNotification(`📜 Menjelajahi: ${periods[period]}`);
		}

		function searchHistory() {
			const query = document.getElementById('historySearch').value;
			if (!query) {
				showNotification('❌ Masukkan pencarian sejarah', 'error');
				return;
			}
			
			showNotification(`🔍 Mencari sejarah: ${query}`);
		}

		// Language Expert Functions
		function translateText() {
			const text = document.getElementById('translateText').value;
			const sourceLang = document.getElementById('sourceLang').value;
			const targetLang = document.getElementById('targetLang').value;
			
			if (!text) {
				showNotification('❌ Masukkan teks untuk diterjemahkan', 'error');
				return;
			}
			
			// Simulate translation
			const translations = {
				'id-en': 'This is a translated text from Indonesian to English',
				'en-id': 'Ini adalah teks yang diterjemahkan dari Inggris ke Indonesia',
				'auto-id': 'Teks terdeteksi dan diterjemahkan ke Indonesia'
			};
			
			const key = sourceLang === 'auto' ? 'auto-id' : `${sourceLang}-${targetLang}`;
			const result = translations[key] || 'Translation result will appear here';
			
			document.getElementById('translationResult').innerHTML = `
				<div class="wiki-result">
					<h4>🌍 Translation Result</h4>
					<p><strong>Original:</strong> ${text}</p>
					<p><strong>Translated:</strong> ${result}</p>
				</div>
			`;
			
			showNotification('✅ Teks berhasil diterjemahkan');
		}

		function startLanguageLesson(type) {
			showNotification(`📚 Memulai pelajaran bahasa: ${type}`);
		}

		// Religion Expert Functions
		function exploreReligion(religion) {
			showNotification(`🕌 Menjelajahi agama: ${religion}`);
		}

		function openReligiousText(text) {
			const texts = {
				'quran': 'Al-Quran',
				'bible': 'Bible',
				'vedas': 'Vedas'
			};
			
			showNotification(`📖 Membuka: ${texts[text]}`);
		}

		function searchReligion() {
			const query = document.getElementById('religionSearch').value;
			if (!query) {
				showNotification('❌ Masukkan pencarian agama', 'error');
				return;
			}
			
			showNotification(`🔍 Mencari: ${query}`);
		}

		// Culture Expert Functions
		function exploreCulture(region) {
			showNotification(`🎎 Menjelajahi budaya: ${region}`);
		}

		function switchCultureTab(tab) {
			showNotification(`🌍 Beralih ke tab: ${tab}`);
		}

		// Security Expert Functions
		function runSecurityCheck(type) {
			showNotification(`🔍 Menjalankan pemeriksaan keamanan: ${type}`);
		}

		function generateSecurityReport() {
			showNotification('📋 Membuat laporan keamanan...');
			
			setTimeout(() => {
				document.getElementById('expertContent').innerHTML += `
					<div class="wiki-result" style="margin-top: 20px;">
						<h4>📋 Security Report Generated</h4>
						<div class="wiki-extract">
							<p><strong>Overall Security Score:</strong> 85/100</p>
							<p><strong>Vulnerabilities Found:</strong> 3 (Low Risk)</p>
							<p><strong>Recommendations:</strong></p>
							<ul>
								<li>Update encryption protocols</li>
								<li>Implement multi-factor authentication</li>
								<li>Regular security training for staff</li>
							</ul>
						</div>
					</div>
				`;
			}, 1500);
		}

		// Writing Expert Functions
		function openWritingTool(tool) {
			showNotification(`✍️ Membuka alat menulis: ${tool}`);
		}

		function analyzeWriting() {
			const text = document.getElementById('writingInput').value;
			if (!text) {
				showNotification('❌ Masukkan teks untuk dianalisis', 'error');
				return;
			}
			
			const analysis = {
				wordCount: text.split(' ').length,
				characterCount: text.length,
				readingLevel: 'Intermediate',
				suggestions: ['Consider varying sentence structure', 'Use more active voice']
			};
			
			document.getElementById('writingAnalysis').innerHTML = `
				<div class="wiki-result">
					<h4>📊 Writing Analysis</h4>
					<p><strong>Word Count:</strong> ${analysis.wordCount}</p>
					<p><strong>Character Count:</strong> ${analysis.characterCount}</p>
					<p><strong>Reading Level:</strong> ${analysis.readingLevel}</p>
					<p><strong>Suggestions:</strong> ${analysis.suggestions.join(', ')}</p>
				</div>
			`;
			
			showNotification('✅ Analisis tulisan selesai');
		}

		function improveWriting() {
			showNotification('✨ Memperbaiki kualitas tulisan...');
		}

		function summarizeText() {
			showNotification('📄 Membuat ringkasan teks...');
		}

		// Archive Expert Functions
		function openArchiveTool(tool) {
			showNotification(`🗃️ Membuka alat arsip: ${tool}`);
		}

		function searchArchiveData() {
			const query = document.getElementById('archiveSearch').value;
			if (!query) {
				showNotification('❌ Masukkan pencarian arsip', 'error');
				return;
			}
			
			showNotification(`🔍 Mencari arsip: ${query}`);
		}

		// Wayback Expert Functions
		function searchWayback() {
			const url = document.getElementById('waybackUrl').value;
			const date = document.getElementById('waybackDate').value;
			
			if (!url) {
				showNotification('❌ Masukkan URL website', 'error');
				return;
			}
			
			showNotification(`🕰️ Mencari arsip: ${url}${date ? ' pada ' + date : ''}`);
		}

		function quickWaybackSearch(site) {
			document.getElementById('waybackUrl').value = site;
			searchWayback();
		}

		// Music Expert Functions
		function openMusicTool(tool) {
			showNotification(`🎵 Membuka alat musik: ${tool}`);
		}

		function searchMusicTheory() {
			const query = document.getElementById('musicTheorySearch').value;
			if (!query) {
				showNotification('❌ Masukkan pencarian teori musik', 'error');
				return;
			}
			
			showNotification(`🎼 Mencari: ${query}`);
		}

		// Psychology Expert Functions
		function openPsychologyTool(tool) {
			showNotification(`🧠 Membuka alat psikologi: ${tool}`);
		}

		function startPsychologyTest(test) {
			showNotification(`📊 Memulai test psikologi: ${test}`);
		}

		// Physics Expert Functions
		function openPhysicsTool(tool) {
			showNotification(`⚛️ Membuka alat fisika: ${tool}`);
		}

		function calculatePhysics() {
			const input1 = parseFloat(document.getElementById('physicsInput1').value);
			const input2 = parseFloat(document.getElementById('physicsInput2').value);
			const formula = document.getElementById('physicsFormula').value;
			
			if (isNaN(input1) || isNaN(input2)) {
				showNotification('❌ Masukkan nilai yang valid', 'error');
				return;
			}
			
			let result;
			switch(formula) {
				case 'velocity':
					result = input1 / input2; // v = d/t
					break;
				case 'force':
					result = input1 * input2; // F = m*a
					break;
				case 'energy':
					result = 0.5 * input1 * Math.pow(input2, 2); // KE = ½mv²
					break;
				case 'power':
					result = input1 / input2; // P = W/t
					break;
				default:
					result = 0;
			}
			
			document.getElementById('physicsResult').innerHTML = `
				<div class="wiki-result">
					<h4>📐 Physics Calculation</h4>
					<p><strong>Result:</strong> ${result.toFixed(2)}</p>
					<p><strong>Formula:</strong> ${document.getElementById('physicsFormula').options[document.getElementById('physicsFormula').selectedIndex].text}</p>
				</div>
			`;
			
			showNotification('✅ Perhitungan fisika selesai');
		}

		// Geology Expert Functions
		function openGeologyTool(tool) {
			showNotification(`🌋 Membuka alat geologi: ${tool}`);
		}

		function loadEarthquakeData() {
			showNotification('🌍 Memuat data gempa terkini...');
			
			setTimeout(() => {
				document.getElementById('earthquakeData').innerHTML = `
					<p><strong>Latest Earthquakes:</strong></p>
					<ul>
						<li>Magnitude 4.5 - Bali, Indonesia (5 minutes ago)</li>
						<li>Magnitude 3.2 - Java, Indonesia (1 hour ago)</li>
						<li>Magnitude 5.1 - Sumatra, Indonesia (3 hours ago)</li>
					</ul>
					<p><em>Data dari USGS</em></p>
				`;
			}, 1000);
		}

		function searchGeology() {
			const query = document.getElementById('geologySearch').value;
			if (!query) {
				showNotification('❌ Masukkan pencarian geologi', 'error');
				return;
			}
			
			showNotification(`🌋 Mencari: ${query}`);
		}

		// Architecture Expert Functions
		function openArchitectureTool(tool) {
			showNotification(`🏛️ Membuka alat arsitektur: ${tool}`);
		}

		function switchArchitectureTab(tab) {
			showNotification(`📐 Beralih ke gaya arsitektur: ${tab}`);
		}

		function open3DViewer() {
			showNotification('🏗️ Membuka 3D Building Viewer...');
		}

		// Education Expert Functions
		function openEducationTool(tool) {
			showNotification(`🎓 Membuka alat pendidikan: ${tool}`);
		}

		function createStudyPlan() {
			const goal = document.getElementById('studyGoal').value;
			const hours = document.getElementById('studyHours').value;
			
			if (!goal || !hours) {
				showNotification('❌ Masukkan tujuan dan jam belajar', 'error');
				return;
			}
			
			showNotification(`📚 Membuat rencana belajar: ${goal} (${hours} jam/minggu)`);
		}

		// CIA Expert Functions
		function runCIAOperation(operation) {
			showNotification(`🕵️ Menjalankan operasi: ${operation}`);
		}

		function generateIntelligenceReport() {
			showNotification('📋 Membuat laporan intelijen...');
			
			setTimeout(() => {
				document.getElementById('expertContent').innerHTML += `
					<div class="wiki-result" style="margin-top: 20px;">
						<h4>📋 Intelligence Report</h4>
						<div class="wiki-extract">
							<p><strong>Classification:</strong> TOP SECRET</p>
							<p><strong>Subject:</strong> Regional Security Assessment</p>
							<p><strong>Key Findings:</strong></p>
							<ul>
								<li>Stable political conditions</li>
								<li>Moderate economic growth</li>
								<li>Low terrorism threat level</li>
							</ul>
							<p><strong>Recommendations:</strong> Continue monitoring, no immediate action required.</p>
						</div>
					</div>
				`;
			}, 2000);
		}
               // ===== AUTHENTICATION =====

                function login() {
                    const username = document.getElementById('username').value;
                    const password = document.getElementById('password').value;
                    
                    if (!username || !password) {
                        showNotification('❌ Masukkan username dan password', 'error');
                        return;
                    }
                    
                    // Simple authentication (in real app, this would be server-side)
                    if (password === 'password123') {
                        currentUser = username;
                        token = 'demo-token-' + Date.now();
                        
                        document.getElementById('loginScreen').style.display = 'none';
                        document.getElementById('appScreen').style.display = 'block';
                        document.getElementById('usernameDisplay').textContent = username;
                        
                        showNotification('🚀 Berhasil login ke KANDA AI v3.0!');
                        playSound('success');
                        
                        // Initialize main app
                        initializeKandaAI();
                    } else {
                        showNotification('❌ Password salah. Gunakan "password123" untuk demo', 'error');
                        playSound('error');
                    }
                }

                function logout() {
                    if (confirm('Yakin ingin logout dari KANDA AI?')) {
                        currentUser = null;
                        token = null;
                        
                        document.getElementById('appScreen').style.display = 'none';
                        document.getElementById('loginScreen').style.display = 'block';
                        
                        // Reset form
                        document.getElementById('password').value = 'password123';
                        
                        showNotification('👋 Sampai jumpa! Berhasil logout.');
                        playSound('success');
                    }
                }

                // ===== PROACTIVE CHAT =====

                function setupProactiveChat() {
                    // Show proactive messages based on time and user activity
                    setTimeout(() => {
                        if (conversationHistory.length === 1) { // Only the initial message
                            const messages = [
                                "Hai! Saya memperhatikan Anda baru memulai. Ada yang spesifik yang ingin Anda eksplorasi? 🤔",
                                "Ingin mencoba fitur voice? Klik tombol mikrofon untuk berbicara dengan saya! 🎤",
                                "Ada 20+ ahli spesialis yang siap membantu di tab 'AI EXPERTS'. Mau coba yang mana? 🧠"
                            ];
                            
                            const randomMessage = messages[Math.floor(Math.random() * messages.length)];
                            addMessage(randomMessage, 'bot');
                        }
                    }, 30000); // After 30 seconds
                }

                // ===== INITIALIZATION =====

                // Initialize when the page loads
                window.addEventListener('load', function() {
                    console.log('🚀 KANDA AI v3.0 Loading...');
                    
                    // Initialize intro screen
                    createStars();
                    createParticles();
                    createSphereElements();
                    setupSphereInteractions();
                    setupStartButton();
                    setupBackButton();
                    
                    // Apply saved theme
                    const savedTheme = localStorage.getItem('kanda_theme') || 'auto';
                    setTheme(savedTheme);
                    
                    console.log('✅ KANDA AI v3.0 Ready!');
                });

            </script>