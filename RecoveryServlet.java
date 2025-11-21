import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import java.net.URLEncoder;

@WebServlet("/recover")
public class RecoveryServlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        String username = request.getParameter("username");
        String q1 = request.getParameter("q1");
        String q2 = request.getParameter("q2");
        String q3 = request.getParameter("q3");
        String q4 = request.getParameter("q4");
        String q5 = request.getParameter("q5");
        String newPassword = request.getParameter("new-password");
        String confirmPassword = request.getParameter("confirm-password");

        if (!newPassword.equals(confirmPassword)) {
            request.setAttribute("error", "Passwords do not match.");
            request.getRequestDispatcher("forgot.html").forward(request, response);
            return;
        }

        try {
            UserDao dao = new UserDao();
            boolean valid = dao.validateRecoveryAnswers(username, q1, q2, q3, q4, q5);

            if (valid) {
                boolean updated = dao.updatePassword(username, newPassword); // <-- keep username here
                if (updated) {
                    // SUCCESS → show modal page
                    response.sendRedirect("reset-success.html?username=" + URLEncoder.encode(username, "UTF-8"));
                } else {
                    // FAILED → show error modal page
                    response.sendRedirect("reset-failed.html?error=Password+update+failed");
                }
            } else {
                // Recovery answers incorrect → still forward back to forgot.html
                request.setAttribute("error", "Recovery answers incorrect.");
                request.getRequestDispatcher("forget.html").forward(request, response);
            }
        } catch (Exception e) {
            e.printStackTrace();
            request.setAttribute("error", "Error: " + e.getMessage());
            request.getRequestDispatcher("forget.html").forward(request, response);
        }
    }
}
