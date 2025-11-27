
package model;

import model.AuthUtil;
import javax.servlet.http.*;
import javax.servlet.annotation.WebServlet;
import java.io.IOException;

@WebServlet("/admin")
public class AdminServlet extends HttpServlet {

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        HttpSession session = request.getSession();

        // Check if user is logged in
        if (!AuthUtil.isLoggedIn(session)) {
            response.sendRedirect("login.jsp");
            return;
        }

        // FOR NOW: Allow everyone (since no role yet)
        response.getWriter().println("Welcome to Admin Page!");

    }
}
