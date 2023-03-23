const { default: axios } = require('axios');
const express = require('express');
const app = express();
const PORT = process.env.PORT||3000;
const Kobis = require('./Kobis.json');
const KMDB = require('./KMDB.json');
const Naver = require('./Naver.json');
const AllowAccess = ["https://movie-api-server.herokuapp.com/","http://localhost:3000/","https://minicastle.github.io/"]

app.get('/',(req,res)=>{
    res.setHeader('Access-Control-Allow-origin', AllowAccess);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.send(`<h2>Made By. MiniCastle</h2>`);
});
app.get('/Kobis/movie/search',(req,res)=>{
    res.setHeader('Access-Control-Allow-origin', AllowAccess);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    axios.get(`${Kobis.SearchURL}${Kobis.Key}&movieNm=${req.query.movieNm}&itemPerPage=100`).then((value)=>{
        res.send(value.data.movieListResult);
    });
});
app.get('/Kobis/movie/info',(req,res)=>{
    res.setHeader('Access-Control-Allow-origin', AllowAccess);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    axios.get(`${Kobis.InfoURL}${Kobis.Key}&movieCd=${req.query.movieCd}`).then((value)=>{
        res.send(value.data);
    });
});
app.get('/Kobis/movie/daily',(req,res)=>{
    res.setHeader('Access-Control-Allow-origin', AllowAccess);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    axios.get(`${Kobis.DailyURL}${Kobis.Key}&targetDt=${req.query.targetDt}`).then((value)=>{
        let valueData = value.data.boxOfficeResult.dailyBoxOfficeList;
        const option = {
            'X-Naver-Client-Id': Naver.id,
            'X-Naver-Client-Secret': Naver.key
        };
        for(let i=0;i<10;i++){
            axios.get(`${Naver.posterURL}&query=영화 ${valueData[i].movieNm} 포스터`,{headers:option})
            .then((value)=>{
                valueData[i].poster = value.data.items[0].link
            });
        }
        setTimeout(()=>{
            res.send(valueData);
        },3000)
    });
});
app.get('/KMDB/movie/info',(req,res)=>{
    res.setHeader('Access-Control-Allow-origin', AllowAccess);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    axios.get(`${KMDB.URL}${KMDB.Key}&title=${req.query.title}`).then((response)=>{
        res.send(response.data);
    });
});
app.get('/Naver/movie/poster',(req,res)=>{
    res.setHeader('Access-Control-Allow-origin', AllowAccess);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    const option = {
        'X-Naver-Client-Id': Naver.id,
        'X-Naver-Client-Secret': Naver.key
    }
    axios.get(`${Naver.posterURL}&query=${'영화 '+req.query.title+' 포스터'}`,{headers:option})
    .then((value)=>{
        res.send(value.data.items[0].link);
    });
});
app.get('/Naver/movie/cafe',(req,res)=>{
    res.setHeader('Access-Control-Allow-origin', AllowAccess);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    const option = {
        'X-Naver-Client-Id': Naver.id,
        'X-Naver-Client-Secret': Naver.key
    }
    axios.get(`${Naver.cafeURL}&query=${'영화 후기 '+req.query.title}`,{headers:option})
    .then((value)=>{
        res.send(value.data.items);
    });
});

app.listen(PORT,()=>{
    console.log('Server Open!');
    console.log(`http://localhost:${PORT}`);
});