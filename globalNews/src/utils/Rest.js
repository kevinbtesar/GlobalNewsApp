export const fetchArticlesRest = (url, params) => {
  let apiUrl = url;
  if (params) {
    apiUrl = withQuery(url, params);
  }
  return fetch(apiUrl, {
    method: "GET",
    headers: {
      Accept: "application/json",
      'Content-Type': 'application/json'
    }
  })
    .then(res => res.json())
    .then(data => {
      /*console.log(JSON.stringify(data));*/
      return data;
    })
    .catch(error => {
      console.log("error: " + error);
    });
}


export const loginManualRest = (url, params) => {
  let apiUrl = url;
  if (params) {
    apiUrl = withQuery(url, params);
  }
  return fetch(apiUrl, {
    method: "POST",
    headers: {
      Accept: "application/json",
      'Content-Type': 'application/json'
    }
  })
    .then(res => res.json())
    .then(data => {
      /*console.log(JSON.stringify(data));*/
      return data;
    })
    .catch(error => {
      console.log("error: " + error);
    });
}


/**
 * Left in for debugging
 */

// export const Rest = async (url, body = null, method = 'GET') => {
//   let config = {
//     method,
//   };
//   try {
//     const response = await fetch(url, config);
//     if (!response.ok) {
//       throw new Error(response.statusText);
//     }
//     // return response;
//     return await response.json();
//   } catch (error) {
//     console.log('error: ' + error);
//     throw error;
//   }
// };


// .then(response => {
//     const contentType = response.headers.get("content-type");
//     if (contentType && contentType.indexOf("application/json") !== -1) {
//       return response.json().then(data => {
//         console.log('here');
//         return data;
//         // The response was a JSON object
//         // Process your data as a JavaScript object
//       });
//     } else {
//       return response.text().then(text => {
//         console.log('error text: ' + text)
//         // The response wasn't a JSON object
//         // Process your text as a String
//       });
//     }
// });
// };

const withQuery = (url, params) => {
  let query = Object.keys(params)
    .filter(k => !!params[k])
    .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`)
    .join("&");
  url += (url.indexOf("?") === -1 ? "?" : "&") + query;
  return url;
};
