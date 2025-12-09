// ==================== DATA UV GUARD PRO ====================
const INDONESIA_PROVINCES = [
    { id: 1, name: "Aceh", capital: "Banda Aceh", lat: 5.5480, lon: 95.3195 },
    { id: 2, name: "Sumatera Utara", capital: "Medan", lat: 3.5952, lon: 98.6722 },
    { id: 3, name: "Sumatera Barat", capital: "Padang", lat: -0.9471, lon: 100.4172 },
    { id: 4, name: "Riau", capital: "Pekanbaru", lat: 0.5071, lon: 101.4478 },
    { id: 5, name: "Jambi", capital: "Jambi", lat: -1.6101, lon: 103.6071 },
    { id: 6, name: "Sumatera Selatan", capital: "Palembang", lat: -2.9761, lon: 104.7759 },
    { id: 7, name: "Bengkulu", capital: "Bengkulu", lat: -3.7956, lon: 102.2592 },
    { id: 8, name: "Lampung", capital: "Bandar Lampung", lat: -5.3971, lon: 105.2668 },
    { id: 9, name: "Kepulauan Bangka Belitung", capital: "Pangkal Pinang", lat: -2.1333, lon: 106.1333 },
    { id: 10, name: "Kepulauan Riau", capital: "Tanjung Pinang", lat: 0.9191, lon: 104.4550 },
    { id: 11, name: "DKI Jakarta", capital: "Jakarta", lat: -6.2088, lon: 106.8456 },
    { id: 12, name: "Jawa Barat", capital: "Bandung", lat: -6.9175, lon: 107.6191 },
    { id: 13, name: "Jawa Tengah", capital: "Semarang", lat: -6.9667, lon: 110.4167 },
    { id: 14, name: "DI Yogyakarta", capital: "Yogyakarta", lat: -7.7956, lon: 110.3695 },
    { id: 15, name: "Jawa Timur", capital: "Surabaya", lat: -7.2575, lon: 112.7521 },
    { id: 16, name: "Banten", capital: "Serang", lat: -6.1200, lon: 106.1503 },
    { id: 17, name: "Bali", capital: "Denpasar", lat: -8.6705, lon: 115.2126 },
    { id: 18, name: "Nusa Tenggara Barat", capital: "Mataram", lat: -8.5833, lon: 116.1167 },
    { id: 19, name: "Nusa Tenggara Timur", capital: "Kupang", lat: -10.1772, lon: 123.6070 },
    { id: 20, name: "Kalimantan Barat", capital: "Pontianak", lat: -0.0226, lon: 109.3303 },
    { id: 21, name: "Kalimantan Tengah", capital: "Palangkaraya", lat: -2.2167, lon: 113.9167 },
    { id: 22, name: "Kalimantan Selatan", capital: "Banjarmasin", lat: -3.3194, lon: 114.5911 },
    { id: 23, name: "Kalimantan Timur", capital: "Samarinda", lat: -0.5022, lon: 117.1536 },
    { id: 24, name: "Kalimantan Utara", capital: "Tanjung Selor", lat: 2.8375, lon: 117.3653 },
    { id: 25, name: "Sulawesi Utara", capital: "Manado", lat: 1.4748, lon: 124.8421 },
    { id: 26, name: "Sulawesi Tengah", capital: "Palu", lat: -0.8950, lon: 119.8594 },
    { id: 27, name: "Sulawesi Selatan", capital: "Makassar", lat: -5.1477, lon: 119.4327 },
    { id: 28, name: "Sulawesi Tenggara", capital: "Kendari", lat: -3.9678, lon: 122.5961 },
    { id: 29, name: "Gorontalo", capital: "Gorontalo", lat: 0.5333, lon: 123.0667 },
    { id: 30, name: "Sulawesi Barat", capital: "Mamuju", lat: -2.6749, lon: 118.8933 },
    { id: 31, name: "Maluku", capital: "Ambon", lat: -3.6954, lon: 128.1814 },
    { id: 32, name: "Maluku Utara", capital: "Ternate", lat: 0.7829, lon: 127.3657 },
    { id: 33, name: "Papua Barat", capital: "Manokwari", lat: -0.8615, lon: 134.0620 },
    { id: 34, name: "Papua", capital: "Jayapura", lat: -2.5330, lon: 140.7169 }
];

