const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJXWXdSZmNNc1Y3YkptQXRhR2phNnkiLCJyb2xlcyI6WyJ1c2VyIl0sImlhdCI6MTcxMzc2NzM3OCwiZXhwIjoxNzEzODUzNzc4fQ.EgsCLGiw0IAj_ptU2BeX4DJKFmSmds9mfcZ6SbCSzFM"
/*
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJXWXdSZmNNc1Y3YkptQXRhR2phNnkiLCJyb2xlcyI6WyJ1c2VyIl0sImlhdCI6MTcxMzc2NzM3OCwiZXhwIjoxNzEzODUzNzc4fQ.EgsCLGiw0IAj_ptU2BeX4DJKFmSmds9mfcZ6SbCSzFM",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJXWXdSZmNNc1Y3YkptQXRhR2phNnkiLCJpYXQiOjE3MTM3NjczNzgsImV4cCI6MTcxNjM1OTM3OH0.5rihaUPM97EUNBQmThqkalsMWMAHjKTjw_POaGfgvd4"
*/

function newPointer(pointer) {

    const headers = { 
        'Authorization': 'Bearer ' + TOKEN,
        'Access-Control-Allow-Origin': "*"
    }

    axios.post('https://fabricio.planetaguru.com.ar/pointers', pointer, { headers })
        .then(response => console.log(response.data))
        .catch(error => {throw (error)})
}
