export const getRest = async (url, params) => {
  let apiUrl = url;
  if (params) {
    apiUrl = withQuery(url, params);
  }
  try {
    console.log(`apiUrl: ${apiUrl}`)

    const res = await fetch(apiUrl, {
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    // console.log("res:\n" + JSON.stringify(res));
    const data = await res.json();
    // console.log("data:\n" + JSON.stringify(data));
    return data;
    
  } catch (error) {
    console.log("getRest error: " + error);
  }
};


export const postRest = async (url, params) => {

  // console.log("url: " + url)
  console.log("params: " + JSON.stringify(params))

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
        deviceId: params.deviceId ?? '',
        appId: params.appId ?? '',
        name: params.name ?? '',
        url: params.url ?? '',
        id: params.id ?? '',
      }),

    });

    const data = await res.json();
    // console.log('data: ' + JSON.stringify(data));

    return data;
  } catch (err) {
    console.error("postRest error: " + err);
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


