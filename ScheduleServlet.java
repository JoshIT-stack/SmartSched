import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.WebServlet;
import java.io.*;
import java.sql.*;
import java.time.LocalDate;
import java.util.*;

@WebServlet("/ScheduleServlet")
public class ScheduleServlet extends HttpServlet {

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
            throw new ServletException("DB init failed: " + e.getMessage(), e);
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        req.setCharacterEncoding("UTF-8");

        String startDate = req.getParameter("startDate"); // e.g. 2025-11-24
        String endDate = req.getParameter("endDate");
        String shiftStart = req.getParameter("shiftStart"); // e.g. 09:00 AM
        String shiftEnd = req.getParameter("shiftEnd");

        String[] employees = req.getParameterValues("employees");

        System.out.println("=== ScheduleServlet POST received ===");
        System.out.println("startDate: " + startDate);
        System.out.println("endDate: " + endDate);
        System.out.println("shiftStart: " + shiftStart);
        System.out.println("shiftEnd: " + shiftEnd);
        System.out.println("employees: " + Arrays.toString(employees));

        if (startDate == null || endDate == null || shiftStart == null || shiftEnd == null || employees == null) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.setContentType("application/json");
            resp.getWriter().write("{\"status\":\"error\",\"message\":\"Missing required fields\"}");
            return;
        }

        try {
            String sql = "INSERT INTO schedule_assignments (schedule_date, shift_start, shift_end, user_id) VALUES (?, ?, ?, ?)";
            PreparedStatement stmt = conn.prepareStatement(sql);

            // Loop through each date in the range
            LocalDate start = LocalDate.parse(startDate);
            LocalDate end = LocalDate.parse(endDate);

            for (LocalDate date = start; !date.isAfter(end); date = date.plusDays(1)) {
                for (String empId : employees) {
                    stmt.setString(1, date.toString());
                    stmt.setString(2, shiftStart);
                    stmt.setString(3, shiftEnd);
                    stmt.setInt(4, Integer.parseInt(empId));
                    stmt.addBatch();
                }
            }

            stmt.executeBatch();

            resp.setStatus(HttpServletResponse.SC_CREATED);
            resp.setContentType("application/json");
            resp.getWriter().write("{\"status\":\"success\"}");
        } catch (SQLException e) {
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            resp.setContentType("application/json");
            resp.getWriter().write("{\"status\":\"error\",\"message\":\"DB error: " + e.getMessage() + "\"}");
            e.printStackTrace();
        }
    }
}