const UV_RECOMMENDATIONS = {
    low: {
        level: "Rendah (0-2)",
        description: "Bahaya rendah untuk kebanyakan orang. Dapat berada di luar dengan aman.",
        icon: "fa-smile",
        color: "#00cc00",
        protection: [
            "SPF 15+ jika berada di luar lebih dari 1 jam",
            "Topi dan kacamata hitam untuk kenyamanan",
            "Oleskan sunscreen pada area yang terbuka"
        ],
        activities: [
            "Aktivitas outdoor tanpa batasan",
            "Ideal untuk olahraga dan rekreasi",
            "Waktu terbaik untuk berjemur"
        ],
        sunbath: {
            safeDuration: "60-120 menit",
            optimalDuration: "15-30 menit",
            risk: "Sangat rendah",
            bestTime: "Sepanjang hari"
        }
    },
    moderate: {
        level: "Sedang (3-5)",
        description: "Bahaya sedang. Lindungi kulit dengan tabir surya dan pakaian.",
        icon: "fa-meh",
        color: "#ffcc00",
        protection: [
            "SPF 30+ wajib digunakan",
            "Topi bertepi lebar 3 inci",
            "Kacamata hitam UV400",
            "Cari tempat teduh saat istirahat"
        ],
        activities: [
            "Batasi paparan 10:00-14:00",
            "Aktivitas outdoor dengan proteksi",
            "Olahraga pagi atau sore"
        ],
        sunbath: {
            safeDuration: "30-60 menit",
            optimalDuration: "10-20 menit",
            risk: "Moderat",
            bestTime: "Sebelum 10:00 atau setelah 14:00"
        }
    },
    high: {
        level: "Tinggi (6-7)",
        description: "Bahaya tinggi. Lindungi diri dengan tabir surya, pakaian, dan topi.",
        icon: "fa-frown",
        color: "#ff6600",
        protection: [
            "SPF 50+ broad spectrum",
            "Pakaian lengan panjang UPF 30+",
            "Topi lebar dan kacamata hitam",
            "Oleskan ulang sunscreen setiap 2 jam",
            "Tetap di tempat teduh saat mungkin"
        ],
        activities: [
            "Hindari aktivitas outdoor 10:00-16:00",
            "Batasi paparan < 30 menit",
            "Jadwalkan olahraga pagi/sore",
            "Gunakan payung atau kanopi"
        ],
        sunbath: {
            safeDuration: "15-30 menit",
            optimalDuration: "5-10 menit",
            risk: "Tinggi",
            bestTime: "Hanya sebelum 9:00 atau setelah 16:00"
        }
    },
    veryHigh: {
        level: "Sangat Tinggi (8-10)",
        description: "Bahaya sangat tinggi. Ekstra proteksi diperlukan.",
        icon: "fa-dizzy",
        color: "#ff3300",
        protection: [
            "SPF 50+ waterproof",
            "Pakaian pelindung UV penuh",
            "Topi dengan kelopak lebar",
            "Tetap di dalam ruangan sebisa mungkin",
            "Cari tempat teduh terus menerus"
        ],
        activities: [
            "Batasi aktivitas luar < 15 menit",
            "Hindari paparan 9:00-17:00",
            "Tunda aktivitas tidak penting",
            "Gunakan transportasi tertutup"
        ],
        sunbath: {
            safeDuration: "5-15 menit",
            optimalDuration: "Tidak disarankan",
            risk: "Sangat tinggi",
            bestTime: "Hanya sebelum 8:00 atau setelah 17:00"
        }
    },
    extreme: {
        level: "Ekstrem (11+)",
        description: "Bahaya ekstrem. Hindari paparan sinar matahari.",
        icon: "fa-skull-crossbones",
        color: "#cc00cc",
        protection: [
            "HINDARI paparan matahari",
            "Jika harus keluar: pakaian pelindung penuh",
            "Sunscreen SPF 50+ setiap jam",
            "Tetap di tempat teduh/indoor",
            "Gunakan payung UV protection"
        ],
        activities: [
            "Hindari semua aktivitas outdoor",
            "Tetap di dalam ruangan",
            "Gunakan tirai/penutup jendela",
            "Jadwalkan ulang aktivitas"
        ],
        sunbath: {
            safeDuration: "0-5 menit",
            optimalDuration: "TIDAK AMAN",
            risk: "Ekstrem",
            bestTime: "TIDAK ADA waktu aman"
        }
    }
};

