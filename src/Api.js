import axios from "axios";
const BASE_URL = `${process.env.REACT_APP_BACKEND_URL}/api`;

const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (
            error.response &&
            error.response.status === 401 &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem("refreshToken");
                const response = await apiEndpoints.refershAuthenticationToken(
                    refreshToken
                );
                localStorage.setItem("accessToken", response.data.accessToken);
                api.defaults.headers[
                    "Authorization"
                ] = `Bearer ${response.data.accessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                // Handle refresh token error (e.g., logout user)
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

const apiEndpoints = {
    signup: (data) => api.post("/user/signup", data),
    login: (data) => api.post("/user/login", data),
    updateUser: (data) => api.put("/user", data),
    deleteUser: (data) => api.delete("/user/delete", data),
    logout: () => api.post("/user/logout"),
    findUser: (username) => api.get(`/user/${username}`),
    refershAuthenticationToken: (refreshToken) =>
        api.post("/user/refresh-token", { refreshToken }),
    verifyOtp: (data) => api.post("/user/verifyotp", data),

    sendFriendRequest: (username) => api.post(`/friendreq/${username}`),
    updateFriendRequest: (data, username) =>
        api.put(`/friendreq/${username}`, data),
    blockUser: (username) => api.post(`/friendreq/block/${username}`),
    unblockUser: (username) => api.delete(`/friendreq/block/${username}`),
    listBlockedUsers: () => api.get("/friendreq/list/blocked"),
    listPendingRequests: () => api.get("/friendreq/list/pending"),
    listFriends: () => api.get("/friendreq/list/friends"),

    accessChat: (data) => api.post("/chat/chats", data),
    fetchChat: () => api.get("/chat/chats"),
    createGroupchat: (data) => api.post("/chat/group", data),
    updateGroupchat: (data) => api.put("/chat/group", data),
    removeUserFromGroup: (data, chatid) =>
        api.post(`/chat/group/${chatid}`, data),

    sendMessage: (data) => api.post("/message", data),
    getAllMessagesOfChat: (chatid) => api.get(`/message/${chatid}`),
    editMessage: (data) => api.put("/message", data),
    deleteMessage: (messageid) => api.delete(`/message/${messageid}`),
};

export { api, apiEndpoints };
