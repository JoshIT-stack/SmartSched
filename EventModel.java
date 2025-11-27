package model;

import java.time.LocalDateTime;
import java.util.List;

public class EventModel {
    private int id;
    private String itemType; // e.g., "MEETING", "SCHEDULE", "TASK"
    private String eventName;
    private LocalDateTime startDateTime;
    private LocalDateTime endDateTime;
    private String notes;
    private int createdByUserId;
    private String notificationSetting; // 'ALL_EMPLOYEES' or 'SELECTED_ONLY'
    private List<Integer> participantIds; // List of User IDs

    // Constructor, Getters, and Setters
    // (Omitted for brevity, but you must include them)



    public EventModel(){

    }

    public EventModel(int id, String itemType, String eventName, LocalDateTime startDateTime, LocalDateTime endDateTime, String notes,int createdByUserId,
            String notificationSetting, List<Integer> participantIds
    ){

            this.id=id;
            this.itemType=itemType;
            this.eventName=eventName;
            this.startDateTime=startDateTime;
            this.endDateTime=endDateTime;
            this.notes=notes;
            this.createdByUserId=createdByUserId;
            this.notificationSetting=notificationSetting;
            this.participantIds=participantIds;
    }

    public EventModel(String itemType, String eventName, LocalDateTime startDateTime, LocalDateTime endDateTime, String notes,int createdByUserId,
            String notificationSetting, List<Integer> participantIds
    ){

            this.itemType=itemType;
            this.eventName=eventName;
            this.startDateTime=startDateTime;
            this.endDateTime=endDateTime;
            this.notes=notes;
            this.createdByUserId=createdByUserId;
            this.notificationSetting=notificationSetting;
            this.participantIds=participantIds;
    }

    // Getters and Setters
    public int getId() {
        return id;
    }
    public void setId(int id) {
        this.id = id;
    }

    public String getItemType() {
        return itemType;
    }
    public void setItemType(String itemType) {
        this.itemType = itemType;
    }

    public String getEventName() {
        return eventName;
    }
    public void setEventName(String eventName) {
        this.eventName = eventName;
    }

    public LocalDateTime getStartDateTime() {
        return startDateTime;
    }
    public void setStartDateTime(LocalDateTime startDateTime) {
        this.startDateTime = startDateTime;
    }

    public LocalDateTime getEndDateTime() {
        return endDateTime;
    }
    public void setEndDateTime(LocalDateTime endDateTime) {
        this.endDateTime = endDateTime;
    }

    public String getNotes() {
        return notes;
    }
    public void setNotes(String notes) {
        this.notes = notes;
    }

    public int getCreatedByUserId() {
        return createdByUserId;
    }
    public void setCreatedByUserId(int createdByUserId) {
        this.createdByUserId = createdByUserId;
    }

    public String getNotificationSetting() {
        return notificationSetting;
    }
    public void setNotificationSetting(String notificationSetting) {
        this.notificationSetting = notificationSetting;
    }

    public List<Integer> getParticipantIds() {
        return participantIds;
    }
    public void setParticipantIds(List<Integer> participantIds) {
        this.participantIds = participantIds;
    }
}