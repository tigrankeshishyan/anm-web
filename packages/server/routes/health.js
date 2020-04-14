import express from 'express';

export default express.Router().get('/', (req, res) => {
  res.send('ok');
});
