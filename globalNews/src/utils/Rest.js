


export const Rest = (url, params) => {
    let apiUrl = url
    if (params) {
        apiUrl = withQuery(url, params)
    }
    return fetch(apiUrl, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          }
          
    })

        .then(res => res.json())
        .then((data) => {
            console.log(JSON.stringify(data))
            return data
        })
        .catch(console.log)
}

const withQuery = (url, params) => {
    let query = Object.keys(params)
        .filter(k => !!params[k])
        .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`)
        .join('&')
    url += (url.indexOf('?') === -1 ? '?' : '&') + query
    return url
}