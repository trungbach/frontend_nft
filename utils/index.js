export function checkProperties(obj) {
    for (var key in obj) {
        if (obj[key] !== null && obj[key] != "" && obj[key] !== 0)
            return false;
    }
    return true;
}

export function checkPropertiesFilterObj(obj) {
    for (var key in obj) {
        if(key !== 'pageIndex')
        if (obj[key] !== null && obj[key] != "")
            return false;
    }
    return true;
}

export function getTokenFromServer(req, res) {
    if(!req.headers.cookie) {
        res.writeHead(302, { Location: `/login?${req.url}` })
        res.end();
        
      } else {
        const tokenCookie =  req.headers.cookie.split(";")
        .find(c => c.trim().startsWith("token="));
        const token = tokenCookie && tokenCookie.split('=')[1]
        return token
      }
}

export function handleExprireToken (req, res) {
    res.setHeader('Set-Cookie','token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT')
    res.setHeader('Set-Cookie','user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT')
    res.writeHead(302, { Location: `/login?${req.url || '/'}` })
    res.end();
}

export  function dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], {type:mimeString});
}

export function unsetRoute(filterName, filterObj, router) {
    switch (filterName) {
        case 'category': 
            if(filterObj.type && filterObj.key) {
                router.push(`/assets?type=${filterObj.type}&key=${filterObj.key}`, undefined, {shallow: true})
    
            } else if(filterObj.type) {
                router.push(`/assets?type=${filterObj.type}`, undefined, {shallow: true})
    
            } else if(filterObj.key) {
                router.push(`/assets?key=${filterObj.key}`, undefined, {shallow: true})
    
            } else router.push('/assets', undefined, {shallow: true})
            break;
        case 'type': 
            if(filterObj.category && filterObj.key) {
                router.push(`/assets?category_id=${filterObj.category.id}&key=${filterObj.key}`, undefined, {shallow: true})
    
            } else if(filterObj.category) {
                router.push(`/assets?category_id=${filterObj.category.id}`, undefined, {shallow: true})
    
            } else if(filterObj.key) {
                router.push(`/assets?key=${filterObj.key}`, undefined, {shallow: true})
    
            } else router.push('/assets', undefined, {shallow: true})
            break;
        case 'key': 
            if(filterObj.category && filterObj.type) {
                router.push(`/assets?category_id=${filterObj.category.id}&type=${filterObj.type}`, undefined, {shallow: true})
    
            } else if(filterObj.category) {
                router.push(`/assets?category_id=${filterObj.category.id}`, undefined, {shallow: true})
    
            } else if(filterObj.type) {
                router.push(`/assets?type=${filterObj.type}`, undefined, {shallow: true})
    
            } else router.push('/assets', undefined, {shallow: true})
            break;
        default: break;
    }
}