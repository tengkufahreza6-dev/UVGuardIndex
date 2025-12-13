// ==================== UV GUARD Index - COMPLETE VERSION (OPTIMIZED & REALISTIC) ====================//
class UVGuardIndex {
    constructor() {
        this.videoController = new VideoTutorialController();
        this.masterVolume = 3.0; // Atur 0.0 – 1.0 (0.7 keras, 1.0 sangat keras)
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        this.dataHistory = [];
        this.currentData = null;
        this.monitoringInterval = null;
        this.charts = {};
        this.currentLocation = null;
        this.lastUpdateTime = null;
        this.isDemoMode = false;
        this.regressionModel = null;
        this.timezone = 'Asia/Jakarta'; // Default timezone
        this.timeUpdateInterval = null;
        this.isInitialLoad = true;
        this.shouldAutoFetch = false;
        this.hardResetAllTimers();
        window.addEventListener('beforeunload', () => {
        console.log('🔄 Cleaning up timers before page unload...');
        this.stopTimeUpdates();
        // HARD FIX untuk timezone
const originalStartTimeUpdates = this.startTimeUpdates;
this.startTimeUpdates = function() {
    console.log(`🕐 startTimeUpdates called, current timezone: ${this.timezone}`);
    
    // Force Bali ke WITA
    if (this.currentLocation && 
        (this.currentLocation.province?.toLowerCase().includes('bali') ||
         this.currentLocation.name?.toLowerCase().includes('bali') ||
         this.currentLocation.name?.toLowerCase().includes('denpasar'))) {
        
        console.log("🎯 HARD FIX: Forcing Bali to Asia/Makassar");
        this.timezone = "Asia/Makassar";
        
        // Update location juga
        if (this.currentLocation) {
            this.currentLocation.timezone = "Asia/Makassar";
        }
    }
    
    // Panggil original
    return originalStartTimeUpdates.call(this);
};
    });
        // API Configuration dengan failover
        this.API_CONFIG = {
            // OpenWeatherMap (3 key untuk failover)
            openweather: {
                keys: [
                    "7c147cbc7723582a81895d13c584fb31",
                    "c5e0d6bf87b5b5260a35352e699409a6",
                    "8330042657054aafedcfd960d14eda1d"
                ],
                currentKeyIndex: 0,
                baseUrl: "https://api.openweathermap.org/data/2.5"
            },
            
            // WeatherAPI.com
            weatherapi: {
                key: "d92bc5798de74504a8a20859250412",
                baseUrl: "https://api.weatherapi.com/v1"
            },
            
            // Visual Crossing
            visualcrossing: {
                key: "KD56SWLAEN7EFXT3LM7LUTS6U",
                baseUrl: "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline"
            },
            
            // Settings
            useMultipleSources: true,
            enableFallback: true,
            timeout: 10000,
            maxRetries: 3
        };

        // Data provinsi Indonesia - HARUS BENAR 100%
this.INDONESIA_PROVINCES = [
    // === WIB (GMT+7) ===
    { id: 37, name: "Aceh", capital: "Banda Aceh", lat: 5.5483, lon: 95.3238, timezone: "Asia/Jakarta" },
    { id: 5, name: "Banten", capital: "Serang", lat: -6.1200, lon: 106.1503, timezone: "Asia/Jakarta" },
    { id: 14, name: "Bengkulu", capital: "Bengkulu", lat: -3.7956, lon: 102.2592, timezone: "Asia/Jakarta" },
    { id: 6, name: "DI Yogyakarta", capital: "Yogyakarta", lat: -7.7956, lon: 110.3695, timezone: "Asia/Jakarta" },
    { id: 1, name: "DKI Jakarta", capital: "Jakarta", lat: -6.2088, lon: 106.8456, timezone: "Asia/Jakarta" },
    { id: 12, name: "Jambi", capital: "Jambi", lat: -1.5900, lon: 103.6100, timezone: "Asia/Jakarta" },
    { id: 2, name: "Jawa Barat", capital: "Bandung", lat: -6.9175, lon: 107.6191, timezone: "Asia/Jakarta" },
    { id: 4, name: "Jawa Tengah", capital: "Semarang", lat: -6.9667, lon: 110.4167, timezone: "Asia/Jakarta" },
    { id: 3, name: "Jawa Timur", capital: "Surabaya", lat: -7.2575, lon: 112.7521, timezone: "Asia/Jakarta" },
    { id: 16, name: "Kalimantan Barat", capital: "Pontianak", lat: -0.0226, lon: 109.3307, timezone: "Asia/Jakarta" },
    { id: 17, name: "Kalimantan Tengah", capital: "Palangkaraya", lat: -2.2100, lon: 113.9200, timezone: "Asia/Jakarta" },
    { id: 15, name: "Lampung", capital: "Bandar Lampung", lat: -5.4500, lon: 105.2667, timezone: "Asia/Jakarta" },
    { id: 10, name: "Riau", capital: "Pekanbaru", lat: 0.5333, lon: 101.4500, timezone: "Asia/Jakarta" },
    { id: 9, name: "Sumatera Barat", capital: "Padang", lat: -0.9492, lon: 100.3543, timezone: "Asia/Jakarta" },
    { id: 13, name: "Sumatera Selatan", capital: "Palembang", lat: -2.9900, lon: 104.7600, timezone: "Asia/Jakarta" },
    { id: 8, name: "Sumatera Utara", capital: "Medan", lat: 3.5952, lon: 98.6722, timezone: "Asia/Jakarta" },
    { id: 38, name: "Kepulauan Bangka Belitung", capital: "Pangkal Pinang", lat: -2.1333, lon: 106.1333, timezone: "Asia/Jakarta" },
    { id: 11, name: "Kepulauan Riau", capital: "Tanjung Pinang", lat: 0.9188, lon: 104.4554, timezone: "Asia/Jakarta" },
    
    // === WITA (GMT+8) ===
    { id: 7, name: "Bali", capital: "Denpasar", lat: -8.6500, lon: 115.2167, timezone: "Asia/Makassar" }, // WITA
    { id: 25, name: "Gorontalo", capital: "Gorontalo", lat: 0.5412, lon: 123.0595, timezone: "Asia/Makassar" }, // WITA
    { id: 18, name: "Kalimantan Selatan", capital: "Banjarmasin", lat: -3.3199, lon: 114.5908, timezone: "Asia/Makassar" }, // WITA
    { id: 19, name: "Kalimantan Timur", capital: "Samarinda", lat: -0.5022, lon: 117.1536, timezone: "Asia/Makassar" }, // WITA
    { id: 20, name: "Kalimantan Utara", capital: "Tanjung Selor", lat: 2.8375, lon: 117.3653, timezone: "Asia/Makassar" }, // WITA
    { id: 36, name: "Nusa Tenggara Barat", capital: "Mataram", lat: -8.5833, lon: 116.1167, timezone: "Asia/Makassar" }, // WITA
    { id: 35, name: "Nusa Tenggara Timur", capital: "Kupang", lat: -10.1772, lon: 123.6070, timezone: "Asia/Makassar" }, // WITA
    { id: 26, name: "Sulawesi Barat", capital: "Mamuju", lat: -2.6786, lon: 118.8933, timezone: "Asia/Makassar" }, // WITA
    { id: 23, name: "Sulawesi Selatan", capital: "Makassar", lat: -5.1477, lon: 119.4327, timezone: "Asia/Makassar" }, // WITA
    { id: 22, name: "Sulawesi Tengah", capital: "Palu", lat: -0.8950, lon: 119.8597, timezone: "Asia/Makassar" }, // WITA
    { id: 24, name: "Sulawesi Tenggara", capital: "Kendari", lat: -3.9675, lon: 122.5947, timezone: "Asia/Makassar" }, // WITA
    { id: 21, name: "Sulawesi Utara", capital: "Manado", lat: 1.4931, lon: 124.8413, timezone: "Asia/Makassar" }, // WITA
    
    // === WIT (GMT+9) ===
    { id: 27, name: "Maluku", capital: "Ambon", lat: -3.6954, lon: 128.1814, timezone: "Asia/Jayapura" }, // WIT
    { id: 28, name: "Maluku Utara", capital: "Ternate", lat: 0.7833, lon: 127.3667, timezone: "Asia/Jayapura" }, // WIT
    { id: 29, name: "Papua", capital: "Jayapura", lat: -2.5333, lon: 140.7167, timezone: "Asia/Jayapura" }, // WIT
    { id: 34, name: "Papua Barat Daya", capital: "Sorong", lat: -0.8667, lon: 131.2500, timezone: "Asia/Jayapura" }, // WIT
    { id: 30, name: "Papua Barat", capital: "Manokwari", lat: -0.8667, lon: 134.0833, timezone: "Asia/Jayapura" }, // WIT
    { id: 33, name: "Papua Pegunungan", capital: "Wamena", lat: -4.0956, lon: 138.9550, timezone: "Asia/Jayapura" }, // WIT
    { id: 31, name: "Papua Selatan", capital: "Merauke", lat: -8.4932, lon: 140.4018, timezone: "Asia/Jayapura" }, // WIT
    { id: 32, name: "Papua Tengah", capital: "Nabire", lat: -3.3667, lon: 135.4833, timezone: "Asia/Jayapura" } // WIT
];

        // VERIFIKASI DATA PROVINSI
console.log("=".repeat(60));
console.log("🇮🇩 VERIFIKASI DATA PROVINSI INDONESIA");
console.log("=".repeat(60));

this.INDONESIA_PROVINCES.forEach(prov => {
    let zona = '';
    if (prov.timezone === 'Asia/Jakarta') zona = 'WIB';
    else if (prov.timezone === 'Asia/Makassar') zona = 'WITA';
    else if (prov.timezone === 'Asia/Jayapura') zona = 'WIT';
    
    console.log(`${prov.name.padEnd(25)} | ${zona.padEnd(4)} | ${prov.timezone}`);
});

console.log("=".repeat(60));
console.log(`Total: ${this.INDONESIA_PROVINCES.length} provinsi`);
console.log(`WIB: ${this.INDONESIA_PROVINCES.filter(p => p.timezone === 'Asia/Jakarta').length}`);
console.log(`WITA: ${this.INDONESIA_PROVINCES.filter(p => p.timezone === 'Asia/Makassar').length}`);
console.log(`WIT: ${this.INDONESIA_PROVINCES.filter(p => p.timezone === 'Asia/Jayapura').length}`);
console.log("=".repeat(60));
        // Cache untuk hasil geocoding
        this.geoCache = new Map();
        
        // UV Thresholds yang lebih akurat
        this.UV_THRESHOLDS = {
            low: { min: 0, max: 2.9, level: "Rendah", color: "#4CAF50", description: "Bahaya rendah. Dapat berada di luar dengan aman." },
            moderate: { min: 3, max: 5.9, level: "Sedang", color: "#FFC107", description: "Bahaya sedang. Gunakan perlindungan dasar." },
            high: { min: 6, max: 7.9, level: "Tinggi", color: "#FF9800", description: "Bahaya tinggi. Perlindungan ekstra diperlukan." },
            veryHigh: { min: 8, max: 10.9, level: "Sangat Tinggi", color: "#F44336", description: "Bahaya sangat tinggi. Hindari matahari tengah hari." },
            extreme: { min: 11, max: 20, level: "Ekstrem", color: "#9C27B0", description: "Bahaya ekstrem. Hindari semua paparan matahari." }
        };

        // Model UV realistik berdasarkan waktu dan lokasi - DIPERBAIKI
        this.UV_MODEL = {
            // Faktor koreksi regional
            regionalCorrection: {
                'Indonesia': 0.8,
                'Singapore': 0.85,
                'Malaysia': 0.85,
                'Thailand': 0.9,
                'Vietnam': 0.88,
                'Philippines': 0.87,
                'Default': 0.85
            }
        };

        // Inisialisasi user guide
        this.initUserGuide();
        
        // Initialize
        this.init();
    }
    
    playTone(freq = 440, duration = 200, volume = 0.2) {
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.frequency.value = freq;
    // volume * masterVolume
    gain.gain.value = volume * this.masterVolume;

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start();

    osc.stop(this.audioCtx.currentTime + duration / 1000);
}

    playUVCategorySound(uv) {
    if (uv <= 2.9) {
        // UV rendah = beep lembut
        this.playTone(300, 180, 0.15);
    } else if (uv <= 5.9) {
        // UV sedang = beep medium
        this.playTone(500, 180, 0.18);
    } else if (uv <= 7.9) {
        // UV tinggi = beep lebih tajam
        this.playTone(700, 200, 0.2);
    } else if (uv <= 10.9) {
        // UV sangat tinggi = 2x beep cepat
        this.playTone(850, 160, 0.22);
        setTimeout(() => this.playTone(850, 160, 0.22), 180);
    } else {
        // UV ekstrem = sirene pendek
        this.playTone(900, 200, 0.24);
        setTimeout(() => this.playTone(1100, 200, 0.24), 220);
    }
}

    checkUVRise() {
    if (this.dataHistory.length < 2) return;

    const prev = this.dataHistory[this.dataHistory.length - 2].uvIndex;
    const curr = this.dataHistory[this.dataHistory.length - 1].uvIndex;

    const diff = curr - prev;

    // WASPADA (0.5 – 0.9)
    if (diff >= 0.5 && diff < 1.0) {
        this.showNotification(
            `Kenaikan UV terdeteksi: +${diff.toFixed(1)} (Waspada)`,
            "warning"
        );
        this.playTone(900, 200, 0.22); // suara peringatan
        return;
    }

    // BAHAYA (1.0+)
    if (diff >= 1.0) {
        this.showNotification(
            `Kenaikan UV besar: +${diff.toFixed(1)} (Bahaya!)`,
            "Danger"
        );
        // suara lebih tajam
        this.playTone(1200, 250, 0.25);
        setTimeout(() => this.playTone(1200, 250, 0.25), 250);
    }
}


    // ==================== USER GUIDE SYSTEM ====================
    initUserGuide() {
        console.log("📚 Initializing user guide system...");
        
        // Buat modal user guide jika belum ada
        if (!document.getElementById('userGuideModal')) {
            const modalHTML = `
                <div id="userGuideModal" class="modal">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h2><i class="fas fa-book"></i> UV Guard Index - Panduan Pengguna</h2>
                           
                        </div>
                        <div class="modal-body">
                            <div class="guide-tabs">
                                <button class="tab-btn active" onclick="app.switchGuideTab('overview')">📋 Overview</button>
                                <button class="tab-btn" onclick="app.switchGuideTab('features')">✨ Fitur</button>
                                <button class="tab-btn" onclick="app.switchGuideTab('api')">🌐 API</button>
                                <button class="tab-btn" onclick="app.switchGuideTab('tips')">💡 Tips</button>
                                <button class="tab-btn" onclick="app.switchGuideTab('video')">🎬 Video Tutorial</button>
                            </div>
                            
                            <div id="guideOverview" class="guide-tab active">
                                <h3><i class="fas fa-sun"></i> Tentang UV Guard Index</h3>
                                <p>UV Guard Index adalah aplikasi monitoring UV Index real-time yang membantu melindungi Anda dari bahaya radiasi ultraviolet.</p>
                                
                                <div class="guide-section">
                                    <h4><i class="fas fa-crosshairs"></i> Cara Kerja</h4>
                                    <ul>
                                        <li><strong>Deteksi Lokasi</strong>: Mendeteksi lokasi Anda secara otomatis via GPS</li>
                                        <li><strong>Multiple API Sources</strong>: Menggunakan 3 sumber data cuaca untuk akurasi maksimal</li>
                                        <li><strong>UV Correction</strong>: Mengoreksi data UV berdasarkan lokasi dan waktu</li>
                                        <li><strong>Analisis Real-time</strong>: Menganalisis trend UV menggunakan regresi linear</li>
                                    </ul>
                                </div>
                                
                                <div class="guide-section">
                                    <h4><i class="fas fa-shield-alt"></i> Tingkat Perlindungan UV</h4>
                                    <div class="uv-levels-guide">
                                        ${Object.entries(this.UV_THRESHOLDS).map(([key, threshold]) => `
                                            <div class="uv-level-item" style="border-left: 4px solid ${threshold.color}">
                                                <strong>${threshold.level}</strong> (UV ${threshold.min}-${threshold.max})
                                                <small>${threshold.description}</small>
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                            </div>
                            
                            <div id="guideFeatures" class="guide-tab">
                                <h3><i class="fas fa-star"></i> Fitur Utama</h3>
                                
                                <div class="feature-grid">
                                    <div class="feature-card">
                                        <div class="feature-icon"><i class="fas fa-map-marker-alt"></i></div>
                                        <h4>Lokasi Cerdas</h4>
                                        <p>Deteksi otomatis, pilih provinsi, atau cari kota global</p>
                                    </div>
                                    <div class="feature-card">
                                        <div class="feature-icon"><i class="fas fa-chart-line"></i></div>
                                        <h4>Chart Real-time</h4>
                                        <p>Grafik UV Index dengan data historis</p>
                                    </div>
                                    <div class="feature-card">
                                        <div class="feature-icon"><i class="fas fa-calculator"></i></div>
                                        <h4>Kalkulator Berjemur</h4>
                                        <p>Hitung durasi berjemur aman berdasarkan tipe kulit</p>
                                    </div>
                                    <div class="feature-card">
                                        <div class="feature-icon"><i class="fas fa-brain"></i></div>
                                        <h4>Analisis Matematis</h4>
                                        <p>Regresi linear dan prediksi trend UV</p>
                                    </div>
                                    <div class="feature-card">
                                        <div class="feature-icon"><i class="fas fa-cloud-download-alt"></i></div>
                                        <h4>Multi-Source Data</h4>
                                        <p>3 sumber API dengan sistem failover</p>
                                    </div>
                                    <div class="feature-card">
                                        <div class="feature-icon"><i class="fas fa-history"></i></div>
                                        <h4>Riwayat Data</h4>
                                        <p>Penyimpanan lokal dengan ekspor CSV</p>
                                    </div>
                                </div>
                            </div>
                            
                            
                            <div id="guideApi" class="guide-tab">
                                <h3><i class="fas fa-plug"></i> Sistem API & Data Sources</h3>
                                
                                <div class="api-grid">
                                    <div class="api-card primary">
                                        <h4><i class="fas fa-cloud"></i> OpenWeatherMap</h4>
                                        <p><strong>Primary Source</strong></p>
                                        <p>3 API keys untuk failover</p>
                                        <p>UV Index + Data Cuaca Lengkap</p>
                                    </div>
                                    <div class="api-card secondary">
                                        <h4><i class="fas fa-cloud-sun"></i> WeatherAPI.com</h4>
                                        <p><strong>Secondary Source</strong></p>
                                        <p>Akurasi tinggi untuk UV</p>
                                        <p>Data real-time</p>
                                    </div>
                                    <div class="api-card tertiary">
                                        <h4><i class="fas fa-chart-bar"></i> Visual Crossing</h4>
                                        <p><strong>Tertiary Source</strong></p>
                                        <p>Data historis dan prediksi</p>
                                        <p>Fallback system</p>
                                    </div>
                                </div>
                                
                                <div class="guide-section">
                                    <h4><i class="fas fa-sync-alt"></i> Alur Kerja Multi-Source</h4>
                                    <ol>
                                        <li>Coba OpenWeatherMap (key 1)</li>
                                        <li>Jika gagal, coba key 2, kemudian key 3</li>
                                        <li>Jika semua gagal, coba WeatherAPI.com</li>
                                        <li>Jika masih gagal, coba Visual Crossing</li>
                                        <li>Jika semua API gagal, gunakan data demo yang realistis</li>
                                        <li>Pilih data terbaik berdasarkan akurasi dan konsistensi</li>
                                    </ol>
                                </div>
                                
                                <div class="guide-section">
                                    <h4><i class="fas fa-database"></i> Cache System</h4>
                                    <ul>
                                        <li><strong>Geocoding Cache</strong>: Simpan hasil pencarian lokasi</li>
                                        <li><strong>Data Cache</strong>: Simpan data cuaca untuk 5 menit</li>
                                        <li><strong>LocalStorage</strong>: Riwayat data dan preferensi</li>
                                    </ul>
                                </div>
                            </div>
                            
                            <div id="guideTips" class="guide-tab">
                                <h3><i class="fas fa-lightbulb"></i> Tips & Best Practices</h3>
                                
                                <div class="tips-grid">
                                    <div class="tip-card">
                                        <div class="tip-icon"><i class="fas fa-search-location"></i></div>
                                        <h4>Pencarian Optimal</h4>
                                        <ul>
                                            <li>Gunakan format: "Kota, Negara"</li>
                                            <li>Untuk Indonesia: "Jakarta" atau "Jakarta, Indonesia"</li>
                                            <li>Koordinat: "latitude, longitude"</li>
                                            <li>Provinsi: Pilih dari dropdown untuk akurasi maksimal</li>
                                        </ul>
                                    </div>
                                    <div class="tip-card">
                                        <div class="tip-icon"><i class="fas fa-user-circle"></i></div>
                                        <h4>Tipe Kulit & SPF</h4>
                                        <ul>
                                            <li>Pilih tipe kulit sesuai kondisi Anda</li>
                                            <li>SPF 30+ untuk aktivitas outdoor</li>
                                            <li>SPF 50+ untuk UV tinggi (>6)</li>
                                            <li>Reapply sunscreen setiap 2 jam</li>
                                        </ul>
                                    </div>
                                    <div class="tip-card">
                                        <div class="tip-icon"><i class="fas fa-chart-bar"></i></div>
                                        <h4>Interpretasi Data</h4>
                                        <ul>
                                            <li>UV 0-2: Aman, perlindungan minimal</li>
                                            <li>UV 3-5: Sedang, gunakan SPF 15+</li>
                                            <li>UV 6-7: Tinggi, hindari matahari 10-14</li>
                                            <li>UV 8+: Sangat tinggi, batasi outdoor</li>
                                            <li>UV 11+: Ekstrem, hindari paparan</li>
                                        </ul>
                                    </div>
                                    <div class="tip-card">
                                        <div class="tip-icon"><i class="fas fa-mobile-alt"></i></div>
                                        <h4>Mobile Optimization</h4>
                                        <ul>
                                            <li>Izinkan akses lokasi untuk deteksi otomatis</li>
                                            <li>Gunakan browser terbaru untuk performa optimal</li>
                                            <li>Refresh data setiap 1 jam untuk akurasi</li>
                                            <li>Simpan lokasi favorit untuk akses cepat</li>
                                        </ul>
                                    </div>
                                </div>
                                
                                <div class="guide-section warning">
                                    <h4><i class="fas fa-exclamation-triangle"></i> Penting!</h4>
                                    <ul>
                                        <li>Data UV adalah perkiraan, selalu gunakan judgment Anda</li>
                                        <li>UV dapat berbeda di area teduh vs terbuka</li>
                                        <li>Refleksi dari air/salju dapat meningkatkan UV</li>
                                        <li>UV tetap ada di hari berawan (80% penetrasi)</li>
                                        <li>Anak-anak lebih sensitif terhadap UV</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button class="btn btn-secondary" onclick="app.closeUserGuide()">Tutup</button>
                            <button class="btn btn-primary" onclick="app.printUserGuide()">
                                <i class="fas fa-print"></i> Cetak Panduan
                            </button>
                        </div>
                    </div>
                </div>
            
                <div id="guideVideo" class="guide-tab">
    <h3><i class="fas fa-video"></i> Video Tutorial Penggunaan</h3>
    
    <!-- VIDEO PLAYER READY -->
    <div class="video-container">
        <div class="video-player" id="videoPlayer">
            <!-- Video element akan diinisialisasi oleh JavaScript -->
            <div class="video-loading" id="videoLoading">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Memuat video tutorial...</p>
            </div>
        </div>
        
        <!-- VIDEO CONTROLS -->
        <div class="video-controls">
            <button class="control-btn" onclick="app.videoPlayPause()" id="playPauseBtn">
                <i class="fas fa-play"></i>
            </button>
            
            <div class="time-display">
                <span id="currentTime">0:00</span> / 
                <span id="durationTime">0:00</span>
            </div>
            
            <div class="progress-container">
                <div class="progress-bar" onclick="app.seekVideo(event)">
                    <div class="progress-fill" id="progressFill"></div>
                </div>
            </div>
            
            <button class="control-btn" onclick="app.toggleMute()" id="muteBtn">
                <i class="fas fa-volume-up"></i>
            </button>
            
            <input type="range" min="0" max="100" value="100" 
                   oninput="app.changeVolume(this.value)" id="volumeSlider">
            
            <button class="control-btn" onclick="app.toggleFullscreen()" id="fullscreenBtn">
                <i class="fas fa-expand"></i>
            </button>
            
            <button class="control-btn" onclick="app.downloadVideo()">
                <i class="fas fa-download"></i>
            </button>
        </div>
    </div>
    
    <!-- VIDEO CHAPTERS -->
    <div class="video-chapters">
        <h4><i class="fas fa-list-ol"></i> Chapters:</h4>
        <div class="chapters-grid">
            <button class="chapter-btn" onclick="app.seekToTime(0)">
                <div class="chapter-icon">▶️</div>
                <div class="chapter-content">
                    <strong>00:00</strong>
                    <small>Pengenalan UV Guard Pro</small>
                </div>
            </button>
            
            <button class="chapter-btn" onclick="app.seekToTime(90)">
                <div class="chapter-icon">📍</div>
                <div class="chapter-content">
                    <strong>01:30</strong>
                    <small>Deteksi Lokasi Otomatis</small>
                </div>
            </button>
            
            <button class="chapter-btn" onclick="app.seekToTime(195)">
                <div class="chapter-icon">🧮</div>
                <div class="chapter-content">
                    <strong>03:15</strong>
                    <small>Kalkulator Berjemur</small>
                </div>
            </button>
            
            <button class="chapter-btn" onclick="app.seekToTime(345)">
                <div class="chapter-icon">📊</div>
                <div class="chapter-content">
                    <strong>05:45</strong>
                    <small>Analisis Matematis</small>
                </div>
            </button>
            
            <button class="chapter-btn" onclick="app.seekToTime(500)">
                <div class="chapter-icon">💡</div>
                <div class="chapter-content">
                    <strong>08:20</strong>
                    <small>Tips & Best Practices</small>
                </div>
            </button>
        </div>
    </div>
    
    <!-- VIDEO INFO -->
    <div class="video-info-card">
        <div class="info-item">
            <i class="fas fa-clock"></i>
            <div>
                <strong>Durasi:</strong>
                <span id="videoDuration">10:30 menit</span>
            </div>
        </div>
        <div class="info-item">
            <i class="fas fa-video"></i>
            <div>
                <strong>Format:</strong>
                <span>MP4 HD (1080p)</span>
            </div>
        </div>
        <div class="info-item">
            <i class="fas fa-file-download"></i>
            <div>
                <strong>Ukuran:</strong>
                <span id="videoSize">~85 MB</span>
            </div>
        </div>
        <div class="info-item">
            <i class="fas fa-language"></i>
            <div>
                <strong>Bahasa:</strong>
                <span>Indonesia</span>
            </div>
        </div>
    </div>
</div>
`;
            
            document.body.insertAdjacentHTML('beforeend', modalHTML);
        }
        
        // Tambah tombol user guide jika belum ada
        if (!document.getElementById('userGuideBtn')) {
            const guideBtn = document.createElement('button');
            guideBtn.id = 'userGuideBtn';
            guideBtn.className = 'btn-help';
            guideBtn.innerHTML = '<i class="fas fa-question-circle"></i> Panduan';
            guideBtn.onclick = () => this.openUserGuide();
            guideBtn.style.position = 'fixed';
            guideBtn.style.bottom = '20px';
            guideBtn.style.right = '20px';
            guideBtn.style.zIndex = '1000';
            guideBtn.style.background = 'linear-gradient(135deg, #0066cc, #0099ff)';
            guideBtn.style.color = 'white';
            guideBtn.style.border = 'none';
            guideBtn.style.borderRadius = '50px';
            guideBtn.style.padding = '12px 24px';
            guideBtn.style.fontWeight = 'bold';
            guideBtn.style.cursor = 'pointer';
            guideBtn.style.boxShadow = '0 4px 15px rgba(0,102,204,0.3)';
            
            document.body.appendChild(guideBtn);
        }
        
        // Tambah CSS untuk user guide
        this.addUserGuideStyles();
    }
    // Tambahkan button untuk enable fetch
addManualControlButton() {
    const controlBtn = document.createElement('button');
    controlBtn.id = 'manualControlBtn';
    controlBtn.innerHTML = '<i class="fas fa-play"></i> Enable Fetch';
    controlBtn.style.position = 'fixed';
    controlBtn.style.top = '20px';
    controlBtn.style.right = '20px';
    controlBtn.style.zIndex = '9999';
    controlBtn.style.background = '#ff3300';
    controlBtn.style.color = 'white';
    controlBtn.style.border = 'none';
    controlBtn.style.borderRadius = '5px';
    controlBtn.style.padding = '10px 15px';
    controlBtn.style.cursor = 'pointer';
    
    controlBtn.onclick = () => {
        this.blockAutoFetch = false;
        this.manualMode = false;
        this.showNotification("Manual mode disabled - Auto-fetch enabled", "warning");
        controlBtn.remove();
    };
    
    document.body.appendChild(controlBtn);
}
    // ==================== HARD RESET TIMER ====================
hardResetAllTimers() {
    console.log("🔄 HARD RESET ALL TIMERS");
    
    // 1. Clear semua interval
    if (this.timeUpdateInterval) {
        clearInterval(this.timeUpdateInterval);
        this.timeUpdateInterval = null;
    }
    
    // 2. Clear semua timeout
    const highestId = window.setTimeout(() => {}, 0);
    for (let i = 0; i < highestId; i++) {
        window.clearTimeout(i);
    }
    
    // 3. Reset timezone
    this.timezone = "Asia/Jakarta";
    
    console.log("✅ All timers reset");
}
    addUserGuideStyles() {
        const styleId = 'user-guide-styles';
        if (document.getElementById(styleId)) return;
        
        const videoStyles = `
    /* Video Container */
    .video-container {
        background: #000;
        border-radius: 12px;
        overflow: hidden;
        margin: 20px 0;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    }
    
    .video-player {
        position: relative;
        width: 100%;
        aspect-ratio: 16/9;
        background: #000;
    }
    
    .video-player video {
        width: 100%;
        height: 100%;
        display: block;
        outline: none;
    }
    
    .video-loading {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
        color: white;
    }
    
    .video-loading i {
        font-size: 3rem;
        margin-bottom: 15px;
        color: #0066cc;
    }
    
    /* Video Controls */
    .video-controls {
        background: rgba(0, 0, 0, 0.8);
        padding: 15px 20px;
        display: flex;
        align-items: center;
        gap: 15px;
        backdrop-filter: blur(10px);
    }
    
    .control-btn {
        background: rgba(255, 255, 255, 0.1);
        border: none;
        color: white;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s;
    }
    
    .control-btn:hover {
        background: rgba(255, 255, 255, 0.2);
        transform: scale(1.1);
    }
    
    .time-display {
        color: white;
        font-family: 'Roboto Mono', monospace;
        font-size: 0.9rem;
        min-width: 100px;
    }
    
    .progress-container {
        flex: 1;
    }
    
    .progress-bar {
        height: 6px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 3px;
        cursor: pointer;
        position: relative;
    }
    
    .progress-fill {
        height: 100%;
        background: #0066cc;
        border-radius: 3px;
        width: 0%;
        transition: width 0.1s;
    }
    
    input[type="range"] {
        width: 80px;
        height: 6px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 3px;
        outline: none;
        -webkit-appearance: none;
    }
    
    input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 16px;
        height: 16px;
        background: #0066cc;
        border-radius: 50%;
        cursor: pointer;
    }
    
    /* Video Chapters */
    .video-chapters {
        margin: 25px 0;
    }
    
    .chapters-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 15px;
        margin-top: 15px;
    }
    
