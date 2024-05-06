const srvTracking = 'https://fabricio.planetaguru.com.ar/pointer'
//const srvTracking = 'http://localhost:3000'
let refreshToken = ''

chrome.storage.local.get('refreshToken', function (data) {
    refreshToken = data.refreshToken
})

async function getAccessToken() {
    const accessToken = await chrome.storage.local.get('accessToken')

    return accessToken.accessToken
}

async function track(url, title) {
    try {
        const response = await fetch(srvTracking + '/tracking', {
            method: "POST",
            headers: {
                Authorization: `Bearer ${await getAccessToken()}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({url: url, title: title})
    })
    } catch (e) {
        console.log(e)
    }
}

chrome.tabs.onCreated.addListener(function(tab) {
//    console.log('Nuevo tab creado:', tab)
})

chrome.tabs.onUpdated.addListener(function(number, changeInfo, tab) {
    if (changeInfo.status === 'complete' && tab.incognito === true) {
        track(tab.url, tab.title)
        console.log('tab:', tab)
    }
})
