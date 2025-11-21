package model;

public class User{
    private String username;
    private String password;
    private String firstName;
    private String lastName;
    private String middleName;
    private String confirmPassword;
    private String mobileNum;
    private String emailAcct;
    private String role;
    private String q1;
    private String q2;
    private String q3;
    private String q4;
    private String q5;

    //constructors for creating account
    public User(String username, String firstName, String lastName, String middleName, String password, String confirmPassword, 
        String mobileNum, String emailAcct,
    String q1,  String q2,  String q3,  String q4, String q5,  String role)
    {
        this.username=username;
        this.firstName=firstName;
        this.lastName=lastName;
        this.middleName=middleName;
        this.password=password;
        this.confirmPassword=confirmPassword;
        this.mobileNum=mobileNum;
        this.emailAcct=emailAcct;
        this.q1=q1;
        this.q2=q2;
        this.q3=q3;
        this.q4=q4;
        this.q5=q5;
        this.role = role;
    }

    // for retrieving data for profile
    public User(String username, String firstName, String lastName, String middleName, String password,
        String mobileNum, String emailAcct,
    String q1,  String q2,  String q3,  String q4, String q5,  String role)
    {
        this.username=username;
        this.password=password;
        this.firstName=firstName;
        this.lastName=lastName;
        this.middleName=middleName;
        this.mobileNum=mobileNum;
        this.emailAcct=emailAcct;
        this.q1=q1;
        this.q2=q2;
        this.q3=q3;
        this.q4=q4;
        this.q5=q5;
        this.role = role;
    }


    public String getMobileNumber(){
        return mobileNum;
    }

    public String getEmailAccount(){
        return emailAcct;
    }

    //getters
    public String getUserName(){
        return username;
    }

        public String getPassword(){
        return password;
    }

        public String getConfirmPassword(){
        return confirmPassword;
    }

    public String getQ1(){
        return q1;
    }

        public String getQ2(){
        return q2;
    }

        public String getQ3(){
        return q3;
    }

        public String getQ4(){
        return q4;
    }

        public String getQ5(){
        return q5;
    }

    public void setRole(String role){
        this.role = role;
    }

    public String getRole(){
        return role;
    }

    public String getFirstName(){
        return firstName;
    }

        public String getLastName(){
        return lastName;
    }

        public String getMiddleName(){
        return middleName;
    }
}
