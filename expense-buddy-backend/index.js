const express = require('express');
const app = express();
const PORT = 3000;
const cors = require('cors');
const rootRouter = require('./routes/root');

app.use(cors());
app.use(express.json()); 

app.use('/api/v1', rootRouter);

app.listen(PORT, () => {
    console.log(`app running on port ${PORT}`);
});