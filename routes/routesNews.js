const express = require('express');
const News = require('../services/servicesNews');
const route = express.Router();
const { upload, furtherOptimizeImage } = require('../middlewares/multerConfig')
const newsService = new News();

route.get('/', async (req, res) => {
  try {
    const allNews = await newsService.getAllNews();
    res.json(allNews);
  } catch (error) {
    console.error('Error fetching all news:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

route.get('/:newsId', async (req, res) => {
  const newsId = req.params.newsId;
  try {
    const news = await newsService.getNewsById(newsId);
    if (!news) {
      res.status(404).json({ error: 'News not found' });
    } else {
      res.json(news);
    }
  } catch (error) {
    console.error('Error fetching news by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

route.post('/', upload.single('image'), furtherOptimizeImage, async (req, res) => {
  const imageUrl = process.env.HOST + req?.file?.path
  const newNews = { ...req.body, promotional_image_url: imageUrl };
  try {
    const createdNews = await newsService.createNews(newNews);
    res.json(createdNews);
  } catch (error) {
    console.error('Error creating news:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

route.put('/:newsId', upload.single('image'), furtherOptimizeImage, async (req, res) => {
  const newsId = req.params.newsId;

  const imageUrl = process.env.HOST + req?.file?.path

  const updatedNews = { ...req.body, promotional_image_url: imageUrl };
  try {
    const updatedNewsResult = await newsService.updateNews(newsId, updatedNews);
    if (!updatedNewsResult) {
      res.status(404).json({ error: 'News not found' });
    } else {
      res.json(updatedNewsResult);
    }
  } catch (error) {
    console.error('Error updating news:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

route.delete('/:newsId', async (req, res) => {
  const newsId = req.params.newsId;
  try {
    const deletedNews = await newsService.deleteNews(newsId);
    if (!deletedNews) {
      res.status(404).json({ error: 'News not found' });
    } else {
      res.json(deletedNews);
    }
  } catch (error) {
    console.error('Error deleting news:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = route;
