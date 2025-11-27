import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.WebServlet;
import java.io.*;
import java.sql.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import model.EventModel;

@WebServlet("/EventServlet")
public class EventServlet extends HttpServlet {

    

    private EventDao eventDAO;

    // Basic JDBC config; adjust to your environment or switch to a DataSource
    private static final String URL = "jdbc:mysql://localhost:3306/testdb";
    private static final String USER = "root";
    private static final String PASS = "zxcvbnm22";

    @Override
    public void init() throws ServletException {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver"); // Ensure MySQL driver is in classpath
            Connection conn = DriverManager.getConnection(URL, USER, PASS);
            eventDAO = new EventDao(conn);
        } catch (ClassNotFoundException | SQLException e) {
            throw new ServletException("DB init failed: " + e.getMessage(), e);
        }
    }




        // ✅ Place this helper method here
    private List<Integer> parseParticipantIds(String idsStr) {
        if (idsStr == null || idsStr.trim().isEmpty()) return Collections.emptyList();

                     return Arrays.stream(idsStr.split(","))
                     .map(String::trim)
                     .filter(s -> !s.isEmpty())
                     .map(Integer::parseInt)
                     .collect(Collectors.toList());
    }



@Override
protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
    try {
        List<EventModel> events = eventDAO.getAllEvents();

        // Build JSON manually
        StringBuilder json = new StringBuilder("[");
        for (int i = 0; i < events.size(); i++) {
            EventModel e = events.get(i);

            String title = e.getEventName();
            String date = e.getStartDateTime().toString();
            String duration = getDuration(e.getStartDateTime(), e.getEndDateTime());
            String category = e.getItemType();
            String status = "completed"; // or derive later
            String description = e.getNotes();
            

                json.append("{")
                    .append("\"id\":").append(e.getId()).append(",") // ✅ Add this line
                    .append("\"title\":\"").append(escapeJson(title)).append("\",")
                    .append("\"date\":\"").append(date).append("\",")
                    .append("\"duration\":\"").append(duration).append("\",")
                    .append("\"category\":\"").append(category).append("\",")
                    .append("\"status\":\"").append(status).append("\",")
                    .append("\"description\":\"").append(escapeJson(description)).append("\"")
                    .append("}");

            if (i < events.size() - 1) {
                json.append(",");
            }
        }
        json.append("]");

        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        resp.getWriter().write(json.toString());

    } catch (SQLException e) {
        resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        resp.setContentType("application/json");
        resp.getWriter().write("{\"status\":\"error\",\"message\":\"DB error: " + e.getMessage() + "\"}");
    }
}

// Helper to escape quotes in strings
private String escapeJson(String s) {
    if (s == null) return "";
    return s.replace("\"", "\\\""); // escape double quotes
}

private String getDuration(LocalDateTime start, LocalDateTime end) {
    if (start == null || end == null) return "";
    long minutes = java.time.Duration.between(start, end).toMinutes();
    if (minutes % 60 == 0) return (minutes / 60) + " hours";
    return minutes + " minutes";
}


   @Override
protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
    req.setCharacterEncoding("UTF-8");
    resp.setContentType("application/json");
    resp.setCharacterEncoding("UTF-8");

        // Debug logging
    System.out.println("=== EventServlet POST received ===");
    System.out.println("eventId: " + req.getParameter("eventId"));
    System.out.println("itemType: " + req.getParameter("itemType"));
    System.out.println("eventName: " + req.getParameter("eventName"));
    System.out.println("startDateTime: " + req.getParameter("startDateTime"));
    System.out.println("endDateTime: " + req.getParameter("endDateTime"));
    System.out.println("notes: " + req.getParameter("notes"));
    System.out.println("participantIds: " + req.getParameter("participantIds"));

    
    // Gather parameters
    String eventIdStr = req.getParameter("eventId"); // ✅ new

    // Fix for undefined eventId from JS
        if (eventIdStr == null || eventIdStr.equals("undefined") || eventIdStr.trim().isEmpty()) {
            eventIdStr = "";
        }

    String itemType = req.getParameter("itemType");
    String eventName = req.getParameter("eventName");
    String startStr = req.getParameter("startDateTime");
    String endStr = req.getParameter("endDateTime");
    String notes = req.getParameter("notes");


    



    HttpSession session = req.getSession(false);
    int createdByUserId = 1; // fallback

    if (session != null && session.getAttribute("userId") != null) {
        try {
            createdByUserId = (int) session.getAttribute("userId");
        } catch (Exception e) {
            System.err.println("❌ Failed to cast session userId: " + e.getMessage());
        }
    } else {
        System.err.println("❌ No userId found in session");
    }

        System.out.println("createdByUserId (from session): " + createdByUserId);








    String notifSetting = req.getParameter("notificationSetting");
    String participantIdsRaw = req.getParameter("participantIds");
    List<Integer> participantIds = parseParticipantIds(participantIdsRaw);


    

    // Parse dates
    LocalDateTime startDateTime;
    LocalDateTime endDateTime;
    try {
        startDateTime = LocalDateTime.parse(startStr);
        endDateTime = LocalDateTime.parse(endStr);
    } catch (Exception e) {
        resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
        resp.setContentType("application/json");
        resp.getWriter().write("{\"status\":\"error\",\"message\":\"Invalid date format: " + e.getMessage() + "\"}");
        return;
    }

    

    String actualNotifSetting = (notifSetting != null && !notifSetting.isEmpty()) ? notifSetting : "SELECTED_ONLY";

    // Build EventModel

    
            int eventId = 0;
        try {
            if (eventIdStr != null && !eventIdStr.isEmpty()) {
                eventId = Integer.parseInt(eventIdStr);
            }
        } catch (NumberFormatException e) {
            resp.getWriter().write("{\"status\":\"error\",\"message\":\"Invalid eventId\"}");
            return;
        }



    EventModel event = new EventModel(eventId, itemType, eventName, startDateTime, endDateTime, notes, createdByUserId, actualNotifSetting, participantIds);

    try {
        if (event.getId() > 0) {
            // ✅ Update existing
            eventDAO.updateEvent(event);
            resp.setStatus(HttpServletResponse.SC_OK);
            resp.setContentType("application/json");
            resp.getWriter().write("{\"status\":\"success\",\"id\":" + event.getId() + "}");
            
        } else {
            // ✅ Insert new
            int newId = eventDAO.insertEvent(event);
            event.setId(newId);
            resp.setStatus(HttpServletResponse.SC_CREATED);
            resp.setContentType("application/json");
            resp.getWriter().write("{\"status\":\"success\",\"id\":" + newId + "}");
        }




    } catch (SQLException e) {
        resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        resp.setContentType("application/json");
        resp.getWriter().write("{\"status\":\"error\",\"message\":\"DB error: " + e.getMessage() + "\"}");
        e.printStackTrace();
    }
}


}