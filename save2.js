const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const {default:axios} = require('axios');
const Kobis = require('./Kobis.json');
const KMDB = require('./KMDB.json');
const Naver = require('./Naver.json');

const allowOrigins = ['http://localhost:3000/']

const NaverOption = {
    'X-Naver-Client-Id': Naver.id,
    'X-Naver-Client-Secret': Naver.key
}

let dailyDataCallStatus = false;
let dailyData = [];

const DailyDataCall = (value)=>{
    let valueData = value.data.boxOfficeResult.dailyBoxOfficeList;
    for(let i = 0;i<10;i++){
        PosterCall(valueData[i].movieNm).then((value)=>{
            valueData[i].poster = value;
            if(i===9){
                dailyData = valueData;
                dailyDataCallStatus=true;
            }
        })
    }
    return;
}

const PosterCall = async (movieNm)=>{
    let exp = '';
    await axios.get(`${Naver.posterURL}&query=${"영화 "+movieNm+" 포스터"}`,{headers:NaverOption})
    .then((value)=>{
        exp = value.data.items[0].link;
    })
    return exp;
}

app.get('/',(req,res)=>{
    res.setHeader('Access-Control-Allow-Origin', allowOrigins);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.send(`<h2>Made By. MiniCastle</h2>`);
});
app.get('/Kobis/movie/search',(req,res)=>{
    res.setHeader('Access-Control-Allow-Origin', allowOrigins);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    axios.get(`${Kobis.SearchURL}${Kobis.Key}&movieNm=${req.query.movieNm}&itemPerPage=100`).then((value)=>{
        res.send(value.data.movieListResult);
    });
});
app.get('/Kobis/movie/info',(req,res)=>{
    res.setHeader('Access-Control-Allow-Origin', allowOrigins);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    axios.get(`${Kobis.InfoURL}${Kobis.Key}&movieCd=${req.query.movieCd}`).then((value)=>{
        res.send(value.data);
    });
});









app.get('/Kobis/movie/daily',(req,res)=>{
    res.setHeader('Access-Control-Allow-Origin', allowOrigins);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    dailyDataCallStatus = false;
    axios.get(`${Kobis.DailyURL}${Kobis.Key}&targetDt=${req.query.targetDt}`).then((value)=>{
        DailyDataCall(value);
    });
    if(dailyDataCallStatus){
        res.send(dailyData);
    }
});














app.get('/KMDB/movie/info',(req,res)=>{
    res.setHeader('Access-Control-Allow-Origin', allowOrigins);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    axios.get(`${KMDB.URL}${KMDB.Key}&title=${req.query.title}`).then((response)=>{
        res.send(response.data);
    });
});
app.get('/Naver/movie/poster',(req,res)=>{
    res.setHeader('Access-Control-Allow-Origin', allowOrigins);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    axios.get(`${Naver.posterURL}&query=${'영화 '+req.query.title+' 포스터'}`,{headers:NaverOption})
    .then((value)=>{
        res.send(value.data.items[0].link);
    });
});
app.get('/Naver/movie/cafe',(req,res)=>{
    res.setHeader('Access-Control-Allow-Origin', allowOrigins);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    axios.get(`${Naver.cafeURL}&query=${'영화 후기 '+req.query.title}`,{headers:NaverOption})
    .then((value)=>{
        res.send(value.data.items);
    });
});

app.listen(PORT,()=>{
    console.log('Server Open',`http://localhost:${PORT}`);
})