// js/script.js - Skrip Utama Aplikasi

// ====================================================================
// FUNGSI UMUM DAN HELPER
// ====================================================================

// Fungsi ini harus ada di data.js, tapi disematkan di sini agar script.js dapat bekerja sendiri
// Catatan: Jika Anda memisahkan formatRupiah ke data.js, pastikan data.js dimuat sebelum script.js
function formatRupiah(number) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(number);
}

// Fungsi untuk menampilkan greeting berdasarkan waktu lokal
function displayGreeting() {
    const greetingElement = document.getElementById('greetingMessage');
    // Guard clause: Keluar jika elemen tidak ada di halaman ini
    if (!greetingElement) return;

    const now = new Date();
    const hour = now.getHours();
    let greeting;

    if (hour >= 5 && hour < 12) {
        greeting = "Selamat Pagi 🌅"; 
    } else if (hour >= 12 && hour < 17) {
        greeting = "Selamat Siang ☀️"; 
    } else if (hour >= 17 && hour < 20) {
        greeting = "Selamat Sore 🌇"; 
    } else {
        greeting = "Selamat Malam 🌙";
    }

    greetingElement.textContent = `${greeting} Selamat datang kembali di sistem pemesanan buku.`;
}


// ====================================================================
// FUNGSI Halaman STOK/KATALOG (stok.html)
// ====================================================================

// Fungsi untuk membuat elemen baris tabel baru (TR)
function createCatalogRow(book) {
    const row = document.createElement('tr');
    
    // Path gambar yang benar: relative ke file HTML
    const imagePath = book.gambar.startsWith('img/') ? book.gambar : `img/${book.gambar}`;

    row.innerHTML = `
        <td><img src="${imagePath}" alt="${book.judul}"></td>
        <td>${book.id}</td>
        <td>${book.judul}</td>
        <td>${book.penulis}</td>
        <td>${book.stok}</td>
        <td>${formatRupiah(book.harga)}</td>
    `;
    return row;
}

// Fungsi untuk menampilkan semua data katalog
function renderKatalog() {
    const tableBody = document.getElementById('katalogTableBody');
    if (!tableBody) return; // Guard clause kedua (double check)

    tableBody.innerHTML = '';
    // dataKatalogBuku didapatkan dari data.js
    dataKatalogBuku.forEach(book => {
        const row = createCatalogRow(book);
        tableBody.appendChild(row);
    });
}

// Fungsi untuk menambahkan baris stok baru (DOM Manipulation)
function addStockByDOM(e) {
    e.preventDefault();
    
    const tableBody = document.getElementById('katalogTableBody');
    if (!tableBody) return;

    const newJudul = document.getElementById('newJudul').value;
    const newPenulis = document.getElementById('newPenulis').value;
    const newStok = parseInt(document.getElementById('newStok').value);
    const newHarga = parseInt(document.getElementById('newHarga').value);

    // Validasi Form & Alert
    if (!newJudul || !newPenulis || isNaN(newStok) || isNaN(newHarga) || newStok <= 0 || newHarga <= 0) {
        return alert('Mohon isi semua data dengan format yang benar (stok dan harga harus angka positif).');
    }

    // Buat ID baru
    const newId = 'B' + (dataKatalogBuku.length + 1).toString().padStart(3, '0');

    const newBook = {
        id: newId,
        judul: newJudul,
        penulis: newPenulis,
        stok: newStok,
        harga: newHarga,
        // Gunakan placeholder untuk buku baru
        gambar: 'https://via.placeholder.com/60x80?text=Baru' 
    };
    
    dataKatalogBuku.push(newBook); 

    // Tambahkan baris baru ke DOM
    const newRow = createCatalogRow(newBook);
    tableBody.appendChild(newRow); 

    alert(`Stok buku "${newJudul}" berhasil ditambahkan ke tabel.`);
    e.target.reset(); 
}


// ====================================================================
// FUNGSI Halaman TRACKING (tracking.html)
// ====================================================================

