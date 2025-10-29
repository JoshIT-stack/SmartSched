public class SignupLogic {

    public String register(User user) {
        if (user.getUserName().isEmpty() || user.getPassword().isEmpty()) {
            return "Username and password cannot be empty.";
        }

        if (!user.getPassword().equals(user.getConfirmPassword())) {
            return "Passwords do not match.";
        }

        if (user.getQ1().isEmpty() || user.getQ2().isEmpty() ||
            user.getQ3().isEmpty() || user.getQ4().isEmpty() ||
            user.getQ5().isEmpty()) {
            return "All recovery questions must be answered.";
        }

        try {
            UserDao dao = new UserDao();
            boolean inserted = dao.insertUser(user);
            

            if (inserted) {
                System.out.println("Data inserted successfully!");
                return "Signup successful! Account created for user: " + user.getUserName();
            } else {
                System.out.println("Insert returned false — no rows affected.");
                return "Signup failed. Please try again.";
            }

        } catch (Exception e) {
            System.out.println("Error during signup: " + e.getMessage());
            e.printStackTrace();
            return "Error: " + e.getMessage();
        }
    }
}
