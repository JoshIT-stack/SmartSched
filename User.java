public class User{
    private String username;
    private String password;
    private String confirmPassword;
    private String q1;
    private String q2;
    private String q3;
    private String q4;
    private String q5;

    //constructors
    public User(String username, String password, String confirmPassword, 
    String q1,  String q2,  String q3,  String q4, String q5)
    {
        this.username=username;
        this.password=password;
        this.confirmPassword=confirmPassword;
        this.q1=q1;
        this.q2=q2;
        this.q3=q3;
        this.q4=q4;
        this.q5=q5;
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

}
