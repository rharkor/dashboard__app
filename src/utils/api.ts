const updateToken: Function = () => {};

const api = {
  updateToken,
  getToken: () => localStorage.getItem("token") ?? "",
  fetch: async (
    url: string,
    options: RequestInit = {},
    supp: {
      noContentType?: boolean;
    } = {
      noContentType: false,
    }
  ) => {
    options.headers = {
      ...options.headers,
      Authorization: "Bearer " + localStorage.getItem("token") ?? "",
    };
    if (!supp.noContentType)
      options.headers = {
        ...options.headers,
        "Content-Type":
          (options.headers as any)?.["Content-Type"] ?? "application/json",
      };

    try {
      const res = await fetch(`/api/${url}`, options);
      if (!res.ok) throw res;
      return await res.json();
    } catch (err: any) {
      if (!err.json) throw { error: err };
      const json = await err.json();
      if (json.error === "Error: Token expired") {
        localStorage.removeItem("token");
        api.updateToken();
      }
      throw json;
    }
  },
  fetchPlain: async (
    url: string,
    options: RequestInit = {},
    supp: {
      noContentType?: boolean;
    } = {
      noContentType: false,
    }
  ) => {
    options.headers = {
      ...options.headers,
      Authorization: "Bearer " + localStorage.getItem("token") ?? "",
    };
    if (!supp.noContentType)
      options.headers = {
        ...options.headers,
        "Content-Type":
          (options.headers as any)?.["Content-Type"] ?? "application/json",
      };

    try {
      const res = await fetch(`/api/${url}`, options);
      if (!res.ok) throw res;
      return await res.text();
    } catch (err: any) {
      if (!err.json) throw { error: err };
      const json = await err.json();
      if (json.error === "Error: Token expired") {
        localStorage.removeItem("token");
        api.updateToken();
      }
      throw json;
    }
  },
};

export default api;
