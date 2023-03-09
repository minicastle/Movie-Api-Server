const { default: axios } = require('axios');
const express = require('express');
const app = express();
const PORT = process.env.PORT||3000;
const Kobis = require('./Kobis.json');
const KMDB = require('./KMDB.json');
const Naver = require('./Naver.json');

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
app.get('/KMDB/movie/info',(req,res)=>{
    axios.get(`${KMDB.URL}${KMDB.Key}&title=${req.query.title}`).then((response)=>{
        res.send(response.data);
    });
});
app.get('/Naver/movie/poster',(req,res)=>{
    const option = {
        'X-Naver-Client-Id': Naver.id,
        'X-Naver-Client-Secret': Naver.key
    }
    axios.get(`${Naver.URL}&query=${'영화 '+req.query.title+' 포스터'}`,{headers:option})
    .then((value)=>{
        console.log(value.data.items[0].link);
        res.send(value.data.items[0].link);
    });
});

app.listen(PORT,()=>{
    console.log('Server Open!');
    console.log(`http://localhost:${PORT}`);
});