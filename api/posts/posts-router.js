// posts için gerekli routerları buraya yazın
const express = require('express');
const Post = require('./posts-model'); // Model dosyasını içe aktarın

const router = express.Router();

// Middleware'leri tanımlayabilirsiniz (örn. ID kontrolü)

// --- GET /api/posts ---
router.get('/', (req, res) => {
  Post.find()
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(err => {
      res.status(500).json({ message: "Gönderiler alınamadı" });
    });
});

// --- GET /api/posts/:id ---
router.get('/:id', (req, res) => {
  const { id } = req.params;
  Post.findById(id)
    .then(post => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: "Belirtilen ID'li gönderi bulunamadı" });
      }
    })
    .catch(err => {
      res.status(500).json({ message: "Gönderi bilgisi alınamadı" });
    });
});

// --- POST /api/posts ---
router.post('/', (req, res) => {
  const { title, contents } = req.body;
  if (!title || !contents) {
    return res.status(400).json({ message: "Lütfen gönderi için bir title ve contents sağlayın" });
  }

  Post.insert({ title, contents })
    .then(newPost => {
      // insert sadece id döndürdüğü için, yeni postu çekmemiz gerekiyor
      return Post.findById(newPost.id);
    })
    .then(finalPost => {
      res.status(201).json(finalPost);
    })
    .catch(err => {
      res.status(500).json({ message: "Veritabanına kaydedilirken bir hata oluştu" });
    });
});

// --- PUT /api/posts/:id ---
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { title, contents } = req.body;

  if (!title || !contents) {
    return res.status(400).json({ message: "Lütfen gönderi için title ve contents sağlayın" });
  }

  Post.findById(id)
    .then(post => {
      if (!post) {
        return res.status(404).json({ message: "Belirtilen ID'li gönderi bulunamadı" });
      }

      return Post.update(id, { title, contents });
    })
    .then(updatedCount => {
      if (updatedCount > 0) {
        // Güncellenen postu döndürmek için tekrar çekiyoruz
        return Post.findById(id);
      }
    })
    .then(updatedPost => {
      res.status(200).json(updatedPost);
    })
    .catch(err => {
      res.status(500).json({ message: "Gönderi bilgileri güncellenemedi" });
    });
});

// --- DELETE /api/posts/:id ---
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  Post.findById(id)
    .then(post => {
      if (!post) {
        return res.status(404).json({ message: "Belirtilen ID'li gönderi bulunamadı" });
      }
      return Post.remove(id)
        .then(() => {
          res.status(200).json(post); // Silinen gönderiyi döndür
        });
    })
    .catch(err => {
      res.status(500).json({ message: "Gönderi silinemedi" });
    });
});

// --- GET /api/posts/:id/comments ---
router.get('/:id/comments', (req, res) => {
  const { id } = req.params;

  Post.findById(id)
    .then(post => {
      if (!post) {
        return res.status(404).json({ message: "Girilen ID'li gönderi bulunamadı." });
      }
      return Post.findPostComments(id);
    })
    .then(comments => {
      res.status(200).json(comments);
    })
    .catch(err => {
      res.status(500).json({ message: "Yorumlar bilgisi getirilemedi" });
    });
});

module.exports = router;