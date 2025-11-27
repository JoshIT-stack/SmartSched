import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.WebServlet;
import java.io.*;
import java.sql.*;

@WebServlet("/DaySummaryServlet")
public class DaySummaryServlet extends HttpServlet {

    private static final String URL = "jdbc:mysql://localhost:3306/testdb";
    private static final String USER = "root";
    private static final String PASS = "zxcvbnm22";

    private Connection conn;

    @Override
    public void init() throws ServletException {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            conn = DriverManager.getConnection(URL, USER, PASS);
        } catch (Exception e) {
            throw new ServletException("DB init failed", e);
        }
    }

    @Override
protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
    HttpSession session = req.getSession(false);
    if (session == null || session.getAttribute("userId") == null) {
        resp.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Not logged in");
        return;
    }

    int userId = (Integer) session.getAttribute("userId"); // 🔹 this is what was missing
    String date = req.getParameter("date"); // format: YYYY-MM-DD
    resp.setContentType("application/json");

    StringBuilder json = new StringBuilder();
    json.append("{");
    json.append("\"events\":").append(getEvents(date, userId)).append(",");
    json.append("\"tasks\":").append(getTasks(date, userId)).append(",");
    json.append("\"schedules\":").append(getSchedules(date, userId));
    json.append("}");

    resp.getWriter().write(json.toString());
}


        private String getEvents(String date, int userId) {
            StringBuilder arr = new StringBuilder("[");
            try {
            String sql = "SELECT e.event_name, e.start_time, e.end_time, e.notes " +
                        "FROM calendar_items e " +
                        "JOIN item_participants ep ON e.id = ep.item_id " +
                        "WHERE DATE(e.start_time)=? AND ep.user_id=?";

                PreparedStatement stmt = conn.prepareStatement(sql);
                stmt.setString(1, toSqlDate(date));
                stmt.setInt(2, userId);
                ResultSet rs = stmt.executeQuery();
                boolean first = true;
                while (rs.next()) {
                    if (!first) arr.append(",");
                    arr.append("{")
                    .append("\"name\":\"").append(rs.getString("event_name")).append("\",")
                    .append("\"start\":\"").append(rs.getString("start_time")).append("\",")
                    .append("\"end\":\"").append(rs.getString("end_time")).append("\",")
                    .append("\"notes\":\"").append(rs.getString("notes")).append("\"")
                    .append("}");
                    first = false;
                }
            } catch (SQLException e) {
                e.printStackTrace();
            }
            arr.append("]");
            return arr.toString();
        }


    private String getTasks(String date, int userId) {
        StringBuilder arr = new StringBuilder("[");
        try {
            String sql = "SELECT task_text, task_time, user_id FROM task_assignments WHERE task_date=?";
            PreparedStatement stmt = conn.prepareStatement(sql);
            stmt.setString(1, toSqlDate(date));
            ResultSet rs = stmt.executeQuery();
            boolean first = true;
            while (rs.next()) {
                if (!first) arr.append(",");
                arr.append("{")
                   .append("\"task\":\"").append(rs.getString("task_text")).append("\",")
                   .append("\"time\":\"").append(rs.getString("task_time")).append("\",")
                   .append("\"userId\":").append(rs.getInt("user_id"))
                   .append("}");
                first = false;
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        arr.append("]");
        return arr.toString();
    }


    

private String getSchedules(String date, int userId) {
    StringBuilder arr = new StringBuilder("[");
    try {
        String sql = "SELECT shift_start, shift_end FROM schedule_assignments WHERE schedule_date=? AND user_id=?";
        PreparedStatement stmt = conn.prepareStatement(sql);
        stmt.setString(1, toSqlDate(date));
        stmt.setInt(2, userId); // Filter by logged-in user
        ResultSet rs = stmt.executeQuery();
        boolean first = true;
        while (rs.next()) {
            if (!first) arr.append(",");
            arr.append("{")
               .append("\"shiftStart\":\"").append(rs.getString("shift_start")).append("\",")
               .append("\"shiftEnd\":\"").append(rs.getString("shift_end")).append("\"")
               .append("}");
            first = false;
        }
    } catch (SQLException e) {
        e.printStackTrace();
    }
    arr.append("]");
    return arr.toString();
}








        private String toSqlDate(String dateStr) {
            try {
                // If already in yyyy-MM-dd format, return as-is
                if (dateStr.matches("\\d{4}-\\d{2}-\\d{2}")) {
                    return dateStr;
                }

                // Otherwise, parse from "MMMM d, yyyy"
                java.text.SimpleDateFormat inputFormat = new java.text.SimpleDateFormat("MMMM d, yyyy", java.util.Locale.ENGLISH);
                java.text.SimpleDateFormat sqlFormat = new java.text.SimpleDateFormat("yyyy-MM-dd");
                java.util.Date parsedDate = inputFormat.parse(dateStr);
                return sqlFormat.format(parsedDate);
            } catch (Exception e) {
                e.printStackTrace();
                return dateStr; // fallback
            }
        }




}
