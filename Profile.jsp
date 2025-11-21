
  <%@ page import="model.User" %>

  <!DOCTYPE html>
  
  <html lang="en">

  <head>

    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>SmartSched-Profile-button</title>
    <link rel="stylesheet" href="style.css">
  </head>


  <body>

    <%
      User user = (User) request.getAttribute("user");
  %>

  <div class="container">
    <div class="profile">PROFILE</div>

    <form method="post" action="updateProfile">
<div class="field">
  <label>Name:</label>
 <input type="text" value="<%= request.getAttribute("FullName") %>" readonly>
</div>

<div class="field">
  <label>Contact Number:</label>
  <input type="text" name="contact-number" value="<%= user.getMobileNumber() %>" required>
</div>

<div class="field">
  <label>Email Address:</label>
  <input type="email" name="email-address" value="<%= user.getEmailAccount() %>" required>
</div>

<div class="field">
  <label>Role:</label>
  <input type="text" name="role" value="<%= user.getRole() %>" readonly>
</div>


  <div class="button-group">
    <button class="action-btn">Save</button>
    <a href ="dashboard.html" class="action-btn">Back to dashboard </a>
  </div>
  </form>

  <div id="successModal" style="display:none;">
  <div class="modal-content">
    <!-- Close button -->
    <span class="close-btn" onclick="closeModal()">&times;</span>
    <h2>Profile Updated Successfully!</h2>
  </div>
</div>


  <% if (request.getAttribute("updateSuccess") != null) { %>
  <script>
    document.getElementById("successModal").style.display = "flex";
  </script>
  <% } %>

  <script>
    function closeModal() {
      document.getElementById("successModal").style.display = "none";
    }
  </script>

  </body>

  <style>

#successModal {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.4);
  width: 100%;
  height: 100%;
  display: none;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal-content {
  background-color: #ffffff;
  padding: 25px 30px;
  border-radius: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  text-align: center;
  width: 350px;
  position: relative;
  font-family: Arial, sans-serif;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 15px;
  font-size: 22px;
  font-weight: bold;
  color: #333;
  cursor: pointer;
}

.close-btn:hover {
  color: #ff0000;
}


    input[type="text"],
input[type="email"] {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 2px solid #ccc;
  border-radius: 8px;
  background-color: white;
  color: #333;
}


      body{

          margin: 0;
          padding: 0;
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #f0f0f0;
          font-family: Arial, sans-serif;

      }

      .container{

          background-color: #e0e0e0;
          padding: 30px;
          border-radius: 15px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          width: 400px;
      }

      .profile{

          background-color: #007bff;
          color: white;
          text-align: center;
          font-weight: bold;
          font-size: 20px;
          padding: 12px;
          border-radius: 30px;
          margin-bottom: 25px;
      }

      .field{

          margin-bottom: 20px;

      }

      label {
    display: block;
    font-weight: bold;
    margin-bottom: 5px;
  }

  .value {
    background-color: white;
    border: 2px solid #ccc;
    border-radius: 8px;
    padding: 10px;
    font-size: 16px;
    color: #333;
  }

  .button-group {
    display: flex;
    justify-content: center;
    gap: 15px;
    margin-top: 30px;
  }

  .action-btn {
    flex: 1;
    max-width: 160px;
    padding: 10px 0;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    text-align: center;
    text-decoration: none;
    cursor: pointer;
  }

  .action-btn:hover {
    background-color: #0056b3;
  }
  </style>
  </html>
