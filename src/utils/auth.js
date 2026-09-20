export const loginUser = (token, user) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
};

export const isLoggedIn = () => {
    return !!localStorage.getItem("token");
};

export const getUser = () => {
    return JSON.parse(localStorage.getItem("user"));
};

export const isDealer = () => {
    const user = getUser();
    return !!user && ["dealer", "seller", "admin"].includes(user.role);
};

export const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
};