function updateTrackingStatus(data) {
    const statusIndex = data.status;
    const percentage = (statusIndex / data.statusList.length) * 100;
    
    const progressBar = document.getElementById('progressBar');
    const currentStatusText = document.getElementById('currentStatusText');

    if (!progressBar || !currentStatusText) return;

    // Manipulasi DOM untuk Progress Bar
    progressBar.style.width = percentage + '%'; 
    progressBar.textContent = `${Math.round(percentage)}%`;
    currentStatusText.textContent = data.statusList[statusIndex - 1]; 

    // Tampilkan Detail
    document.getElementById('pemesanName').textContent = `Nama Pemesan: ${data.pemesan}`;
    document.getElementById('detailEkspedisi').textContent = data.ekspedisi;
    document.getElementById('detailTanggalKirim').textContent = data.tanggalKirim;
    document.getElementById('detailJenisPaket').textContent = data.jenisPaket;
    document.getElementById('detailTotalBayar').textContent = data.totalBayar;
}


// ====================================================================
// FUNGSI UTAMA (DOM LOADED)
// ====================================================================
document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Halaman Login (index.html) ---
    const loginForm = document.getElementById('loginForm');
    
    // **GUARD CLAUSE PENTING:** Hanya jalankan kode ini di index.html
    if (loginForm) { 
        const modalBox = document.getElementById('modalBox');
        const closeModal = document.querySelector('.close-btn');

        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('email').value; 
            const password = document.getElementById('password').value; 

            // Validasi Login (menggunakan data DATA_USER dari data.js)
            if (email === DATA_USER.email && password === DATA_USER.password) {
                alert('Login berhasil! Mengalihkan ke Dashboard.');
                window.location.href = 'dashboard.html';
            } else {
                [cite_start]// Alert Box sesuai permintaan soal [cite: 12]
                alert('email/password yang anda masukkan salah'); 
            }
        });

        [cite_start]// Logika Modal Pop-up (Lupa Password / Daftar) [cite: 13]
        document.getElementById('lupaPasswordBtn').addEventListener('click', () => {
            document.getElementById('modalTitle').textContent = 'Lupa Password';
            document.getElementById('modalBody').textContent = 'Fungsi reset password disimulasikan. Silakan hubungi admin.';
            modalBox.style.display = 'block';
        });

        document.getElementById('daftarBtn').addEventListener('click', () => {
            document.getElementById('modalTitle').textContent = 'Pendaftaran Akun';
            document.getElementById('modalBody').textContent = 'Fitur pendaftaran disimulasikan. Silakan gunakan akun dummy.';
            modalBox.style.display = 'block';
        });
        
        closeModal.addEventListener('click', () => { modalBox.style.display = 'none'; });
        window.addEventListener('click', (event) => { if (event.target === modalBox) { modalBox.style.display = 'none'; } });
    }

    // --- 2. Halaman Dashboard (dashboard.html) ---
    displayGreeting(); // Memiliki guard clause internal

    // --- 3. Halaman Stok/Katalog (stok.html) ---
    const katalogTableBody = document.getElementById('katalogTableBody');
    const addStockForm = document.getElementById('addStockForm');
    
    // **GUARD CLAUSE KHUSUS:** Hanya render katalog jika elemen tabel ada.
    if (katalogTableBody) { 
        renderKatalog(); 
    }
    
    // Hanya tambahkan listener jika form ada.
    if (addStockForm) {
        addStockForm.addEventListener('submit', addStockByDOM); 
    }

    // --- 4. Halaman Tracking Pengiriman (tracking.html) ---
    const trackingForm = document.getElementById('trackingForm');
    const trackingResult = document.getElementById('trackingResult');
    if (trackingForm) {
        trackingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const doNumber = document.getElementById('doNumber').value.trim(); 
            // trackingData didapatkan dari data.js
            const data = trackingData[doNumber];

            if (data) {
                trackingResult.style.display = 'block';
                updateTrackingStatus(data); 
            } else {
                trackingResult.style.display = 'none';
                alert('Nomor Delivery Order tidak ditemukan atau salah.');
            }
        });
    }

    // --- 5. Halaman Pemesanan (checkout.html) ---
    const checkoutForm = document.getElementById('checkoutForm');
    if(checkoutForm) {
         checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Pemesanan berhasil diproses! Silakan cek status di halaman Tracking Pengiriman (gunakan DO-12345).');
            // Simulasi pengalihan
            window.location.href = 'tracking.html';
        });
    }
});