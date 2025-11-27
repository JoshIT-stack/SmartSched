import model.User;
import javax.servlet.annotation.WebServlet;
import java.io.*;
import java.util.*;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/users")
public class UserServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");

        try {
            UserDao dao = new UserDao();
            List<User> users = dao.getAllUsers();

            System.out.println("✅ UserServlet reached");
            System.out.println("Total users fetched: " + users.size());

            PrintWriter out = resp.getWriter();
            out.print("[");
            for (int i = 0; i < users.size(); i++) {
                User u = users.get(i);
                out.print("{\"id\":" + u.getId() +
                          ",\"username\":\"" + u.getUserName() + "\"" +
                          ",\"firstname\":\"" + u.getFirstName() + "\"" +
                          ",\"lastname\":\"" + u.getLastName() + "\"}");
                if (i < users.size() - 1) out.print(",");
            }
            out.print("]");
            out.flush();
        } catch (Exception e) {
            e.printStackTrace();
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }
}
