export const getRest = (url, params) => {
  let apiUrl = url;
  if (params) {
    apiUrl = withQuery(url, params);
  }
   console.log(`${apiUrl}`)
  return fetch(apiUrl, {
    method: "GET",
    headers: {
      Accept: "application/json",
      'Content-Type': 'application/json'
    }
  })
    .then(res => res.json())
    .then(data => {
      // console.log(JSON.stringify(data));
      return data;
    })
    .catch(error => {
      console.log("error: " + error);
    });
};


export const postRest = async (url, params) => {

  // console.log("params: " + JSON.stringify(params))
  
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=utf-8',
        'Authorization': `Bearer ${params.accessToken ?? ''}`,
      },

      body: JSON.stringify({
        email: params.email ?? '',
        password: params.password ?? '',
        articleId: params.articleId ?? '',
        action: params.action ?? '',
        userAuth: params.userAuth ?? '',
        title: params.title ?? '',
        imageUrl: params.imageUrl ?? '',
        source: params.source ?? '',
        category: params.category ?? '',
        createdUtc: params.createdUtc ?? '',
        author: params.author ?? '',
      }),

    });
   
    const data = await res.json();
    console.log('data: ' + JSON.stringify(data));

    return data;
  } catch (error) {
    console.log("error: " + error);
  }
};


const withQuery = (url, params) => {
  let query = Object.keys(params)
    .filter(k => !!params[k])
    .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`)
    .join("&");
  url += (url.indexOf("?") === -1 ? "?" : "&") + query;
  return url;
};


