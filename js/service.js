const pointers = axios.create({
    baseURL: 'https://fabricio.planetaguru.com.ar/pointer/pointers',
    timeout: 10000,
    // headers: {
    //     'Access-Control-Allow-Origin': "*",
    //     'Access-Control-Request-Headers': "authorization,content-type"
    // }
});

const auth = axios.create({
    baseURL: 'https://fabricio.planetaguru.com.ar/pointer/auth',
    timeout: 10000,
});

/*
// Add a request interceptor
axios.interceptors.request.use(function (config) {
    // Do something before request is sent
    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });
*/

// // Add a response interceptor
// axios.interceptors.response.use(function (response) {
//     // Any status code that lie within the range of 2xx cause this function to trigger
//     // Do something with response data
//     return response;
//   }, function (error) {
//     // Any status codes that falls outside the range of 2xx cause this function to trigger
//     // Do something with response error
//     if (error.response && error.response.status === 401) {
//         console.log('401!!')
//     }
//     return Promise.reject(error)
//   })

pointers.interceptors.request.use(async function (config) {

    const accessToken = await getItem('accessToken')

    console.log('accessToken para request:', accessToken)

    if (accessToken) config.headers['Authorization'] = `Bearer ${accessToken.accessToken}`

    return config
}, function (error) {
    console.log('error en request interceptor', error)
    return Promise.reject(error);
})

// Add a response interceptor
pointers.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  }, async function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    if (error.response && error.response.status === 401) {
        try {
            const tokens = await svcRefreshTokens()
            if (tokens) {
                error.config.headers['Authorization'] = `Bearer ${tokens.accessToken}`;
                return instance(error.config)
            }
        } catch (e) {
            console.log('Error en interceptor response:', e)
            chrome.storage.local.clear()
            Promise.reject(error);
        }
    }
    return Promise.reject(error);
})

function setItem(obj) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.set(obj)
            .then((item) => {
                console.log('Item Almacenado:', item)
                resolve()
            })
            .catch((error) =>{
                console.log('Error Almacenando Item:', error)
                reject(error)
            })
       })
}

function getItem(key) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(key, (obj) => {
            if (chrome.runtime.lastError) {
                console.log('get item error:', chrome.runtime.lastError)
                return reject(chrome.runtime.lastError);
              }

            console.log('Item Recuperado:', obj)

            resolve(obj)
        })
    })
}

async function newPointer(pointer) {
    try {
        const response = await pointers.post('/', pointer)
        //response.data.json; 
        console.log('data:', response.data);
        console.log('status:', response.status);
        console.log('statusText:', response.statusText);
        console.log('headers:', response.headers);
        console.log('config:', response.config);
        return response.data
    } catch (error) {
        // console.log('error.name', error.name)
        // console.log('error.message', error.message)
        // console.log('error.code', error.code)
        // console.log('error.status', error.status)
        // console.log('error.stack', error.stack)
        // console.log('error.config', error.config)
        // console.log('error', error)
//        console.log('error', error.response.data.error)
//        console.log('error.response', error.response)
        let response = {
            status: error.response.status,
            statusText: error.response.statusText,
            errorField: error.response.data.error,
            bodyField: error.response.data.body
        }

        console.log(response)

        throw response
    }
}

async function getPointerByURL(url) {
    try {
        const response = await pointers.get('/pointer', { params: { url: url }})
        //response.data.json; 
//        console.log('data:', response.data);
        // console.log('status:', response.status);
        // console.log('statusText:', response.statusText);
        // console.log('headers:', response.headers);
        // console.log('config:', response.config);
        return response.data.body
    } catch (error) {
        console.log('error')
        // console.log('error.name', error.name)
        // console.log('error.message', error.message)
        // console.log('error.code', error.code)
        // console.log('error.status', error.status)
        // console.log('error.stack', error.stack)
        // console.log('error.config', error.config)
        console.log('error', error)
//        console.log('error', error.response.data.error)
//        console.log('error.response', error.response)
        let response = {
            status: error.response.status,
            statusText: error.response.statusText,
            errorField: error.response.data.error,
            bodyField: error.response.data.body
        }

        throw response
    }
}

async function updatePointer(dataPointer) {
    try {
        const response = await pointers.put(`/${dataPointer.id}`, dataPointer)
        //response.data.json; 
//        console.log('data:', response.data);
        // console.log('status:', response.status);
        // console.log('statusText:', response.statusText);
        // console.log('headers:', response.headers);
        // console.log('config:', response.config);
        return response.data.body
    } catch (error) {
        // console.log('error.name', error.name)
        // console.log('error.message', error.message)
        // console.log('error.code', error.code)
        // console.log('error.status', error.status)
        // console.log('error.stack', error.stack)
        // console.log('error.config', error.config)
        console.log('error', error)
//        console.log('error', error.response.data.error)
//        console.log('error.response', error.response)
        let response = {
            status: error.response.status,
            statusText: error.response.statusText,
            errorField: error.response.data.error,
            bodyField: error.response.data.body
        }

        throw response
    }
}