const SKIN_TYPES = {
    I: {
        name: "Tipe I - Sangat putih, mudah terbakar",
        description: "Kulit sangat putih, rambut merah atau pirang, mata biru/hijau",
        burnTime: "10 menit",
        color: "#ffdbac",
        example: "Orang Nordic"
    },
    II: {
        name: "Tipe II - Putih, mudah terbakar",
        description: "Kulit putih, rambut pirang, mata biru/hijau/coklat",
        burnTime: "15-20 menit",
        color: "#f1c27d",
        example: "Orang Eropa Utara"
    },
    III: {
        name: "Tipe III - Coklat muda, terbakar sedang",
        description: "Kulit putih sampai coklat muda, rambut coklat, mata coklat",
        burnTime: "20-30 menit",
        color: "#e0ac69",
        example: "Orang Mediterania, Asia Timur"
    },
    IV: {
        name: "Tipe IV - Coklat, jarang terbakar",
        description: "Kulit coklat, rambut hitam, mata coklat",
        burnTime: "40-50 menit",
        color: "#c68642",
        example: "Orang Asia, Amerika Latin"
    },
    V: {
        name: "Tipe V - Coklat gelap, sangat jarang terbakar",
        description: "Kulit coklat gelap, rambut hitam, mata coklat",
        burnTime: "60+ menit",
        color: "#8d5524",
        example: "Orang Timur Tengah, India"
    },
    VI: {
        name: "Tipe VI - Hitam, tidak pernah terbakar",
        description: "Kulit hitam, rambut hitam, mata coklat",
        burnTime: "90+ menit",
        color: "#5d3a1a",
        example: "Orang Afrika"
    }
};

const ACTIVITY_SCHEDULE = [
    {
        time: "06:00-08:00",
        uvRange: "0-2",
        risk: "Rendah",
        activities: ["Lari pagi", "Jalan sehat", "Yoga outdoor", "Bersepeda santai"],
        recommendation: "Aman untuk semua aktivitas outdoor. SPF 15+ jika >1 jam."
    },
    {
        time: "08:00-10:00",
        uvRange: "2-4",
        risk: "Sedang",
        activities: ["Bersepeda", "Golf", "Memancing", "Berkebun"],
        recommendation: "Gunakan SPF 30+, topi, dan kacamata hitam."
    },
    {
        time: "10:00-12:00",
        uvRange: "5-8",
        risk: "Tinggi",
        activities: ["Hindari outdoor", "Aktivitas indoor", "Berenang dengan payung"],
        recommendation: "Tetap di tempat teduh. SPF 50+ wajib jika harus keluar."
    },
    {
        time: "12:00-14:00",
        uvRange: "8-11",
        risk: "Sangat Tinggi",
        activities: ["Makan siang indoor", "Istirahat", "Aktivitas dalam ruangan"],
        recommendation: "HINDARI matahari langsung. Gunakan transportasi tertutup."
    },
    {
        time: "14:00-16:00",
        uvRange: "4-7",
        risk: "Tinggi",
        activities: ["Berenang", "Sepak bola", "Hiking", "Bermain anak"],
        recommendation: "SPF 50+, pakaian lengan panjang, topi lebar."
    },
    {
        time: "16:00-18:00",
        uvRange: "0-3",
        risk: "Rendah",
        activities: ["Jalan sore", "Basket", "Playground", "Barbekyu"],
        recommendation: "Waktu terbaik untuk outdoor. SPF 15+ jika sensitif."
    }
];

// Create global appData object
window.appData = {
    provinces: INDONESIA_PROVINCES,
    uvRecommendations: UV_RECOMMENDATIONS,
    skinTypes: SKIN_TYPES,
    activitySchedule: ACTIVITY_SCHEDULE,
    appName: "UV Guard Pro",
    version: "3.0",
    author: "UV Guard Team",
    description: "Analisis UV Index Komprehensif dengan Prediksi Matematis"
};

console.log("✅ UV Guard Pro Data initialized successfully!");
console.log(`📊 Loaded ${INDONESIA_PROVINCES.length} provinces`);
console.log(`📊 Loaded ${Object.keys(UV_RECOMMENDATIONS).length} UV recommendation levels`);
console.log(`📊 Loaded ${Object.keys(SKIN_TYPES).length} skin types`);
console.log(`📊 Loaded ${ACTIVITY_SCHEDULE.length} activity schedules`);