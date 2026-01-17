export const save = (key, data) => {
    sessionStorage.setItem(key, data);
}

export const get = (key) => {
    sessionStorage.getItem(key);
}

export const getRol = () => {
    if (typeof window !== 'undefined') {
      return window.sessionStorage.getItem("rol");
    }
    return null; // Otra opción es devolver un valor predeterminado
  }

  export const getExternal = () => {
    if (typeof window !== 'undefined') {
      return window.sessionStorage.getItem("external");
    }
    return null; // Otra opción es devolver un valor predeterminado
  }

  export const getCorreo = () => {
    if (typeof window !== 'undefined') {
      return window.sessionStorage.getItem("correo");
    }
    return null; // Otra opción es devolver un valor predeterminado
  }


export const saveToken = (key) => {
    return sessionStorage.setItem("token",key);
}
export const getToken = () => {
    return sessionStorage.getItem("token");
}

export const borrarSesion = () => {
    sessionStorage.clear();
}

/**export const estaSesion = () => {
    var token = sessionStorage.getItem('token');
    return (token && (token != 'undefined' || token != null || token != 'null'));
}*/
export const estaSesion = () => {
    if (typeof sessionStorage !== 'undefined') {
      var token = sessionStorage.getItem('token');
      return (token && (token !== 'undefined' && token !== null && token !== 'null'));
    }
    return false; // Otra opción es devolver false si no hay sessionStorage
  }
  

//------------------TOKEN DE SESION------------------
/**export const saveToken = (token) => {
    localStorage.setItem("token", token);
}
 
export const getToken = () => {
    return localStorage.getItem('token');
}

export const borrarSesion=()=>{
    localStorage.clear();
}

export const estaSesion =()=>{
    var token = localStorage.getItem('token');
    return (token && (token != 'undefined' || token!=null || token!='null'));
}
//------------------ROL------------------
export const saveRol = (rol) => {
    localStorage.setItem('rol', rol);
}

export const getRol = () => {
    return localStorage.getItem('rol');
}
//------------------USUARIO------------------
export const saveUser = (user) => {
    const userJSON = JSON.stringify(user);
    localStorage.setItem('user', userJSON);
}

export const getUser = () => {
    const userJSON = localStorage.getItem('user');
    return JSON.parse(userJSON);
}
export const savetokenApi = (tokenapi) => {
    localStorage.setItem("tokenapi", tokenapi);
}
export const gettokenApi = () => {
    return localStorage.getItem('tokenapi');
}
//------------------Correo------------------
export const saveCorreo = (correo) => {
    localStorage.setItem('correo', correo);
}

export const getCorreo = () => {
    return localStorage.getItem('correo');
    
}*/