async function deletePointer(dataPointer) {
    try {
        const response = await pointers.delete(`/${dataPointer.id}`, dataPointer)
        //response.data.json; 
//        console.log('data:', response.data);
        // console.log('status:', response.status);
        // console.log('statusText:', response.statusText);
        // console.log('headers:', response.headers);
        // console.log('config:', response.config);
        return response.data.body
    } catch (error) {
        // console.log('error.name', error.name)
        // console.log('error.message', error.message)
        // console.log('error.code', error.code)
        // console.log('error.status', error.status)
        // console.log('error.stack', error.stack)
        // console.log('error.config', error.config)
        console.log('error', error)
//        console.log('error', error.response.data.error)
//        console.log('error.response', error.response)
        let response = {
            status: error.response.status,
            statusText: error.response.statusText,
            errorField: error.response.data.error,
            bodyField: error.response.data.body
        }

        throw response
    }
}

async function svcCountPointers() {
    try {
        const response = await pointers.get('/count')
        //response.data.json; 
//        console.log('data:', response.data);
        // console.log('status:', response.status);
        // console.log('statusText:', response.statusText);
        // console.log('headers:', response.headers);
        // console.log('config:', response.config);
        return response.data.body
    } catch (error) {
        console.log('error')
        // console.log('error.name', error.name)
        // console.log('error.message', error.message)
        // console.log('error.code', error.code)
        // console.log('error.status', error.status)
        // console.log('error.stack', error.stack)
        // console.log('error.config', error.config)
        console.log('error', error)
//        console.log('error', error.response.data.error)
//        console.log('error.response', error.response)
        let response = {
            status: error.response.status,
            statusText: error.response.statusText,
            errorField: error.response.data.error,
            bodyField: error.response.data.body
        }

        throw response
    }
}

async function svcRefreshTokens() {
    try {
        const tokens = await getItem(['accessToken', 'refreshToken'])

        const response = await auth.post('/refreshtoken', {refreshToken:tokens.refreshToken})

        //response.data.json;
//        console.log('data:', response.data);
        // console.log('status:', response.status);
        // console.log('statusText:', response.statusText);
        // console.log('headers:', response.headers);
        // console.log('config:', response.config);
        await setItem(response.data.body)
        return response.data.body
    } catch (error) {
        // console.log('error.name', error.name)
        // console.log('error.message', error.message)
        // console.log('error.code', error.code)
        // console.log('error.status', error.status)
        // console.log('error.stack', error.stack)
        // console.log('error.config', error.config)
        console.log('error', error)
//        console.log('error', error.response.data.error)
//        console.log('error.response', error.response)
        let response = {
            status: error.response.status,
            statusText: error.response.statusText,
            errorField: error.response.data.error,
            bodyField: error.response.data.body
        }
        throw response
    }
}

async function svcLogin(email, password) {
    try {
        const response = await auth.post('/login', { email: email, password: password})
        //response.data.json; 
        // console.log('data Login:', response.data);
        // console.log('status:', response.status);
        // console.log('statusText:', response.statusText);
        // console.log('headers:', response.headers);
        // console.log('config:', response.config);

        if (response.data.body) await setItem({accessToken: response.data.body.accessToken, refreshToken: response.data.body.refreshToken})

        return response.data.body
    } catch (error) {
        // console.log('error.name', error.name)
        // console.log('error.message', error.message)
        // console.log('error.code', error.code)
        // console.log('error.status', error.status)
        // console.log('error.stack', error.stack)
        // console.log('error.config', error.config)
        // console.log('error', error)
//        console.log('error', error.response.data.error)
//        console.log('error.response', error.response)
        let response = {
            status: error.response.status,
            statusText: error.response.statusText,
            errorField: error.response.data.error,
            bodyField: error.response.data.body
        }

        console.log(response)

        throw response
    }
}

async function svcGetPointers() {
    try {
        const response = await pointers.get('/')
        //response.data.json; 
//        console.log('data:', response.data);
        // console.log('status:', response.status);
        // console.log('statusText:', response.statusText);
        // console.log('headers:', response.headers);
        // console.log('config:', response.config);
        return response.data.body
    } catch (error) {
        console.log('error')
        // console.log('error.name', error.name)
        // console.log('error.message', error.message)
        // console.log('error.code', error.code)
        // console.log('error.status', error.status)
        // console.log('error.stack', error.stack)
        // console.log('error.config', error.config)
        console.log('error', error)
//        console.log('error', error.response.data.error)
//        console.log('error.response', error.response)
        let response = {
            status: error.response.status,
            statusText: error.response.statusText,
            errorField: error.response.data.error,
            bodyField: error.response.data.body
        }

        throw response
    }
}
