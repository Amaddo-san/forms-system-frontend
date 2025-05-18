// services/logoutService.ts
export const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login"; // Full page reload to ensure cleanup
};
