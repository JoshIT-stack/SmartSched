

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import model.User;

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

    public User getUser(String username, String password) throws Exception {
        Class.forName("com.mysql.cj.jdbc.Driver");
        try (Connection conn = DriverManager.getConnection(URL, USER, PASS)) {
            String sql = "SELECT id, username, firstname, lastname, role FROM users WHERE username=? AND password=?";
            PreparedStatement stmt = conn.prepareStatement(sql);
            stmt.setString(1, username);
            stmt.setString(2, password);
            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                int id = rs.getInt("id");
                String uname = rs.getString("username");
                String fname = rs.getString("firstname");
                String lname = rs.getString("lastname");
                String role = rs.getString("role");
                return new User(id, uname, fname, lname, role);
            }
        }
        return null;
    }




public boolean insertUser(User user) throws Exception {
    Class.forName("com.mysql.cj.jdbc.Driver");
    try (Connection conn = DriverManager.getConnection(URL, USER, PASS)) {

        // ✅ Debug lines to confirm correct database connection
        DatabaseMetaData meta = conn.getMetaData();
        System.out.println("Connected to DB: " + conn.getCatalog());
        System.out.println("URL: " + meta.getURL());

        String sql = "INSERT INTO users (username, firstname, lastname, middlename, password, mobilenumber, emailaccount, q1, q2, q3, q4, q5, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        //teest for debug 
        System.out.println("✅ SQL to be executed: " + sql);
        PreparedStatement stmt = conn.prepareStatement(sql);

        //test for debug
            System.out.println("DEBUG --- Values being inserted:");
            System.out.println("1: " + user.getUserName());
            System.out.println("2: " + user.getFirstName());
            System.out.println("3: " + user.getLastName());
            System.out.println("4: " + user.getMiddleName());  // <-- check this
            System.out.println("5: " + user.getPassword());
            System.out.println("6: " + user.getMobileNumber());
            System.out.println("7: " + user.getEmailAccount());
            System.out.println("8: " + user.getQ1());
            System.out.println("9: " + user.getQ2());
            System.out.println("10: " + user.getQ3());
            System.out.println("11: " + user.getQ4());
            System.out.println("12: " + user.getQ5());
            System.out.println("13: " + user.getRole());


        stmt.setString(1, user.getUserName());
        stmt.setString(2, user.getFirstName());
        stmt.setString(3, user.getLastName());
        stmt.setString(4, user.getMiddleName());
        stmt.setString(5, user.getPassword());
        stmt.setString(6, user.getMobileNumber());
        stmt.setString(7, user.getEmailAccount());
        stmt.setString(8, user.getQ1());
        stmt.setString(9, user.getQ2());
        stmt.setString(10, user.getQ3());
        stmt.setString(11, user.getQ4());
        stmt.setString(12, user.getQ5());
        stmt.setString(13, user.getRole());
        
        
        int rows = stmt.executeUpdate();
        System.out.println("🧾 Rows affected: " + rows);

        return rows > 0;
    }
}


public List<User> getAllUsers() throws Exception {
    List<User> users = new ArrayList<>();
    Class.forName("com.mysql.cj.jdbc.Driver");

    try (Connection conn = DriverManager.getConnection(URL, USER, PASS)) {
        String sql = "SELECT id, username, firstname, lastname, role FROM users"; // adjust columns
        PreparedStatement stmt = conn.prepareStatement(sql);
        ResultSet rs = stmt.executeQuery();

        while (rs.next()) {
            User user = new User(
                rs.getInt("id"),
                rs.getString("username"),
                rs.getString("firstname"),
                rs.getString("lastname"),
                rs.getString("role")
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
    public boolean validateRecoveryAnswers(String username, String q1, String q2, String q3, String q4, String q5) throws Exception {
    Class.forName("com.mysql.cj.jdbc.Driver");
    try (Connection conn = DriverManager.getConnection(URL, USER, PASS)) {
        //String sql = "SELECT * FROM users WHERE username=? AND q1=? AND q2=? AND q3=? AND q4=? AND q5=?";
        String sql = "SELECT * FROM users WHERE username=? AND " +
             "LOWER(TRIM(q1)) = LOWER(TRIM(?)) AND " +
             "LOWER(TRIM(q2)) = LOWER(TRIM(?)) AND " +
             "LOWER(TRIM(q3)) = LOWER(TRIM(?)) AND " +
             "LOWER(TRIM(q4)) = LOWER(TRIM(?)) AND " +
             "LOWER(TRIM(q5)) = LOWER(TRIM(?))";

        PreparedStatement stmt = conn.prepareStatement(sql);
        stmt.setString(1, username);
        stmt.setString(2, q1);
        stmt.setString(3, q2);
        stmt.setString(4, q3);
        stmt.setString(5, q4);
        stmt.setString(6, q5);

        ResultSet rs = stmt.executeQuery();
        return rs.next();
    }
}

public boolean updatePassword(String username, String newPassword) throws Exception {
    Class.forName("com.mysql.cj.jdbc.Driver");
    try (Connection conn = DriverManager.getConnection(URL, USER, PASS)) {
        String sql = "UPDATE users SET password=? WHERE username=?";
        PreparedStatement stmt = conn.prepareStatement(sql);
        
        stmt.setString(2, username);
        stmt.setString(1, newPassword);
        
        
       

        int rows = stmt.executeUpdate();
        return rows > 0;
    }
}





//for profile
public User getUserByUsername(String username) throws Exception {
    Class.forName("com.mysql.cj.jdbc.Driver");
    try (Connection conn = DriverManager.getConnection(URL, USER, PASS)) {

        String sql = "SELECT * FROM users WHERE username = ?";
        PreparedStatement stmt = conn.prepareStatement(sql);
        stmt.setString(1, username);

        ResultSet rs = stmt.executeQuery();

        if (rs.next()) {
            return new User(
                rs.getString("username"),
                rs.getString("firstname"),
                rs.getString("lastname"),
                rs.getString("middlename"),
                rs.getString("password"),
                rs.getString("mobilenumber"),
                rs.getString("emailaccount"),
                rs.getString("q1"),
                rs.getString("q2"),
                rs.getString("q3"),
                rs.getString("q4"),
                rs.getString("q5"),
                rs.getString("role")
            );
        }
        return null; // not found
    }
}


//update of data profile 
    public boolean updateProfile(String username, String newMobile, String newEmail) throws Exception {

        Class.forName("com.mysql.cj.jdbc.Driver");
        try (Connection conn = DriverManager.getConnection(URL, USER, PASS)) {

            String sql ="UPDATE users Set mobilenumber =?, emailaccount =? WHERE username =?";
            PreparedStatement stmt = conn.prepareStatement(sql);

            stmt.setString(1, newMobile);
            stmt.setString(2, newEmail);
            stmt.setString(3, username);

            int rows = stmt.executeUpdate();
            return rows >0;
    }


}

public List<Integer> getAllEmployeeIds() throws SQLException, ClassNotFoundException {
    List<Integer> employeeIds = new ArrayList<>();

    // Load the JDBC driver
    Class.forName("com.mysql.cj.jdbc.Driver");

    String sql = "SELECT id FROM users";

    // Use try-with-resources to ensure everything closes properly
    try (Connection conn = DriverManager.getConnection(URL, USER, PASS);
         PreparedStatement pst = conn.prepareStatement(sql);
         ResultSet rs = pst.executeQuery()) {

        while (rs.next()) {
            employeeIds.add(rs.getInt("id"));
        }
    }

    return employeeIds;
}

}

