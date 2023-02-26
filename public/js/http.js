const AppRequest = function () {
    const handleQuery = ({ url, data }) => {
        if (data == undefined || data == null) return url;
        const queryParts = [];
        for (const key in data) queryParts.push(`${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`);
        return (queryParts.length == 0) ? url: `${url}?${queryParts.join('&')}`;
    }

    const bodyString = (data = {}) => {
        try {
            return JSON.stringify(data);
        }

        catch (error) {
            console.error(error);
            throw error;
        }        
    }

    const parseBody = (data = '') => {
        try {
            return JSON.parse(data);
        }

        catch (error) {
            console.error(error);
            return null;
        }
    }

    const setHeaders = ({ method, data, request } = { method: '', data: '', request: new XMLHttpRequest() }) => {
        request.setRequestHeader('Origin', location.origin);
        request.setRequestHeader('Accept', 'application/json');
        request.setRequestHeader('User-Agent', location.appVersion);
        if (method == 'GET') return;
        request.setRequestHeader('Content-Type', 'application/json');
        request.setRequestHeader('Content-Length', data.length);
    }

    const request = ({ url, method, data } = { url: '', method: '', data: undefined }) => {
        const httpRequest = new XMLHttpRequest();
        let body = '';

        if (method == 'GET') url = handleQuery({ url, data });
        else body = bodyString(data);

        return new Promise((resolve) => {
            const control = {
                resolved: false
            }

            const handleResult = ({ event }) => {
                if (control.resolved) return;
                control.resolved = true;

                resolve({
                    event, 
                    status: httpRequest.status,
                    message: httpRequest.statusText,
                    data: parseBody(httpRequest.responseText)
                });
            }

            httpRequest.onabort = () => handleResult({ event: 'abort' })
            httpRequest.onerror = () => handleResult({ event: 'error' })
            httpRequest.onloadend = () => handleResult({ event: 'end' })
            httpRequest.ontimeout = () => handleResult({ event: 'timeout' })
            
            httpRequest.timeout = 12000;
            httpRequest.open(method.toUpperCase(), url, true);
            setHeaders({ url, data: body, method, request: httpRequest });
            httpRequest.send(body);
        });
    }

    return {
        post: ({ url, data }) => request({ url, data, method: 'POST' }),
        put: ({ url, data }) => request({ url, data, method: 'PUT' }),
        get: ({ url, data }) => request({ url, data, method: 'GET' }),
        delete: ({ url, data }) => request({ url, data, method: 'DELETE' })
    }
}