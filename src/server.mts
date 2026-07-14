import express from 'express';

const app = express();
app.use(express.json());

app.get('/', (_req, res) => {
  res.send('Saddle running');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Saddle listening on :${PORT}`);
});