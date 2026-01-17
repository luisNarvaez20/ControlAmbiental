const URL_BACKEND = "https://monitoreoaula.azurewebsites.net/api"
// No se sube ): 

export const LoginPost= async (data,url) => {
    console.log(url)
    console.log(data);
    const headers = {
        "Accept": 'application/json',
        "Content-Type": 'application/json', 
    };
   
    const datos = await (await fetch(`${URL_BACKEND}/${url}`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(data)
    })).json();
    return datos;
}
export const PeticionGet = async (key, url) => {
    const headers = {
        "Content-Type": "application/json",
        "x-api-token": key
    };
    const datos = await (await fetch(`${URL_BACKEND}/${url}`, {
        method: "GET",
        headers: headers,
    })).json();
    return datos;
}
export const PeticionPost = async (key, url,data) => {
    const headers = {
        "Content-Type": "application/json",
        "x-api-token": key
    };
    const datos = await (await fetch(`${URL_BACKEND}/${url}`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(data),
    })).json();
    return datos;
}

export const PeticionGetSinToken = async (url) => {
    const headers = {
        "Content-Type": "application/json",
    };
    const datos = await (await fetch(`${URL_BACKEND}/${url}`, {
        method: "GET",
        headers: headers,
    })).json();
    return datos;
}

export const PeticionPostSinToken = async (url, data) => {
    const headers = {
        "Content-Type": "application/json",
    };
    const datos = await (await fetch(`${URL_BACKEND}/${url}`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(data),
    })).json();
    return datos;
}