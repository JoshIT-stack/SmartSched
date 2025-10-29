import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.net.URLEncoder;

@WebServlet("/signup")
public class SignupServlet extends HttpServlet {
  
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // 1. Get values from HTML form
        String username = request.getParameter("username");
        String password = request.getParameter("password");
        String confirmPassword = request.getParameter("confirmPassword");
        String q1 = request.getParameter("q1");
        String q2 = request.getParameter("q2");
        String q3 = request.getParameter("q3");
        String q4 = request.getParameter("q4");
        String q5 = request.getParameter("q5");


        // 2. (Optional) save to your Login class for now
        User user = new User(username, password, confirmPassword, q1, q2, q3, q4, q5, "employee");
        SignupLogic logic = new SignupLogic();
        String result = logic.register(user);


        // 3. Later: save to database
        // For now, just show confirmation
      // response.setContentType("text/html");
      // response.sendRedirect("signup-succes.html?username=" + URLEncoder.encode(username, "UTF-8"));

       request.setAttribute("result", result);
      // request.getRequestDispatcher("signup-succes.html").forward(request, response);
       response.sendRedirect("signup-succes.html?username=" + URLEncoder.encode(user.getUserName(), "UTF-8"));



    }
}
