import express from 'express';
import cors from 'cors';
import { medicalRoutes } from './src/Modules/Medical/medicalRoutes.js';
const app = express();

app.use(cors());

app.use(express.json());

let PORT = process.env.PORT || 4000;

app.use('/medical',medicalRoutes);

app.post('/trystream',(req,res)=>{
  res.write('hiii i am parth');
  res.write('how are you')
  res.end();
})

app.listen(PORT, () => {
  console.log(`Server is up and running on ${PORT} ...`);
});
