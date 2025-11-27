    package model;

    import javax.servlet.http.HttpSession;

    public class AuthUtil {

        // Check if user is logged in (using "username" from LoginServlet)
        public static boolean isLoggedIn(HttpSession session) {
            return session.getAttribute("username") != null;
        }

        // For now, super admin always false (or modify as needed)
        public static boolean isSuperAdmin(HttpSession session) {
            return false; // or true if testing
        }

        public static boolean isAdmin(HttpSession session) {
        Object role = session.getAttribute("role");
        return role != null && role.equals("ADMIN");
    }

    }

