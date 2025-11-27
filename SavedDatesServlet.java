import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.WebServlet;
import java.io.*;
import java.sql.*;
import java.util.Set;
import java.util.HashSet;
import java.util.ArrayList;


@WebServlet("/SavedDatesServlet")
public class SavedDatesServlet extends HttpServlet {
    private Connection conn;

    @Override
    public void init() throws ServletException {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/testdb", "root", "zxcvbnm22");
        } catch (Exception e) {
            throw new ServletException("DB init failed", e);
        }
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        HttpSession session = req.getSession(false);
        if (session == null || session.getAttribute("userId") == null) {
            resp.sendError(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        int userId = (Integer) session.getAttribute("userId");
        Set<String> dates = new HashSet<>();

        try {
            // Events
            String sql1 = "SELECT DATE(e.start_time) FROM calendar_items e JOIN item_participants ip ON e.id = ip.item_id WHERE ip.user_id=?";
            PreparedStatement stmt1 = conn.prepareStatement(sql1);
            stmt1.setInt(1, userId);
            ResultSet rs1 = stmt1.executeQuery();
            while (rs1.next()) {
                dates.add(rs1.getString(1));
            }

            // Tasks
            String sql2 = "SELECT task_date FROM task_assignments WHERE user_id=?";
            PreparedStatement stmt2 = conn.prepareStatement(sql2);
            stmt2.setInt(1, userId);
            ResultSet rs2 = stmt2.executeQuery();
            while (rs2.next()) {
                dates.add(rs2.getString(1));
            }

            // Schedules
            String sql3 = "SELECT schedule_date FROM schedule_assignments WHERE user_id=?";
            PreparedStatement stmt3 = conn.prepareStatement(sql3);
            stmt3.setInt(1, userId);
            ResultSet rs3 = stmt3.executeQuery();
            while (rs3.next()) {
                dates.add(rs3.getString(1));
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }
        System.out.println("Saved dates for user " + userId + ": " + dates);
        resp.setContentType("application/json");
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");

        ArrayList<String> dateList = new ArrayList<>(dates);
        StringBuilder json = new StringBuilder("[");
        for (int i = 0; i < dateList.size(); i++) {
            json.append("\"").append(dateList.get(i)).append("\"");
            if (i < dateList.size() - 1) json.append(",");
        }
        json.append("]");
        resp.getWriter().write(json.toString());

    }
}
