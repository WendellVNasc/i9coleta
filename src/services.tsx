// BIBLIOTECAS REACT
import { Modal } from "antd";

// URL
const CONF_URL = "https://api-i9coleta.test";

var PATH = "";

export const setPath = (value: string) => {
  PATH = value;
};
export const getPath = () => {
  return PATH;
};

export const URL_API = CONF_URL + "/api";
export const UPLOAD_API = CONF_URL + "/api/upload";

export const POST_CATCH = () => {
  Modal.error({
    title: "Erro crítico!",
    content:
      "Não foi possível estabelecer uma conexão com o servidor. Por favor, entre em contato com o suporte!",
  });
};

export const BLOCK_FORM_ENTER = (e: KeyboardEvent) => {
  if (e.key === "Enter") {
    e.preventDefault();
  }
};

export const getUPLOADAPI = () => {
  return UPLOAD_API + "?path=" + getPath() + "&token=" + getToken();
};

export const setToken = (value: string) => {
  localStorage.setItem("TOKEN", value);
};

export const getToken = () => {
  return localStorage.getItem("TOKEN");
};

export const setProfile = (value: string) => {
  localStorage.setItem("PROFILE", value);
};

export const getProfile = () => {
  return localStorage.getItem("PROFILE") ?? "0";
};

export const getProfileID = () => {
  return JSON.parse(getProfile()).id;
};

export const delToken = () => {
  localStorage.removeItem("TOKEN");
};

export const setConfig = (value: string) => {
  localStorage.setItem("CONFIG", value);
};

export const getConfig = (): any => {
  return localStorage.getItem("CONFIG");
};

export const delConfig = () => {
  localStorage.removeItem("CONFIG");
};

export const POST_API = (
  url: string,
  data: any,
  ID: string | number | null = null
) => {
  function createFormData() {
    const form = new FormData();

    Object.keys(data).forEach((key) => {
      form.append(key, data[key]);
    });

    return form;
  }

  if (ID == null) {
    return fetch(URL_API + url, {
      method: "post",
      body: createFormData(),
      headers: {
        Authorization: "Bearer " + getToken(),
        Accept: "application/json",
        Profile: getProfileID(),
      },
    });
  } else {
    return fetch(`${URL_API}${url}/${ID}?_method=PUT`, {
      method: "post",
      body: createFormData(),
      headers: {
        Authorization: "Bearer " + getToken(),
        Accept: "application/json",
        Profile: getProfileID(),
      },
    });
  }
};

export const GET_API = (url: string) => {
  return fetch(URL_API + url, {
    method: "get",
    headers: {
      Authorization: "Bearer " + getToken(),
      Accept: "application/json",
      Profile: getProfileID(),
    },
  });
};

export const DELETE_API = (url: string) => {
  return fetch(`${URL_API}${url}`, {
    method: "delete",
    headers: {
      Authorization: "Bearer " + getToken(),
      Accept: "application/json",
      Profile: getProfileID(),
    },
  });
};

// VALIDA PERMISSAO
export const verifyConfig = (value: any) => {
  try {
    if (!Array.isArray(value)) value = [value, value];
    for (let v of value) {
      if (v === true) {
        return true;
        break;
      }
      if (getConfig().includes(v)) {
        return true;
        break;
      }
    }
    return false;
  } catch (error) {
    return false;
  }
};

export function MaskCNPJ(event: any): any {
  var text = event.target.value;

  text = text.replace(/\D/g, "");
  text = text.replace(/(\d{2})(\d)/, "$1.$2");
  text = text.replace(/(\d{3})(\d)/, "$1.$2");
  text = text.replace(/(\d{3})(\d)/, "$1/$2");
  text = text.replace(/(\d{4})(\d{1,2})$/, "$1-$2");

  event.target.value = text;
}

export function MaskCPF(event: any): any {
  var text = event.target.value;

  text = text.replace(/\D/g, "");
  text = text.replace(/(\d{3})(\d)/, "$1.$2");
  text = text.replace(/(\d{3})(\d)/, "$1.$2");
  text = text.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

  event.target.value = text;
}

export function MaskCEP(event: any): any {
  var text = event.target.value;

  text = text.replace(/\D/g, "");
  text = text.replace(/(\d{5})(\d)/, "$1-$2");

  event.target.value = text;
}

export function MaskCodeResiduos(event: any): any {
  var text = event.target.value;

  text = text.replace(/\D/g, "");
  text = text.replace(/(\d{2})(\d)/, "$1 $2");
  text = text.replace(/(\d{2})(\d)/, "$1 $2");
  text = text.replace(/(\d{2})(\d)/, "$1 $2");

  event.target.value = text;
}

// PALETA DE COR
export const cor1 = "rgb(243, 48, 153)";
export const cor2 = "rgb(147, 39, 143)";
export const cor3 = "rgb(53, 0, 153)";
export const cor4 = "rgb(96, 21, 207)";
export const cor5 = "rgb(165, 82, 207)";

// INTERFACE
export interface PageDefaultProps {
  type: "list" | "trash" | "add" | "edit";
  path: string;
  permission: string;
}
