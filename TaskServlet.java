import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.WebServlet;
import java.io.*;
import java.sql.*;
import java.util.*;

@WebServlet("/TaskServlet")
public class TaskServlet extends HttpServlet {

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

        String date = req.getParameter("date"); // e.g. 2025-11-25
        String taskTime = req.getParameter("taskTime"); // e.g. 09:00

        String[] tasks = req.getParameterValues("tasks");
        String[] employees = req.getParameterValues("employees");

        System.out.println("=== TaskServlet POST received ===");
        System.out.println("date: " + date);
        System.out.println("taskTime: " + taskTime);
        System.out.println("tasks: " + Arrays.toString(tasks));
        System.out.println("employees: " + Arrays.toString(employees));

        if (date == null || taskTime == null || tasks == null || employees == null) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.setContentType("application/json");
            resp.getWriter().write("{\"status\":\"error\",\"message\":\"Missing required fields\"}");
            return;
        }

        try {
            String sql = "INSERT INTO task_assignments (task_date, task_time, task_text, user_id) VALUES (?, ?, ?, ?)";
            PreparedStatement stmt = conn.prepareStatement(sql);

            for (String task : tasks) {
                for (String empId : employees) {
                    stmt.setString(1, date);
                    stmt.setString(2, taskTime);
                    stmt.setString(3, task);
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
