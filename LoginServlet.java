import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.net.URLEncoder;


@WebServlet("/login") // mapping 
public class LoginServlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String username = request.getParameter("username");
        String password = request.getParameter("password");
        String error = "Invalid username or password";

        // Replace with real DB check later
        if ("admin".equals(username) && "1234".equals(password)) {
            response.sendRedirect("dashboard.html");
        } else {

            try{
            UserDao userLoggingIn = new UserDao();
            boolean valid = userLoggingIn.validateUser(username, password);
            if(valid){
                response.sendRedirect("dashboard.html");
            }
            else{
            error = URLEncoder.encode("Invalid username or password", "UTF-8");
            response.sendRedirect("login.html?message=" + error);
        }
    }
        catch (Exception e) {
            e.printStackTrace();
              response.sendRedirect("login.html?message=" + URLEncoder.encode("Server error", "UTF-8"));
        }
    }
}
}
