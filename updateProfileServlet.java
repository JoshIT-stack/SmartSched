import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import java.net.URLEncoder;
import model.User;



@WebServlet("/updateProfile")
public class updateProfileServlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
        throws ServletException, IOException {

         HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("username") == null) {
            response.sendRedirect("login.html");
            return;
        }

        

        String username = (String) session.getAttribute("username");
        String newMobile = request.getParameter("contact-number");
        String newEmail = request.getParameter("email-address");

        UserDao dao = new UserDao();
        try {
            boolean updated = dao.updateProfile(username, newMobile, newEmail);
        if (updated) {
            User updatedUser = dao.getUserByUsername(username);
            request.setAttribute("user", updatedUser);

            // set FullName just like in ProfileServlet
            String FullName = updatedUser.getFirstName() + " " + updatedUser.getMiddleName() + " " + updatedUser.getLastName();
            request.setAttribute("FullName", FullName);

            request.setAttribute("updateSuccess", true);
            request.getRequestDispatcher("profile.jsp").forward(request, response);

      
                //debug print
                System.out.println("Updating profile for: " + username);
                System.out.println("New Mobile: " + newMobile);
                System.out.println("New Email: " + newEmail);

            } else {
                response.getWriter().println(" Update failed.");
            }
        } catch (Exception e) {
            throw new ServletException(e);
        }
    }
}
