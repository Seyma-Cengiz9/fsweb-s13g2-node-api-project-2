// server için gerekli olanları burada ayarlayın
const express = require('express');
const cors = require('cors'); // Görev 3 için
const postRouter = require('./posts/posts-router'); // Post yönlendiricisini içe aktarın

const server = express();

server.use(express.json());
server.use(cors()); // Görev 3: cors middleware'i ekleyin


// posts router'ını buraya require edin ve bağlayın

// Post yönlendiricisini /api/posts yolu altına bağlayın
server.use('/api/posts', postRouter);

// Temel bir kontrol noktası (opsiyonel)
server.get('/', (req, res) => {
  res.send('API çalışıyor!');
});

module.exports = server;