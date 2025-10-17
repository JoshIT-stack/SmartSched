public class SignupLogic {

    // Simulate account creation
    public String register(User user) {

        // Step 1: Check if username and password fields are not empty
        if (user.getUserName().isEmpty() || user.getPassword().isEmpty()) {
            return "Username and password cannot be empty.";
        }

        // Step 2: Confirm password match
        if (!user.getPassword().equals(user.getConfirmPassword())) {
            return "Passwords do not match.";
        }

        // Step 3: Check recovery questions
        if (user.getQ1().isEmpty() || user.getQ2().isEmpty() ||
            user.getQ3().isEmpty() || user.getQ4().isEmpty() ||
            user.getQ5().isEmpty()) {
            return "All recovery questions must be answered.";
        }

        // Step 4: If all checks passed, simulate saving user
        // (in future, this will go to database)
        return "Signup successful! Account created for user: " + user.getUserName();
    }
}
