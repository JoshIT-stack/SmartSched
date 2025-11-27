import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import model.User;
import java.net.URLEncoder;

@WebServlet("/login")
public class LoginServlet extends HttpServlet {

    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String username = request.getParameter("username").trim();
        String password = request.getParameter("password").trim();

        try {
        UserDao userDao = new UserDao();
        User user = userDao.getUser(username, password); // returns User object if valid, else null
            if (user != null) {
                HttpSession session = request.getSession();
                session.setAttribute("username", user.getUserName());
                session.setAttribute("userId", user.getId());   // 🔹 store userId here
                session.setAttribute("role", user.getRole());

                System.out.println("✅ Logged in userId: " + user.getId());
                System.out.println("✅ Logged in username: " + user.getUserName());
                System.out.println("✅ Logged in role: " + user.getRole());



                request.getRequestDispatcher("login-success-popup.jsp").forward(request, response);
            }
             else {
                String error = URLEncoder.encode("Invalid username or password", "UTF-8");
                response.sendRedirect("login.html?message=" + error);
            }

        } catch (Exception e) {
            e.printStackTrace();
            response.sendRedirect("login.html?message=" + URLEncoder.encode("Server error", "UTF-8"));
        }
    }
}
