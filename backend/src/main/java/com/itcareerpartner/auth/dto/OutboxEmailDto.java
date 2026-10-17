package com.itcareerpartner.auth.dto;

import java.time.Instant;

public class OutboxEmailDto {
    private String recipient;
    private String subject;
    private String token;
    private String link;
    private String purpose;
    private Instant sentAt;

    public OutboxEmailDto() {}

    public OutboxEmailDto(String recipient, String subject, String token, String link, String purpose, Instant sentAt) {
        this.recipient = recipient;
        this.subject = subject;
        this.token = token;
        this.link = link;
        this.purpose = purpose;
        this.sentAt = sentAt;
    }

    public String getRecipient() { return recipient; }
    public void setRecipient(String recipient) { this.recipient = recipient; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getLink() { return link; }
    public void setLink(String link) { this.link = link; }

    public String getPurpose() { return purpose; }
    public void setPurpose(String purpose) { this.purpose = purpose; }

    public Instant getSentAt() { return sentAt; }
    public void setSentAt(Instant sentAt) { this.sentAt = sentAt; }
}
