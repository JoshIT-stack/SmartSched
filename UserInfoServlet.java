import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import model.User;
import java.net.URLEncoder; 

@WebServlet("/UserInfoServlet")
public class UserInfoServlet extends HttpServlet {
  protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    HttpSession session = request.getSession(false);
    String role = "GUEST"; // default fallback

    if (session != null && session.getAttribute("role") != null) {
      role = session.getAttribute("role").toString();
    }

    response.setContentType("application/json");
    response.setCharacterEncoding("UTF-8");

    String json = String.format("{\"role\":\"%s\"}", role);
    response.getWriter().write(json);
  }
}
