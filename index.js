const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const { sequelize } = require('./models');

// Routes
const absenKantinRoutes = require('./routes/absenKantinRoutes');
const masterShiftRoutes = require('./routes/masterShiftRoutes');
const masterBagianRoutes = require('./routes/masterBagianRoutes');
const masterKartuRoutes = require('./routes/masterKartuRoutes');
const masterWaktuMakanRoutes = require('./routes/masterWaktuMakanRoutes');
const ramadhanRoutes = require('./routes/ramadhanRoutes');
const userKantinRoutes = require('./routes/userKantinRoutes');
const visitorRoutes = require('./routes/visitorRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const server = http.createServer(app);

// WebSocket config
const io = socketIo(server, {
  cors: {
    origin: '*', // Bisa ganti dengan 'http://localhost:5173' untuk frontend tertentu
    methods: ['GET', 'POST']
  }
});
app.set('io', io); // agar bisa diakses di controller pakai req.app.get('io')

// Middleware CORS
app.use(cors({
  origin: '*', // Atau ganti: ['http://localhost:5173', 'https://your-domain.com']
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Middleware untuk JSON dan urlencoded
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Tambahkan io ke setiap request
app.use((req, res, next) => {
  req.io = io;
  next();
});

// WebSocket event
io.on('connection', socket => {
  console.log('🟢 Client terhubung ke Socket.IO');

  socket.on('disconnect', () => {
    console.log('🔴 Client terputus dari Socket.IO');
  });
});

// Sync Sequelize Models (opsional)
// sequelize.sync({ alter: true }) // Hati-hati di production
//   .then(() => console.log('✅ Semua tabel berhasil disinkronisasi'))
//   .catch(err => console.error('❌ Gagal sync database:', err));

// Routing
app.use('/v1/absen-kantin', absenKantinRoutes);
app.use('/v1/master-bagian', masterBagianRoutes);
app.use('/v1/master-shift', masterShiftRoutes);
app.use('/v1/master-kartu', masterKartuRoutes);
app.use('/v1/master-ramadhan', ramadhanRoutes);
app.use('/v1/master-waktu-makan', masterWaktuMakanRoutes);
app.use('/v1/user-kantin', userKantinRoutes);
app.use('/v1/visitor', visitorRoutes);
app.use('/v1/auth', userRoutes);

// Default route
app.get('/', (req, res) => {
  res.status(200).json({
    code: 200,
    status: true,
    message: '✅ Aplikasi Absen Kantin Berjalan dengan Baik'
  });
});

// Jalankan server
const PORT = process.env.PORT || 3021;
server.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});