    .chapter-btn {
        background: #f8f9fa;
        border: 2px solid #e9ecef;
        border-radius: 10px;
        padding: 15px;
        text-align: left;
        cursor: pointer;
        transition: all 0.3s;
        display: flex;
        align-items: center;
        gap: 15px;
    }
    
    .chapter-btn:hover {
        background: #e9ecef;
        border-color: #0066cc;
        transform: translateY(-3px);
    }
    
    .chapter-icon {
        font-size: 1.5rem;
    }
    
    .chapter-content {
        flex: 1;
    }
    
    .chapter-content strong {
        display: block;
        color: #0066cc;
        font-size: 1.1rem;
    }
    
    .chapter-content small {
        color: #666;
        font-size: 0.9rem;
    }
    
    /* Video Info Card */
    .video-info-card {
        background: linear-gradient(135deg, #f8f9fa, #e9ecef);
        border-radius: 10px;
        padding: 20px;
        margin-top: 25px;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 15px;
    }
    
    .info-item {
        display: flex;
        align-items: center;
        gap: 15px;
    }
    
    .info-item i {
        font-size: 1.5rem;
        color: #0066cc;
        width: 40px;
        text-align: center;
    }
    
    /* Responsive */
    @media (max-width: 768px) {
        .video-controls {
            flex-wrap: wrap;
            justify-content: center;
        }
        
        .chapters-grid {
            grid-template-columns: 1fr;
        }
        
        .video-info-card {
            grid-template-columns: 1fr;
        }
    }
`;
// Tambahkan ke addUserGuideStyles():
const errorStyles = `
    .video-error {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
        color: white;
        background: rgba(0, 0, 0, 0.8);
        padding: 30px;
        border-radius: 10px;
        max-width: 400px;
        width: 90%;
    }
    
    .video-error i {
        font-size: 3rem;
        color: #ff6b6b;
        margin-bottom: 15px;
    }
    
    .video-error h3 {
        margin: 10px 0;
        color: #ff6b6b;
    }
    
    .video-error p {
        margin: 10px 0;
        color: #ccc;
    }
    
    .video-error code {
        background: rgba(255, 255, 255, 0.1);
        padding: 2px 6px;
        border-radius: 4px;
        font-family: 'Roboto Mono', monospace;
    }
`;
        const styles = `
        styles += videoStyles;
            /* User Guide Modal */
            .modal {
                display: none;
                position: fixed;
                z-index: 2000;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0,0,0,0.7);
                animation: fadeIn 0.3s ease;
            }
            
            .modal-content {
                background-color: #fff;
                margin: 2% auto;
                padding: 0;
                border-radius: 12px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.2);
                width: 90%;
                max-width: 1000px;
                max-height: 85vh;
                display: flex;
                flex-direction: column;
                animation: slideUp 0.4s ease;
            }
            
            .modal-header {
                padding: 20px 30px;
                background: linear-gradient(135deg, #0066cc, #0099ff);
                color: white;
                border-radius: 12px 12px 0 0;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .modal-header h2 {
                margin: 0;
                font-size: 1.5rem;
            }
            
            .close-btn {
                background: none;
                border: none;
                color: white;
                font-size: 28px;
                cursor: pointer;
                padding: 0 10px;
            }
            
            .modal-body {
                padding: 20px 30px;
                overflow-y: auto;
                flex: 1;
            }
            
            .modal-footer {
                padding: 15px 30px;
                background: #f8f9fa;
                border-radius: 0 0 12px 12px;
                display: flex;
                justify-content: flex-end;
                gap: 10px;
            }
            
            /* Guide Tabs */
            .guide-tabs {
                display: flex;
                gap: 5px;
                margin-bottom: 20px;
                border-bottom: 2px solid #e9ecef;
                padding-bottom: 10px;
                flex-wrap: wrap;
            }
            
            .tab-btn {
                padding: 10px 20px;
                border: none;
                background: #f8f9fa;
                border-radius: 6px;
                cursor: pointer;
                font-weight: 500;
                transition: all 0.3s;
                flex: 1;
                min-width: 120px;
                text-align: center;
            }
            
            .tab-btn:hover {
                background: #e9ecef;
            }
            
            .tab-btn.active {
                background: #0066cc;
                color: white;
            }
            
            .guide-tab {
                display: none;
            }
            
            .guide-tab.active {
                display: block;
            }
            
            /* Guide Content */
            .guide-section {
                margin: 25px 0;
                padding: 20px;
                background: #f8f9fa;
                border-radius: 8px;
                border-left: 4px solid #0066cc;
            }
            
            .guide-section h4 {
                margin-top: 0;
                color: #0066cc;
            }
            
            .uv-levels-guide {
                display: grid;
                gap: 10px;
                margin-top: 15px;
            }
            
            .uv-level-item {
                padding: 12px 15px;
                background: white;
                border-radius: 6px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            
            .feature-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 20px;
                margin: 20px 0;
            }
            
            .feature-card {
                padding: 20px;
                background: white;
                border-radius: 8px;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                text-align: center;
                transition: transform 0.3s;
            }
            
            .feature-card:hover {
                transform: translateY(-5px);
            }
            
            .feature-icon {
                font-size: 2rem;
                color: #0066cc;
                margin-bottom: 10px;
            }
            
            /* Formula Styling */
            .formula-section {
                margin: 25px 0;
            }
            
            .formula-box {
                padding: 20px;
                background: white;
                border-radius: 8px;
                border: 1px solid #dee2e6;
                font-family: 'Courier New', monospace;
                margin: 15px 0;
            }
            
            .formula-box code {
                font-size: 1.1rem;
                color: #d63384;
                display: block;
                margin-bottom: 15px;
            }
            
            /* API Grid */
            .api-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 20px;
                margin: 20px 0;
            }
            
            .api-card {
                padding: 20px;
                border-radius: 8px;
                color: white;
                text-align: center;
            }
            
            .api-card.primary {
                background: linear-gradient(135deg, #0066cc, #0099ff);
            }
            
            .api-card.secondary {
                background: linear-gradient(135deg, #00a86b, #00cc88);
            }
            
            .api-card.tertiary {
                background: linear-gradient(135deg, #ff6600, #ff9933);
            }
            
            /* Tips Grid */
            .tips-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                gap: 20px;
                margin: 20px 0;
            }
            
            .tip-card {
                padding: 20px;
                background: white;
                border-radius: 8px;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                border-top: 4px solid #00cc88;
            }
            
            .tip-icon {
                font-size: 1.5rem;
                color: #00cc88;
                margin-bottom: 10px;
            }
            
            .guide-section.warning {
                border-left-color: #ff6600;
                background: #fff3cd;
                color: #856404;
            }
            
            /* Help Button */
            .btn-help {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 1000;
                background: linear-gradient(135deg, #0066cc, #0099ff);
                color: white;
                border: none;
                border-radius: 50px;
                padding: 12px 24px;
                font-weight: bold;
                cursor: pointer;
                box-shadow: 0 4px 15px rgba(0,102,204,0.3);
                transition: all 0.3s;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            .btn-help:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(0,102,204,0.4);
            }
            
            /* Animations */
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes slideUp {
                from {
                    opacity: 0;
                    transform: translateY(50px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            /* Responsive */
            @media (max-width: 768px) {
                .modal-content {
                    width: 95%;
                    margin: 5% auto;
                    max-height: 90vh;
                }
                
                .guide-tabs {
                    flex-wrap: wrap;
                }
                
                .tab-btn {
                    flex: 1;
                    min-width: 120px;
                    text-align: center;
                }
                
                .feature-grid,
                .tips-grid {
                    grid-template-columns: 1fr;
                }
            }
        `;
        
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = styles;
        document.head.appendChild(style);
    }
    
    openUserGuide() {
    console.log("🚨 EMERGENCY FIX: Opening user guide");
    
    const modal = document.getElementById('userGuideModal');
    if (!modal) {
        console.error("Modal not found, creating emergency modal");
        this.createEmergencyModal();
        return;
    }
    
    // HARD FIX: Reset semua style
    modal.style.cssText = `
        display: block !important;
        position: fixed !important;
        z-index: 9999 !important;
        left: 0 !important;
        top: 0 !important;
        width: 100% !important;
        height: 100% !important;
        background-color: rgba(0,0,0,0.8) !important;
        overflow: auto !important;
    `;
    
    // Pastikan modal content juga visible
    const modalContent = modal.querySelector('.modal-content');
    if (modalContent) {
        modalContent.style.cssText = `
            background-color: white !important;
            margin: 5% auto !important;
            padding: 0 !important;
            border: 1px solid #888 !important;
            width: 90% !important;
            max-width: 1000px !important;
            border-radius: 10px !important;
            position: relative !important;
            z-index: 10000 !important;
        `;
    }
    
    document.body.style.overflow = 'hidden';
    
    // Tambah close button emergency
    this.addEmergencyCloseButton();
    
    console.log("✅ Emergency modal opened");
}

createEmergencyModal() {
    const emergencyHTML = `
        <div id="emergencyModal" style="
            position: fixed;
            z-index: 9999;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.9);
            display: block;
            overflow: auto;
        ">
            <div style="
                background: white;
                margin: 50px auto;
                padding: 30px;
                border-radius: 15px;
                max-width: 800px;
                position: relative;
            ">
                <button onclick="document.getElementById('emergencyModal').remove(); document.body.style.overflow='auto'" 
                        style="
                            position: absolute;
                            top: 15px;
                            right: 15px;
                            background: #ff3300;
                            color: white;
                            border: none;
                            border-radius: 50%;
                            width: 40px;
                            height: 40px;
                            font-size: 20px;
                            cursor: pointer;
                        ">
                    ×
                </button>
                <h2>🆘 Emergency User Guide</h2>
                <p>Modal utama mengalami masalah. Ini adalah fallback.</p>
                <p>Tab yang tersedia:</p>
                <div style="margin: 20px 0;">
                    <button onclick="app.switchGuideTab('overview')" style="padding: 10px 20px; margin: 5px;">📋 Overview</button>
                    <button onclick="app.switchGuideTab('features')" style="padding: 10px 20px; margin: 5px;">✨ Fitur</button>
                    <button onclick="app.switchGuideTab('api')" style="padding: 10px 20px; margin: 5px;">🌐 API</button>
                    <button onclick="app.switchGuideTab('tips')" style="padding: 10px 20px; margin: 5px;">💡 Tips</button>
                    <button onclick="app.switchGuideTab('video')" style="padding: 10px 20px; margin: 5px;">🎬 Video</button>
                </div>
                <div id="emergencyTabContent"></div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', emergencyHTML);
}

addEmergencyCloseButton() {
    const modal = document.getElementById('userGuideModal');
    if (!modal) return;
    
    // Cek apakah sudah ada close button
    let closeBtn = modal.querySelector('.emergency-close');
    if (!closeBtn) {
        closeBtn = document.createElement('button');
        closeBtn.className = 'emergency-close';
        closeBtn.innerHTML = '×';
        closeBtn.style.cssText = `
            position: absolute;
            top: 15px;
            right: 15px;
            background: #ff3300;
            color: white;
            border: none;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            font-size: 24px;
            cursor: pointer;
            z-index: 10001;
        `;
        closeBtn.onclick = () => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        };
        
        modal.appendChild(closeBtn);
    }
}
    
    switchGuideTab(tabName) {
    console.log(`📚 Switching to tab: ${tabName}`);
    
    // Hide all tabs
    document.querySelectorAll('.guide-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    const tab = document.getElementById(`guide${tabName.charAt(0).toUpperCase() + tabName.slice(1)}`);
    if (tab) {
        tab.classList.add('active');
    }
    
    // Fixed logic for button activation
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => {
        const btnText = btn.textContent.toLowerCase();
        
        // Simple keyword matching
        const shouldActivate = 
    (tabName === 'overview' && (btnText.includes('overview') || btnText.includes('📋'))) ||
    (tabName === 'features' && (btnText.includes('fitur') || btnText.includes('✨'))) ||
    (tabName === 'api' && (btnText.includes('api') || btnText.includes('🌐'))) ||
    (tabName === 'tips' && (btnText.includes('tips') || btnText.includes('💡'))) ||
    (tabName === 'video' && (btnText.includes('video') || btnText.includes('🎬')));
        if (shouldActivate) {
            btn.classList.add('active');
        }
    });
     // Initialize video player when video tab is opened
        if (tabName === 'video') {
            setTimeout(() => {
                this.videoController.initVideoPlayer();
            }, 300);
        }
}
    
    printUserGuide() {
        const modalContent = document.querySelector('#userGuideModal .modal-content');
        if (modalContent) {
            const printWindow = window.open('', '_blank');
            printWindow.document.write(`
                <html>
                <head>
                    <title>UV Guard Pro - Panduan Pengguna</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 20px; }
                        h2 { color: #0066cc; }
                        h3 { color: #333; }
                        .guide-section { margin: 20px 0; padding: 15px; background: #f5f5f5; border-radius: 5px; }
                        .formula-box { background: #f8f9fa; padding: 10px; border: 1px solid #ddd; margin: 10px 0; }
                        code { font-family: 'Courier New', monospace; color: #d63384; }
                        @media print {
                            .guide-tabs, .modal-footer { display: none; }
                        }
                    </style>
                </head>
                <body>
                    ${modalContent.innerHTML}
                </body>
                </html>
            `);
            printWindow.document.close();
            printWindow.print();
        }
    }
    
    async init() {
    console.log("🚀 UV Guard Pro Initializing...");
    
    try {
        // 1. Load saved data
        this.loadHistory();
        
        // 2. Initialize components
        await this.initializeComponents();
        
        // 3. FORCE REFRESH DROPDOWN
        console.log("🔄 Forcing province dropdown refresh...");
        this.initProvinceSelect();
        
        // 4. JANGAN set default location - BIARKAN KOSONG
        // this.setDefaultLocation(); // JANGAN PAKAI INI
        
        // 5. Start time updates dengan UTC (bukan Asia/Jakarta)
        this.timezone = 'UTC'; // Default ke UTC, bukan Asia/Jakarta
        this.startTimeUpdates();
        
        // 6. Show EMPTY placeholder
        this.showStartupPlaceholder();
        
        // 7. CLEAR SEMUA INPUT FIELD
        this.clearAllInputsOnStartup();
        
        // 8. CLEAR localStorage timezone cache
        try {
            localStorage.removeItem('uvguard_pro_timezone');
            console.log('✅ localStorage timezone cleared');
        } catch (e) {
            console.warn('⚠️ Could not clear localStorage');
        }
        
        console.log("✅ UV Guard Pro ready! - SEMUA FIELD KOSONG");
        
    } catch (error) {
        console.error("❌ Initialization error:", error);
    }
}

    clearAllInputs() {
    console.log("🧹 Clearing all input fields...");
    
    // Clear text inputs
    const inputs = [
        'cityInput',
        'latInput',
        'lonInput',
        'calcUV'
    ];
    
    inputs.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.value = '';
            console.log(`✅ Cleared ${id}`);
        }
    });
    
    // Clear dropdowns
    const provinceSelect = document.getElementById('provinceSelect');
    if (provinceSelect) {
        provinceSelect.selectedIndex = 0;
        console.log('✅ Cleared province select');
    }
    
    const skinTypeSelect = document.getElementById('skinTypeSelect');
    if (skinTypeSelect) {
        skinTypeSelect.value = 'III';
    }
    
    const spfSelect = document.getElementById('spfSelect');
    if (spfSelect) {
        spfSelect.value = '30';
    }
    
    // Clear location cache
    this.currentLocation = null;
    
    console.log("✅ All inputs cleared");
}

showStartupPlaceholder() {
    console.log("📱 Showing startup placeholder");
    
    // Update UI tanpa data
    const uvElement = document.getElementById('currentUV');
    if (uvElement) uvElement.textContent = "--";
    
    const levelElement = document.getElementById('uvLevel');
    if (levelElement) {
        levelElement.textContent = "SILAKAN AMBIL DATA";
        levelElement.style.backgroundColor = "#4CAF50";
    }
    
    // **TIMEZONE KOSONG**
    const timezoneElement = document.getElementById('timezoneInfo');
    if (timezoneElement) {
        timezoneElement.textContent = "--";
        timezoneElement.style.color = "#666";
    }
    
    // **KOORDINAT KOSONG**
    const coordinatesElement = document.getElementById('coordinatesText');
    if (coordinatesElement) {
        coordinatesElement.textContent = "--";
        coordinatesElement.style.color = "#666";
    }
    
    // Enable tombol fetch
    const fetchBtn = document.getElementById('fetchData');
    if (fetchBtn) {
        fetchBtn.disabled = false;
        fetchBtn.innerHTML = '<i class="fas fa-cloud-download-alt"></i> Ambil Data ';
        fetchBtn.style.opacity = '1';
    }
    
    // Tampilkan instruction
    this.showNotification("Aplikasi siap. Pilih lokasi dan klik 'Ambil Data'", "info");
}   

        // ==================== CLEAR ON STARTUP ====================
clearAllInputsOnStartup() {
    console.log("🧹 Clearing all inputs on startup...");
    
    // Clear text inputs
    const inputs = ['cityInput', 'latInput', 'lonInput'];
    inputs.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.value = '';
            console.log(`✅ Cleared ${id}`);
        }
    });
    
    // Clear dropdown
    const provinceSelect = document.getElementById('provinceSelect');
    if (provinceSelect) {
        provinceSelect.selectedIndex = 0;
        console.log('✅ Cleared province select');
    }
    
    // Clear current location
    this.currentLocation = null;
    
    // Reset timezone ke UTC
    this.timezone = 'UTC';
    
    console.log("✅ All inputs cleared on startup");
}

    showPlaceholderData() {
    console.log("📱 Showing placeholder data - EMPTY STATE");
    
    // UV Display
    const uvElement = document.getElementById('currentUV');
    if (uvElement) {
        uvElement.textContent = "--";
        uvElement.style.color = "#666";
    }
    
    const levelElement = document.getElementById('uvLevel');
    if (levelElement) {
        levelElement.textContent = "PILIH LOKASI";
        levelElement.style.backgroundColor = "#666";
        levelElement.style.color = "white";
    }
    
    const descElement = document.getElementById('uvDescription');
    if (descElement) {
        descElement.textContent = "Silakan pilih lokasi dan klik 'Ambil Data'";
        descElement.style.color = "#666";
    }
    
    // Location
    const locationElement = document.getElementById('locationName');
    if (locationElement) {
        locationElement.textContent = "--";
        locationElement.style.color = "#666";
    }
    
    // Coordinates
    const coordinatesElement = document.getElementById('coordinatesText');
    if (coordinatesElement) {
        coordinatesElement.textContent = "--";
        coordinatesElement.style.color = "#666";
    }
    
    // TIMEZONE - PASTIKAN KOSONG
    const timezoneElement = document.getElementById('timezoneInfo');
    if (timezoneElement) {
        timezoneElement.textContent = "--";
        timezoneElement.style.color = "#666";
    }
    
    // Time Status & Period
    const timeStatusElement = document.getElementById('timeStatus');
    const dayNightElement = document.getElementById('dayNightIndicator');
    if (timeStatusElement) {
        timeStatusElement.textContent = "--";
        timeStatusElement.style.color = "#666";
    }
    if (dayNightElement) {
        dayNightElement.textContent = "--";
        dayNightElement.style.color = "#666";
    }
    
    // Current time (browser local time saja)
    const currentTimeElement = document.getElementById('currentTime');
    if (currentTimeElement) {
        currentTimeElement.textContent = new Date().toLocaleTimeString('id-ID');
        currentTimeElement.style.color = "#666";
    }
    
    // Date
    const dateElement = document.getElementById('dataTimestamp');
    if (dateElement) {
        dateElement.textContent = new Date().toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        dateElement.style.color = "#666";
    }
    
    // Weather data
    const tempElement = document.getElementById('temperature');
    const feelsLikeElement = document.getElementById('feelsLikeText');
    const weatherElement = document.getElementById('weatherCondition');
    const humidityElement = document.getElementById('humidity');
    
    if (tempElement) tempElement.textContent = "--°C";
    if (feelsLikeElement) feelsLikeElement.textContent = "--°C";
    if (weatherElement) weatherElement.textContent = "--";
    if (humidityElement) humidityElement.textContent = "--%";
    
    // Data Source
    const dataSourceElement = document.getElementById('dataSource');
    if (dataSourceElement) {
        dataSourceElement.textContent = "--";
        dataSourceElement.style.color = "#666";
    }
    
    // Last Update
    const lastUpdateElement = document.getElementById('lastUpdate');
    if (lastUpdateElement) {
        lastUpdateElement.textContent = "--";
        lastUpdateElement.style.color = "#666";
    }
    
    // Enable fetch button
    const fetchBtn = document.getElementById('fetchData');
    if (fetchBtn) {
        fetchBtn.disabled = false;
        fetchBtn.innerHTML = '<i class="fas fa-cloud-download-alt"></i> Ambil Data ';
        fetchBtn.style.opacity = '1';
    }
    
    console.log("✅ Placeholder shown - ALL EMPTY");
}
    
    // Tambahkan method ini di class UVGuardIndex
updateUIWithPlaceholder() {
    console.log("🔄 Updating UI with placeholder data...");
    
    // Update time display saja
    this.updateTimeDisplay();
    
    // Set placeholder untuk UV
    const uvValueElement = document.getElementById('currentUV');
    if (uvValueElement) {
        uvValueElement.textContent = "--";
        uvValueElement.style.color = '#666';
    }
    
    const levelElement = document.getElementById('uvLevel');
    if (levelElement) {
        levelElement.textContent = "PILIH LOKASI";
        levelElement.style.backgroundColor = "#666";
    }
    
    const descElement = document.getElementById('uvDescription');
    if (descElement) {
        descElement.textContent = "Pilih lokasi terlebih dahulu untuk melihat data UV";
    }
    
    // Update location info
    const locationElement = document.getElementById('locationName');
    if (locationElement) {
        locationElement.textContent = "Silakan pilih lokasi";
    }
    
    // Update recommendations
    const container = document.getElementById('recommendationsContainer');
    if (container) {
        container.innerHTML = `
            <div class="recommendation-card" data-level="info">
                <div class="recommendation-header">
                    <div class="recommendation-icon">
                        <i class="fas fa-map-marker-alt"></i>
                    </div>
                    <div class="recommendation-title">📍 Pilih Lokasi</div>
                </div>
                <ul class="recommendation-list">
                    <li><i class="fas fa-info-circle"></i> Pilih provinsi dari dropdown</li>
                    <li><i class="fas fa-info-circle"></i> Atau ketik nama kota</li>
                    <li><i class="fas fa-info-circle"></i> Atau gunakan deteksi lokasi otomatis</li>
                    <li><i class="fas fa-info-circle"></i> Klik "Ambil Data" untuk memulai</li>
                </ul>
            </div>
        `;
    }
    
    // Update data source info
    const sourceElement = document.getElementById('dataSource');
    if (sourceElement) {
        sourceElement.textContent = "Menunggu input";
        sourceElement.style.color = '#666';
    }
}

    async initializeComponents() {
        // Initialize province dropdown
        this.initProvinceSelect();
        
        // Initialize skin type selector
        this.initSkinTypeSelector();

        // Initialize scroll navigation
    setTimeout(() => {
        this.setupScrollNavigation();
         this.setupSmoothScroll();
    }, 1500);
        
        // Initialize charts
        setTimeout(() => {
            this.initCharts();
        }, 500);
        
        // Initialize all event listeners
        this.initEventListeners();
        
        // Initialize UI state
        this.updateUIState();    
    }
    
    // ==================== PROVINCE DROPDOWN ====================
    initProvinceSelect() {
    console.log("🔄 Loading province dropdown...");
    
    const dropdown = document.getElementById('provinceSelect');
    if (!dropdown) {
        console.error("❌ Dropdown not found!");
        setTimeout(() => {
            const retryDropdown = document.getElementById('provinceSelect');
            if (retryDropdown) {
                this.initProvinceSelect();
            }
        }, 1000);
        return;
    }
    
    // Clear existing options
    dropdown.innerHTML = '<option value="">-- Pilih Provinsi Indonesia --</option>';
    
    // DEBUG: Tampilkan data Bali sebelum membuat dropdown
    const baliData = this.INDONESIA_PROVINCES.find(p => p.name === "Bali");
    console.log("🔍 Bali data in INDONESIA_PROVINCES:", baliData);
    
    // Add provinces
    this.INDONESIA_PROVINCES.forEach(prov => {
    const option = document.createElement('option');
    option.value = `${prov.lat},${prov.lon}`;
    
    // PASTIKAN timezone sesuai zona Indonesia
    let timezone = prov.timezone;
    if (prov.name.includes("Bali")) {
        timezone = "Asia/Makassar"; // WITA
    } else if (prov.name.includes("Papua") || prov.name.includes("Maluku")) {
        timezone = "Asia/Jayapura"; // WIT
    } else if (prov.name.includes("Sulawesi") || 
               prov.name.includes("Kalimantan Timur") ||
               prov.name.includes("Kalimantan Selatan") ||
               prov.name.includes("Nusa Tenggara")) {
        timezone = "Asia/Makassar"; // WITA
    } else {
        timezone = "Asia/Jakarta"; // WIB
    }
    
    option.setAttribute('data-timezone', timezone);
    option.textContent = `${prov.name} (${prov.capital})`;
    dropdown.appendChild(option);
});

    
    console.log(`✅ Loaded ${this.INDONESIA_PROVINCES.length} provinces`);
    
    // DEBUG: Cek option Bali setelah dibuat
    const baliOption = Array.from(dropdown.options).find(opt => opt.textContent.includes('Bali'));
    if (baliOption) {
        console.log("🔍 Bali option in dropdown:", {
            text: baliOption.textContent,
            value: baliOption.value,
            timezoneAttr: baliOption.getAttribute('data-timezone')
        });
    }
    
    // Add event listener
    // Add event listener
dropdown.addEventListener('change', (e) => {
    if (!e.target.value) {
        // Jika user memilih "Pilih Provinsi", clear semua
        console.log("🗑️ Province cleared, resetting everything...");
        
        this.currentLocation = null;
        this.timezone = 'Asia/Jakarta'; // Reset ke default
        
        // Clear input fields
        this.clearAllInputs();
        
        // Show placeholder
        this.showPlaceholderData();
        
        // Restart timer dengan browser time
        this.stopTimeUpdates();
        setTimeout(() => {
            this.startTimeUpdates();
        }, 100);
        
        this.showNotification("Lokasi di-reset. Pilih provinsi baru.", "info");
        return;
    }
    
    console.log("🛑 Stopping timer before province change...");
    this.stopTimeUpdates();
    
    const [lat, lon] = e.target.value.split(',').map(Number);
    const selectedOption = e.target.options[e.target.selectedIndex];
    const selectedText = selectedOption.text;
    
    // ========== PERBAIKAN DI SINI ==========
    // Ambil timezone dari attribute
    let timezone = selectedOption.getAttribute('data-timezone');
    
    // DEBUG
    console.log("Selected option attributes:", {
        text: selectedText,
        timezoneAttr: timezone,
        hasTimezoneAttr: selectedOption.hasAttribute('data-timezone')
    });
    
    // Jika timezone tidak ada atau undefined, gunakan default
    if (!timezone || timezone === 'null' || timezone === 'undefined') {
        console.warn("⚠️ Timezone attribute missing or invalid, using fallback");
        
        // Deteksi berdasarkan nama provinsi
        if (selectedText.includes('Bali') || selectedText.includes('Denpasar')) {
            timezone = "Asia/Makassar";
            console.log("🎯 Detected Bali, forcing to Asia/Makassar");
        } else if (selectedText.includes('Papua') || selectedText.includes('Jayapura')) {
            timezone = "Asia/Jayapura";
        } else if (selectedText.includes('Makassar') || selectedText.includes('Sulawesi')) {
            timezone = "Asia/Makassar";
        } else {
            timezone = "Asia/Jakarta";
        }
    }
    
    // Parse province and city names
    const provinceMatch = selectedText.match(/^(.+?)\(/);
    const cityMatch = selectedText.match(/\(([^)]+)\)/);
    
    const provinceName = provinceMatch ? provinceMatch[1].trim() : selectedText;
    const cityName = cityMatch ? cityMatch[1].trim() : provinceName;
    
    console.log(`📍 Selected: ${provinceName}`);
    console.log(`📍 Timezone from data: ${timezone}`);
    console.log(`📍 Coordinates: ${lat}, ${lon}`);
    
    // Update current location
    this.currentLocation = {
        lat: lat,
        lon: lon,
        name: cityName,
        province: provinceName,
        country: "ID",
        timezone: timezone
    };
    
    // ====== SET TIMEZONE ======
    this.timezone = timezone;
    console.log(`🔄 App timezone set to: ${this.timezone}`);
    // ====== UPDATE TIMEZONE DISPLAY ======
const tzInfoElement = document.getElementById('timezoneInfo');
if (tzInfoElement) {
    const displayText = this.formatTimezoneForDisplay(timezone);
    const color = this.getTimezoneColor(timezone);
    
    tzInfoElement.textContent = displayText;
    tzInfoElement.style.color = color;
    console.log(`✅ Timezone display updated: ${displayText}`);
}
    // Update input fields
    const cityInput = document.getElementById('cityInput');
    const latInput = document.getElementById('latInput');
    const lonInput = document.getElementById('lonInput');
    
    if (cityInput) cityInput.value = `${cityName}, ${provinceName}`;
    if (latInput) latInput.value = lat;
    if (lonInput) lonInput.value = lon;
    
    // Show notification with timezone info
    let tzDisplay = 'WIB';
    if (timezone === 'Asia/Makassar') tzDisplay = 'WITA';
    if (timezone === 'Asia/Jayapura') tzDisplay = 'WIT';
    
    this.showNotification(`${provinceName} dipilih (${tzDisplay})`, "success");
    this.updateLocationStatus(`${provinceName} - ${tzDisplay}`);
    
    // ====== RESTART TIMER ======
    console.log("🟢 Restarting timer with province timezone...");
    
    // Beri waktu untuk update state
    setTimeout(() => {
        // VERIFIKASI sebelum start timer
        console.log(`🔍 Verification before starting timer:`);
        console.log(`   - this.timezone: ${this.timezone}`);
        console.log(`   - this.currentLocation.timezone: ${this.currentLocation.timezone}`);
        console.log(`   - Province: ${this.currentLocation.province}`);
        
        this.startTimeUpdates();
        
        // Verifikasi setelah 1 detik
        setTimeout(() => {
            const timeElement = document.getElementById('currentTime');
            if (timeElement) {
                console.log(`✅ Time displayed: ${timeElement.textContent}`);
            }
        }, 1000);
        
    }, 100);
    
    // Tampilkan instruksi untuk fetch data
    this.showNotification(`Klik "Ambil Data" untuk update UV Index`, "info");
});

    
    // Trigger change event jika ada lokasi yang disimpan
   // setTimeout(() => {
        //if (this.currentLocation && this.currentLocation.lat && this.currentLocation.lon) {
           // const lat = this.currentLocation.lat;
           // const lon = this.currentLocation.lon;
            
            // Cari option yang cocok
           // for (let i = 0; i < dropdown.options.length; i++) {
              //  const option = dropdown.options[i];
               // if (option.value === `${lat},${lon}` || 
                   // option.text.includes(this.currentLocation.name) ||
                   // option.text.includes(this.currentLocation.province)) {
                   // dropdown.selectedIndex = i;
                   // dropdown.dispatchEvent(new Event('change'));
                   // break;
              //  } 
         // }
         console.log("✅ Province dropdown ready - waiting for user selection");
        }
   // }, 1500);
