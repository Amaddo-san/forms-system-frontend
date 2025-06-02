// services/logoutService.ts
export const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userRole");
    localStorage.removeItem("submissions");
    window.location.href = "/login"; // Full page reload to ensure cleanup
};
