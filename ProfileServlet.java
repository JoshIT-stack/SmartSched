    import java.io.IOException;
    import javax.servlet.ServletException;
    import javax.servlet.annotation.WebServlet;
    import javax.servlet.http.HttpServlet;
    import javax.servlet.http.HttpServletRequest;
    import javax.servlet.http.HttpServletResponse;
    import javax.servlet.http.HttpSession;
    import model.User;
    import java.net.URLEncoder;

    @WebServlet("/profile")
    public class ProfileServlet extends HttpServlet {

        protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

            HttpSession session = request.getSession(false);

            // If not logged in → redirect
            if (session == null || session.getAttribute("username") == null) {
                response.sendRedirect("login.html");
                return;
            }

            String username = (String) session.getAttribute("username");

            UserDao dao = new UserDao();
            try {
                User user = dao.getUserByUsername(username);

                if (user == null) {
                    response.sendRedirect("login.html");
                    return;
                }

                String FullName = user.getFirstName() + " " + user.getMiddleName() + " " + user.getLastName();
                request.setAttribute("user", user);
                request.setAttribute("FullName", FullName);
                request.getRequestDispatcher("profile.jsp").forward(request, response);

            } catch (Exception e) {
                throw new ServletException(e);
            }
        }
    }
