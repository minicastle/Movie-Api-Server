const { default: axios } = require('axios');
const express = require('express');
const app = express();
const PORT = process.env.PORT||3000;
const Kobis = require('./Kobis.json');

app.get('/',(req,res)=>{
    res.send(`<h2>Made By. MiniCastle</h2>`);
});
app.get('/Kobis/movie/search',(req,res)=>{
    axios.get(`${Kobis.SearchURL}${Kobis.Key}&movieNm=${req.query.movieNm}`).then((response)=>{
        res.send(response.data.movieListResult);
    });
});
app.get('/Kobis/movie/info',(req,res)=>{
    
    axios.get(`${Kobis.InfoURL}${Kobis.Key}&movieCd=${req.query.movieCd}`).then((response)=>{
        res.send(response.data);
    });
});
app.get('/Kobis/movie/daily',(req,res)=>{
    axios.get(`${Kobis.DailyURL}${Kobis.Key}&targetDt=${req.query.targetDt}`).then((response)=>{
        res.send(response.data.boxOfficeResult.dailyBoxOfficeList);
    });
});

app.listen(PORT,()=>{
    console.log('Server Open!');
    console.log(`http://localhost:${PORT}`);
});