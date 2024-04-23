const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJXWXdSZmNNc1Y3YkptQXRhR2phNnkiLCJyb2xlcyI6WyJ1c2VyIl0sImlhdCI6MTcxMzc2NzM3OCwiZXhwIjoxNzEzODUzNzc4fQ.EgsCLGiw0IAj_ptU2BeX4DJKFmSmds9mfcZ6SbCSzFM"
const REFRESH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJXWXdSZmNNc1Y3YkptQXRhR2phNnkiLCJpYXQiOjE3MTM3NjczNzgsImV4cCI6MTcxNjM1OTM3OH0.5rihaUPM97EUNBQmThqkalsMWMAHjKTjw_POaGfgvd4"
const BASE_URL = "https://fabricio.planetaguru.com.ar/pointers"

async function newPointer(pointer) {

    const headers = { 
        'Authorization': 'Bearer ' + ACCESS_TOKEN,
        'Access-Control-Allow-Origin': "*"
    }

    try {
        const response = await axios.post(BASE_URL, pointer, { headers })
        return response.data
    } catch (error) {
        throw error
    }
}
