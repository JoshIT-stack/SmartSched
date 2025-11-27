import java.time.LocalDateTime;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import model.EventModel;
public class EventDao {

    private Connection connection;

    public EventDao(Connection connection) {
        this.connection = connection;
    }

    // Key method: insert event and its participants in a transaction
    public int insertEvent(EventModel event) throws SQLException {
        String eventSql = "INSERT INTO calendar_items (item_type, event_name, start_time, end_time, notes, created_by_user_id, notification_setting) VALUES (?, ?, ?, ?, ?, ?, ?)";
        String participantSql = "INSERT INTO item_participants (item_id, user_id) VALUES (?, ?)";
        int eventId = -1;

        // Transaction: ensure both event and participants are saved or neither
        connection.setAutoCommit(false);
        try (PreparedStatement eventPst = connection.prepareStatement(eventSql, Statement.RETURN_GENERATED_KEYS)) {

            // 1. Insert main event/schedule/task
            eventPst.setString(1, event.getItemType());
            eventPst.setString(2, event.getEventName());
            eventPst.setTimestamp(3, Timestamp.valueOf(event.getStartDateTime()));
            eventPst.setTimestamp(4, Timestamp.valueOf(event.getEndDateTime()));
            eventPst.setString(5, event.getNotes());
            eventPst.setInt(6, event.getCreatedByUserId());
            eventPst.setString(7, event.getNotificationSetting());

            eventPst.executeUpdate();

            // Get generated ID
            try (ResultSet rs = eventPst.getGeneratedKeys()) {
                if (rs.next()) {
                    eventId = rs.getInt(1);
                }
            }

            // 2. Insert participants (if any)
            if (eventId != -1 && event.getParticipantIds() != null && !event.getParticipantIds().isEmpty()) {
                try (PreparedStatement participantPst = connection.prepareStatement(participantSql)) {
                    for (int userId : event.getParticipantIds()) {
                        participantPst.setInt(1, eventId);
                        participantPst.setInt(2, userId);
                        participantPst.addBatch();
                    }
                    participantPst.executeBatch();
                }
            }

            connection.commit();
            // After commit, trigger notifications
            notifyRecipients(event, eventId);

            return eventId;

        } catch (SQLException e) {
            connection.rollback();
            throw e;
        } finally {
            connection.setAutoCommit(true);
        }
    }

   private void notifyRecipients(EventModel event, int eventId) {
    boolean notifyAll = "ALL_EMPLOYEES".equalsIgnoreCase(event.getNotificationSetting());
    List<Integer> recipients;

    try {
        if (notifyAll) {
            recipients = getAllUserIds();

        } else {
            recipients = event.getParticipantIds();
        }

        if (recipients == null || recipients.isEmpty()) {
            System.out.println("No recipients to notify for item " + eventId);
            return;
        }

        String sql = "INSERT INTO notifications (item_id, sender, recipient_id, role, time, message, is_read) VALUES (?, ?, ?, ?, NOW(), ?, 0)";
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            for (Integer uid : recipients) {
                stmt.setInt(1, eventId);
                stmt.setString(2, "Admin");// or fetch admin name from session
                stmt.setInt(3, uid);
                stmt.setString(4, "EVENT");
                stmt.setString(5, "You’ve been added to an event: " + event.getEventName());
                stmt.addBatch();
            }
            stmt.executeBatch();
        }
        System.out.println("✅ Notifications inserted for event " + eventId);

    } catch (SQLException ex) {
        System.err.println("❌ Notification insert error: " + ex.getMessage());
    }
}












    // Helper: fetch all user IDs (adjust to your actual users table)
    private List<Integer> getAllUserIds() throws SQLException {
        List<Integer> ids = new ArrayList<>();
        String sql = "SELECT id FROM users";
        try (Statement st = connection.createStatement(); ResultSet rs = st.executeQuery(sql)) {
            while (rs.next()) {
                ids.add(rs.getInt("id"));
            }
        }
        return ids;
    }






    // ✅ New method: update existing event
public void updateEvent(EventModel event) throws SQLException {
    // 1. Update the main event record
    String sql = "UPDATE calendar_items SET item_type=?, event_name=?, start_time=?, end_time=?, notes=?, created_by_user_id=?, notification_setting=? WHERE id=?";
    
    try (PreparedStatement stmt = connection.prepareStatement(sql)) {
        stmt.setString(1, event.getItemType());
        stmt.setString(2, event.getEventName());
        stmt.setTimestamp(3, Timestamp.valueOf(event.getStartDateTime()));
        stmt.setTimestamp(4, Timestamp.valueOf(event.getEndDateTime()));
        stmt.setString(5, event.getNotes());
        stmt.setInt(6, event.getCreatedByUserId());
        stmt.setString(7, event.getNotificationSetting());
        stmt.setInt(8, event.getId());
        stmt.executeUpdate();
    }

    // 2. Refresh participants
    // First, clear old participants
    String deleteSql = "DELETE FROM item_participants WHERE item_id=?";
    try (PreparedStatement deleteStmt = connection.prepareStatement(deleteSql)) {
        deleteStmt.setInt(1, event.getId());
        deleteStmt.executeUpdate();
    }

    // Then, insert the new participants
    if (event.getParticipantIds() != null && !event.getParticipantIds().isEmpty()) {
        String insertSql = "INSERT INTO item_participants (item_id, user_id) VALUES (?, ?)";
        try (PreparedStatement insertStmt = connection.prepareStatement(insertSql)) {
            for (int userId : event.getParticipantIds()) {
                insertStmt.setInt(1, event.getId());
                insertStmt.setInt(2, userId);
                insertStmt.addBatch();
            }
            insertStmt.executeBatch();
        }
    }
}










    public List<EventModel> getAllEvents() throws SQLException {
    List<EventModel> events = new ArrayList<>();
    String sql = "SELECT id, item_type, event_name, start_time, end_time, notes, created_by_user_id, notification_setting FROM calendar_items ORDER BY start_time DESC";

    try (PreparedStatement ps = connection.prepareStatement(sql);
         ResultSet rs = ps.executeQuery()) {

        while (rs.next()) {
            EventModel event = new EventModel(
                rs.getInt("id"),
                rs.getString("item_type"),
                rs.getString("event_name"),
                rs.getTimestamp("start_time").toLocalDateTime(),
                rs.getTimestamp("end_time").toLocalDateTime(),
                rs.getString("notes"),
                rs.getInt("created_by_user_id"),
                rs.getString("notification_setting"),
                new ArrayList<>() // participantIds not needed for frontend display
            );
            events.add(event);
        }
    }

    return events;
}

}
