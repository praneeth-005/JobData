package com.itcareerpartner.resume;

public class EvidenceItem {
    private String skillOrKeyword;
    private String category;
    private String lineProof;
    private int confidencePercent;
    private String status; // "CONFIRMED", "GAP", "WEAK"

    public EvidenceItem() {}

    public EvidenceItem(String skillOrKeyword, String category, String lineProof, int confidencePercent, String status) {
        this.skillOrKeyword = skillOrKeyword;
        this.category = category;
        this.lineProof = lineProof;
        this.confidencePercent = confidencePercent;
        this.status = status;
    }

    public String getSkillOrKeyword() { return skillOrKeyword; }
    public void setSkillOrKeyword(String skillOrKeyword) { this.skillOrKeyword = skillOrKeyword; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getLineProof() { return lineProof; }
    public void setLineProof(String lineProof) { this.lineProof = lineProof; }

    public int getConfidencePercent() { return confidencePercent; }
    public void setConfidencePercent(int confidencePercent) { this.confidencePercent = confidencePercent; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
