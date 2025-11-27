
import javax.servlet.http.*;
import javax.servlet.annotation.WebServlet;
import java.io.*;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;


@WebServlet("/NotificationServlet")
public class NotificationServlet extends HttpServlet {
    private static final String URL = "jdbc:mysql://localhost:3306/testdb";
    private static final String USER = "root";
    private static final String PASS = "zxcvbnm22";

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        HttpSession session = req.getSession(false);
        int userId = (session != null && session.getAttribute("userId") != null)
            ? (int) session.getAttribute("userId") : -1;


            
    System.out.println("🔍 NotificationServlet called");
    System.out.println("Session userId: " + userId);


        if (userId == -1) {
            resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        List<String> rows = new ArrayList<>();
        try (Connection conn = DriverManager.getConnection(URL, USER, PASS);
             PreparedStatement stmt = conn.prepareStatement(
                 "SELECT id, sender, role, time, message, is_read FROM notifications WHERE recipient_id = ? ORDER BY time DESC")) {

            stmt.setInt(1, userId);
            ResultSet rs = stmt.executeQuery();

            while (rs.next()) {
                rows.add(String.format(
                    "{\"id\":%d,\"sender\":\"%s\",\"role\":\"%s\",\"time\":\"%s\",\"message\":\"%s\",\"is_read\":%d}",
                    rs.getInt("id"),
                    escape(rs.getString("sender")),
                    escape(rs.getString("role")),
                    rs.getTimestamp("time").toString(),
                    escape(rs.getString("message")),
                    rs.getInt("is_read")
                ));
            }
        } catch (SQLException e) {
            e.printStackTrace();
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            return;
        }

        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        resp.getWriter().write("[" + String.join(",", rows) + "]");
    }

    private String escape(String s) {
        return s == null ? "" : s.replace("\"", "\\\"");
    }
}
