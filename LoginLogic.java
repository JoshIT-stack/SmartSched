class Login{
 
    private String name;
    private String password;
    private String role;

    public void setName(String name){ 
        if(name != null && !name.isEmpty()){
        this.name = name;
        } 
    }

    public String getName(){
        return name;
    }

    public void setPassword(String password){
        if(password != null && !password.isEmpty()){
            this.password = password;
        }
    }

    public String getPassword(){
        return password;
    }


    public boolean verifylogin(String user, String pass){ 
        boolean result = this.name.equals("admin") && this.password.equals("12345");
        if(result){
            System.out.println("Welcome user: " +name);
        }
        else{
            System.out.println("Login Failed, username or password incorrect!");
        }

        return result;
     }
}