//}
            

    updateTimezoneDisplay(timezone) {
    const tzElement = document.getElementById('timezoneInfo');
    if (!tzElement) return;
    
    // Mapping timezone ke display name yang user-friendly
    const timezoneDisplayMap = {
        // Indonesia
        'Asia/Jakarta': 'WIB (GMT+7)',
        'Asia/Makassar': 'WITA (GMT+8)', 
        'Asia/Jayapura': 'WIT (GMT+9)',
        
        // Asia
        'Asia/Singapore': 'SGT (GMT+8)',
        'Asia/Tokyo': 'JST (GMT+9)',
        'Asia/Shanghai': 'CST (GMT+8)',
        'Asia/Hong_Kong': 'HKT (GMT+8)',
        'Asia/Bangkok': 'ICT (GMT+7)',
        'Asia/Seoul': 'KST (GMT+9)',
        'Asia/Kolkata': 'IST (GMT+5:30)',
        'Asia/Dubai': 'GST (GMT+4)',
        'Asia/Riyadh': 'AST (GMT+3)',
        
        // Australia
        'Australia/Sydney': 'AEST (GMT+10)',
        'Australia/Melbourne': 'AEST (GMT+10)',
        'Australia/Perth': 'AWST (GMT+8)',
        
        // Europe
        'Europe/London': 'GMT/BST (GMT+0/+1)',
        'Europe/Paris': 'CET (GMT+1)',
        'Europe/Berlin': 'CET (GMT+1)',
        'Europe/Moscow': 'MSK (GMT+3)',
        
        // Americas
        'America/New_York': 'EST (GMT-5)',
        'America/Chicago': 'CST (GMT-6)',
        'America/Denver': 'MST (GMT-7)',
        'America/Los_Angeles': 'PST (GMT-8)',
        'America/Toronto': 'EST (GMT-5)',
        
        // Other
        'UTC': 'UTC (GMT+0)'
    };
    
    // Warna berdasarkan region
    const timezoneColorMap = {
        // Indonesia
        'Asia/Jakarta': '#4CAF50',
        'Asia/Makassar': '#0066cc',
        'Asia/Jayapura': '#ff6600',
        
        // Asia
        'Asia/Singapore': '#9b59b6',
        'Asia/Tokyo': '#e74c3c',
        'Asia/Shanghai': '#c0392b',
        'Asia/Hong_Kong': '#3498db',
        'Asia/Bangkok': '#e67e22',
        'Asia/Seoul': '#2c3e50',
        
        // Australia
        'Australia/Sydney': '#1abc9c',
        
        // Europe
        'Europe/London': '#3498db',
        'Europe/Paris': '#2980b9',
        
        // Americas
        'America/New_York': '#2ecc71',
        
        // Default
        'default': '#666'
    };
    
    const displayText = timezoneDisplayMap[timezone] || timezone;
    const color = timezoneColorMap[timezone] || timezoneColorMap.default;
    
    tzElement.textContent = displayText;
    tzElement.style.color = color;
}

    // ==================== TIMEZONE FORMAT HELPER ====================
formatTimezoneForDisplay(timezone) {
    const tz = timezone || this.timezone || 'Asia/Jakarta';
    
    // Mapping untuk display yang user-friendly
    const displayMap = {
        // Indonesia
        'Asia/Jakarta': 'WIB (GMT+7)',
        'Asia/Makassar': 'WITA (GMT+8)', 
        'Asia/Jayapura': 'WIT (GMT+9)',
        
        // Asia
        'Asia/Singapore': 'SGT (GMT+8)',
        'Asia/Tokyo': 'JST (GMT+9)',
        'Asia/Shanghai': 'CST (GMT+8)',
        'Asia/Hong_Kong': 'HKT (GMT+8)',
        'Asia/Bangkok': 'ICT (GMT+7)',
        'Asia/Seoul': 'KST (GMT+9)',
        'Asia/Dubai': 'GST (GMT+4)',
        
        // Australia
        'Australia/Sydney': 'AEST (GMT+10)',
        'Australia/Melbourne': 'AEST (GMT+10)',
        'Australia/Perth': 'AWST (GMT+8)',
        
        // Europe
        'Europe/London': 'GMT/BST (GMT+0/+1)',
        'Europe/Paris': 'CET (GMT+1)',
        'Europe/Berlin': 'CET (GMT+1)',
        
        // Americas
        'America/New_York': 'EST (GMT-5)',
        'America/Los_Angeles': 'PST (GMT-8)',
        
        // Default
        'UTC': 'UTC (GMT+0)'
    };
    
    return displayMap[tz] || tz;
}

getTimezoneColor(timezone) {
    const tz = timezone || this.timezone || 'Asia/Jakarta';
    
    const colorMap = {
        // Indonesia
        'Asia/Jakarta': '#4CAF50',  // Hijau untuk WIB
        'Asia/Makassar': '#0066cc', // Biru untuk WITA
        'Asia/Jayapura': '#ff6600', // Orange untuk WIT
        
        // Asia
        'Asia/Singapore': '#9b59b6', // Ungu
        'Asia/Tokyo': '#e74c3c',     // Merah
        'Asia/Seoul': '#2c3e50',     // Dark grey
        
        // Australia
        'Australia/Sydney': '#1abc9c', // Turquoise
        
        // Europe
        'Europe/London': '#3498db',   // Biru muda
        
        // Americas  
        'America/New_York': '#2ecc71', // Hijau muda
        
        // Default
        'default': '#666'
    };
    
    return colorMap[tz] || colorMap.default;
}
    
    initSkinTypeSelector() {
        const select = document.getElementById('skinTypeSelect');
        if (!select) return;
        
        // Clear existing options
        select.innerHTML = '';
        
        // Add skin types
        const skinTypes = {
            'I': { name: 'Tipe I - Sangat putih, mudah terbakar' },
            'II': { name: 'Tipe II - Putih, mudah terbakar' },
            'III': { name: 'Tipe III - Coklat muda, terbakar sedang' },
            'IV': { name: 'Tipe IV - Coklat, jarang terbakar' },
            'V': { name: 'Tipe V - Coklat gelap, sangat jarang terbakar' },
            'VI': { name: 'Tipe VI - Hitam, tidak pernah terbakar' }
        };
        
        Object.entries(skinTypes).forEach(([key, data]) => {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = data.name;
            select.appendChild(option);
        });
        
        // Set default to type III
        select.value = 'III';
        
        // Calculate on changes
        const calculateBtn = document.getElementById('calculateSunbath');
        if (calculateBtn) {
            calculateBtn.addEventListener('click', () => {
                this.calculateSunbathDuration();
            });
        }
        
        select.addEventListener('change', () => {
            this.calculateSunbathDuration();
        });
        
        const spfSelect = document.getElementById('spfSelect');
        if (spfSelect) {
            spfSelect.addEventListener('change', () => {
                this.calculateSunbathDuration();
            });
        }
        
        const calcUV = document.getElementById('calcUV');
        if (calcUV) {
            calcUV.addEventListener('input', () => {
                this.calculateSunbathDuration();
            });
        }
    }
    
    // Helper untuk display timezone
getTimezoneDisplay(timezone) {
    if (!timezone) return "--";
    if (timezone === 'Asia/Makassar') return 'WITA (GMT+8)';
    if (timezone === 'Asia/Jayapura') return 'WIT (GMT+9)';
    if (timezone === 'Asia/Jakarta') return 'WIB (GMT+7)';
    if (timezone === 'Asia/Singapore') return 'SGT (GMT+8)';
    if (timezone === 'Asia/Tokyo') return 'JST (GMT+9)';
    if (timezone === 'Europe/London') return 'GMT/BST';
    if (timezone === 'America/New_York') return 'EST (GMT-5)';
    return timezone;
}



// Helper untuk parse nama kota dari option text
getCityNameFromOption(optionText) {
    const match = optionText.match(/\(([^)]+)\)/);
    return match ? match[1].trim() : optionText.split('(')[0].trim();
}

// Helper untuk parse nama provinsi dari option text
getProvinceNameFromOption(optionText) {
    const match = optionText.match(/^(.+?)\(/);
    return match ? match[1].trim() : optionText.split('-')[0].trim();
}

    // ==================== TIMEZONE DETECTION ====================
getTimezoneFromCoordinates(lat, lon) {
    console.log(`🌍 Timezone detection for: ${lat}, ${lon}`);
    
    // INDONESIA - PAKAI DATA DARI PROVINSI, JANGAN LOGIKA KOORDINAT!
    if (lat > -11 && lat < 6 && lon > 95 && lon < 141) {
        console.log("📍 Indonesia location detected");
        
        // CARI PROVINSI BERDASARKAN KOORDINAT
        for (const prov of this.INDONESIA_PROVINCES) {
            // Tolerance ±0.5 derajat untuk matching
            const latDiff = Math.abs(prov.lat - lat);
            const lonDiff = Math.abs(prov.lon - lon);
            
            if (latDiff < 0.5 && lonDiff < 0.5) {
                console.log(`📍 Matched province: ${prov.name} -> ${prov.timezone}`);
                return prov.timezone;
            }
        }
        
        // Jika tidak match, gunakan logika default
        if (lon > 129) return "Asia/Jayapura";      // WIT
        if (lon > 118.5 && lat < 10) return "Asia/Makassar"; // WITA
        return "Asia/Jakarta";                      // WIB
    }

    
    // INTERNATIONAL CITIES dengan display name yang user-friendly
    // Singapore
    if (lat > 1.2 && lat < 1.5 && lon > 103.6 && lon < 104.0) {
        return "Asia/Singapore";
    }
    // Tokyo, Japan
    if (lat > 35.6 && lat < 35.7 && lon > 139.6 && lon < 139.8) {
        return "Asia/Tokyo";
    }
    // London, UK
    if (lat > 51.5 && lat < 51.6 && lon > -0.2 && lon < 0) {
        return "Europe/London";
    }
    // New York, USA
    if (lat > 40.7 && lat < 40.8 && lon > -74.1 && lon < -73.9) {
        return "America/New_York";
    }
    // Sydney, Australia
    if (lat > -33.9 && lat < -33.8 && lon > 151.1 && lon < 151.2) {
        return "Australia/Sydney";
    }
    // Paris, France
    if (lat > 48.85 && lat < 48.86 && lon > 2.34 && lon < 2.35) {
        return "Europe/Paris";
    }
    // Bangkok, Thailand
    if (lat > 13.7 && lat < 13.8 && lon > 100.4 && lon < 100.5) {
        return "Asia/Bangkok";
    }
    // Seoul, South Korea
    if (lat > 37.5 && lat < 37.6 && lon > 126.9 && lon < 127.0) {
        return "Asia/Seoul";
    }
    // Dubai, UAE
    if (lat > 25.2 && lat < 25.3 && lon > 55.2 && lon < 55.3) {
        return "Asia/Dubai";
    }
    // Beijing, China
    if (lat > 39.9 && lat < 40.0 && lon > 116.3 && lon < 116.4) {
        return "Asia/Shanghai";
    }
    
    // DEFAULT: UTC (jangan Asia/Jakarta!)
    console.warn('⚠️ No specific timezone found, returning UTC');
    return "UTC";
}



getLocalHour() {
    const timezone = this.timezone || 'Asia/Jakarta';
    
    try {
        const now = new Date();
        const options = { 
            timeZone: timezone,
            hour: '2-digit', 
            hour12: false 
        };
        const timeString = now.toLocaleTimeString('en-US', options);
        return parseInt(timeString.split(':')[0]);
    } catch (error) {
        return new Date().getHours();
    }
}



stopTimeUpdates() {
    console.log(`🔴 Attempting to stop timer. Current timer ID: ${this.timeUpdateInterval}`);
    
    if (this.timeUpdateInterval) {
        clearInterval(this.timeUpdateInterval);
        this.timeUpdateInterval = null;
        console.log("✅ Timer stopped successfully");
    } else {
        console.log("ℹ️ No active timer to stop");
    }
    
    // Clear juga timeout jika ada
    if (this.timeUpdateTimeout) {
        clearTimeout(this.timeUpdateTimeout);
        this.timeUpdateTimeout = null;
    }
}
    updateTimeDisplay() {
    const now = new Date();
    
    // Update current time
    const timeElement = document.getElementById('currentTime');
    if (timeElement) {
        try {
            timeElement.textContent = now.toLocaleTimeString('id-ID', {
                timeZone: this.timezone,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
        } catch (e) {
            timeElement.textContent = now.toLocaleTimeString('id-ID');
        }
    }
    
    // Update date display
    const dateElement = document.getElementById('dataTimestamp');
    if (dateElement) {
        try {
            dateElement.textContent = now.toLocaleDateString('id-ID', {
                timeZone: this.timezone,
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (e) {
            dateElement.textContent = now.toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }
    }
    
    // Update time period
    this.updateTimePeriod();
}

    // Tambahkan method ini di class UVGuardIndex (bisa di dekat method time handling)
updateTimePeriod() {
    // Panggil method baru dengan timezone saat ini
    if (this.timezone) {
        this.updateTimePeriodWithTimezone(this.timezone);
    } else {
        // Fallback ke browser time
        const hour = new Date().getHours();
        this.updateTimePeriodSimple(hour);
    }
}

// Method bantu jika perlu
updateTimePeriodSimple(hour) {
    let period = '';
    let periodIcon = '';
    let periodColor = '';
    
    if (hour >= 5 && hour < 11) {
        period = 'Pagi';
        periodIcon = '🌅';
        periodColor = '#FF8C00';
    } else if (hour >= 11 && hour < 15) {
        period = 'Siang';
        periodIcon = '☀️';
        periodColor = '#FF4500';
    } else if (hour >= 15 && hour < 18) {
        period = 'Sore';
        periodIcon = '🌇';
        periodColor = '#FF8C00';
    } else if (hour >= 18 && hour < 24) {
        period = 'Malam';
        periodIcon = '🌙';
        periodColor = '#4169E1';
    } else {
        period = 'Dini Hari';
        periodIcon = '🌌';
        periodColor = '#2F4F4F';
    }
    
    const dayNightElement = document.getElementById('dayNightIndicator');
    if (dayNightElement) {
        dayNightElement.innerHTML = `${periodIcon} ${period}`;
        dayNightElement.style.color = periodColor;
    }
}

updateTimePeriod() {
    if (!this.currentData) return;
    
    // PAKAI getLocalHour() bukan manual calculation
    const hour = this.getLocalHour();
    
    // Determine time period
    let period = '';
    let periodIcon = '';
    let periodColor = '';
    
    if (hour >= 5 && hour < 11) {
        period = 'Pagi';
        periodIcon = '🌅';
        periodColor = '#FF8C00';
    } else if (hour >= 11 && hour < 15) {
        period = 'Siang';
        periodIcon = '☀️';
        periodColor = '#FF4500';
    } else if (hour >= 15 && hour < 18) {
        period = 'Sore';
        periodIcon = '🌇';
        periodColor = '#FF8C00';
    } else if (hour >= 18 && hour < 24) {
        period = 'Malam';
        periodIcon = '🌙';
        periodColor = '#4169E1';
    } else {
        period = 'Dini Hari';
        periodIcon = '🌌';
        periodColor = '#2F4F4F';
    }
    
    // Update dayNightIndicator (Periode)
    const dayNightElement = document.getElementById('dayNightIndicator');
    if (dayNightElement) {
        dayNightElement.innerHTML = `${periodIcon} ${period}`;
        dayNightElement.style.color = periodColor;
        dayNightElement.style.fontWeight = 'bold';
    }
    
    // Update time status dengan logika yang sama
    const timeStatusElement = document.getElementById('timeStatus');
    if (timeStatusElement) {
        // KONSISTEN dengan period di atas
        if (hour >= 5 && hour < 11) {
            timeStatusElement.innerHTML = '🌅 Pagi Hari';
            timeStatusElement.style.color = '#FF8C00';
        } else if (hour >= 11 && hour < 15) {
            timeStatusElement.innerHTML = '☀️ Siang Hari';
            timeStatusElement.style.color = '#FF4500';
        } else if (hour >= 15 && hour < 18) {
            timeStatusElement.innerHTML = '🌇 Sore Hari';
            timeStatusElement.style.color = '#FF8C00';
        } else if (hour >= 18 && hour < 24) {
            timeStatusElement.innerHTML = '🌙 Malam Hari';
            timeStatusElement.style.color = '#4169E1';
        } else {
            timeStatusElement.innerHTML = '🌌 Dini Hari';
            timeStatusElement.style.color = '#2F4F4F';
        }
    }
}

   // ==================== SIMPLE TIMEZONE FIX ====================
// ==================== TIMEZONE FIX - 100% AKURAT ====================
fixIndonesianTimezone() {
    if (!this.currentLocation || !this.currentLocation.province) {
        console.log("❌ No province to fix");
        return;
    }
    
    const provinceName = this.currentLocation.province;
    console.log(`🔍 Fixing timezone for: "${provinceName}"`);
    
    // CARI DI DATA PROVINSI - 100% AKURAT
    for (const prov of this.INDONESIA_PROVINCES) {
        if (prov.name === provinceName) {
            console.log(`✅ Found exact match: ${prov.name} -> ${prov.timezone}`);
            this.timezone = prov.timezone;
            this.currentLocation.timezone = prov.timezone;
            return;
        }
    }
    
    // JIKA TIDAK EXACT MATCH, COBA PARTIAL MATCH
    const provinceLower = provinceName.toLowerCase();
    
    // WIT DULU
    if (provinceLower.includes('papua') || provinceLower.includes('maluku')) {
        console.log(`✅ Partial match WIT: ${provinceName} -> Asia/Jayapura`);
        this.timezone = "Asia/Jayapura";
        this.currentLocation.timezone = "Asia/Jayapura";
        return;
    }
    
    // WITA
    const witaKeywords = ['bali', 'sulawesi', 'nusa tenggara', 'kalimantan timur', 
                         'kalimantan selatan', 'kalimantan utara', 'gorontalo'];
    
    for (const keyword of witaKeywords) {
        if (provinceLower.includes(keyword)) {
            console.log(`✅ Partial match WITA: ${provinceName} -> Asia/Makassar (keyword: ${keyword})`);
            this.timezone = "Asia/Makassar";
            this.currentLocation.timezone = "Asia/Makassar";
            return;
        }
    }
    
    // DEFAULT WIB
    console.log(`ℹ️ Default to WIB: ${provinceName} -> Asia/Jakarta`);
    this.timezone = "Asia/Jakarta";
    this.currentLocation.timezone = "Asia/Jakarta";
}

    startTimeUpdates() {
    // Stop timer lama
    if (this.timeUpdateInterval) {
        clearInterval(this.timeUpdateInterval);
    }
    
    // Jika tidak ada lokasi yang dipilih, gunakan browser time
    if (!this.currentLocation || !this.timezone) {
        console.log("🌐 No location selected, using browser time");
        this.updateBrowserTime();
        return;
    }
    
    const timezone = this.timezone || 'Asia/Jakarta';
    
    // Fungsi untuk update waktu
    const updateTime = () => {
        const now = new Date();
        
        try {
            // Format waktu untuk timezone
            const timeStr = now.toLocaleTimeString('id-ID', {
                timeZone: timezone,
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
            
            const dateStr = now.toLocaleDateString('id-ID', {
                timeZone: timezone,
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            // Update tampilan
            const timeElement = document.getElementById('currentTime');
            const dateElement = document.getElementById('dataTimestamp');
            
            if (timeElement) {
                timeElement.textContent = timeStr;
                timeElement.style.color = '#0066cc';
            }
            if (dateElement) {
                dateElement.textContent = dateStr;
                dateElement.style.color = '#0066cc';
            }
            
            // Update timezone info display
const tzInfoElement = document.getElementById('timezoneInfo');
if (tzInfoElement) {
    const displayText = this.formatTimezoneForDisplay(timezone);
    const color = this.getTimezoneColor(timezone);
    
    tzInfoElement.textContent = displayText;
    tzInfoElement.style.color = color;
}
            
            // Update time period
            this.updateTimePeriodWithTimezone(timezone);
            
        } catch (error) {
            console.error("❌ Timezone error, falling back to browser time:", error);
            this.updateBrowserTime();
        }
    };
    
    // Jalankan sekarang
    updateTime();
    
    // Update setiap detik
    this.timeUpdateInterval = setInterval(updateTime, 1000);
    console.log(`🟢 Timer started with timezone: ${timezone}`);
}

// Method baru untuk browser time
updateBrowserTime() {
    const now = new Date();
    
    const timeElement = document.getElementById('currentTime');
    const dateElement = document.getElementById('dataTimestamp');
    
    if (timeElement) {
        timeElement.textContent = now.toLocaleTimeString('id-ID');
        timeElement.style.color = '#666';
    }
    
    if (dateElement) {
        dateElement.textContent = now.toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        dateElement.style.color = '#666';
    }
    
    // Kosongkan timezone display
    const tzInfoElement = document.getElementById('timezoneInfo');
    if (tzInfoElement) {
        tzInfoElement.textContent = "--";
        tzInfoElement.style.color = "#666";
    }
    
    // Update time period sederhana
    const hour = now.getHours();
    this.updateTimePeriodSimple(hour);
}

// Method baru untuk update time
updateSingleTimeDisplay() {
    const now = new Date();
    
    try {
        // Target timezone
        const targetTime = now.toLocaleTimeString('id-ID', {
            timeZone: this.timezone,
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        
        const targetDate = now.toLocaleDateString('id-ID', {
            timeZone: this.timezone,
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        // Update elements
        const timeElement = document.getElementById('currentTime');
        const dateElement = document.getElementById('dataTimestamp');
        
        if (timeElement) {
            timeElement.textContent = targetTime;
            timeElement.style.color = '#0066cc';
        }
        
        if (dateElement) {
            dateElement.textContent = targetDate;
        }
        
        // Update time period
        this.updateTimePeriodWithTimezone(this.timezone);
        
    } catch (error) {
        console.error(`❌ Timezone error: ${this.timezone}`, error);
        
        // Fallback ke browser time
        const timeElement = document.getElementById('currentTime');
        if (timeElement) {
            timeElement.textContent = now.toLocaleTimeString('id-ID');
            timeElement.style.color = '#ff3300';
        }
    }
}


// Tambahkan method helper untuk fallback timezone
getFallbackTimezone(failedTimezone) {
    // Mapping fallback timezones
    const fallbackMap = {
        'Asia/Jakarta': 'Asia/Singapore',
        'Asia/Singapore': 'Asia/Jakarta',
        'Asia/Tokyo': 'Asia/Shanghai',
        'Asia/Shanghai': 'Asia/Tokyo',
        'Europe/London': 'Europe/Paris',
        'Europe/Paris': 'Europe/London',
        'America/New_York': 'America/Chicago',
        'America/Chicago': 'America/New_York'
    };
    
    return fallbackMap[failedTimezone] || 'UTC';
}
    
    // ==================== CHART SYSTEM ====================
initCharts() {
    console.log("📊 Initializing charts...");
    
    // UV Chart
    const uvCtx = document.getElementById('uvChart');
    if (!uvCtx) {
        console.error("❌ UV chart canvas not found!");
        return;
    }
    
    // Destroy previous chart if exists
    if (this.charts.uv) {
        try {
            this.charts.uv.destroy();
        } catch (e) {
            console.warn("Error destroying old chart:", e);
        }
    }
    
    try {
        this.charts.uv = new Chart(uvCtx.getContext('2d'), {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'UV Index',
                    data: [],
                    borderColor: '#0066cc',
                    backgroundColor: 'rgba(0, 102, 204, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 4,
                    pointBackgroundColor: '#0066cc',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        callbacks: {
                            label: (context) => `UV Index: ${context.parsed.y.toFixed(2)}`
                        }
                    }
                },
                scales: {
                    x: {
                        type: 'category',
                        title: {
                            display: true,
                            text: 'Waktu',
                            color: '#64748b'
                        },
                        grid: { color: 'rgba(0,0,0,0.05)' }
                    },
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'UV Index',
                            color: '#64748b'
                        },
                        grid: { color: 'rgba(0,0,0,0.05)' },
                        suggestedMin: 0, // TAMBAHKAN INI
                        suggestedMax: 8, // KURANGI DARI 15 KE 8 (atau lebih rendah)
                        ticks: {
                            callback: function(value) {
                                // Tampilkan dengan 2 desimal untuk nilai kecil
                                if (value < 1) {
                                    return value.toFixed(2);
                                } else if (value < 10) {
                                    return value.toFixed(1);
                                }
                                return value;
                            }
                        }
                    }
                },
                animation: {
                    duration: 1000,
                    easing: 'easeOutQuart'
                }
            }
        });
        console.log("✅ UV Chart initialized");
        
        // Update chart with existing data
        if (this.dataHistory.length > 0) {
            setTimeout(() => {
                this.updateCharts();
            }, 100);
        }
        
    } catch (error) {
        console.error("❌ Error initializing UV chart:", error);
    }
}
    
    // ========== NEW METHOD: Update Time Period dengan Timezone Tertentu ==========
updateTimePeriodWithTimezone(timezone) {
    console.log(`🌐 Updating time for timezone: ${timezone}`);
    
    try {
        const now = new Date();
        
        // Dapatkan jam di timezone target
        let hour;
        try {
            const timeString = now.toLocaleTimeString('en-US', { 
                timeZone: timezone, 
                hour: '2-digit', 
                hour12: false 
            });
            hour = parseInt(timeString.split(':')[0]);
        } catch (e) {
            hour = now.getHours();
        }
        
        // Tentukan periode dengan LOGIKA SAMA untuk semua
        let period = '', periodIcon = '', periodColor = '';
        
        if (hour >= 5 && hour < 11) {
            period = 'Pagi';
            periodIcon = '🌅';
            periodColor = '#FF8C00';
        } else if (hour >= 11 && hour < 15) {
            period = 'Siang';
            periodIcon = '☀️';
            periodColor = '#FF4500';
        } else if (hour >= 15 && hour < 18) {
            period = 'Sore';
            periodIcon = '🌇';
            periodColor = '#FF8C00';
        } else if (hour >= 18 && hour < 24) {
            period = 'Malam';
            periodIcon = '🌙';
            periodColor = '#4169E1';
        } else {
            period = 'Dini Hari';
            periodIcon = '🌌';
            periodColor = '#2F4F4F';
        }
        
        // Update dayNightIndicator (PERIODE)
        const dayNightElement = document.getElementById('dayNightIndicator');
        if (dayNightElement) {
            dayNightElement.innerHTML = `${periodIcon} ${period}`;
            dayNightElement.style.color = periodColor;
        }
        
        // Update timeStatus dengan LABEL SAMA
        const timeStatusElement = document.getElementById('timeStatus');
        if (timeStatusElement) {
            timeStatusElement.innerHTML = `${periodIcon} ${period}`;
            timeStatusElement.style.color = periodColor;
        }
        
        console.log(`✅ Period: ${period} (Hour: ${hour}, Timezone: ${timezone})`);
        
    } catch (error) {
        console.error('❌ Error in updateTimePeriodWithTimezone:', error);
    }
}

    // ==================== ADVANCED SCROLL NAVIGATION ====================
// ==================== SIMPLE SCROLL NAVIGATION (NO DROPDOWN) ====================
setupScrollNavigation() {
    console.log("🔍 Setting up simple scroll navigation (no dropdown)...");
    
    setTimeout(() => {
        const navLinks = document.querySelectorAll('.nav-link');
        
        // Mapping: Section yang dilihat → Navigation yang di-highlight
        const sectionToNavMap = {
            'dashboard': '#dashboard',
            'data-input': '#data-input',    // Koneksi Data → Analisis
            'analisis': '#data-input',      // Analisis Matematis → Analisis
            'dampak': '#dampak',
            'berjemur': '#berjemur',
            'sun-effects': '#berjemur',     // Manfaat & Risiko → Berjemur
            'rekomendasi': '#rekomendasi',
            'edukasi': '#edukasi'
        };
        
        // Function to update active nav
        const updateActiveNav = () => {
            const sections = document.querySelectorAll('section[id]');
            let activeSectionId = '';
            
            // Find which section is most visible
            sections.forEach(section => {
                const rect = section.getBoundingClientRect();
                const isVisible = (
                    rect.top <= window.innerHeight * 0.5 &&
                    rect.bottom >= window.innerHeight * 0.3
                );
                
                if (isVisible) {
                    activeSectionId = section.id;
                }
            });
            
            // If no section found, check for specific positions
            if (!activeSectionId) {
                const scrollPos = window.scrollY + 100;
                
                // Manual check for sections
                const sectionsData = [
                    { id: 'dashboard', element: document.getElementById('dashboard') },
                    { id: 'data-input', element: document.getElementById('data-input') },
                    { id: 'analisis', element: document.getElementById('analisis') },
                    { id: 'dampak', element: document.getElementById('dampak') },
                    { id: 'berjemur', element: document.getElementById('berjemur') },
                    { id: 'sun-effects', element: document.getElementById('sun-effects') },
                    { id: 'rekomendasi', element: document.getElementById('rekomendasi') },
                    { id: 'edukasi', element: document.getElementById('edukasi') }
                ];
                
                sectionsData.forEach(({ id, element }) => {
                    if (element) {
                        const elementTop = element.offsetTop;
                        const elementBottom = elementTop + element.offsetHeight;
                        
                        if (scrollPos >= elementTop && scrollPos < elementBottom) {
                            activeSectionId = id;
                        }
                    }
                });
            }
            
            // Update nav links
            if (activeSectionId) {
                const targetNavId = sectionToNavMap[activeSectionId];
                
                navLinks.forEach(link => {
                    const href = link.getAttribute('href');
                    
                    if (href === targetNavId) {
                        // Active link
                        link.classList.add('active');
                        link.style.color = '#0066cc';
                        link.style.fontWeight = 'bold';
                        link.style.background = 'rgba(0, 102, 204, 0.1)';
                        link.style.borderRadius = '4px';
                        link.style.padding = '8px 16px';
                    } else {
                        // Inactive link
                        link.classList.remove('active');
                        link.style.color = '';
                        link.style.fontWeight = '';
                        link.style.background = '';
                        link.style.padding = '8px 16px';
                    }
                });
                
                console.log(`📍 Active: ${activeSectionId} → Nav: ${targetNavId}`);
            }
        };
        
        // Set up event listeners
        window.addEventListener('scroll', updateActiveNav);
        window.addEventListener('resize', updateActiveNav);
        
        // Initial update
        setTimeout(updateActiveNav, 100);
        
        console.log('✅ Simple navigation setup complete');
    }, 1000);
}

// Setup Intersection Observer
setupIntersectionObserver(navLinks) {
    const sections = document.querySelectorAll('section[id]');
    
    // Create observer
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id;
                    this.updateNavLinks(sectionId, navLinks);
                }
            });
        },
        {
            root: null,
            rootMargin: '-20% 0px -20% 0px',
            threshold: 0.1
        }
    );
    
    // Observe all sections
    sections.forEach(section => {
        observer.observe(section);
    });
}

// Update nav links based on active section
updateNavLinks(activeSectionId, navLinks) {
    const sectionMap = {
        'data-input': 'analisis',
        'sun-effects': 'berjemur'
    };
    
    // Get the nav section (mapped if needed)
    const navSectionId = sectionMap[activeSectionId] || activeSectionId;
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (!href || !href.startsWith('#')) return;
        
        const targetId = href.substring(1);
        
        // Check if this link should be active
        const shouldBeActive = 
            targetId === navSectionId ||
            targetId === activeSectionId ||
            (sectionMap[targetId] === activeSectionId);
        
        if (shouldBeActive) {
            link.classList.add('active');
            link.style.color = '#0066cc';
            link.style.fontWeight = 'bold';
        } else {
            link.classList.remove('active');
            link.style.color = '';
            link.style.fontWeight = '';
        }
    });
}

    // Smooth scroll for nav links
setupSmoothScroll() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const href = link.getAttribute('href');
            if (!href.startsWith('#')) return;
            
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                // Update active nav immediately
                document.querySelectorAll('.nav-link').forEach(nav => {
                    nav.classList.remove('active');
                    nav.style.color = '';
                    nav.style.fontWeight = '';
                    nav.style.background = '';
                });
                
                link.classList.add('active');
                link.style.color = '#ffffff';
                link.style.fontWeight = 'bold';
                link.style.background = 'linear-gradient(135deg, #0066cc, #0099ff)';
                
                // Smooth scroll
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Helper to get parent section ID
getParentSectionId(subSectionId) {
    const parentMap = {
        'data-input': 'analisis',
        'sun-effects': 'berjemur'
    };
    return parentMap[subSectionId] || subSectionId;
}

// Backup scroll detection
setupScrollBackup(navLinks, sectionDetectionPoints) {
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY + 100;
        const viewportHeight = window.innerHeight;
        
        // Check setiap section
        sectionDetectionPoints.forEach(section => {
            let isSectionActive = false;
            
            // Check semua selector untuk section ini
            section.selectors.forEach(selector => {
                if (isSectionActive) return; // Skip jika sudah ditemukan
                
                try {
                    let elements;
                    
                    if (selector.includes(':contains(')) {
                        // Handle text content matching
                        const text = selector.match(/:contains\("([^"]+)"\)/)[1];
                        elements = Array.from(document.querySelectorAll('h2, h3, h4')).filter(el => 
                            el.textContent.includes(text)
                        );
                    } else {
                        elements = document.querySelectorAll(selector);
                    }
                    
                    elements.forEach(element => {
                        const rect = element.getBoundingClientRect();
                        const elementTop = window.scrollY + rect.top;
                        const elementBottom = elementTop + rect.height;
                        
                        // Jika elemen berada dalam viewport (dengan threshold)
                        if (scrollPosition >= elementTop - 100 && 
                            scrollPosition <= elementBottom - 100) {
                            isSectionActive = true;
                        }
                    });
                } catch (e) {
                    // Skip selector yang error
                }
            });
            
            // Update nav link untuk section ini
            navLinks.forEach(link => {
                const href = link.getAttribute('href');
                if (!href || !href.startsWith('#')) return;
                
                const targetId = href.substring(1);
                
                if (targetId === section.id && isSectionActive) {
                    link.classList.add('active');
                    link.style.color = '#0066cc';
                    link.style.fontWeight = 'bold';
                    link.style.background = 'rgba(0, 102, 204, 0.1)';
                } else if (targetId === section.id) {
                    link.classList.remove('active');
                    link.style.color = '';
                    link.style.fontWeight = '';
                    link.style.background = '';
                }
            });
        });
    });
}
// Method untuk update link aktif
updateActiveNavLink(sectionId) {
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        
        // Hapus # dari href untuk matching
        const linkHref = link.getAttribute('href');
        const linkTarget = linkHref.substring(1); // hapus karakter '#'
        
        if (linkTarget === sectionId) {
            link.classList.add('active');
            
            // Tambahkan visual feedback
            link.style.color = '#0066cc';
            link.style.fontWeight = 'bold';
            link.style.background = 'rgba(0, 102, 204, 0.1)';
            link.style.borderRadius = '4px';
            link.style.padding = '5px 10px';
            
            console.log(`📍 Active section: ${sectionId}`);
        } else {
            link.style.color = '';
            link.style.fontWeight = '';
            link.style.background = '';
            link.style.padding = '';
        }
    });
}

    // ==================== EVENT LISTENERS ====================
    initEventListeners() {
    console.log("🔗 Initializing event listeners...");
    
    // Location detection button - JANGAN auto-fetch
    const detectBtn = document.getElementById('detectLocation');
    if (detectBtn) {
        detectBtn.addEventListener('click', () => {
            this.detectUserLocation(); // Ini hanya deteksi, tidak fetch
        });
    }
    
    // City search button - JANGAN auto-fetch
    const searchBtn = document.getElementById('searchCity');
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            this.searchCityUniversal(); // Ini hanya search, tidak fetch
        });
    }
    
    // Use coordinates button - JANGAN auto-fetch
    const coordsBtn = document.getElementById('useCoordsBtn');
    if (coordsBtn) {
        coordsBtn.addEventListener('click', () => {
            this.useCoordinates(); // Ini hanya set koordinat, tidak fetch
        });
    }
    
    // HANYA ini yang trigger fetch data
    const fetchBtn = document.getElementById('fetchData');
    if (fetchBtn) {
        fetchBtn.addEventListener('click', () => {
            this.fetchData(); // Ini fetch data
        });
    }
    
    // Refresh button - fetch data
    const refreshBtn = document.getElementById('refreshData');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            this.fetchData();
        });
    }

        
        // Start monitoring button
        const startMonitorBtn = document.getElementById('startMonitoring');
        if (startMonitorBtn) {
            startMonitorBtn.addEventListener('click', () => {
                this.startMonitoring();
            });
        }
        
        // Stop monitoring button
        const stopMonitorBtn = document.getElementById('stopMonitoring');
        if (stopMonitorBtn) {
            stopMonitorBtn.addEventListener('click', () => {
                this.stopMonitoring();
            });
        }
        
        // Export data button
        const exportBtn = document.getElementById('exportDataBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.exportData();
            });
        }
        
        // Clear history button
        const clearBtn = document.getElementById('clearHistoryBtn');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                this.clearHistory();
            });
        }
        
        // Chart range selector
        const chartRange = document.getElementById('chartRange');
        if (chartRange) {
            chartRange.addEventListener('change', (e) => {
                const hours = parseInt(e.target.value);
                this.updateChartRange(hours);
            });
        }
        
        // City input enter key
        const cityInput = document.getElementById('cityInput');
        if (cityInput) {
            cityInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.searchCityUniversal();
                }
            });
        }
        
        console.log("✅ All event listeners initialized");
    }
    
    // ==================== LOCATION METHODS ====================
    setDefaultLocation() {
    console.log("📍 Setting default location...");
    
    // JANGAN langsung set location, biarin kosong dulu
    this.currentLocation = null;
    this.timezone = 'Asia/Jakarta'; // Default timezone saja
    
    // Kosongkan semua input fields
    const cityInput = document.getElementById('cityInput');
    const latInput = document.getElementById('latInput');
    const lonInput = document.getElementById('lonInput');
    
    if (cityInput) cityInput.value = "";
    if (latInput) latInput.value = "";
    if (lonInput) lonInput.value = "";
    
    // Update status location
    this.updateLocationStatus("Silakan pilih lokasi");
    
    // Tampilkan placeholder data
    this.showPlaceholderData();
    
    console.log("📍 Default location cleared, waiting for user input");
}
    
    async detectUserLocation() {
    console.log("📍 Attempting to detect location...");
    
    // ====== TAMBAH INI DI AWAL ======
    console.log("🛑 Stopping timer before location detection...");
    this.stopTimeUpdates();
    
    this.showNotification("Mendeteksi lokasi... Browser akan meminta izin.", "info");
    
    if (!navigator.geolocation) {
        const errorMsg = "Browser Anda tidak mendukung geolocation. Gunakan browser modern.";
        this.showNotification(errorMsg, "error");
        this.updateLocationStatus("Browser tidak support geolocation");
        
        // ====== TAMBAH INI ======
        console.log("🟢 Restarting timer after geolocation error...");
        this.startTimeUpdates();
        
        this.useDefaultLocationFallback();
        return;
    }
    
    const geoOptions = {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 60000
    };
    
    try {
        const position = await new Promise((resolve, reject) => {
            const timeoutId = setTimeout(() => {
                reject(new Error("Timeout: Gagal mendapatkan lokasi dalam 15 detik"));
            }, 15000);
            
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    clearTimeout(timeoutId);
                    resolve(pos);
                },
                (err) => {
                    clearTimeout(timeoutId);
                    reject(err);
                },
                geoOptions
            );
        });

        console.log("✅ Geolocation success:", position);
        
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const accuracy = position.coords.accuracy;
        
        console.log(`Coordinates: ${lat}, ${lon} (accuracy: ${accuracy}m)`);
        
        this.currentLocation = {
            lat: lat,
            lon: lon,
            name: "Lokasi Anda",
            country: "ID",
            timezone: this.getTimezoneFromCoordinates(lat, lon)
        };
        
        // ====== TAMBAH INI ======
        this.timezone = this.currentLocation.timezone;
        console.log(`🔄 Timezone set to: ${this.timezone}`);
        // Update timezone display immediately
