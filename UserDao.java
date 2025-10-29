import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class UserDao {
    private static final String URL = "jdbc:mysql://localhost:3306/testdb"; // update if needed
    private static final String USER = "root";
    private static final String PASS = "zxcvbnm22";

    public boolean usernameExists(String username) throws Exception {
        Class.forName("com.mysql.cj.jdbc.Driver");
        try (Connection conn = DriverManager.getConnection(URL, USER, PASS)) {
            String sql = "SELECT * FROM users WHERE username = ?";
            PreparedStatement stmt = conn.prepareStatement(sql);
            stmt.setString(1, username);
            ResultSet rs = stmt.executeQuery();
            return rs.next();
        }
    }

public boolean insertUser(User user) throws Exception {
    Class.forName("com.mysql.cj.jdbc.Driver");
    try (Connection conn = DriverManager.getConnection(URL, USER, PASS)) {

        // ✅ Debug lines to confirm correct database connection
        DatabaseMetaData meta = conn.getMetaData();
        System.out.println("Connected to DB: " + conn.getCatalog());
        System.out.println("URL: " + meta.getURL());

        String sql = "INSERT INTO users (username, password, q1, q2, q3, q4, q5, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        //teest for debug 
        System.out.println("✅ SQL to be executed: " + sql);
        PreparedStatement stmt = conn.prepareStatement(sql);

        /*test for debug
        System.out.println("Preparing to insert:");
        System.out.println("Username: " + user.getUserName());
        System.out.println("Password: " + user.getPassword());
        System.out.println("Role: " + user.getRole());
        System.out.println("Q1-Q5: " + user.getQ1() + ", " + user.getQ2() + ", " + user.getQ3() + ", " + user.getQ4() + ", " + user.getQ5());
        */

        stmt.setString(1, user.getUserName());
        stmt.setString(2, user.getPassword());
        stmt.setString(3, user.getQ1());
        stmt.setString(4, user.getQ2());
        stmt.setString(5, user.getQ3());
        stmt.setString(6, user.getQ4());
        stmt.setString(7, user.getQ5());
        stmt.setString(8, user.getRole());
        
        
        int rows = stmt.executeUpdate();
        System.out.println("🧾 Rows affected: " + rows);

        return rows > 0;
    }
}


    public List<User> getAllUsers() throws Exception {
        List<User> users = new ArrayList<>();
        Class.forName("com.mysql.cj.jdbc.Driver");

        try (Connection conn = DriverManager.getConnection(URL, USER, PASS)) {
            String sql = "SELECT * FROM users WHERE username = ? AND password = ?";
            PreparedStatement stmt = conn.prepareStatement(sql);
            ResultSet rs = stmt.executeQuery();

            while (rs.next()) {
                User user = new User(
                    rs.getString("username"),
                    rs.getString("password"),
                    rs.getString("confirmPassword"),
                    rs.getString("role"),
                    rs.getString("q1"),
                    rs.getString("q2"),
                    rs.getString("q3"),
                    rs.getString("q4"),
                    rs.getString("q5")
                );
                users.add(user);
            }
        }
        return users;
    }

    public boolean validateUser(String username, String password) throws Exception{
    Class.forName("com.mysql.cj.jdbc.Driver");

        try (Connection conn = DriverManager.getConnection(URL, USER, PASS)) {
            String sql = "SELECT * FROM users WHERE username =? and password =?";
            PreparedStatement stmt = conn.prepareStatement(sql);


            stmt.setString(1, username);
            stmt.setString(2, password);

                    // Debug lines:
            System.out.println("🧠 LOGIN DEBUG ---");
            System.out.println("Username received: [" + username + "]");
            System.out.println("Password received: [" + password + "]");
            
            ResultSet rs = stmt.executeQuery();
            
            boolean found = rs.next();
            System.out.println("✅ Query match found: " + found);
            return found;
        

    }
}
}
