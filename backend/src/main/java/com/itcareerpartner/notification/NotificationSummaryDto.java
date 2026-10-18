package com.itcareerpartner.notification;

import java.util.List;

public class NotificationSummaryDto {
    private int totalCount;
    private int unreadCount;
    private int jobAlertsCount;
    private int remindersCount;
    private int systemUpdatesCount;
    private String alertStatus; // ACTIVE, PAUSED
    private List<NotificationItem> notifications;

    public NotificationSummaryDto() {}

    public NotificationSummaryDto(int totalCount, int unreadCount, int jobAlertsCount, int remindersCount,
                                  int systemUpdatesCount, String alertStatus, List<NotificationItem> notifications) {
        this.totalCount = totalCount;
        this.unreadCount = unreadCount;
        this.jobAlertsCount = jobAlertsCount;
        this.remindersCount = remindersCount;
        this.systemUpdatesCount = systemUpdatesCount;
        this.alertStatus = alertStatus;
        this.notifications = notifications;
    }

    public int getTotalCount() { return totalCount; }
    public void setTotalCount(int totalCount) { this.totalCount = totalCount; }

    public int getUnreadCount() { return unreadCount; }
    public void setUnreadCount(int unreadCount) { this.unreadCount = unreadCount; }

    public int getJobAlertsCount() { return jobAlertsCount; }
    public void setJobAlertsCount(int jobAlertsCount) { this.jobAlertsCount = jobAlertsCount; }

    public int getRemindersCount() { return remindersCount; }
    public void setRemindersCount(int remindersCount) { this.remindersCount = remindersCount; }

    public int getSystemUpdatesCount() { return systemUpdatesCount; }
    public void setSystemUpdatesCount(int systemUpdatesCount) { this.systemUpdatesCount = systemUpdatesCount; }

    public String getAlertStatus() { return alertStatus; }
    public void setAlertStatus(String alertStatus) { this.alertStatus = alertStatus; }

    public List<NotificationItem> getNotifications() { return notifications; }
    public void setNotifications(List<NotificationItem> notifications) { this.notifications = notifications; }
}