const tzInfoElement = document.getElementById('timezoneInfo');
if (tzInfoElement) {
    const displayText = this.formatTimezoneForDisplay(this.timezone);
    const color = this.getTimezoneColor(this.timezone);
    
    tzInfoElement.textContent = displayText;
    tzInfoElement.style.color = color;
}
        // ====== TAMBAH INI ======
        console.log("🟢 Restarting timer with detected location...");
        this.startTimeUpdates();
        
        this.updateLocationInputs("Lokasi Anda", lat, lon);
        this.updateLocationStatus(`Lokasi terdeteksi (akurasi: ${Math.round(accuracy)}m)`);
        
        // Try to get city name
        setTimeout(async () => {
            try {
                const locationInfo = await this.reverseGeocode(lat, lon);
                if (locationInfo && locationInfo.city) {
                    const displayName = locationInfo.state ? 
                        `${locationInfo.city}, ${locationInfo.state}, ${locationInfo.country}` :
                        `${locationInfo.city}, ${locationInfo.country}`;
                    
                    this.currentLocation.name = locationInfo.city;
                    this.currentLocation.country = locationInfo.country;
                    
                    const cityInput = document.getElementById('cityInput');
                    if (cityInput) cityInput.value = displayName;
                    
                    this.updateLocationStatus(`Lokasi: ${displayName}`);
                }
            } catch (geoError) {
                console.warn("Reverse geocode failed:", geoError);
            }
        }, 0);
        
        this.showNotification("Lokasi berhasil dideteksi!", "success");
        
        setTimeout(() => this.fetchData(), 1000);
        
    } catch (error) {
        console.error("❌ Geolocation failed:", error);
        
        let userMessage = "Gagal mendeteksi lokasi";
        let suggestion = "";
        
        if (error.code === 1 || error.message.includes("denied")) {
            userMessage = "Izin lokasi ditolak";
            suggestion = "Izinkan akses lokasi di browser settings dan coba lagi.";
        } else if (error.code === 2 || error.message.includes("unavailable")) {
            userMessage = "Lokasi tidak tersedia";
            suggestion = "Pastikan GPS/Internet aktif.";
        } else if (error.code === 3 || error.message.includes("timeout")) {
            userMessage = "Timeout mendapatkan lokasi";
            suggestion = "Coba lagi dengan koneksi lebih baik.";
        } else {
            userMessage = `Error: ${error.message || "Tidak diketahui"}`;
        }
        
        this.showNotification(`${userMessage}. ${suggestion}`, "error");
        this.updateLocationStatus("Gagal deteksi lokasi");
        
        // ====== TAMBAH INI ======
        console.log("🟢 Restarting timer after geolocation failure...");
        this.startTimeUpdates();
        
        setTimeout(() => {
            this.useDefaultLocationFallback();
        }, 2000);
    }
}
    
    async getTimezoneFromAPI(lat, lon) {
    try {
        // API Gratis: TimezoneDB
        const response = await fetch(
            `https://api.timezonedb.com/v2.1/get-time-zone?key=YOUR_KEY&format=json&by=position&lat=${lat}&lng=${lon}`
        );
        const data = await response.json();
        return data.zoneName || "UTC";
    } catch (error) {
        // Fallback ke Google Timezone API
        const timestamp = Math.floor(Date.now() / 1000);
        const response = await fetch(
            `https://maps.googleapis.com/maps/api/timezone/json?location=${lat},${lon}&timestamp=${timestamp}&key=YOUR_GOOGLE_KEY`
        );
        const data = await response.json();
        return data.timeZoneId || "UTC";
    }
}

    
    useDefaultLocationFallback() {
    console.log("🔄 Using default location fallback...");
    
    // ====== TAMBAH INI ======
    console.log("🛑 Stopping timer before fallback...");
    this.stopTimeUpdates();
    
    this.currentLocation = {
        lat: -6.2088,
        lon: 106.8456,
        name: "Jakarta",
        province: "DKI Jakarta",
        country: "ID",
        timezone: "Asia/Jakarta"
    };
    
    // ====== TAMBAH INI ======
    this.timezone = "Asia/Jakarta";
    console.log(`🔄 Timezone set to: ${this.timezone}`);
    
    const cityInput = document.getElementById('cityInput');
    const latInput = document.getElementById('latInput');
    const lonInput = document.getElementById('lonInput');
    
    if (cityInput) cityInput.value = "Jakarta, Indonesia";
    if (latInput) latInput.value = "-6.2088";
    if (lonInput) lonInput.value = "106.8456";
    
    this.updateLocationStatus("Lokasi default: Jakarta, Indonesia");
    
    // ====== TAMBAH INI ======
    console.log("🟢 Restarting timer with Jakarta timezone...");
    this.startTimeUpdates();
    
    this.showNotification("Menggunakan lokasi default Jakarta", "info");
    
    setTimeout(() => {
        this.fetchData();
    }, 1000);
}
    
    updateLocationInputs(name, lat, lon) {
        const cityInput = document.getElementById('cityInput');
        const latInput = document.getElementById('latInput');
        const lonInput = document.getElementById('lonInput');
        
        if (cityInput) cityInput.value = name;
        if (latInput) latInput.value = lat.toFixed(6);
        if (lonInput) lonInput.value = lon.toFixed(6);
    }
    
    // ==================== ADVANCED CITY SEARCH ====================
    async searchCityUniversal() {
    const cityInput = document.getElementById('cityInput');
    if (!cityInput) return;
    
    // ====== TAMBAH INI DI AWAL METHOD ======
    console.log("🛑 Stopping timer before city search...");
    this.stopTimeUpdates();
    
    const searchText = cityInput.value.trim();
    
    if (!searchText) {
        this.showNotification("Masukkan nama kota atau koordinat", "warning");
        // ====== TAMBAH INI ======
        console.log("⚠️ No search text, restarting timer...");
        this.startTimeUpdates();
        return;
    }
    
    // Cek apakah input adalah koordinat
    const coordRegex = /^(-?\d+\.?\d*)[,\s]+(-?\d+\.?\d*)$/;
    const coordMatch = searchText.match(coordRegex);
    
    if (coordMatch) {
        const lat = parseFloat(coordMatch[1]);
        const lon = parseFloat(coordMatch[2]);
        
        if (isNaN(lat) || isNaN(lon)) {
            this.showNotification("Koordinat tidak valid", "error");
            // ====== TAMBAH INI ======
            this.startTimeUpdates();
            return;
        }
        
        if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
            this.showNotification("Koordinat di luar rentang valid", "error");
            // ====== TAMBAH INI ======
            this.startTimeUpdates();
            return;
        }
        
        this.currentLocation = { 
            lat, 
            lon, 
            name: `Koordinat (${lat.toFixed(4)}, ${lon.toFixed(4)})`,
            country: "XX",
            timezone: this.getTimezoneFromCoordinates(lat, lon)
        };
        
        // ====== TAMBAH INI ======
        this.timezone = this.currentLocation.timezone;
        console.log(`🔄 Timezone set to: ${this.timezone}`);
        // Update display immediately
const tzInfoElement = document.getElementById('timezoneInfo');
if (tzInfoElement) {
    const displayText = this.formatTimezoneForDisplay(this.timezone);
    const color = this.getTimezoneColor(this.timezone);
    
    tzInfoElement.textContent = displayText;
    tzInfoElement.style.color = color;
    console.log(`✅ Timezone display: ${displayText}`);
}
        const latInput = document.getElementById('latInput');
        const lonInput = document.getElementById('lonInput');
        
        if (latInput) latInput.value = lat.toFixed(6);
        if (lonInput) lonInput.value = lon.toFixed(6);
        
        this.updateLocationStatus(`Lokasi: Koordinat manual`);
        
        // ====== TAMBAH INI ======
        console.log("🟢 Restarting timer with new timezone...");
        this.startTimeUpdates();
        
        this.showNotification("Koordinat diterima", "success");
        this.fetchData();
        return;
    }
    
    this.showNotification(`Mencari: ${searchText}...`, "info");
    
    // Try multiple geocoding services
    const geoResult = await this.geocodeCity(searchText);
    
    if (geoResult) {
        this.currentLocation = {
            lat: geoResult.lat,
            lon: geoResult.lon,
            name: geoResult.name,
            country: geoResult.country,
            state: geoResult.state,
            timezone: this.getTimezoneFromCoordinates(geoResult.lat, geoResult.lon)
        };
        
        // ====== TAMBAH INI ======
        this.timezone = this.currentLocation.timezone;
        console.log(`🔄 Timezone set to: ${this.timezone}`);
        
        const latInput = document.getElementById('latInput');
        const lonInput = document.getElementById('lonInput');
        
        if (latInput) latInput.value = geoResult.lat.toFixed(6);
        if (lonInput) lonInput.value = geoResult.lon.toFixed(6);
        
        const displayName = geoResult.state ? 
            `${geoResult.name}, ${geoResult.state}, ${geoResult.country}` :
            `${geoResult.name}, ${geoResult.country}`;
        
        this.updateLocationStatus(`Lokasi: ${displayName}`);
        
        // ====== TAMBAH INI ======
        console.log("🟢 Restarting timer with new timezone...");
        this.startTimeUpdates();
        
        this.showNotification(`Kota ditemukan: ${displayName}`, "success");
        
        await this.fetchData();
        return;
    }
    
    // Fallback ke OpenStreetMap
    try {
        this.showNotification("Mencari via OpenStreetMap...", "info");
        
        const osmUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchText)}&limit=1&addressdetails=1`;
        const response = await fetch(osmUrl, {
            headers: {
                'User-Agent': 'UVGuardIndex/1.0'
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            
            if (data && data.length > 0) {
                const result = data[0];
                this.currentLocation = {
                    lat: parseFloat(result.lat),
                    lon: parseFloat(result.lon),
                    name: result.display_name.split(',')[0],
                    country: result.address?.country_code?.toUpperCase() || "XX",
                    state: result.address?.state || result.address?.region || "",
                    timezone: this.getTimezoneFromCoordinates(parseFloat(result.lat), parseFloat(result.lon))
                };
                
                // ====== TAMBAH INI ======
                this.timezone = this.currentLocation.timezone;
                console.log(`🔄 Timezone set to: ${this.timezone}`);
                
                const latInput = document.getElementById('latInput');
                const lonInput = document.getElementById('lonInput');
                
                if (latInput) latInput.value = parseFloat(result.lat).toFixed(6);
                if (lonInput) lonInput.value = parseFloat(result.lon).toFixed(6);
                
                this.updateLocationStatus(`Lokasi via OSM: ${result.display_name}`);
                
                // ====== TAMBAH INI ======
                console.log("🟢 Restarting timer with new timezone...");
                this.startTimeUpdates();
                
                this.showNotification(`Lokasi ditemukan via OpenStreetMap`, "success");
                
                await this.fetchData();
                return;
            }
        }
    } catch (osmError) {
        console.warn("OSM geocoding error:", osmError);
    }
    
    this.showNotification(`"${searchText}" tidak ditemukan. Coba format: "Kota, Negara"`, "warning");
    this.updateLocationStatus("Kota tidak ditemukan");
    
    // ====== TAMBAH INI ======
    console.log("🟢 Restarting timer (search failed)...");
    this.startTimeUpdates();
}

    
    async geocodeCity(cityName) {
    console.log(`📍 Geocoding: "${cityName}"`);
    
    const cacheKey = cityName.toLowerCase().trim();
    if (this.geoCache.has(cacheKey)) {
        console.log("📍 Using cached geocode result");
        return this.geoCache.get(cacheKey);
    }
    
    // ========== PRIORITIZE OPENSTREETMAP (FREE, GLOBAL) ==========
    console.log("📍 Trying OpenStreetMap first...");
    try {
        const osmUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cityName)}&limit=1&addressdetails=1`;
        const response = await fetch(osmUrl, {
            headers: {
                'User-Agent': 'UVGuardIndex/1.0 (Educational Project)',
                'Accept-Language': 'en'
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            
            if (data && data.length > 0) {
                const result = data[0];
                const geoData = {
                    name: result.name || result.display_name.split(',')[0],
                    lat: parseFloat(result.lat),
                    lon: parseFloat(result.lon),
                    country: result.address?.country_code?.toUpperCase() || "XX",
                    state: result.address?.state || result.address?.region || ""
                };
                
                this.geoCache.set(cacheKey, geoData);
                console.log(`📍 OpenStreetMap found: ${geoData.name}, ${geoData.country}`);
                return geoData;
            }
        }
    } catch (osmError) {
        console.warn("📍 OpenStreetMap error:", osmError.message);
    }
    
    // ========== FALLBACK: OpenWeatherMap ==========
    console.log("📍 Falling back to OpenWeatherMap...");
    const owmConfig = this.API_CONFIG.openweather;
    
    for (let i = 0; i < owmConfig.keys.length; i++) {
        const apiKey = owmConfig.keys[i];
        if (!apiKey) continue;
        
        try {
            const geocodeUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(cityName)}&limit=5&appid=${apiKey}`;
            const response = await fetch(geocodeUrl);
            
            if (response.ok) {
                const data = await response.json();
                
                if (data && data.length > 0) {
                    const result = data[0];
                    const geoData = {
                        name: result.name,
                        lat: result.lat,
                        lon: result.lon,
                        country: result.country,
                        state: result.state || ""
                    };
                    
                    this.geoCache.set(cacheKey, geoData);
                    console.log(`📍 OpenWeatherMap found: ${result.name}, ${result.country}`);
                    return geoData;
                }
            }
        } catch (error) {
            console.warn(`📍 OpenWeatherMap key ${i+1} failed:`, error.message);
        }
    }
    
    // ========== LAST RESORT: Hardcoded popular cities ==========
    console.log("📍 Using hardcoded fallback...");
    const hardcodedCities = {
        'london': { name: 'London', lat: 51.5074, lon: -0.1278, country: 'GB', state: 'England' },
        'new york': { name: 'New York', lat: 40.7128, lon: -74.0060, country: 'US', state: 'NY' },
        'tokyo': { name: 'Tokyo', lat: 35.6762, lon: 139.6503, country: 'JP', state: 'Kanto' },
        'paris': { name: 'Paris', lat: 48.8566, lon: 2.3522, country: 'FR', state: 'Île-de-France' },
        'singapore': { name: 'Singapore', lat: 1.3521, lon: 103.8198, country: 'SG', state: '' },
        'sydney': { name: 'Sydney', lat: -33.8688, lon: 151.2093, country: 'AU', state: 'NSW' },
        'dubai': { name: 'Dubai', lat: 25.2048, lon: 55.2708, country: 'AE', state: 'Dubai' }
    };
    
    const lowerCity = cityName.toLowerCase();
    for (const [key, city] of Object.entries(hardcodedCities)) {
        if (lowerCity.includes(key)) {
            console.log(`📍 Hardcoded match: ${city.name}`);
            this.geoCache.set(cacheKey, city);
            return city;
        }
    }
    
    console.warn(`📍 All geocoding failed for "${cityName}"`);
    return null;
}
    
    // ==================== REALISTIC UV MODEL (DIPERBAIKI) ====================
    calculateRealisticUV(originalUV, lat, lon, timestamp, apiSource) {
    const now = timestamp || new Date();
    let hour;
    
    try {
        const options = { timeZone: this.timezone, hour: '2-digit', hour12: false };
        const timeString = now.toLocaleTimeString('en-US', options);
        hour = parseInt(timeString.split(':')[0]);
    } catch (e) {
        hour = now.getHours();
    }
    
    // ========== GLOBAL UV MODEL ==========
    let realisticUV = Math.min(originalUV, 20); // Increase max to 20 for extreme locations
    
    // 1. TIME FACTOR (Global Gaussian - tetap dipakai)
    const timeFactor = this.calculateTimeFactorGaussian(hour);
    realisticUV *= timeFactor;
    
    // 2. LATITUDE FACTOR (New! Most important for global)
    const latFactor = this.calculateLatitudeFactor(lat);
    realisticUV *= latFactor;
    
    // 3. SEASONAL FACTOR (Improved global version)
    const month = now.getMonth();
    const seasonalFactor = this.calculateGlobalSeasonalFactor(month, lat);
    realisticUV *= seasonalFactor;
    
    // 4. OZONE FACTOR (New! For polar regions)
    const ozoneFactor = this.calculateOzoneFactor(lat, month);
    realisticUV *= ozoneFactor;
    
    // 5. ALTITUDE FACTOR (Jika ada data altitude)
    if (this.currentLocation?.altitude) {
        const altitudeFactor = 1 + (this.currentLocation.altitude / 1000 * 0.1);
        realisticUV *= altitudeFactor;
    }
    
    // 6. NIGHT TIME CORRECTION
    if (this.isNightTimeGlobal(hour, lat, lon)) {
        realisticUV = 0;
    }
    
    // 7. Bounds check
    realisticUV = Math.max(0, realisticUV);
    realisticUV = Math.min(realisticUV, 20);
    
    // 8. Smoothing (keep existing)
    if (this.currentData && this.currentData.uvIndex) {
        const previousUV = this.currentData.uvIndex;
        const smoothingFactor = 0.3;
        realisticUV = previousUV * (1 - smoothingFactor) + realisticUV * smoothingFactor;
    }
    
    realisticUV = Math.round(realisticUV * 10) / 10;
    
    console.log(`🌍 GLOBAL UV: ${originalUV.toFixed(1)} → ${realisticUV.toFixed(1)}`);
    console.log(`   Factors: Time=${timeFactor.toFixed(2)}, Lat=${latFactor.toFixed(2)}, Season=${seasonalFactor.toFixed(2)}`);
    
    return realisticUV;
}

// ==================== GLOBAL UV FACTORS ====================
calculateLatitudeFactor(lat) {
    // Latitude effect: Max at equator (0°), min at poles (±90°)
    // Formula: cos(latitude in radians) * 0.8 + 0.2
    const latRad = Math.abs(lat) * Math.PI / 180;
    let factor = Math.cos(latRad) * 0.8 + 0.2;
    
    // Adjust for tropical boost
    if (Math.abs(lat) < 23.5) { // Tropics
        factor *= 1.1;
    }
    
    return Math.max(0.3, Math.min(1.2, factor));
}

calculateGlobalSeasonalFactor(month, lat) {
    // Global seasonal adjustment
    let factor = 1.0;
    
    if (lat >= 0) { // Northern hemisphere
        if (month >= 5 && month <= 7) { // Summer
            factor = 1.3;
        } else if (month >= 11 || month <= 1) { // Winter
            factor = 0.7;
        }
    } else { // Southern hemisphere
        if (month >= 11 || month <= 1) { // Summer
            factor = 1.3;
        } else if (month >= 5 && month <= 7) { // Winter
            factor = 0.7;
        }
    }
    
    // Equatorial regions have less seasonal variation
    if (Math.abs(lat) < 10) {
        factor = 0.9 + (Math.random() * 0.2); // 0.9-1.1
    }
    
    return factor;
}

calculateOzoneFactor(lat, month) {
    // Simulate ozone layer thickness variation
    // Polar regions have ozone holes, tropics have stable ozone
    let factor = 1.0;
    
    if (Math.abs(lat) > 60) { // Polar regions
        if (month >= 8 && month <= 10) { // Spring ozone hole
            factor = 0.7; // More UV due to ozone hole
        }
    } else if (Math.abs(lat) < 30) { // Tropical regions
        factor = 0.9; // Thinner ozone but stable
    }
    
    return factor;
}

isNightTimeGlobal(hour, lat, lon) {
    // More accurate global night detection
    const country = this.detectCountry(lat, lon);
    
    switch(country) {
        case 'Indonesia':
        case 'Singapore':
        case 'Malaysia':
            return hour >= 19 || hour <= 5;
        case 'United Kingdom':
        case 'France':
        case 'Germany':
            // Summer: late sunset, Winter: early sunset
            const month = new Date().getMonth();
            if (month >= 4 && month <= 8) { // Summer
                return hour >= 22 || hour <= 4;
            } else {
                return hour >= 18 || hour <= 6;
            }
        case 'Australia':
            return hour >= 20 || hour <= 5;
        case 'United States':
            // Varies by region, but general
            return hour >= 20 || hour <= 5;
        default:
            // Generic: use latitude-based estimation
            const dayLength = 12 + (Math.sin(lat * Math.PI / 180) * 4);
            const sunrise = 12 - (dayLength / 2);
            const sunset = 12 + (dayLength / 2);
            return hour < sunrise || hour > sunset;
    }
}
    
    calculateTimeFactorGaussian(hour) {
    // Gaussian distribution: peak at 12:00, zero at night
    if (hour >= 20 || hour <= 5) { // Malam lebih pendek
        return 0;
    }
    
    const mean = 12; // Peak at noon
    const stdDev = 3.0; // Lebih lebar untuk distribusi lebih realistik
    
    // Calculate Gaussian
    let factor = Math.exp(-Math.pow((hour - mean), 2) / (2 * Math.pow(stdDev, 2)));
    
    // **PERBAIKAN:** UV pagi/sore lebih rendah
    if ((hour >= 5 && hour <= 8) || (hour >= 16 && hour <= 19)) {
        factor *= 0.2; // Pagi/sore hanya 20% dari puncak (dari 0.3)
    } else if (hour >= 8 && hour <= 11) {
        factor *= 0.5; // Late morning 50%
    } else if (hour >= 13 && hour <= 16) {
        factor *= 0.5; // Early afternoon 50%
    } else if (hour >= 11 && hour <= 13) {
        factor *= 1.0; // Noon peak 100%
    }
    
    return factor;
}
    
    calculateSeasonalFactor(month, lat) {
        // Adjust UV based on season and latitude
        let factor = 1.0;
        
        if (Math.abs(lat) < 10) {
            // Tropical/equatorial: minimal seasonal variation
            factor = 0.9 + (Math.random() * 0.2); // 0.9-1.1
        } else if (lat >= 0) { // Northern hemisphere
            if (month >= 5 && month <= 7) { // Summer
                factor = 1.2;
            } else if (month >= 11 || month <= 1) { // Winter
                factor = 0.7;
            } else { // Spring/Autumn
                factor = 1.0;
            }
        } else { // Southern hemisphere
            if (month >= 11 || month <= 1) { // Summer
                factor = 1.2;
            } else if (month >= 5 && month <= 7) { // Winter
                factor = 0.7;
            } else { // Spring/Autumn
                factor = 1.0;
            }
        }
        
        return factor;
    }
    
    calculateRegionalFactor(lat, lon) {
        // Determine country/region
        let country = this.detectCountry(lat, lon);
        
        // Apply regional correction factors - DIPERBAIKI
        const factors = {
            'Indonesia': 0.80,
            'Singapore': 0.85,
            'Malaysia': 0.85,
            'Thailand': 0.90,
            'Vietnam': 0.88,
            'Philippines': 0.87,
            'Australia': 0.95,
            'Japan': 0.90,
            'China': 0.87,
            'India': 0.85,
            'Default': 0.85
        };
        
        return factors[country] || factors['Default'];
    }
    
    detectCountry(lat, lon) {
    // Indonesia
    if (lat > -11 && lat < 6 && lon > 95 && lon < 141) return 'Indonesia';
    
    // Singapore
    if (lat > 1.2 && lat < 1.5 && lon > 103.6 && lon < 104.0) return 'Singapore';
    
    // Malaysia
    if ((lat > 1 && lat < 7 && lon > 100 && lon < 119)) return 'Malaysia';
    
    // Thailand
    if (lat > 5 && lat < 21 && lon > 97 && lon < 106) return 'Thailand';
    
    // Australia
    if (lat < -10 && lat > -44 && lon > 112 && lon < 154) return 'Australia';
    
    // United Kingdom
    if (lat > 49 && lat < 61 && lon > -11 && lon < 2) return 'United Kingdom';
    
    // USA (mainland)
    if (lat > 24 && lat < 50 && lon > -125 && lon < -66) return 'United States';
    
    // Japan
    if (lat > 24 && lat < 46 && lon > 122 && lon < 146) return 'Japan';
    
    // China
    if (lat > 18 && lat < 54 && lon > 73 && lon < 135) return 'China';
    
    // India
    if (lat > 8 && lat < 37 && lon > 68 && lon < 97) return 'India';
    
    // Brazil
    if (lat > -34 && lat < 5 && lon > -74 && lon < -35) return 'Brazil';
    
    // South Africa
    if (lat > -35 && lat < -22 && lon > 16 && lon < 33) return 'South Africa';
    
    // Egypt
    if (lat > 22 && lat < 32 && lon > 25 && lon < 35) return 'Egypt';
    
    // Russia (European part)
    if (lat > 41 && lat < 82 && lon > 20 && lon < 180) return 'Russia';
    
    return 'Unknown';
}
    
    isNightTime(hour, lat, lon) {
    const country = this.detectCountry(lat, lon);
    
    switch(country) {
        case 'Indonesia':
        case 'Singapore':
        case 'Malaysia':
        case 'Thailand':
        case 'Vietnam':
        case 'Philippines':
            // Tropis: matahari terbenam sekitar 18:00-19:00
            return hour >= 19 || hour <= 5; // Perbaiki: 19:00 bukan 18:00
        case 'Japan':
        case 'China':
        case 'South Korea':
            return hour >= 20 || hour <= 4;
        case 'Australia':
            return hour >= 20 || hour <= 5;
        default:
            return hour >= 19 || hour <= 6; // Default lebih masuk akal
    }
}

    
    // ==================== API METHODS ====================
    async testAPIConnection() {
        console.log("🔌 Testing API connection...");
        
        // Test OpenWeatherMap
        const owmConfig = this.API_CONFIG.openweather;
        
        for (let i = 0; i < owmConfig.keys.length; i++) {
            const apiKey = owmConfig.keys[i];
            
            if (!apiKey || apiKey === "YOUR_API_KEY_HERE") {
                console.warn(`⚠️ OpenWeatherMap key ${i+1} tidak valid`);
                continue;
            }
            
            try {
                const testUrl = `https://api.openweathermap.org/data/2.5/weather?q=Jakarta&appid=${apiKey}&units=metric`;
                
                console.log(`🔍 Testing OpenWeatherMap key ${i+1}...`);
                const response = await fetch(testUrl);
                
                if (response.ok) {
                    console.log(`✅ OpenWeatherMap key ${i+1}: CONNECTED`);
                    owmConfig.currentKeyIndex = i;
                    
                    // Test other APIs
                    await this.testMultiSourceAPIs();
                    
                    this.isDemoMode = false;
                    this.updateAPIStatus(true);
                    return true;
                } else {
                    console.warn(`⚠️ OpenWeatherMap key ${i+1} failed: ${response.status}`);
                }
                
            } catch (error) {
                console.error(`❌ OpenWeatherMap key ${i+1} error:`, error.message);
            }
        }
        
        // Try WeatherAPI.com
        console.log("🔍 Testing WeatherAPI.com...");
        try {
            const weatherapiKey = this.API_CONFIG.weatherapi.key;
            if (weatherapiKey && weatherapiKey !== "YOUR_WEATHERAPI_KEY") {
                const testUrl = `https://api.weatherapi.com/v1/current.json?key=${weatherapiKey}&q=Jakarta&aqi=no`;
                const response = await fetch(testUrl);
                
                if (response.ok) {
                    console.log("✅ WeatherAPI.com: CONNECTED");
                    this.isDemoMode = false;
                    this.updateAPIStatus(true);
                    return true;
                }
            }
        } catch (error) {
            console.warn("⚠️ WeatherAPI.com test failed:", error.message);
        }
        
        // Try Visual Crossing
        console.log("🔍 Testing Visual Crossing...");
        try {
            const vcKey = this.API_CONFIG.visualcrossing.key;
            if (vcKey && vcKey !== "YOUR_VISUALCROSSING_KEY") {
                const testUrl = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/Jakarta/today?key=${vcKey}&unitGroup=metric`;
                const response = await fetch(testUrl);
                
                if (response.ok) {
                    console.log("✅ Visual Crossing: CONNECTED");
                    this.isDemoMode = false;
                    this.updateAPIStatus(true);
                    return true;
                }
            }
        } catch (error) {
            console.warn("⚠️ Visual Crossing test failed:", error.message);
        }
        
        console.warn("⚠️ All API tests failed. Using DEMO MODE.");
        this.isDemoMode = true;
        this.updateAPIStatus(false);
        return false;
    }
    
    async testMultiSourceAPIs() {
        console.log("🔍 Testing additional API sources...");
        
        let availableSources = [];
        
        // Test WeatherAPI.com
        const weatherapiKey = this.API_CONFIG.weatherapi.key;
        if (weatherapiKey && weatherapiKey !== "YOUR_WEATHERAPI_KEY") {
            try {
                const url = `https://api.weatherapi.com/v1/current.json?key=${weatherapiKey}&q=Jakarta&aqi=no`;
                const response = await fetch(url);
                if (response.ok) {
                    console.log("✅ WeatherAPI.com: AVAILABLE");
                    availableSources.push("WeatherAPI.com");
                }
            } catch (error) {
                console.warn("❌ WeatherAPI.com: NOT AVAILABLE");
            }
        }
        
        // Test Visual Crossing
        const vcKey = this.API_CONFIG.visualcrossing.key;
        if (vcKey && vcKey !== "YOUR_VISUALCROSSING_KEY") {
            try {
                const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/Jakarta/today?key=${vcKey}`;
                const response = await fetch(url);
                if (response.ok) {
                    console.log("✅ Visual Crossing: AVAILABLE");
                    availableSources.push("Visual Crossing");
                }
            } catch (error) {
                console.warn("❌ Visual Crossing: NOT AVAILABLE");
            }
        }
        
        console.log(`📡 Available sources: ${availableSources.join(', ') || 'None'}`);
        return availableSources;
    }
    
    updateAPIStatus(connected) {
        const apiStatus = document.getElementById('apiStatus');
        if (!apiStatus) return;
        
        if (connected) {
            apiStatus.innerHTML = '<span class="status-indicator active"></span> <span>API Connected</span>';
            apiStatus.style.color = '#10b981';
            apiStatus.title = "Connected to weather API";
        } else {
            apiStatus.innerHTML = '<span class="status-indicator warning"></span> <span>Demo Mode</span>';
            apiStatus.style.color = '#f59e0b';
            apiStatus.title = "Using demo data (API failed)";
        }
    }
    
    // ==================== MAIN DATA FETCH ====================
    async fetchData() {
    
    if (!this.currentLocation) {
        this.showNotification("Pilih lokasi terlebih dahulu", "warning");
        return;
    }
    
    // ====== FIX TIMEZONE SEBELUM FETCH ======
    if (this.currentLocation.country === 'ID') {
        console.log("🇮🇩 Pre-fetch: Fixing Indonesian timezone");
        this.fixIndonesianTimezone();
    }
        
        try {
            this.validateCoordinates(this.currentLocation.lat, this.currentLocation.lon);
        } catch (validationError) {
            this.showNotification(`Error lokasi: ${validationError.message}`, "error");
            return;
        }
        
        console.log("=".repeat(60));
        console.log("🚀 UV GUARD PRO - DATA FETCH START");
        console.log(`📍 Location: ${this.currentLocation.name || "Unknown"}`);
        console.log(`⏰ Timezone: ${this.timezone}`);
        console.log("=".repeat(60));
        
        this.showNotification("Mengambil data dari multiple sources...", "info");
        this.toggleButtons(false);
        
        try {
            let data;
            
            if (this.isDemoMode) {
                console.log("🎭 Using DEMO DATA");
                data = await this.generateRealisticDemoData();
            } else if (this.API_CONFIG.useMultipleSources) {
                console.log("🌐 MULTI-SOURCE: Trying all weather providers...");
                data = await this.fetchFromMultipleSources();
                
                if (!data) {
                    console.log("⚠️ Multi-source failed, trying OpenWeatherMap alone...");
                    data = await this.fetchAPIData();
                }
            } else {
                console.log("🌐 SINGLE-SOURCE: Using OpenWeatherMap only");
                data = await this.fetchAPIData();
            }
            
            // Jika semua API gagal, fallback ke demo data
            if (!data) {
                console.log("❌ ALL API SOURCES FAILED, using DEMO DATA");
                this.isDemoMode = true;
                this.updateAPIStatus(false);
                data = await this.generateRealisticDemoData();
                
                this.showNotification("Menggunakan data demo (API gagal)", "warning");
            } else {
                this.isDemoMode = false;
                this.updateAPIStatus(true);
                
                const provider = data.provider || data.apiSource || "API";
                const uvValue = data.uvIndex.toFixed(1);
                const timeOfDay = data.isDaytime ? "siang" : "malam";
                
                this.showNotification(
                    `Data ${provider}: UV ${uvValue} (${timeOfDay})`, 
                    "success"
                );
            }
            
            // Proses data yang didapat
            if (data) {
                console.log("✅ DATA RECEIVED SUCCESSFULLY:");
                console.log(`   Provider: ${data.provider || data.apiSource || "Unknown"}`);
                console.log(`   UV Index: ${data.uvIndex}`);
                console.log(`   Temperature: ${data.temperature}°C`);
                console.log("=".repeat(60));
                
                await this.processData(data);
            }
            
        } catch (error) {
            console.error("❌ CRITICAL ERROR in fetchData:", error);
            this.showNotification(`Error sistem: ${error.message}`, "error");
            
            // Emergency fallback
            try {
                console.log("🆘 EMERGENCY: Using demo data as last resort...");
                const demoData = await this.generateRealisticDemoData();
                await this.processData(demoData);
            } catch (demoError) {
                console.error("💥 EVEN DEMO DATA FAILED:", demoError);
                this.showNotification("Sistem error total. Refresh halaman.", "error");
            }
        } finally {
            this.toggleButtons(true);
            console.log("✅ Fetch process completed");
        }
    }
    
    async fetchAPIData() {
        const { lat, lon, name } = this.currentLocation;
        const apiConfig = this.API_CONFIG.openweather;
        const apiKeys = apiConfig.keys;
        const currentApiKey = apiKeys[apiConfig.currentKeyIndex];
        
        if (!currentApiKey) {
            console.warn("No valid API key available for OpenWeatherMap");
            return null;
        }
        
        try {
            // Fetch weather data
            const weatherUrl = `${apiConfig.baseUrl}/weather?lat=${lat}&lon=${lon}&appid=${currentApiKey}&units=metric&lang=id`;
            
            console.log(`🌐 OpenWeatherMap: Fetching weather data...`);
            const weatherResponse = await fetch(weatherUrl);
            
            if (!weatherResponse.ok) {
                console.warn(`❌ OpenWeatherMap weather error: ${weatherResponse.status}`);
                apiConfig.currentKeyIndex = (apiConfig.currentKeyIndex + 1) % apiKeys.length;
                return null;
            }
            
            const weatherData = await weatherResponse.json();
            
            // Fetch UV index
            const uvUrl = `${apiConfig.baseUrl}/uvi?lat=${lat}&lon=${lon}&appid=${currentApiKey}`;
            let uvIndex = 0;
            
            try {
                const uvResponse = await fetch(uvUrl);
                if (uvResponse.ok) {
                    const uvData = await uvResponse.json();
                    uvIndex = uvData.value || 0;
                }
            } catch (uvError) {
                console.warn("❌ OpenWeatherMap UV API error:", uvError);
            }
            
            // Calculate realistic UV - DIPERBAIKI
            const now = new Date();
            uvIndex = this.calculateRealisticUV(uvIndex, lat, lon, now, "OpenWeatherMap");
            
            // Handle sunrise/sunset
            const sunriseUnix = weatherData.sys.sunrise;
            const sunsetUnix = weatherData.sys.sunset;
            
            // Convert Unix timestamps to local time
            let sunriseLocal, sunsetLocal;
            
            try {
                // Coba konversi dengan timezone
                sunriseLocal = new Date(sunriseUnix * 1000);
                sunsetLocal = new Date(sunsetUnix * 1000);
                
                // Adjust for timezone display
                const sunriseOptions = { 
                    timeZone: this.timezone,
                    hour: '2-digit', 
                    minute: '2-digit'
                };
                
                const sunsetOptions = { 
                    timeZone: this.timezone,
                    hour: '2-digit', 
                    minute: '2-digit'
                };
                
                // Simpan string waktu untuk display
                const sunriseTimeStr = sunriseLocal.toLocaleTimeString('id-ID', sunriseOptions);
                const sunsetTimeStr = sunsetLocal.toLocaleTimeString('id-ID', sunsetOptions);
                
                console.log(`🌅 Sunrise: ${sunriseTimeStr}, Sunset: ${sunsetTimeStr}`);
                
            } catch (e) {
                console.warn("Error processing sunrise/sunset times:", e);
                // Fallback ke waktu default
                sunriseLocal = new Date(sunriseUnix * 1000);
                sunsetLocal = new Date(sunsetUnix * 1000);
            }
            
            // Check if it's daytime
            let isDaytime = false;
            try {
                const currentHour = new Date().getHours();
                const sunriseHour = sunriseLocal.getHours();
                const sunsetHour = sunsetLocal.getHours();
                isDaytime = currentHour >= sunriseHour && currentHour <= sunsetHour;
            } catch (e) {
                // Default to checking with local time
                const now = new Date();
                isDaytime = now >= sunriseLocal && now <= sunsetLocal;
            }
            
            return {
                uvIndex: uvIndex,
                temperature: parseFloat(weatherData.main.temp.toFixed(1)),
                feelsLike: parseFloat(weatherData.main.feels_like.toFixed(1)),
                humidity: weatherData.main.humidity,
                pressure: weatherData.main.pressure,
                weather: weatherData.weather[0].description,
                weatherMain: weatherData.weather[0].main,
                weatherIcon: weatherData.weather[0].icon,
                windSpeed: parseFloat(weatherData.wind.speed.toFixed(1)),
                windDeg: weatherData.wind.deg || 0,
                clouds: weatherData.clouds.all,
                sunrise: sunriseLocal,
                sunset: sunsetLocal,
                cityName: weatherData.name || name,
                country: weatherData.sys.country || "XX",
                timestamp: now,
                lat: lat,
                lon: lon,
                source: "api",
                apiSource: "OpenWeatherMap",
                provider: "OpenWeatherMap",
                isDaytime: isDaytime,
                timezone: this.timezone
            };
            
        } catch (error) {
            console.error("❌ OpenWeatherMap fetch error:", error);
            const apiConfig = this.API_CONFIG.openweather;
            apiConfig.currentKeyIndex = (apiConfig.currentKeyIndex + 1) % apiConfig.keys.length;
            return null;
        }
    }
    
    async fetchFromMultipleSources() {
        console.log("🔄 Starting multi-source fetch...");
        
        if (!this.currentLocation) {
            console.error("❌ No location for multi-source");
            return null;
        }
        
        const lat = this.currentLocation.lat;
        const lon = this.currentLocation.lon;
        
        const results = [];
        const errors = [];
        
        // 1. OpenWeatherMap
        console.log("1. 📡 OpenWeatherMap...");
        try {
            const owmData = await this.fetchWithTimeout(
                () => this.fetchAPIData(),
                8000,
                "OpenWeatherMap"
            );
            if (owmData) {
                results.push(owmData);
                console.log(`   ✅ Success: UV ${owmData.uvIndex}`);
            }
        } catch (error) {
            errors.push(`OpenWeatherMap: ${error.message}`);
            console.warn("   ⚠️ Error:", error.message);
        }
        
        // 2. WeatherAPI.com
        console.log("2. 📡 WeatherAPI.com...");
        try {
            const weatherApiData = await this.fetchWithTimeout(
                () => this.fetchFromWeatherAPI(lat, lon),
                8000,
                "WeatherAPI.com"
            );
            if (weatherApiData) {
                results.push(weatherApiData);
                console.log(`   ✅ Success: UV ${weatherApiData.uvIndex}`);
            }
        } catch (error) {
            errors.push(`WeatherAPI.com: ${error.message}`);
            console.warn("   ⚠️ Error:", error.message);
        }
        
        // 3. Visual Crossing
        console.log("3. 📡 Visual Crossing...");
        try {
            const vcData = await this.fetchWithTimeout(
                () => this.fetchFromVisualCrossing(lat, lon),
                8000,
                "Visual Crossing"
            );
            if (vcData) {
                results.push(vcData);
                console.log(`   ✅ Success: UV ${vcData.uvIndex}`);
            }
        } catch (error) {
            errors.push(`Visual Crossing: ${error.message}`);
            console.warn("   ⚠️ Error:", error.message);
        }
        
        console.log(`📊 Multi-source results: ${results.length}/3 successful`);
        
        if (results.length === 0) {
            console.log("❌ All sources failed");
            return null;
        }
        
        // Select best data
        const bestData = this.selectBestData(results, lat, lon);
        console.log(`🏆 Selected: ${bestData.provider || bestData.apiSource} with UV ${bestData.uvIndex}`);
        
        return bestData;
    }
    
    async fetchWithTimeout(fetchFunction, timeout = 8000, sourceName = "Unknown") {
        return new Promise((resolve, reject) => {
            const timeoutId = setTimeout(() => {
                reject(new Error(`${sourceName} timeout after ${timeout}ms`));
            }, timeout);
            
            fetchFunction()
                .then(result => {
                    clearTimeout(timeoutId);
                    resolve(result);
                })
                .catch(error => {
                    clearTimeout(timeoutId);
                    reject(error);
                });
        });
    }
    
    selectBestData(dataArray, lat, lon) {
    console.log(`🎯 Selecting best from ${dataArray.length} sources`);
    
    if (dataArray.length === 0) return null;
    if (dataArray.length === 1) return dataArray[0];
    
    // Priority order - OPENWEATHERMAP UTAMA
    const priorityOrder = ["OpenWeatherMap", "WeatherAPI.com", "Visual Crossing"];
    
    for (const provider of priorityOrder) {
        const found = dataArray.find(d => 
            d.provider === provider || d.apiSource === provider
        );
        if (found) {
            console.log(`✅ Selected by priority: ${provider}`);
            return found;
        }
    }
        
        // Filter valid data
        const validData = dataArray.filter(d => 
            d.uvIndex >= 0 && d.uvIndex <= 15 && 
            d.temperature >= -50 && d.temperature <= 60
        );
        
        if (validData.length > 0) {
            // Calculate average UV
            const avgUV = validData.reduce((sum, d) => sum + d.uvIndex, 0) / validData.length;
            
            // Find closest to average
            const closest = validData.reduce((prev, curr) => {
                const prevDiff = Math.abs(prev.uvIndex - avgUV);
                const currDiff = Math.abs(curr.uvIndex - avgUV);
                return currDiff < prevDiff ? curr : prev;
            });
            
            console.log(`✅ Selected: Closest to average UV ${avgUV.toFixed(1)}`);
            return closest;
        }
        
        // Fallback: first available
        console.log("✅ Selected: First available");
        return dataArray[0];
    }
    
    // ==================== REALISTIC DEMO DATA ====================
    async generateRealisticDemoData() {
        const { lat, lon, name, country } = this.currentLocation;
        const now = new Date();
        
        // Get local hour
        let hour;
        try {
            const options = { timeZone: this.timezone, hour: '2-digit', hour12: false };
            const timeString = now.toLocaleTimeString('en-US', options);
            hour = parseInt(timeString.split(':')[0]);
        } catch (e) {
            hour = now.getHours();
        }
        
        const month = now.getMonth();
        
        // Calculate realistic UV based on multiple factors - DIPERBAIKI
        let uvIndex = 0;
        
        // Only calculate UV during daytime
        if (hour >= 6 && hour <= 18) {
            // Base UV based on latitude
            let baseUV = 12;
            
            // Adjust for latitude (less UV away from equator)
            const latitudeFactor = 1 - (Math.abs(lat) / 90);
            baseUV *= latitudeFactor;
            
            // Adjust for time of day (Gaussian distribution)
            const timeFactor = this.calculateTimeFactorGaussian(hour);
            baseUV *= timeFactor;
            
            // Adjust for season
            const seasonalFactor = this.calculateSeasonalFactor(month, lat);
            baseUV *= seasonalFactor;
            
            // Adjust for regional factor
            const regionalFactor = this.calculateRegionalFactor(lat, lon);
            baseUV *= regionalFactor;
            
            // Add small random variation (±10%)
            const randomFactor = 0.9 + Math.random() * 0.2;
            uvIndex = parseFloat((baseUV * randomFactor).toFixed(1));
            
            // Ensure realistic bounds
            uvIndex = Math.min(uvIndex, 15);
            uvIndex = Math.max(uvIndex, 0);
        }
        
        // Generate realistic weather conditions
        const weather = this.generateRealisticWeather(lat, lon, month, hour);
        
        // Generate realistic temperature
        const temperature = this.generateRealisticTemperature(lat, lon, month, hour);
        
        // Generate sunrise/sunset times based on latitude and season
        const sunriseHour = this.calculateSunriseHour(lat, month);
        const sunsetHour = this.calculateSunsetHour(lat, month);
        
        const sunrise = new Date(now);
        sunrise.setHours(Math.floor(sunriseHour), Math.floor((sunriseHour % 1) * 60), 0, 0);
        
        const sunset = new Date(now);
        sunset.setHours(Math.floor(sunsetHour), Math.floor((sunsetHour % 1) * 60), 0, 0);
        
        const isDaytime = hour >= sunrise.getHours() && hour <= sunset.getHours();
        
        return {
            uvIndex: uvIndex,
            temperature: temperature,
            feelsLike: temperature + (Math.random() - 0.5) * 2,
            humidity: Math.floor(50 + Math.random() * 40),
            pressure: Math.floor(1010 + (Math.random() - 0.5) * 20),
            weather: weather.description,
            weatherMain: weather.main,
            weatherIcon: weather.icon,
            windSpeed: parseFloat((3 + Math.random() * 8).toFixed(1)),
            windDeg: Math.floor(Math.random() * 360),
            clouds: weather.clouds || 30,
            sunrise: sunrise,
            sunset: sunset,
            cityName: name || "Demo Location",
            country: country || "XX",
            timestamp: now,
            lat: lat,
            lon: lon,
            source: "demo",
            apiSource: "demo",
            isDaytime: isDaytime,
            timezone: this.timezone
        };
    }
    
    calculateSunriseHour(lat, month) {
        // Simplified sunrise calculation
        let baseHour = 6;
        
        // Adjust for latitude
        if (Math.abs(lat) > 20) {
            baseHour += (Math.abs(lat) - 20) * 0.1;
        }
        
        // Adjust for season
        if (Math.abs(lat) > 10) {
            if (lat > 0) { // Northern hemisphere
                if (month >= 5 && month <= 7) { // Summer
                    baseHour -= 1;
                } else if (month >= 11 || month <= 1) { // Winter
                    baseHour += 1;
                }
            } else { // Southern hemisphere
                if (month >= 11 || month <= 1) { // Summer
                    baseHour -= 1;
                } else if (month >= 5 && month <= 7) { // Winter
                    baseHour += 1;
                }
            }
        }
        
        return Math.max(4, Math.min(8, baseHour));
    }
    
    calculateSunsetHour(lat, month) {
        // Simplified sunset calculation
        let baseHour = 18;
        
        // Adjust for latitude
        if (Math.abs(lat) > 20) {
            baseHour -= (Math.abs(lat) - 20) * 0.1;
        }
        
        // Adjust for season
        if (Math.abs(lat) > 10) {
            if (lat > 0) { // Northern hemisphere
                if (month >= 5 && month <= 7) { // Summer
                    baseHour += 1;
                } else if (month >= 11 || month <= 1) { // Winter
                    baseHour -= 1;
                }
            } else { // Southern hemisphere
                if (month >= 11 || month <= 1) { // Summer
                    baseHour += 1;
                } else if (month >= 5 && month <= 7) { // Winter
                    baseHour -= 1;
                }
            }
        }
        
        return Math.min(22, Math.max(16, baseHour));
    }
    
    generateRealisticWeather(lat, lon, month, hour) {
        const conditions = [];
        
        // Tropical regions
        if (Math.abs(lat) < 23.5) {
            conditions.push(
                { desc: "Cerah", main: "Clear", icon: "01d", prob: 40, clouds: 10 },
                { desc: "Cerah Berawan", main: "Partly Cloudy", icon: "02d", prob: 30, clouds: 40 },
                { desc: "Hujan Ringan", main: "Light Rain", icon: "10d", prob: 20, clouds: 70 },
                { desc: "Hujan Petir", main: "Thunderstorm", icon: "11d", prob: 10, clouds: 90 }
            );
        } else if (Math.abs(lat) < 45) { // Temperate
            conditions.push(
                { desc: "Cerah", main: "Clear", icon: "01d", prob: 30, clouds: 10 },
                { desc: "Cerah Berawan", main: "Partly Cloudy", icon: "02d", prob: 40, clouds: 40 },
                { desc: "Berawan", main: "Cloudy", icon: "03d", prob: 20, clouds: 80 },
                { desc: "Hujan Ringan", main: "Light Rain", icon: "10d", prob: 10, clouds: 90 }
            );
        } else { // Polar
            conditions.push(
                { desc: "Berawan", main: "Cloudy", icon: "03d", prob: 50, clouds: 90 },
                { desc: "Cerah Berawan", main: "Partly Cloudy", icon: "02d", prob: 30, clouds: 40 },
                { desc: "Salju Ringan", main: "Light Snow", icon: "13d", prob: 15, clouds: 95 },
                { desc: "Berkabut", main: "Mist", icon: "50d", prob: 5, clouds: 100 }
            );
        }
        
        return this.weightedRandomChoice(conditions);
    }
    
    generateRealisticTemperature(lat, lon, month, hour) {
        let baseTemp;
        
        // Base temperature by latitude
        if (Math.abs(lat) < 23.5) {
            baseTemp = 28; // Tropical
        } else if (Math.abs(lat) < 45) {
            baseTemp = 15; // Temperate
        } else {
            baseTemp = -5; // Polar
        }
        
        // Adjust for season
        baseTemp += 10 * this.calculateSeasonalFactor(month, lat);
        
        // Adjust for time of day (cooler at night)
        const tempVariation = Math.cos((hour - 14) * Math.PI / 12) * 6;
        const temperature = baseTemp + tempVariation + (Math.random() - 0.5) * 3;
        
        return parseFloat(temperature.toFixed(1));
    }
    
    weightedRandomChoice(items) {
        const totalWeight = items.reduce((sum, item) => sum + (item.prob || 1), 0);
        let random = Math.random() * totalWeight;
        
        for (const item of items) {
            random -= (item.prob || 1);
            if (random <= 0) {
                return item;
            }
        }
        
        return items[0];
    }
    
    // ==================== DATA PROCESSING ====================
    async processData(data) {
        console.log("📊 Processing data:", data);
        
        const dataPoint = {
            timestamp: data.timestamp,
            uvIndex: data.uvIndex,
            temperature: data.temperature,
            humidity: data.humidity,
            weather: data.weather,
            location: data.cityName,
            lat: data.lat,
            lon: data.lon,
            source: data.apiSource,
            timezone: data.timezone || this.timezone
        };
        
        this.dataHistory.push(dataPoint);
        
        if (this.dataHistory.length > 50) {
            this.dataHistory = this.dataHistory.slice(-50);
        }
        
        this.currentData = data;
        this.lastUpdateTime = new Date();
        
        // Update timezone if available
        if (data.timezone) {
            this.timezone = data.timezone;
        }
        
        // Update chart
        if (!this.charts.uv) {
            this.initCharts();
        }
        
        this.updateAllUI();
        
        this.saveHistory();
        // 🔥 Tambahan notifikasi UV naik & suara kategori UV
        this.checkUVRise();
        this.playUVCategorySound(data.uvIndex);
        const sourceText = this.isDemoMode ? "Demo" : "API";
        const timeText = data.isDaytime ? "siang" : "malam";
        this.showNotification(`Data ${sourceText} berhasil diperbarui (UV: ${data.uvIndex}, ${timeText})`, "success");
    }
    
    updateAllUI() {
        if (!this.currentData) {
            console.warn("No current data to update UI");
            return;
        }
        
        console.log("🔄 Updating all UI components...");
        
        try {
            this.updateRealtimeDisplay();
            this.updateWeatherInfo();
            this.updateRecommendations();
            this.updateActivityRecommendations();
            
            setTimeout(() => {
                this.updateCharts();
                this.performMathematicalAnalysis();
                this.updateStats();
                this.updateDataSourceInfo();
                this.calculateSunbathDuration();
            }, 200);
            
            console.log("✅ All UI components updated");
            
        } catch (error) {
            console.error("❌ Error updating UI:", error);
        }
    }
    
    // ==================== UI UPDATE METHODS ====================
    updateRealtimeDisplay() {
        if (!this.currentData) return;
        
        const uvIndex = this.currentData.uvIndex;
        const uvLevel = this.getUVLevel(uvIndex);
        
        // Update UV value
        const uvValueElement = document.getElementById('currentUV');
        if (uvValueElement) {
            uvValueElement.textContent = uvIndex.toFixed(1);
            uvValueElement.style.color = uvLevel.color;
            
            if (!this.currentData.isDaytime) {
                uvValueElement.innerHTML += ' <span style="font-size:0.6em;color:#666">🌙</span>';
            } else {
                uvValueElement.innerHTML += ' <span style="font-size:0.6em;color:#666">☀️</span>';
            }
        }
        
        if (uvIndex === 0) {
            const titleElement = document.getElementById('pageTitle');
            if (titleElement) {
                titleElement.innerHTML = '🌙 UV Guard Pro - Malam Hari (UV: 0)';
            }
            
            const levelElement = document.getElementById('uvLevel');
            if (levelElement) {
                levelElement.textContent = "AMAN (MALAM)";
                levelElement.style.backgroundColor = "#4169E1";
            }
        }
        
        // Update UV level badge
        const levelElement = document.getElementById('uvLevel');
        if (levelElement) {
            levelElement.textContent = uvLevel.level;
            levelElement.className = 'level-badge';
            levelElement.style.backgroundColor = uvLevel.color;
            levelElement.style.color = 'white';
            levelElement.style.boxShadow = `0 4px 15px ${uvLevel.color}80`;
            levelElement.setAttribute('data-level', uvLevel.key);
        }
        
        // Update UV description
        const descElement = document.getElementById('uvDescription');
        if (descElement) {
            descElement.textContent = uvLevel.description;
            
            if (uvIndex === 0) {
                descElement.textContent += " (Malam hari - tidak ada UV)";
            }
        }
        
        // Update UV gauge
        const gaugeElement = document.getElementById('uvGauge');
        if (gaugeElement) {
            const gaugeWidth = Math.min(100, (uvIndex / 15) * 100);
            gaugeElement.style.width = `${gaugeWidth}%`;
            gaugeElement.style.backgroundColor = uvLevel.color;
            gaugeElement.style.boxShadow = `0 0 20px ${uvLevel.color}`;
        }
    }
    
    updateWeatherInfo() {
    if (!this.currentData) {
        console.error("❌ ERROR: currentData is undefined!");
        return;
    }
    
    const data = this.currentData;
    
    // ====== FIX TIMEZONE PASTI ======
    if ((this.currentLocation && this.currentLocation.country === 'ID') ||
        (data.country && data.country === 'ID')) {
        
        console.log("🇮🇩 Indonesian location, fixing timezone...");
        this.fixIndonesianTimezone();
    }
    
    const updateElement = (id, value) => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        } else {
            console.warn(`⚠️ Element with id "${id}" not found`);
        }
    };
    
    // Location
    let locationText = data.cityName || 'Unknown City';
    if (data.country && data.country !== "XX") {
        locationText += `, ${data.country}`;
    }
    updateElement('locationName', locationText);
    
    const coordinatesElement = document.getElementById('coordinatesText');
    if (coordinatesElement) {
        const lat = data.lat !== undefined ? data.lat.toFixed(4) : '0.0000';
        const lon = data.lon !== undefined ? data.lon.toFixed(4) : '0.0000';
        coordinatesElement.textContent = `${lat}, ${lon}`;
    }
    
    // Weather data
    updateElement('temperature', data.temperature !== undefined ? `${data.temperature.toFixed(1)}°C` : '- °C');
    updateElement('feelsLikeText', data.feelsLike !== undefined ? `${data.feelsLike.toFixed(1)}°C` : '- °C');
    updateElement('weatherCondition', data.weather || 'Tidak diketahui');
    updateElement('humidity', `${data.humidity !== undefined ? data.humidity : '-'}%`);
    
    const pressureElement = document.getElementById('pressureText');
    const windElement = document.getElementById('windText');
    const cloudsElement = document.getElementById('cloudsText');
    
    if (pressureElement) pressureElement.textContent = `${data.pressure !== undefined ? data.pressure : '-'} hPa`;
    if (windElement) windElement.textContent = data.windSpeed !== undefined ? `${data.windSpeed.toFixed(1)} m/s` : '- m/s';
    if (cloudsElement) cloudsElement.textContent = `${data.clouds !== undefined ? data.clouds : '-'}%`;
    
    // Sunrise/sunset - FIXED
    if (data.sunrise && data.sunset) {
        try {
            const sunriseDate = data.sunrise instanceof Date ? data.sunrise : new Date(data.sunrise);
            const sunsetDate = data.sunset instanceof Date ? data.sunset : new Date(data.sunset);
            
            let sunriseTime, sunsetTime;
            
            // Try to format with timezone
            try {
                const sunriseOptions = { 
                    timeZone: this.timezone,
                    hour: '2-digit', 
                    minute: '2-digit'
                };
                
                const sunsetOptions = { 
                    timeZone: this.timezone,
                    hour: '2-digit', 
                    minute: '2-digit'
                };
                
                sunriseTime = sunriseDate.toLocaleTimeString('id-ID', sunriseOptions);
                sunsetTime = sunsetDate.toLocaleTimeString('id-ID', sunsetOptions);
            } catch (e) {
                // Fallback to local time
                sunriseTime = sunriseDate.toLocaleTimeString('id-ID', { 
                    hour: '2-digit', 
                    minute: '2-digit'
                });
                
                sunsetTime = sunsetDate.toLocaleTimeString('id-ID', { 
                    hour: '2-digit', 
                    minute: '2-digit'
                });
            }
            
            const sunriseElement = document.getElementById('sunriseText');
            const sunsetElement = document.getElementById('sunsetText');
            if (sunriseElement) sunriseElement.textContent = sunriseTime;
            if (sunsetElement) sunsetElement.textContent = sunsetTime;
            
        } catch (error) {
            console.error("❌ Error processing sunrise/sunset:", error);
            updateElement('sunriseText', '06:00');
            updateElement('sunsetText', '18:00');
        }
    } else {
        updateElement('sunriseText', '--:--');
        updateElement('sunsetText', '--:--');
    }
    
    // Update time period
    this.updateTimePeriod();
    
    // Last update time
    if (this.lastUpdateTime) {
        const lastUpdateElement = document.getElementById('lastUpdate');
        if (lastUpdateElement) {
            lastUpdateElement.textContent = this.lastUpdateTime.toLocaleTimeString('id-ID');
        }
    }
    
    // Data source - FIXED! Pastikan pakai this.currentData
    const dataSourceElement = document.getElementById('dataSource');
    if (dataSourceElement) {
        // PAKAI this.currentData, bukan data (biar konsisten)
        const apiSource = this.currentData.apiSource;
        
        if (apiSource === 'demo') {
            dataSourceElement.textContent = 'Data Demo';
            dataSourceElement.style.color = '#ff6600';
        } else {
            // Tampilkan nama API asli
            const displayName = apiSource || 
                               this.currentData.provider || 
                               'API Real-time';
            dataSourceElement.textContent = displayName;
            dataSourceElement.style.color = '#0066cc';
        }
    }
    
    // ========== TAMBAH: HANDLE KOSONG ==========
    if (!data.cityName || data.cityName === 'Unknown City' || data.cityName === 'Demo Location') {
        const locationElement = document.getElementById('locationName');
        if (locationElement) locationElement.textContent = "--";
        
        const timezoneElement = document.getElementById('timezoneInfo');
        if (timezoneElement) {
            timezoneElement.textContent = "--";
            timezoneElement.style.color = "#666";
        }
        
        const coordinatesElement = document.getElementById('coordinatesText');
        if (coordinatesElement) coordinatesElement.textContent = "--";
        
        console.log("⚠️ Location data empty, showing placeholder");
    }

    console.log("✅ Weather info updated successfully");
    
    // ========== TIMEZONE DISPLAY ==========
const timezoneElement = document.getElementById('timezoneInfo');
if (timezoneElement) {
    const tz = this.timezone || 'UTC';
    
    // Mapping untuk display yang user-friendly
    if (tz === 'Asia/Makassar') {
        timezoneElement.textContent = 'WITA (GMT+8)';
        timezoneElement.style.color = '#0066cc';
    } else if (tz === 'Asia/Jayapura') {
        timezoneElement.textContent = 'WIT (GMT+9)';
        timezoneElement.style.color = '#ff6600';
    } else if (tz === 'Asia/Jakarta') {
        timezoneElement.textContent = 'WIB (GMT+7)';
        timezoneElement.style.color = '#4CAF50';
    } else if (tz === 'Asia/Singapore') {
        timezoneElement.textContent = 'SGT (GMT+8)';
        timezoneElement.style.color = '#9b59b6';
    } else if (tz === 'Asia/Tokyo') {
        timezoneElement.textContent = 'JST (GMT+9)';
        timezoneElement.style.color = '#e74c3c';
    } else if (tz === 'Europe/London') {
        timezoneElement.textContent = 'GMT/BST';
        timezoneElement.style.color = '#3498db';
    } else if (tz === 'America/New_York') {
        timezoneElement.textContent = 'EST (GMT-5)';
        timezoneElement.style.color = '#2ecc71';
    } else if (tz === 'Australia/Sydney') {
        timezoneElement.textContent = 'AEST (GMT+10)';
        timezoneElement.style.color = '#1abc9c';
    } else if (tz === 'Asia/Bangkok') {
        timezoneElement.textContent = 'ICT (GMT+7)';
        timezoneElement.style.color = '#e67e22';
    } else if (tz === 'Asia/Seoul') {
        timezoneElement.textContent = 'KST (GMT+9)';
        timezoneElement.style.color = '#2c3e50';
    } else if (tz === 'Asia/Dubai') {
        timezoneElement.textContent = 'GST (GMT+4)';
        timezoneElement.style.color = '#ff6b6b';
    } else if (tz === 'UTC') {
        timezoneElement.textContent = 'UTC (GMT+0)';
        timezoneElement.style.color = '#666';
    } else {
        timezoneElement.textContent = tz;
        timezoneElement.style.color = '#666';
    }
    
    timezoneElement.style.fontWeight = 'bold';
}

    
    // Update time status (biar "Status Waktu" gak kosong)
    const timeStatusElement = document.getElementById('timeStatus');
    if (timeStatusElement) {
        const now = new Date();
        const hour = now.getHours();
        
        // Jika malam atau UV = 0
        if (data.uvIndex === 0 || !data.isDaytime) {
            timeStatusElement.innerHTML = '🌙 Malam Hari';
            timeStatusElement.style.color = '#4169E1';
        } else {
            // Siang hari, bedakan pagi/siang/sore
            if (hour >= 5 && hour < 11) {
                timeStatusElement.innerHTML = '🌅 Pagi Hari';
                timeStatusElement.style.color = '#FF8C00';
            } else if (hour >= 11 && hour < 15) {
                timeStatusElement.innerHTML = '☀️ Siang Hari';
                timeStatusElement.style.color = '#FF4500';
            } else if (hour >= 15 && hour < 18) {
                timeStatusElement.innerHTML = '🌇 Sore Hari';
                timeStatusElement.style.color = '#FF8C00';
            } else {
                timeStatusElement.innerHTML = '🌙 Malam Hari';
                timeStatusElement.style.color = '#4169E1';
            }
        }
    }
}

    // ==================== SIMPLE TIMEZONE FORMATTER ====================
formatTimezoneForDisplay(timezone) {
    const tz = timezone || this.timezone || 'Asia/Jakarta';
    
    // Mapping sederhana
    if (tz === 'Asia/Makassar') return 'WITA (GMT+8)';
    if (tz === 'Asia/Jayapura') return 'WIT (GMT+9)';
    if (tz === 'Asia/Jakarta') return 'WIB (GMT+7)';
    if (tz === 'Asia/Singapore') return 'SGT (GMT+8)';
    if (tz === 'Asia/Tokyo') return 'JST (GMT+9)';
    if (tz === 'Europe/London') return 'GMT/BST';
    if (tz === 'America/New_York') return 'EST (GMT-5)';
    
    return tz;
}

getTimezoneColor(timezone) {
    const tz = timezone || this.timezone || 'Asia/Jakarta';
    
    if (tz === 'Asia/Makassar') return '#0066cc'; // WITA - Biru
    if (tz === 'Asia/Jayapura') return '#ff6600'; // WIT - Orange
    if (tz === 'Asia/Jakarta') return '#4CAF50';  // WIB - Hijau
    if (tz === 'Asia/Singapore') return '#9b59b6'; // SGT - Ungu
    if (tz === 'Asia/Tokyo') return '#e74c3c';    // JST - Merah
    if (tz === 'Europe/London') return '#3498db'; // GMT - Biru muda
    if (tz === 'America/New_York') return '#2ecc71'; // EST - Hijau muda
    
    return '#666'; // Default grey
}

    // ==================== RECOMMENDATIONS WITH OUTFIT ====================
// ==================== RECOMMENDATIONS WITH OUTFIT ====================
updateRecommendations() {
    if (!this.currentData) return;
    
    const uvIndex = this.currentData.uvIndex;
    const uvLevel = this.getUVLevel(uvIndex);
    const isDaytime = this.currentData.isDaytime;
    const currentHour = new Date().getHours();
    
    const recommendations = {
        low: {
            protection: [
                "SPF 15+ untuk aktivitas lebih dari 1 jam",
                "Topi dengan pinggiran minimal 5cm untuk perlindungan wajah",
                "Kacamata hitam dengan UV protection 99-100%",
                "Sunscreen pada area sensitif: hidung, telinga, leher",
                "Gunakan lip balm dengan SPF 15+",
                "Aplikasi sunscreen ulang setelah berenang atau berkeringat"
            ],
            activities: [
                "Aman untuk semua aktivitas outdoor sepanjang hari",
                "Ideal untuk jogging, bersepeda, atau hiking pagi",
                "Berjemur 15-30 menit untuk produksi vitamin D optimal",
                "Waktu terbaik olahraga: 07:00-10:00 atau 16:00-18:00",
                "Anak-anak dapat bermain di luar dengan pengawasan normal",
                "Foto outdoor dengan cahaya alami yang lembut"
            ],
            outfit: [
                "Baju lengan pendek atau kaus berbahan katun",
                "Celana pendek, rok pendek, atau capri pants",
                "Topi baseball atau topi biasa untuk gaya",
                "Kacamata hitam UV400 (opsional untuk kenyamanan)",
                "Bahan: Katun, linen, rayon, atau bahan natural breathable",
                "Warna: Putih, krem, pastel, atau warna terang yang memantulkan panas",
                "Sepatu: Sandal, sepatu sneakers, atau sepatu terbuka",
                "Aksesori: Jam tangan biasa, perhiasan ringan"
            ],
            sunbath: {
                safeDuration: "30-60 menit",
                optimalDuration: "15-30 menit untuk vitamin D",
                risk: "Rendah (burn time: 60+ menit)",
                bestTime: "Pagi (08:00-10:00) atau Sore (16:00-17:00)",
                frequency: "3-4 kali per minggu",
                position: "Bergantian depan-beluk setiap 10 menit",
                caution: "Tetap gunakan SPF 15+ untuk wajah"
            }
        },
        moderate: {
            protection: [
                "SPF 30+ wajib digunakan 15 menit sebelum keluar",
                "Topi bertepi lebar (minimal 7cm) untuk wajah dan leher",
                "Kacamata hitam dengan lensa UV400 wajib",
                "Sunscreen water resistant untuk aktivitas outdoor",
                "Lip balm SPF 30+ dengan perlindungan UVA/UVB",
                "Cari tempat teduh antara pukul 11:00-14:00",
                "Reapply sunscreen setiap 2 jam atau setelah berkeringat"
            ],
            activities: [
                "Batasi paparan langsung antara 10:00-14:00",
                "Olahraga intensitas sedang di pagi/sore hari",
                "Berjemur maksimal 15 menit untuk kulit sensitif",
                "Waktu aman untuk gardening: sebelum 10:00 atau setelah 15:00",
                "Anak-anak perlu diawasi lebih ketat",
                "Jika bekerja di luar, ambil istirahat setiap 45 menit",
                "Beraktivitas di area dengan naungan parsial"
            ],
            outfit: [
                "Baju lengan pendek dengan lapisan sunscreen",
                "Celana panjang tipis atau celana 3/4",
                "Topi bertepi lebar atau topi panama",
                "Kacamata hitam wrap-around untuk proteksi samping",
                "Reapply sunscreen pada lengan dan kaki setiap 2 jam",
                "Bahan: Katun dengan tenunan rapat, chambray, atau poplin",
                "Warna: Biru muda, abu-abu terang, atau warna pastel dengan UV protection",
                "Sepatu: Sepatu tertutup atau sandal dengan strap lebar",
                "Aksesori: Scarf ringan untuk leher, wristbands"
            ],
            sunbath: {
                safeDuration: "15-30 menit",
                optimalDuration: "10-15 menit untuk vitamin D",
                risk: "Sedang (burn time: 30-60 menit)",
                bestTime: "Pagi (07:00-09:00) atau Sore (16:00-18:00)",
                frequency: "2-3 kali per minggu",
                position: "Bergantian sisi tubuh setiap 8 menit",
                caution: "Hindari matahari pukul 11:00-13:00"
            }
        },
        high: {
            protection: [
                "SPF 50+ wajib untuk semua area kulit terbuka",
                "Pakaian lengan panjang dengan UPF minimal 30",
                "Topi lebar dengan pinggiran 10cm+ dan neck flap",
                "Kacamata hitam dengan polarisasi dan UV400+",
                "Sunscreen broad spectrum (UVA/UVB) water resistant",
                "Lip balm SPF 50+ dengan zinc oxide",
                "Gunakan payung atau cari tempat teduh terus menerus",
                "Reapply sunscreen setiap 90 menit atau lebih sering jika berenang"
            ],
            activities: [
                "Hindari aktivitas outdoor antara 10:00-16:00",
                "Olahraga hanya di pagi sebelum 09:00 atau sore setelah 17:00",
                "Prioritaskan aktivitas indoor: gym, mall, museum",
                "Jika harus keluar, maksimal 30 menit dengan perlindungan lengkap",
                "Anak-anak sebaiknya bermain di dalam ruangan",
                "Meeting outdoor sebaiknya di tempat teduh atau indoor",
                "Minum air lebih banyak untuk hindari heat stroke"
            ],
            outfit: [
                "Baju lengan panjang berbahan katun rapat atau linen",
                "Celana panjang atau maxi dress/skirt",
                "Topi bucket dengan neck guard atau topi safari",
                "Kacamata hitam dengan frame besar dan side protection",
                "Sunscreen SPF 50+ pada wajah, leher, tangan, dan kaki",
                "Payung anti-UV atau cari naungan terus menerus",
                "Bahan: Katun Oxford, denim ringan, atau kain dengan UPF rating",
                "Warna: Navy, dark grey, olive, atau warna gelap dengan UV block",
                "Sepatu: Sepatu tertutup dengan kaus kaki tipis",
                "Aksesori: Arm sleeves, neck gaiter, atau lightweight scarf"
            ],
            sunbath: {
                safeDuration: "10-15 menit",
                optimalDuration: "5-10 menit (hanya untuk yang sangat perlu)",
                risk: "Tinggi (burn time: 15-30 menit)",
                bestTime: "Hanya pagi sebelum 08:30",
                frequency: "Maksimal 1 kali per minggu",
                position: "Punggung saja selama 5-8 menit maksimal",
                caution: "Tidak disarankan untuk anak dan kulit sensitif"
            }
        },
        veryHigh: {
            protection: [
                "SPF 50+ mineral sunscreen dengan zinc oxide/titanium dioxide",
                "Pakaian UPF 50+ wajib untuk seluruh tubuh",
                "Topi dengan neck veil atau attachment khusus",
                "Kacamata hitam dengan goggle-style atau side shields",
                "Sunscreen water resistant 80 menit, reapply setiap 60 menit",
                "Lip balm dengan SPF 50+ dan physical blocker",
                "Tetap di tempat teduh atau gunakan payung UV sepanjang waktu",
                "Hindari keluar rumah jika tidak sangat penting"
            ],
            activities: [
                "Hindari SEMUA aktivitas outdoor yang tidak perlu",
                "Aktivitas hanya di dalam ruangan ber-AC",
                "Jika emergency keluar, maksimal 15 menit dengan proteksi maksimal",
                "Anak-anak, lansia, dan kulit sensitif TIDAK BOLEH keluar",
                "Kerja remote dari dalam rumah jika memungkinkan",
                "Tunda perjalanan, meeting, atau acara outdoor",
                "Minum electrolyte untuk cegah dehidrasi ekstrem"
            ],
            outfit: [
                "Full coverage clothing dengan rating UPF 50+",
                "Long pants dengan bahan thick weave atau specialized fabric",
                "Wide-brim hat dengan neck cover dan face shield",
                "Sunglasses dengan full coverage dan UV filter max",
                "Gloves untuk tangan atau arm sleeves UPF 50+",
                "Sunscreen pada setiap inci kulit yang terbuka",
                "UV umbrella dengan rating UPF 50+ wajib dibawa",
                "Bahan: Specialized UV fabric, polyester tightly woven, nylon",
                "Warna: Hitam, dark blue, atau warna dengan UV reflective coating",
                "Sepatu: Sepatu tertutup dengan kaus kaki UPF",
                "Aksesori: Face mask UV, leg gaiters, cooling towel"
            ],
            sunbath: {
                safeDuration: "5-10 menit (hanya jika sangat diperlukan)",
                optimalDuration: "TIDAK DISARANKAN",
                risk: "Sangat Tinggi (burn time: 5-15 menit)",
                bestTime: "Tidak ada waktu yang aman",
                frequency: "Hindari sama sekali",
                position: "Tidak disarankan",
                caution: "Risiko sunburn ekstrem, skin damage permanen"
            }
        },
        extreme: {
            protection: [
                "TETAP DI DALAM RUANGAN adalah perlindungan terbaik",
                "Jika emergency keluar: SPF 100+ physical sunscreen",
                "Full body coverage dengan pakaian UPF 100 jika ada",
                "Face shield dengan UV protection + sunglasses",
                "Sunscreen dengan zinc oxide 20%+ atau titanium dioxide",
                "Lip protection dengan physical barrier",
                "Hindari area reflective: air, pasir, salju, beton",
                "Emergency exit only dengan durasi minimal"
            ],
            activities: [
                "TIDAK ADA aktivitas outdoor yang aman",
                "Semua aktivitas HARUS di dalam ruangan",
                "Emergency services only dengan proteksi maksimal",
                "Anak-anak, bayi, lansia, kulit sensitif: ABSOLUTELY NO OUTDOOR",
                "Cancel semua janji, perjalanan, dan kegiatan luar",
                "Stay hydrated dengan air dan electrolyte",
                "Monitor tanda-tanda heat stroke dan sun poisoning"
            ],
            outfit: [
                "Full body protective suit jika benar-benar harus keluar",
                "Multi-layer clothing dengan bahan UV protective",
                "Helmet dengan face shield UV atau specialized headgear",
                "Goggles dengan UV protection maksimal",
                "Gloves panjang dan thick socks",
                "Sunscreen pada setiap millimeter kulit",
                "UV umbrella dengan rating maksimal",
                "Bahan: Multi-layer specialized fabrics, aluminized materials",
                "Warna: Reflective silver, white, atau specialized UV coating",
                "Sepatu: Boots tertutup dengan insulation",
                "Aksesori: Cooling vest, hydration pack, emergency kit"
            ],
            sunbath: {
                safeDuration: "TIDAK AMAN",
                optimalDuration: "TIDAK DISARANKAN",
                risk: "EKSTREM (burn time: <5 menit)",
                bestTime: "Tidak ada waktu yang aman",
                frequency: "JANGAN LAKUKAN",
                position: "Tidak ada posisi aman",
                caution: "Risiko immediate sunburn, heat stroke, skin cancer"
            }
        }
    };
    
    // Night time recommendations
    if (!isDaytime || uvIndex === 0) {
        const container = document.getElementById('recommendationsContainer');
        if (container) {
            const nightRec = `
                <div class="recommendation-card" data-level="night">
                    <div class="recommendation-header">
                        <div class="recommendation-icon">
                            <i class="fas fa-moon"></i>
                        </div>
                        <div class="recommendation-title">🌙 Malam Hari - Rekomendasi Lengkap</div>
                    </div>
                    <div class="recommendation-grid">
                        <div class="recommendation-section">
                            <h4><i class="fas fa-shield-alt"></i> Perlindungan</h4>
                            <ul class="recommendation-list">
                                <li><i class="fas fa-check-circle"></i> Tidak ada radiasi UV aktif</li>
                                <li><i class="fas fa-check-circle"></i> Tidak perlu sunscreen UV protection</li>
                                <li><i class="fas fa-check-circle"></i> Moisturizer untuk kulit kering malam</li>
                                <li><i class="fas fa-check-circle"></i> Lip balm biasa (tanpa SPF) untuk kelembaban</li>
                                <li><i class="fas fa-check-circle"></i> Eye care untuk mata lelah</li>
                            </ul>
                        </div>
                        <div class="recommendation-section">
                            <h4><i class="fas fa-running"></i> Aktivitas</h4>
                            <ul class="recommendation-list">
                                <li><i class="fas fa-check-circle"></i> Aman untuk semua aktivitas outdoor</li>
                                <li><i class="fas fa-check-circle"></i> Night running, cycling dengan safety gear</li>
                                <li><i class="fas fa-check-circle"></i> Stargazing atau night photography</li>
                                <li><i class="fas fa-check-circle"></i> Outdoor dining atau social gathering</li>
                                <li><i class="fas fa-check-circle"></i> Anak-anak dapat bermain di luar dengan pengawasan</li>
                                <li><i class="fas fa-check-circle"></i> Gardening dengan lampu kepala</li>
                            </ul>
                        </div>
                        <div class="recommendation-section">
                            <h4><i class="fas fa-tshirt"></i> Pakaian & Outfit</h4>
                            <ul class="recommendation-list">
                                <li><i class="fas fa-check-circle"></i> Pakaian sesuai suhu malam (biasanya lebih dingin)</li>
                                <li><i class="fas fa-check-circle"></i> Jaket atau sweater untuk kenyamanan</li>
                                <li><i class="fas fa-check-circle"></i> Bahan: Wool, fleece, atau bahan hangat sesuai cuaca</li>
                                <li><i class="fas fa-check-circle"></i> Warna: Terang atau reflective untuk visibility</li>
                                <li><i class="fas fa-check-circle"></i> Sepatu: Closed shoes untuk proteksi</li>
                                <li><i class="fas fa-check-circle"></i> Aksesori: Headlamp, reflective vest untuk safety</li>
                            </ul>
                        </div>
                        <div class="recommendation-section">
                            <h4><i class="fas fa-info-circle"></i> Informasi Tambahan</h4>
                            <ul class="recommendation-list">
                                <li><i class="fas fa-check-circle"></i> UV Index: 0 (Aman total dari radiasi UV)</li>
                                <li><i class="fas fa-check-circle"></i> Waktu: ${currentHour}:00 - Aman untuk kulit</li>
                                <li><i class="fas fa-check-circle"></i> Suhu malam biasanya 5-10°C lebih dingin</li>
                                <li><i class="fas fa-check-circle"></i> Kelembaban mungkin lebih tinggi</li>
                                <li><i class="fas fa-check-circle"></i> Perhatikan keamanan pribadi di malam hari</li>
                            </ul>
                        </div>
                    </div>
                </div>
            `;
            container.innerHTML = nightRec;
        }
        return;
    }
    
    const rec = recommendations[uvLevel.key] || recommendations.moderate;
    
    const container = document.getElementById('recommendationsContainer');
    if (!container) return;
    
    const recommendationTypes = [
        {
            title: "🛡️ Perlindungan Detail",
            icon: "fa-shield-alt",
            items: rec.protection || []
        },
        {
            title: "🏃 Aktivitas & Jadwal",
            icon: "fa-running",
            items: rec.activities || []
        },
        {
            title: "👕 Pakaian, Bahan & Warna",
            icon: "fa-tshirt",
            items: rec.outfit || []
        },
        {
            title: "⏱️ Panduan Berjemur",
            icon: "fa-sun",
            items: [
                `Durasi Aman: ${rec.sunbath?.safeDuration || '-'}`,
                `Durasi Optimal Vitamin D: ${rec.sunbath?.optimalDuration || '-'}`,
                `Risiko Sunburn: ${rec.sunbath?.risk || '-'}`,
                `Waktu Terbaik: ${rec.sunbath?.bestTime || '-'}`,
                `Frekuensi: ${rec.sunbath?.frequency || '-'}`,
                `Posisi: ${rec.sunbath?.position || '-'}`,
                `Peringatan: ${rec.sunbath?.caution || '-'}`
            ]
        }
    ];
    
    let html = `
        <div class="recommendations-grid-container">
    `;
    
    recommendationTypes.forEach(type => {
        if (type.items && type.items.length > 0) {
            html += `
                <div class="recommendation-card" data-level="${uvLevel.key}">
                    <div class="recommendation-header">
                        <div class="recommendation-icon">
                            <i class="fas ${type.icon}"></i>
                        </div>
                        <div class="recommendation-title">${type.title}</div>
                    </div>
                    <ul class="recommendation-list">
                        ${type.items.map(item => `
                            <li><i class="fas fa-check-circle"></i> ${item}</li>
                        `).join('')}
                    </ul>
                </div>
            `;
        }
    });
    
    html += `</div>`;
    
    container.innerHTML = html || '<div class="loading-recommendations">Tidak ada rekomendasi</div>';
}
    
    updateActivityRecommendations() {
        if (!this.currentData) return;
        
        const uvIndex = this.currentData.uvIndex;
        const now = new Date();
        let currentHour;
        
        try {
            const options = { timeZone: this.timezone, hour: '2-digit', hour12: false };
            const timeString = now.toLocaleTimeString('en-US', options);
            currentHour = parseInt(timeString.split(':')[0]);
        } catch (e) {
            currentHour = now.getHours();
        }
        
        const isDaytime = this.currentData.isDaytime;
        
        let recommendation = "";
        
        if (!isDaytime || uvIndex === 0) {
            recommendation = "🌙 Malam hari: Tidak ada radiasi UV. Aman untuk semua aktivitas outdoor tanpa perlindungan UV.";
        } else if (uvIndex <= 2) {
            recommendation = "UV rendah. Aman untuk semua aktivitas outdoor sepanjang hari.";
        } else if (uvIndex <= 5) {
            recommendation = "UV sedang. Batasi paparan 10:00-14:00. Gunakan SPF 30+.";
        } else if (uvIndex <= 7) {
            recommendation = "UV tinggi. Hindari outdoor 10:00-16:00. SPF 50+ wajib.";
        } else if (uvIndex <= 10) {
            recommendation = "UV sangat tinggi. Hanya aktivitas outdoor singkat di pagi/sore.";
        } else {
            recommendation = "UV ekstrem. Hindari semua aktivitas outdoor. Tetap di dalam ruangan.";
        }
        
        if (isDaytime) {
            if (currentHour >= 10 && currentHour <= 14) {
                recommendation += " Saat ini adalah waktu puncak UV - ekstra hati-hati!";
            } else if (currentHour >= 6 && currentHour <= 9) {
                recommendation += " Saat ini waktu baik untuk aktivitas pagi.";
            } else if (currentHour >= 16 && currentHour <= 18) {
                recommendation += " Saat ini waktu terbaik untuk aktivitas sore.";
            }
        }
        
        const recElement = document.getElementById('currentActivityRec');
        if (recElement) {
            recElement.textContent = recommendation;
        }
    }
    
    // ==================== MATHEMATICAL ANALYSIS ====================
    performMathematicalAnalysis() {
        if (!this.dataHistory || this.dataHistory.length < 3) {
            this.updateMathematicalDisplay(null);
            return;
        }
        
        try {
            const recentData = this.dataHistory.slice(-8);
            const n = recentData.length;
            
            if (n < 3) {
                this.updateMathematicalDisplay(null);
                return;
            }
            
            const times = recentData.map(d => {
                const date = new Date(d.timestamp);
                return date.getTime() / (1000 * 60 * 60);
            });
            
            const uvValues = recentData.map(d => d.uvIndex);
            
            const timeMin = Math.min(...times);
            const timesNormalized = times.map(t => t - timeMin);
            
            // Linear regression: y = ax + b
            let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
            
            for (let i = 0; i < n; i++) {
                const x = timesNormalized[i];
                const y = uvValues[i];
                sumX += x;
                sumY += y;
                sumXY += x * y;
                sumX2 += x * x;
            }
            
            const denominator = n * sumX2 - sumX * sumX;
            
            if (Math.abs(denominator) < 1e-10) {
                this.updateMathematicalDisplay(null);
                return;
            }
            
            const slope = (n * sumXY - sumX * sumY) / denominator;
            const intercept = (sumY - slope * sumX) / n;
            
            this.regressionModel = { slope, intercept };
            
            // Calculate current rate of change
            const currentRate = slope;
            
            // Find peak UV and time
            let peakUV = Math.max(...uvValues);
            let peakTimeIndex = uvValues.indexOf(peakUV);
            let peakTime = times[peakTimeIndex];
            
            const peakDate = new Date(peakTime * 1000 * 60 * 60);
            const peakTimeStr = peakDate.toLocaleTimeString('id-ID', { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
            
            // Calculate safe time (when UV drops below 3)
            let safeTime = "16:00";
            
            if (slope < 0 && uvValues[n-1] > 3) {
                const hoursToSafe = (uvValues[n-1] - 3) / Math.abs(slope);
                const safeDate = new Date(Date.now() + hoursToSafe * 60 * 60 * 1000);
                safeTime = safeDate.toLocaleTimeString('id-ID', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                });
            }
            
            this.updateMathematicalDisplay({ slope, intercept }, currentRate, peakTimeStr, peakUV, safeTime);
            
        } catch (error) {
            console.error("Error in mathematical analysis:", error);
            this.updateMathematicalDisplay(null);
        }
    }
    
    updateMathematicalDisplay(coefficients, currentRate = 0, peakTime = "--:--", peakUV = 0, safeTime = "16:00") {
        const updateCoeff = (id, value) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value !== null ? value.toFixed(4) : "0.0000";
            }
        };
        
        if (coefficients) {
            updateCoeff('coeffA', 0); // a coefficient (for quadratic model)
            updateCoeff('coeffB', coefficients.slope);
            updateCoeff('coeffC', coefficients.intercept);
        } else {
            updateCoeff('coeffA', 0);
            updateCoeff('coeffB', 0);
            updateCoeff('coeffC', 0);
        }
        
        const rateElement = document.getElementById('currentRate');
        if (rateElement) {
            rateElement.textContent = Math.abs(currentRate).toFixed(2);
            this.updateTrendIndicator(currentRate);
        }
        
        const peakTimeElement = document.getElementById('peakTime');
        const peakUVElement = document.getElementById('peakUV');
        const safeTimeElement = document.getElementById('safeTime');
        
        if (peakTimeElement) peakTimeElement.textContent = peakTime;
        if (peakUVElement) peakUVElement.textContent = peakUV.toFixed(1);
        if (safeTimeElement) safeTimeElement.textContent = safeTime;
    }
    
    updateTrendIndicator(currentRate) {
        const trendElement = document.getElementById('trendIndicator');
        const interpretationElement = document.getElementById('rateInterpretation');
        
        if (!trendElement || !interpretationElement) return;
        
        if (currentRate > 0.1) {
            trendElement.innerHTML = '<i class="fas fa-arrow-up"></i> <span>Naik</span>';
            trendElement.setAttribute('data-trend', 'up');
            trendElement.style.background = 'rgba(255, 51, 0, 0.1)';
            trendElement.style.color = '#ff3300';
            interpretationElement.textContent = 
                "UV Index sedang meningkat. Waspada terhadap peningkatan risiko.";
        } else if (currentRate < -0.1) {
            trendElement.innerHTML = '<i class="fas fa-arrow-down"></i> <span>Turun</span>';
            trendElement.setAttribute('data-trend', 'down');
            trendElement.style.background = 'rgba(0, 204, 136, 0.1)';
            trendElement.style.color = '#00cc88';
            interpretationElement.textContent = 
                "UV Index sedang menurun. Kondisi akan semakin aman.";
        } else {
            trendElement.innerHTML = '<i class="fas fa-arrow-right"></i> <span>Stabil</span>';
            trendElement.setAttribute('data-trend', 'stable');
            trendElement.style.background = 'rgba(255, 204, 0, 0.1)';
            trendElement.style.color = '#ffcc00';
            interpretationElement.textContent = 
                "UV Index stabil. Tidak ada perubahan signifikan.";
        }
    }
    
    // ==================== SUNBATH CALCULATOR ====================
    calculateSunbathDuration() {
        if (!this.currentData) return;
        
        const uvIndex = this.currentData.uvIndex;
        const skinTypeSelect = document.getElementById('skinTypeSelect');
        const spfSelect = document.getElementById('spfSelect');
        const calcUV = document.getElementById('calcUV');
        
        if (!skinTypeSelect || !spfSelect) return;
        
        const skinType = skinTypeSelect.value;
        const spf = parseInt(spfSelect.value) || 1;
        const useCustomUV = calcUV ? parseFloat(calcUV.value) : uvIndex;
        
        // Handle night time or zero UV
        if (!skinType || useCustomUV <= 0) {
            this.updateSunbathResults('N/A', 'N/A', 'Tidak ada', 'Tidak ada UV');
            
            const sunbathDurationElement = document.getElementById('sunbathDuration');
            if (sunbathDurationElement) {
                sunbathDurationElement.textContent = 'Tidak ada UV';
                sunbathDurationElement.style.color = '#666';
            }
            return;
        }
        
        // MED (Minimal Erythemal Dose) in minutes for each skin type
        const medTimes = {
            'I': 10,   // Very fair
            'II': 20,  // Fair
            'III': 30, // Medium
            'IV': 45,  // Olive
            'V': 60,   // Brown
            'VI': 90   // Dark brown to black
        };
        
        const med = medTimes[skinType] || 30;
        
        // Calculate safe duration: T = (MED × SPF) / UV
        let safeDuration = (med * spf) / useCustomUV;
        
        // Apply limits
        safeDuration = Math.min(safeDuration, 120); // Max 2 hours
        safeDuration = Math.max(safeDuration, 0);
        
        // Calculate optimal time for Vitamin D (25% of safe duration, max 30 min)
        const vitaminDTime = Math.min(safeDuration * 0.25, 30);
        
        // Determine burn risk level
        let burnRisk = "Rendah";
        let riskColor = "#00cc00";
        
        if (safeDuration < 15) {
            burnRisk = "Sangat Tinggi";
            riskColor = "#ff3300";
        } else if (safeDuration < 30) {
            burnRisk = "Tinggi";
            riskColor = "#ff6600";
        } else if (safeDuration < 60) {
            burnRisk = "Sedang";
            riskColor = "#ffcc00";
        }
        
        // Update display
        const updateElement = (id, value) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
            }
        };
        
        updateElement('safeSunbathTime', Math.round(safeDuration));
        updateElement('vitaminDTime', Math.round(vitaminDTime));
        updateElement('burnRisk', burnRisk);
        updateElement('sunbathDuration', `${Math.round(safeDuration)} menit`);
        
        const burnRiskElement = document.getElementById('burnRisk');
        if (burnRiskElement) {
            burnRiskElement.style.color = riskColor;
            burnRiskElement.style.fontWeight = 'bold';
        }
    }
    
    // ==================== CHART METHODS ====================
    updateCharts() {
    console.log("📈 Updating charts...");
    
    const chartContainer = document.querySelector('.chart-container');
    if (!chartContainer) {
        console.error("Chart container not found!");
        return;
    }
    
    if (!this.charts.uv) {
        const uvCtx = document.getElementById('uvChart');
        if (!uvCtx) {
            console.error("Chart canvas not found!");
            return;
        }
        
        this.initCharts();
        if (!this.charts.uv) {
            console.error("Failed to initialize chart!");
            return;
        }
    }
    
    if (!this.dataHistory || this.dataHistory.length < 1) {
        this.charts.uv.data.labels = ['00:00', '06:00', '12:00', '18:00'];
        this.charts.uv.data.datasets[0].data = [0, 5, 10, 5];
        this.charts.uv.update();
        return;
    }
    
    try {
        const recentData = this.dataHistory.slice(-12);
        const labels = recentData.map((point, index) => {
            try {
                const time = new Date(point.timestamp);
                return `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}`;
            } catch (e) {
                return `${index * 2}:00`;
            }
        });
        
        const data = recentData.map(point => point.uvIndex);
        
        console.log(`📊 Chart data: ${data.length} points, latest UV: ${data[data.length-1]}`);
        
        // ========== PERBAIKAN UTAMA DI SINI ==========
        // Hitung range data yang lebih sensitif
        const minUV = Math.min(...data);
        const maxUV = Math.max(...data);
        const rangeUV = maxUV - minUV;
        
        // Jika perubahan kecil (kurang dari 1), set range yang lebih sensitif
        let suggestedMax;
        if (rangeUV < 1) {
            // Untuk perubahan kecil, beri margin 0.2 di atas nilai maksimum
            suggestedMax = maxUV + 0.2;
        } else if (rangeUV < 3) {
            // Untuk perubahan sedang
            suggestedMax = maxUV + (rangeUV * 0.3);
        } else {
            // Untuk perubahan besar
            suggestedMax = Math.max(8, maxUV * 1.3);
        }
        
        // Pastikan suggestedMax minimal 1 jika ada data > 0
        if (maxUV > 0 && suggestedMax < 1) {
            suggestedMax = 1;
        }
        
        // Set min ke 0 atau sedikit di bawah min jika data tidak di 0
        const suggestedMin = minUV > 0 ? Math.max(0, minUV - 0.1) : 0;
        
        console.log(`📈 UV Range: ${minUV.toFixed(2)} - ${maxUV.toFixed(2)} (range: ${rangeUV.toFixed(2)})`);
        console.log(`📈 Chart scale: ${suggestedMin.toFixed(2)} to ${suggestedMax.toFixed(2)}`);
        
        // Update skala chart
        if (this.charts.uv.options.scales.y) {
            this.charts.uv.options.scales.y.suggestedMin = suggestedMin;
            this.charts.uv.options.scales.y.suggestedMax = suggestedMax;
            
            // Update ticks untuk tampilan yang lebih detail
            this.charts.uv.options.scales.y.ticks = {
                callback: function(value) {
                    if (suggestedMax - suggestedMin < 2) {
                        // Jika skala kecil, tampilkan dengan 2 desimal
                        return value.toFixed(2);
                    } else if (suggestedMax - suggestedMin < 5) {
                        // Jika skala sedang, tampilkan dengan 1 desimal
                        return value.toFixed(1);
                    }
                    return value;
                }
            };
        }
        
        this.charts.uv.data.labels = labels;
        this.charts.uv.data.datasets[0].data = data;
        
        this.charts.uv.update('active');
        console.log("✅ Chart updated successfully");
        
        this.updateHistoryTable();
        
    } catch (error) {
        console.error("❌ Error updating charts:", error);
    }
}
    
    updateChartRange(hours) {
        if (!this.charts.uv || !this.dataHistory.length) return;
        
        try {
            const cutoffTime = new Date(Date.now() - hours * 60 * 60 * 1000);
            const filteredData = this.dataHistory.filter(point => 
                new Date(point.timestamp) >= cutoffTime
            );
            
            const labels = filteredData.map((point) => {
                const time = new Date(point.timestamp);
                return `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}`;
            });
            
            const data = filteredData.map(point => point.uvIndex);
            
            this.charts.uv.data.labels = labels;
            this.charts.uv.data.datasets[0].data = data;
            this.charts.uv.update();
            
        } catch (error) {
            console.error("Error updating chart range:", error);
        }
    }
    
    interpretRate(rateValue) {
    if (rateValue === '-' || isNaN(rateValue)) return {text: '-', color: '#777'};

    const r = parseFloat(rateValue);
    if (r >= 1.0) return {text: `Naik cepat +${r.toFixed(2)}/jam (Bahaya)`, color: '#d9534f'};
    if (r >= 0.5) return {text: `Naik +${r.toFixed(2)}/jam (Waspada)`, color: '#f0ad4e'};
    if (r >= 0.1) return {text: `Naik perlahan +${r.toFixed(2)}/jam`, color: '#5bc0de'};
    if (r <= -1.0) return {text: `Turun cepat ${r.toFixed(2)}/jam`, color: '#0275d8'};
    if (r <= -0.5) return {text: `Turun ${r.toFixed(2)}/jam`, color: '#5cb85c'};
    return {text: `${r.toFixed(2)}/jam (Stabil)`, color: '#777'};
}

    updateHistoryTable() {
        const tbody = document.getElementById('historyBody');
        if (!tbody) {
            console.warn("History table body not found");
            return;
        }
        
        const recentData = this.dataHistory.slice(-10).reverse();
        
        if (recentData.length === 0) {
            tbody.innerHTML = `
                <tr class="no-data">
                    <td colspan="7">
                        <i class="fas fa-database"></i>
                        <p>Tidak ada data riwayat. Ambil data UV terlebih dahulu.</p>
                    </td>
                </tr>
            `;
            return;
        }
        
        let html = '';
        
        recentData.forEach((data, index) => {
            const time = new Date(data.timestamp).toLocaleTimeString('id-ID', {
                hour: '2-digit',
                minute: '2-digit'
            });
            
            const uvLevel = this.getUVLevel(data.uvIndex);
            const levelColor = uvLevel.color;
            
            let rate = '-';
            if (index < recentData.length - 1) {
                const nextData = recentData[index + 1];
                const timeDiff = (new Date(data.timestamp) - new Date(nextData.timestamp)) / (1000 * 60 * 60);
                const uvDiff = data.uvIndex - nextData.uvIndex;
                
                if (timeDiff > 0) {
                    rate = `${(uvDiff / timeDiff).toFixed(2)}/jam`;
                }
            }
            
            html += `
                <tr>
                    <td>${time}</td>
                    <td><strong>${data.uvIndex.toFixed(1)}</strong></td>
                    <td style="color:${this.interpretRate(parseFloat(rate))?.color}">
                    ${this.interpretRate(parseFloat(rate))?.text}
                    </td>
                    <td>${data.temperature ? data.temperature.toFixed(1) + '°C' : '-'}</td>
                    <td>${data.humidity || '-'}%</td>
                    <td>
                        <span class="badge" style="background: ${levelColor}; color: white; padding: 4px 8px; border-radius: 4px; font-size: 0.75rem;">
                            ${uvLevel.level}
                        </span>
                    </td>
                    <td>
                        <button class="btn-icon small" onclick="app.useHistoricalData(${this.dataHistory.length - 1 - index})" 
                                title="Gunakan data ini">
                            <i class="fas fa-redo"></i>
                        </button>
                    </td>
                </tr>
            `;
        });
        
        tbody.innerHTML = html;
    }
    
    // ==================== UTILITY METHODS ====================
    getUVLevel(uvIndex) {
        for (const [key, threshold] of Object.entries(this.UV_THRESHOLDS)) {
            if (uvIndex >= threshold.min && uvIndex <= threshold.max) {
                return {
                    key: key,
                    level: threshold.level,
                    color: threshold.color,
                    min: threshold.min,
                    max: threshold.max,
                    description: threshold.description
                };
            }
        }
        return this.UV_THRESHOLDS.extreme;
    }
    
    toggleButtons(enable) {
        const buttonIds = [
            'fetchData', 
            'startMonitoring', 
            'detectLocation', 
            'searchCity',
            'useCoordsBtn',
            'calculateSunbath',
            'refreshData'
        ];
        
        buttonIds.forEach(id => {
            const button = document.getElementById(id);
            if (button) {
                button.disabled = !enable;
                button.style.opacity = enable ? '1' : '0.5';
                button.style.cursor = enable ? 'pointer' : 'not-allowed';
            }
        });
        
        const fetchBtn = document.getElementById('fetchData');
        if (fetchBtn) {
            if (!enable) {
                fetchBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memproses...';
            } else {
                fetchBtn.innerHTML = '<i class="fas fa-cloud-download-alt"></i> Ambil Data ';
            }
        }
    }
    
    // ==================== MONITORING METHODS ====================
    startMonitoring() {
        if (this.monitoringInterval) {
            this.stopMonitoring();
        }
        
        if (!this.currentLocation) {
            this.showNotification("Pilih lokasi terlebih dahulu", "warning");
            return;
        }
        
        this.monitoringInterval = setInterval(() => {
            this.fetchData();
        }, 5 * 60 * 1000);
        
        this.updateUIState();
        
        this.showNotification("Monitoring dimulai. Data akan diperbarui setiap 5 menit.", "success");
        console.log("🔴 Monitoring started");
    }
    
    stopMonitoring() {
        if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval);
            this.monitoringInterval = null;
        }
        
        this.updateUIState();
        
        this.showNotification("Monitoring dihentikan.", "info");
        console.log("🟢 Monitoring stopped");
    }
    
    // ==================== DATA MANAGEMENT ====================
    saveHistory() {
        try {
            const historyToSave = this.dataHistory.map(item => ({
                t: item.timestamp.getTime(),
                uv: item.uvIndex,
                temp: item.temperature,
                hum: item.humidity,
                w: item.weather,
                loc: item.location,
                lat: item.lat,
                lon: item.lon,
                src: item.source,
                tz: item.timezone || this.timezone
            }));
            
            localStorage.setItem('uvguard_pro_history', JSON.stringify(historyToSave));
            
            if (this.currentLocation) {
                localStorage.setItem('uvguard_pro_location', JSON.stringify(this.currentLocation));
            }
            
            localStorage.setItem('uvguard_pro_timezone', this.timezone);
            localStorage.setItem('uvguard_pro_last_update', new Date().toISOString());
            
            console.log("💾 History saved to localStorage, items:", this.dataHistory.length);
            
        } catch (error) {
            console.error("❌ Error saving history:", error);
        }
    }
    
    loadHistory() {
        try {
            const savedHistory = localStorage.getItem('uvguard_pro_history');
            if (savedHistory) {
                const parsed = JSON.parse(savedHistory);
                this.dataHistory = parsed.map(item => ({
                    timestamp: new Date(item.t),
                    uvIndex: item.uv,
                    temperature: item.temp,
                    humidity: item.hum,
                    weather: item.w,
                    location: item.loc,
                    lat: item.lat,
                    lon: item.lon,
                    source: item.src || 'saved',
                    timezone: item.tz || 'Asia/Jakarta'
                }));
                
                console.log(`📂 Loaded ${this.dataHistory.length} history items from localStorage`);
            }
            
            const savedLocation = localStorage.getItem('uvguard_pro_location');
            if (savedLocation) {
                this.currentLocation = JSON.parse(savedLocation);
                
                const cityInput = document.getElementById('cityInput');
                const latInput = document.getElementById('latInput');
                const lonInput = document.getElementById('lonInput');
                
                //if (cityInput && this.currentLocation.name) {
               //     cityInput.value = `${this.currentLocation.name}${this.currentLocation.country ? ', ' + this.currentLocation.country : ''}`;
              //  }
              //  if (latInput && this.currentLocation.lat) {
               //     latInput.value = this.currentLocation.lat;
              //  }
               // if (lonInput && this.currentLocation.lon) {
               //     lonInput.value = this.currentLocation.lon;
               // }
                
                console.log("📍 Loaded saved location:", this.currentLocation);
            }
            
            const savedTimezone = localStorage.getItem('uvguard_pro_timezone');
            if (savedTimezone) {
                this.timezone = savedTimezone;
            }
            
        } catch (error) {
            console.error("❌ Error loading history:", error);
        }
    }
    
    clearHistory() {
        if (confirm("Hapus semua riwayat data? Tindakan ini tidak dapat dibatalkan.")) {
            this.dataHistory = [];
            localStorage.removeItem('uvguard_pro_history');
            
            this.updateHistoryTable();
            this.updateStats();
            
            if (this.charts.uv) {
                this.charts.uv.data.labels = [];
                this.charts.uv.data.datasets[0].data = [];
                this.charts.uv.update();
            }
            
            this.showNotification("Riwayat data telah dihapus.", "success");
            console.log("🗑️ History cleared");
        }
    }
    
    initExportButtons() {
    const btn = document.getElementById('exportDataBtn');
    if (!btn) return;

    btn.addEventListener('click', () => {
        if (!this.dataHistory || this.dataHistory.length === 0) {
            this.showNotification('Tidak ada data untuk diekspor', 'warning');
            return;
        }

        // Pilihan format sederhana via prompt (bisa diganti dialog UI)
        const format = prompt('Pilih format ekspor: ketik csv atau json', 'csv');
        if (!format) return;

        if (format.toLowerCase() === 'json') {
            const blob = new Blob([JSON.stringify(this.dataHistory, null, 2)], {type: 'application/json'});
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `uvguard_history_${new Date().toISOString().slice(0,10)}.json`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
            this.showNotification('Ekspor JSON berhasil', 'success');
            return;
        }

        // CSV export
        const keys = ['timestamp','uvIndex','temperature','humidity','lat','lon','source'];
        const rows = this.dataHistory.map(d => {
            return keys.map(k => {
                let v = d[k];
                if (k === 'timestamp') v = new Date(d.timestamp).toISOString();
                if (v === undefined || v === null) return '';
                // escape quotes
                return (`"${String(v).replace(/"/g,'""')}"`);
            }).join(',');
        });
        const header = keys.join(',');
        const csv = header + '\n' + rows.join('\n');
        const csvBlob = new Blob([csv], {type: 'text/csv;charset=utf-8;'});
        const csvUrl = URL.createObjectURL(csvBlob);
        const ai = document.createElement('a');
        ai.href = csvUrl;
        ai.download = `uvguard_history_${new Date().toISOString().slice(0,10)}.csv`;
        document.body.appendChild(ai);
        ai.click();
        ai.remove();
        URL.revokeObjectURL(csvUrl);
        this.showNotification('Ekspor CSV berhasil', 'success');
    });
}

    exportData() {
        if (this.dataHistory.length === 0) {
            this.showNotification("Tidak ada data untuk diekspor", "warning");
            return;
        }
        
        try {
            const headers = ['Waktu', 'UV Index', 'Suhu (°C)', 'Kelembapan (%)', 'Kondisi', 'Lokasi', 'Latitude', 'Longitude', 'Sumber', 'Timezone'];
            
            const csvContent = [
                headers.join(','),
                ...this.dataHistory.map(item => [
                    new Date(item.timestamp).toISOString(),
                    item.uvIndex,
                    item.temperature || '',
                    item.humidity || '',
                    `"${item.weather || ''}"`,
                    `"${item.location || ''}"`,
                    item.lat || '',
                    item.lon || '',
                    item.source || '',
                    item.timezone || ''
                ].join(','))
            ].join('\n');
            
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `uv-data-${new Date().toISOString().slice(0, 10)}.csv`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            
            this.showNotification("Data berhasil diekspor ke CSV", "success");
            console.log("📤 Data exported to CSV");
            
        } catch (error) {
            console.error("❌ Error exporting data:", error);
            this.showNotification("Gagal mengekspor data", "error");
        }
    }
    
    useHistoricalData(index) {
        const originalIndex = this.dataHistory.length - 1 - index;
        
        if (originalIndex >= 0 && originalIndex < this.dataHistory.length) {
            const historicalData = this.dataHistory[originalIndex];
            
            this.currentData = {
                uvIndex: historicalData.uvIndex,
                temperature: historicalData.temperature,
                humidity: historicalData.humidity,
                weather: historicalData.weather,
                cityName: historicalData.location,
                timestamp: new Date(),
                lat: historicalData.lat,
                lon: historicalData.lon,
                source: "history",
                apiSource: "history",
                timezone: historicalData.timezone || this.timezone
            };
            
            this.updateRealtimeDisplay();
            this.updateWeatherInfo();
            this.updateRecommendations();
            
            this.showNotification(`Menggunakan data historis dari ${historicalData.location}`, "info");
            console.log(`↩️ Using historical data from index ${originalIndex}`);
        }
    }
    
    // ==================== NOTIFICATION SYSTEM ====================
    showNotification(message, type = 'info') {
    console.log(`📢 ${type.toUpperCase()}: ${message}`);
    
    const container = document.getElementById('notificationSystem');
    if (!container) {
        console.warn("Notification container not found");
        return;
    }
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // Mapping icon untuk semua type termasuk danger
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle',
        danger: 'fa-exclamation-triangle',
        Danger: 'fa-exclamation-triangle',
        bahaya: 'fa-exclamation-triangle'
    };
    
    // Jika type danger tidak ada di mapping, fallback ke error
    const icon = icons[type] || 'fa-info-circle';
    
    // Mapping title/warna
    const titles = {
        success: 'Berhasil',
        error: 'Error',
        warning: 'Peringatan',
        info: 'Informasi',
        danger: 'Bahaya!',
        Danger: 'Bahaya!',
        bahaya: 'Bahaya!'
    };
    
    const title = titles[type] || type.charAt(0).toUpperCase() + type.slice(1);
    
    notification.innerHTML = `
        <i class="fas ${icon}"></i>
        <div class="notification-content">
            <div class="notification-title">${title}</div>
            <div class="notification-message">${message}</div>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    container.appendChild(notification);
    
    // ========== TAMBAHKAN LOGIKA DURASI BERBEDA ==========
    let duration = 5000; // Default: 5 detik (info, success, error biasa)
    
    // Durasi khusus untuk notifikasi tertentu
    if (type === 'danger' || type === 'Danger' || type === 'bahaya') {
        duration = 15000; // 15 detik untuk Bahaya (3x lebih lama)
    } else if (type === 'warning') {
        duration = 10000; // 10 detik untuk Waspada (2x lebih lama)
    }
    
    // Auto remove setelah durasi tertentu
    setTimeout(() => {
        if (notification.parentNode) {
            notification.classList.add('fade-out');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
    }, duration);
    
    // Log durasi untuk debugging
    console.log(`⏱️ Notifikasi "${type}" akan hilang dalam ${duration/1000} detik`);
}
    
    // ==================== VALIDATION METHODS ====================
    validateCoordinates(lat, lon) {
        console.log(`📍 Validating coordinates: ${lat}, ${lon}`);
        
        if (lat === undefined || lon === undefined || lat === null || lon === null) {
            throw new Error("Koordinat tidak boleh kosong");
        }
        
        if (isNaN(lat) || isNaN(lon)) {
            throw new Error("Koordinat harus berupa angka");
        }
        
        if (lat < -90 || lat > 90) {
            throw new Error("Latitude harus antara -90 dan 90");
        }
        
        if (lon < -180 || lon > 180) {
            throw new Error("Longitude harus antara -180 dan 180");
        }
        
        console.log("✅ Coordinates valid");
        return true;
    }
    
    // ==================== ADDITIONAL API METHODS ====================
    async fetchFromWeatherAPI(lat, lon) {
    console.log("🌐 Mengambil data dari WeatherAPI.com...");
    
    const apiKey = this.API_CONFIG.weatherapi.key;
    const baseUrl = this.API_CONFIG.weatherapi.baseUrl;
    
    if (!apiKey || apiKey === "YOUR_WEATHERAPI_KEY") {
        console.error("WeatherAPI key tidak dikonfigurasi");
        return null;
    }
    
    const url = `${baseUrl}/current.json?key=${apiKey}&q=${lat},${lon}&aqi=no`;
    
    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            console.warn(`WeatherAPI.com error: ${response.status}`);
            return null;
        }
        
        const data = await response.json();
        let uvIndex = data.current?.uv || 0;
        
        // **PERBAIKAN PENTING:** WeatherAPI.com sering overestimate UV untuk Indonesia
        // Kurangi 30% untuk Indonesia
        if (this.detectCountry(lat, lon) === 'Indonesia') {
            uvIndex = uvIndex * 0.7; // Reduce by 30%
            console.log(`⚠️ WeatherAPI UV reduced for Indonesia: ${data.current?.uv} → ${uvIndex}`);
        }
        
        // Apply realistic UV model
        uvIndex = this.calculateRealisticUV(uvIndex, lat, lon, new Date(data.current.last_updated), "WeatherAPI.com");
        
        console.log(`✅ WeatherAPI.com: UV = ${uvIndex}, Suhu = ${data.current.temp_c}°C`);
        
        return {
            uvIndex: uvIndex,
            temperature: data.current.temp_c,
            feelsLike: data.current.feelslike_c,
            humidity: data.current.humidity,
            pressure: data.current.pressure_mb,
            weather: data.current.condition.text,
            weatherIcon: `https:${data.current.condition.icon}`,
            windSpeed: data.current.wind_kph / 3.6,
            windDeg: data.current.wind_degree,
            clouds: data.current.cloud,
            cityName: data.location?.name || "Unknown",
            country: data.location?.country || "XX",
            timestamp: new Date(data.current.last_updated),
            lat: lat,
            lon: lon,
            source: "api",
            apiSource: "WeatherAPI.com",
            provider: "WeatherAPI.com"
        };
        
    } catch (error) {
        console.error("❌ WeatherAPI.com error:", error);
        return null;
    }
}
    
    async fetchFromVisualCrossing(lat, lon) {
        console.log("🌐 Mengambil data dari Visual Crossing...");
        
        const apiKey = this.API_CONFIG.visualcrossing.key;
        const baseUrl = this.API_CONFIG.visualcrossing.baseUrl;
        
        if (!apiKey || apiKey === "YOUR_VISUALCROSSING_KEY") {
            console.error("Visual Crossing key tidak dikonfigurasi");
            return null;
        }
        
        const today = new Date().toISOString().split('T')[0];
        const url = `${baseUrl}/${lat},${lon}/${today}?key=${apiKey}&unitGroup=metric&include=current`;
        
        try {
            const response = await fetch(url);
            
            if (!response.ok) {
                console.warn(`Visual Crossing error: ${response.status}`);
                return null;
            }
            
            const data = await response.json();
            const current = data.currentConditions;
            
            if (!current) {
                console.warn("Visual Crossing: No current data");
                return null;
            }
            
            let uvIndex = current.uvindex || 0;
            
            // Apply realistic UV model - DIPERBAIKI
            uvIndex = this.calculateRealisticUV(uvIndex, lat, lon, new Date(), "VisualCrossing");
            
            console.log(`✅ Visual Crossing: UV = ${uvIndex}, Suhu = ${current.temp}°C`);
            
            return {
                uvIndex: uvIndex,
                temperature: current.temp,
                feelsLike: current.feelslike || current.temp,
                humidity: current.humidity,
                pressure: current.pressure,
                weather: current.conditions || "Clear",
                weatherIcon: this.getWeatherIcon(current.conditions || "Clear"),
                windSpeed: current.windspeed,
                windDeg: current.winddir,
                clouds: current.cloudcover || 0,
                cityName: data.resolvedAddress || "Unknown",
                country: "XX",
                timestamp: new Date(),
                lat: lat,
                lon: lon,
                source: "api",
                apiSource: "VisualCrossing",
                provider: "Visual Crossing",
                timezone: data.timezone || this.timezone
            };
            
        } catch (error) {
            console.error("❌ Visual Crossing error:", error);
            return null;
        }
    }
    
    getWeatherIcon(conditions) {
        const cond = conditions.toLowerCase();
        if (cond.includes("clear") || cond.includes("sunny")) return "01d";
        if (cond.includes("cloud")) return "03d";
        if (cond.includes("rain")) return "10d";
        if (cond.includes("storm")) return "11d";
        return "01d";
    }
    
    // ==================== UI STATE MANAGEMENT ====================
    updateUIState() {
        const startBtn = document.getElementById('startMonitoring');
        const stopBtn = document.getElementById('stopMonitoring');
        
        if (startBtn) {
            startBtn.disabled = !!this.monitoringInterval;
            startBtn.style.opacity = this.monitoringInterval ? '0.5' : '1';
        }
        if (stopBtn) {
            stopBtn.disabled = !this.monitoringInterval;
            stopBtn.style.opacity = !this.monitoringInterval ? '0.5' : '1';
        }
    }
    
    updateLocationStatus(message) {
        const statusElement = document.getElementById('locationStatus');
        if (statusElement) {
            statusElement.innerHTML = `<i class="fas fa-info-circle"></i> <span>${message}</span>`;
        }
    }
    
    updateStats() {
        const updateCount = (id, value) => {
            const element = document.getElementById(id);
            if (element) element.textContent = value;
        };
        
        updateCount('dataCount', this.dataHistory.length);
        
        const footerDataCount = document.getElementById('footerDataCount');
        if (footerDataCount) footerDataCount.textContent = this.dataHistory.length;
        
        const today = new Date().toDateString();
        const todayUpdates = this.dataHistory.filter(item => 
            new Date(item.timestamp).toDateString() === today
        ).length;
        
        const footerUpdates = document.getElementById('footerUpdates');
        if (footerUpdates) footerUpdates.textContent = todayUpdates;
        
        const uniqueLocations = new Set(this.dataHistory.map(item => item.location));
        const footerLocations = document.getElementById('footerLocations');
        if (footerLocations) footerLocations.textContent = uniqueLocations.size;
    }
    
    updateDataSourceInfo() {
        if (!this.currentData) return;
        
        const sourceElement = document.getElementById('dataSource');
        if (!sourceElement) return;
        
        const source = this.currentData.apiSource;
        
        if (source === 'demo') {
            sourceElement.textContent = 'Data Demo';
            sourceElement.style.color = '#ff6600';
        } else {
            sourceElement.textContent = source || 'API';
            sourceElement.style.color = '#0066cc';
        }
    }
    
    updateSunbathResults(safeTime, vitaminDTime, burnRisk, duration) {
        const updateElement = (id, value) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
            }
        };
        
        updateElement('safeSunbathTime', safeTime);
        updateElement('vitaminDTime', vitaminDTime);
        updateElement('burnRisk', burnRisk);
        updateElement('sunbathDuration', duration);
    }
    
    useCoordinates() {
    const latInput = document.getElementById('latInput');
    const lonInput = document.getElementById('lonInput');
    
    if (!latInput || !lonInput) return;
    
    const lat = parseFloat(latInput.value);
    const lon = parseFloat(lonInput.value);
    
    if (isNaN(lat) || isNaN(lon)) {
        this.showNotification("Koordinat tidak valid", "error");
        return;
    }
    
    if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
        this.showNotification("Koordinat di luar rentang valid", "error");
        return;
    }
    
    // ====== TAMBAH INI ======
    console.log("🛑 Stopping timer before coordinates...");
    this.stopTimeUpdates();
    
    this.currentLocation = { 
        lat, 
        lon, 
        name: `Koordinat (${lat.toFixed(4)}, ${lon.toFixed(4)})`,
        country: "XX",
        timezone: this.getTimezoneFromCoordinates(lat, lon)
    };
    
    // ====== TAMBAH INI ======
    this.timezone = this.currentLocation.timezone;
    console.log(`🔄 Timezone set to: ${this.timezone}`);
    
    const cityInput = document.getElementById('cityInput');
    if (cityInput) {
        cityInput.value = `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
    }
    
    this.updateLocationStatus(`Lokasi: Koordinat manual`);
    
    // ====== TAMBAH INI ======
    console.log("🟢 Restarting timer with coordinates timezone...");
    this.startTimeUpdates();
    
    this.showNotification("Koordinat diterima", "success");
    this.fetchData();
}
// ==================== DEBUG METHOD ====================
debugTimezoneInfo() {
    console.log('='.repeat(60));
    console.log('⏰ TIMEZONE DEBUG INFO');
    console.log(`Current timezone: ${this.timezone}`);
    console.log(`Timer running: ${!!this.timeUpdateInterval}`);
    console.log(`Timer ID: ${this.timeUpdateInterval}`);
    console.log(`Browser time: ${new Date().toLocaleTimeString('id-ID')}`);
    console.log(`Browser date: ${new Date().toLocaleDateString('id-ID')}`);
    
    try {
        const tzTime = new Date().toLocaleTimeString('id-ID', { 
            timeZone: this.timezone,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        const tzDate = new Date().toLocaleDateString('id-ID', { 
            timeZone: this.timezone,
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        console.log(`Timezone time (${this.timezone}): ${tzTime}`);
        console.log(`Timezone date (${this.timezone}): ${tzDate}`);
    } catch (e) {
        console.log(`Cannot get timezone time: ${e.message}`);
    }
    console.log('='.repeat(60));
}
}

    // ==================== VIDEO TUTORIAL CONTROLLER ====================
class VideoTutorialController {
    constructor() {
        this.video = null;
        this.isPlaying = false;
        this.isMuted = false;
        this.currentVolume = 1.0;
        this.videoUrl = 'uv-guide-tutorial.mp4'; // Nanti ganti dengan nama file video Anda
        this.videoSize = '85 MB'; // Update sesuai ukuran file
        this.videoDuration = '10:30'; // Update sesuai durasi video
    }
    
    // Initialize video player
    initVideoPlayer() {
        console.log('🎬 Initializing video player...');
        
        const videoContainer = document.getElementById('videoPlayer');
        if (!videoContainer) {
            console.error('Video container not found');
            return;
        }
        
        // Create video element
        this.video = document.createElement('video');
        this.video.id = 'tutorialVideo';
        this.video.className = 'tutorial-video';
        this.video.preload = 'metadata';
        this.video.poster = 'video-poster.jpg'; // Optional thumbnail
        
        // Create source element
        const source = document.createElement('source');
        source.src = this.videoUrl;
        source.type = 'video/mp4';
        
        this.video.appendChild(source);
        
        // Fallback message
        const fallback = document.createElement('p');
        fallback.textContent = 'Browser Anda tidak mendukung tag video.';
        fallback.style.cssText = 'color: white; padding: 20px; text-align: center;';
        this.video.appendChild(fallback);
        
        // Replace loading indicator with video
        const loading = document.getElementById('videoLoading');
        if (loading) {
            videoContainer.replaceChild(this.video, loading);
        } else {
            videoContainer.appendChild(this.video);
        }
        
        // Setup event listeners
        this.setupVideoEvents();
        
        // Update video info
        this.updateVideoInfo();
        
        console.log('✅ Video player initialized');
    }
    
    setupVideoEvents() {
        if (!this.video) return;
        
        // Play/Pause
        this.video.addEventListener('play', () => {
            this.isPlaying = true;
            this.updatePlayButton();
        });
        
        this.video.addEventListener('pause', () => {
            this.isPlaying = false;
            this.updatePlayButton();
        });
        
        // Time update
        this.video.addEventListener('timeupdate', () => {
            this.updateProgress();
            this.updateTimeDisplay();
        });
        
        // Loaded metadata
        this.video.addEventListener('loadedmetadata', () => {
            this.updateDurationDisplay();
            this.updateVideoSize();
        });
        
        // Volume change
        this.video.addEventListener('volumechange', () => {
            this.currentVolume = this.video.volume;
            this.isMuted = this.video.muted;
            this.updateVolumeControls();
        });
        
        // Error handling
        this.video.addEventListener('error', (e) => {
            console.error('Video error:', e);
            this.showVideoError();
        });
    }
    
    // Video control methods
    videoPlayPause() {
        if (!this.video) return;
        
        if (this.video.paused) {
            this.video.play();
        } else {
            this.video.pause();
        }
    }
    
    toggleMute() {
        if (!this.video) return;
        
        this.video.muted = !this.video.muted;
    }
    
    changeVolume(value) {
        if (!this.video) return;
        
        const volume = value / 100;
        this.video.volume = volume;
        this.video.muted = volume === 0;
    }
    
    toggleFullscreen() {
        const videoContainer = document.querySelector('.video-container');
        if (!videoContainer) return;
        
        if (!document.fullscreenElement) {
            videoContainer.requestFullscreen().catch(err => {
                console.log('Fullscreen error:', err);
            });
        } else {
            document.exitFullscreen();
        }
    }
    
    seekVideo(event) {
        if (!this.video) return;
        
        const progressBar = event.currentTarget;
        const rect = progressBar.getBoundingClientRect();
        const clickPosition = (event.clientX - rect.left) / rect.width;
        
        this.video.currentTime = clickPosition * this.video.duration;
    }
    
    seekToTime(seconds) {
        if (!this.video) return;
        
        this.video.currentTime = seconds;
        this.video.play();
    }
    
    downloadVideo() {
        const link = document.createElement('a');
        link.href = this.videoUrl;
        link.download = 'UV-Guard-Tutorial.mp4';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    
    // UI update methods
    updatePlayButton() {
        const button = document.getElementById('playPauseBtn');
        if (!button) return;
        
        const icon = button.querySelector('i');
        if (icon) {
            icon.className = this.isPlaying ? 'fas fa-pause' : 'fas fa-play';
        }
    }
    
    updateProgress() {
        if (!this.video) return;
        
        const progressFill = document.getElementById('progressFill');
        if (progressFill) {
            const percentage = (this.video.currentTime / this.video.duration) * 100;
            progressFill.style.width = `${percentage}%`;
        }
    }
    
    updateTimeDisplay() {
        if (!this.video) return;
        
        const currentTimeEl = document.getElementById('currentTime');
        if (currentTimeEl) {
            currentTimeEl.textContent = this.formatTime(this.video.currentTime);
        }
    }
    
    updateDurationDisplay() {
        if (!this.video) return;
        
        const durationEl = document.getElementById('durationTime');
        if (durationEl) {
            durationEl.textContent = this.formatTime(this.video.duration);
        }
    }
    
    updateVolumeControls() {
        const muteBtn = document.getElementById('muteBtn');
        const volumeSlider = document.getElementById('volumeSlider');
        
        if (muteBtn) {
            const icon = muteBtn.querySelector('i');
            if (icon) {
                icon.className = this.isMuted ? 'fas fa-volume-mute' : 'fas fa-volume-up';
            }
        }
        
        if (volumeSlider) {
            volumeSlider.value = this.currentVolume * 100;
        }
    }
    
    updateVideoInfo() {
        // Update video duration
        const durationEl = document.getElementById('videoDuration');
        if (durationEl) {
            durationEl.textContent = this.videoDuration;
        }
        
        // Update video size
        const sizeEl = document.getElementById('videoSize');
        if (sizeEl) {
            sizeEl.textContent = `~${this.videoSize}`;
        }
    }
    
    updateVideoSize() {
        // Fetch video file size
        fetch(this.videoUrl, { method: 'HEAD' })
            .then(response => {
                const size = response.headers.get('content-length');
                if (size) {
                    const mb = (size / (1024 * 1024)).toFixed(1);
                    this.videoSize = `${mb} MB`;
                    
                    const sizeEl = document.getElementById('videoSize');
                    if (sizeEl) {
                        sizeEl.textContent = `~${this.videoSize}`;
                    }
                }
            })
            .catch(() => {
                // Use default size if fetch fails
            });
    }
    
    showVideoError() {
        const videoContainer = document.getElementById('videoPlayer');
        if (!videoContainer) return;
        
        videoContainer.innerHTML = `
            <div class="video-error">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Video Tidak Dapat Dimuat</h3>
                <p>Pastikan file video tersedia di folder yang sama dengan aplikasi.</p>
                <p>Nama file harus: <code>${this.videoUrl}</code></p>
                <button onclick="location.reload()" class="btn-primary">
                    <i class="fas fa-redo"></i> Coba Lagi
                </button>
            </div>
        `;
    }
    
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
}

// ==================== GLOBAL INITIALIZATION ====================
let app;

document.addEventListener('DOMContentLoaded', () => {
    console.log("🌞 UV Guard Pro - Document loaded");
    
    // Check for Chart.js
    if (typeof Chart === 'undefined') {
        console.error("❌ Chart.js not loaded!");
        const chartWarning = document.createElement('div');
        chartWarning.style.cssText = 'position:fixed;top:0;left:0;right:0;background:#ff6600;color:white;padding:10px;text-align:center;z-index:9999;';
        chartWarning.innerHTML = '⚠️ Chart.js tidak terdeteksi. Pastikan Chart.js dimuat sebelum file ini.';
        document.body.appendChild(chartWarning);
        return;
    }
    
    try {
        app = new UVGuardIndex();
        window.app = app;
        
        // Try chart initialization again if needed
        setTimeout(() => {
            if (!app.charts.uv) {
                console.log("Chart initialization may have failed, trying again...");
                app.initCharts();
            }
        }, 2000);
        
        console.log("🎉 UV Guard Pro application started successfully!");
        
    } catch (error) {
        console.error("❌ Fatal error initializing application:", error);
        alert(`Error inisialisasi aplikasi: ${error.message}\n\nCek console untuk detail.`);
    }
});
// ==================== STATIC HISTORY CHART - DATA UV INDONESIA 2018-2025 ====================
function createStaticHistoryChart() {
    console.log("📊 Creating static history chart (Indonesia UV trends)...");
    
    const ctx = document.getElementById('historyChart');
    if (!ctx) {
        console.error("❌ Canvas #historyChart not found in HTML!");
        return;
    }
    
    const years = ['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025*'];
    const uvAverages = [9.8, 10.1, 9.9, 10.3, 10.6, 10.9, 11.2, 11.5];
    
    const descriptions = [
        "Rendah-Sedang", "Sedang", "Sedang", "Sedang-Tinggi", 
        "Tinggi", "Tinggi", "Sangat Tinggi", "Sangat Tinggi-Ekstrem"
    ];
    
    try {
        const historyChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: years,
                datasets: [{
                    label: 'Rata-rata UV Index Tahunan',
                    data: uvAverages,
                    backgroundColor: uvAverages.map(uv => {
                        if (uv >= 11) return '#9C27B0';
                        if (uv >= 8) return '#F44336';
                        if (uv >= 6) return '#FF9800';
                        if (uv >= 3) return '#FFC107';
                        return '#4CAF50';
                    }),
                    borderColor: '#2c3e50',
                    borderWidth: 2,
                    borderRadius: 6,
                    barPercentage: 0.7
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            padding: 20,
                            usePointStyle: true,
                            pointStyle: 'rectRounded'
                        }
                    },
                    title: {
                        display: true,
                        text: 'TREN UV INDEX INDONESIA (2018-2025)',
                        font: {
                            size: 16,
                            weight: 'bold',
                            family: "'Poppins', sans-serif"
                        },
                        color: '#2c3e50',
                        padding: { top: 10, bottom: 30 }
                    },
                    subtitle: {
                        display: true,
                        text: 'Sumber: BMKG Indonesia, NASA OMI, & Data Historis',
                        color: '#7f8c8d',
                        font: { size: 11, style: 'italic' },
                        padding: { bottom: 20 }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(44, 62, 80, 0.9)',
                        titleColor: '#ecf0f1',
                        bodyColor: '#ecf0f1',
                        borderColor: '#3498db',
                        borderWidth: 1,
                        callbacks: {
                            label: function(context) {
                                const year = years[context.dataIndex];
                                const uv = uvAverages[context.dataIndex];
                                const desc = descriptions[context.dataIndex];
                                const change = context.dataIndex > 0 ? 
                                    ` (▲${((uv - uvAverages[0])/uvAverages[0]*100).toFixed(1)}% dari 2018)` : '';
                                
                                return [
                                    `Tahun: ${year}`,
                                    `UV Index: ${uv}`,
                                    `Kategori: ${desc}`,
                                    `Perubahan: ${change}`
                                ];
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { display: false },
                        title: {
                            display: true,
                            text: 'TAHUN',
                            font: { weight: 'bold', size: 12 },
                            color: '#34495e'
                        }
                    },
                    y: {
                        beginAtZero: true,
                         max: 15,
                        grid: { color: 'rgba(0,0,0,0.05)' },
                        title: {
                            display: true,
                            text: 'UV INDEX',
                            font: { weight: 'bold', size: 12 },
                            color: '#34495e'
                        },
                        ticks: {
                            stepSize: 3
                        }
                    }
                },
                animation: {
                    duration: 1500,
                    easing: 'easeOutQuart'
                }
            }
        });
        
        // Garis tren (opsional)
        setTimeout(() => {
            const chartInstance = historyChart;
            const ctx = chartInstance.ctx;
            const xScale = chartInstance.scales.x;
            const yScale = chartInstance.scales.y;
            
            const firstX = xScale.getPixelForValue(0);
            const firstY = yScale.getPixelForValue(uvAverages[0]);
            const lastX = xScale.getPixelForValue(years.length - 1);
            const lastY = yScale.getPixelForValue(uvAverages[uvAverages.length - 1]);
            
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(firstX, firstY);
            ctx.lineTo(lastX, lastY);
            ctx.strokeStyle = 'rgba(231, 76, 60, 0.8)';
            ctx.lineWidth = 3;
            ctx.setLineDash([5, 5]);
            ctx.stroke();
            ctx.restore();
            
            ctx.save();
            ctx.fillStyle = '#e74c3c';
            ctx.font = 'bold 12px Poppins';
            ctx.fillText(
                `Tren: ▲${((uvAverages[uvAverages.length-1] - uvAverages[0])/uvAverages[0]*100).toFixed(1)}% (2018-2025)`,
                lastX - 150, 
                lastY - 15
            );
            ctx.restore();
            
            chartInstance.update();
        }, 1000);
        
        console.log("✅ Static history chart created successfully");
        
    } catch (error) {
        console.error("❌ Error creating static chart:", error);
    }
}

// Inisialisasi chart saat DOM ready
document.addEventListener('DOMContentLoaded', function() {
    // Tunggu 2 detik untuk memastikan UVGuardIndex selesai load
    setTimeout(createStaticHistoryChart, 2000);
});

// Juga coba inisialisasi jika element muncul belakangan
setTimeout(createStaticHistoryChart, 3000);
//CSV REAL-TIME
document.getElementById("downloadRealtimeCSV").addEventListener("click", () => {

    const data = {
        waktu_download: new Date().toLocaleString(),
        lokasi: document.getElementById("locationName")?.textContent || "-",
        koordinat: document.getElementById("coordinatesText")?.textContent || "-",
        uv_index: document.getElementById("currentUV")?.textContent || "-",
        level_uv: document.getElementById("uvLevel")?.textContent || "-",
        suhu: document.getElementById("temperature")?.textContent || "-",
        terasa_seperti: document.getElementById("feelsLikeText")?.textContent || "-",
        kelembapan: document.getElementById("humidity")?.textContent || "-",
        tekanan: document.getElementById("pressureText")?.textContent || "-",
        angin: document.getElementById("windText")?.textContent || "-",
        awan: document.getElementById("cloudsText")?.textContent || "-",
        kondisi_cuaca: document.getElementById("weatherCondition")?.textContent || "-",
        sunrise: document.getElementById("sunriseText")?.textContent || "-",
        sunset: document.getElementById("sunsetText")?.textContent || "-",
        sumber_data: document.getElementById("dataSource")?.textContent || "-",
        terakhir_update: document.getElementById("lastUpdate")?.textContent || "-"
    };

    let csv = "Field,Value\n";
    for (const key in data) {
        csv += `${key},${data[key]}\n`;
    }

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "realtime_uv_data.csv";
    a.click();

    URL.revokeObjectURL(url);
});
