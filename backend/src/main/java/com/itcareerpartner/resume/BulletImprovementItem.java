package com.itcareerpartner.resume;

public class BulletImprovementItem {
    private String id;
    private String category;
    private String originalText;
    private String recommendedText;
    private String rationale;
    private String impactLevel; // "High", "Medium", "Low"
    private String context;

    public BulletImprovementItem() {}

    public BulletImprovementItem(String id, String category, String originalText, String recommendedText, String rationale, String impactLevel, String context) {
        this.id = id;
        this.category = category;
        this.originalText = originalText;
        this.recommendedText = recommendedText;
        this.rationale = rationale;
        this.impactLevel = impactLevel;
        this.context = context;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getOriginalText() { return originalText; }
    public void setOriginalText(String originalText) { this.originalText = originalText; }

    public String getRecommendedText() { return recommendedText; }
    public void setRecommendedText(String recommendedText) { this.recommendedText = recommendedText; }

    public String getRationale() { return rationale; }
    public void setRationale(String rationale) { this.rationale = rationale; }

    public String getImpactLevel() { return impactLevel; }
    public void setImpactLevel(String impactLevel) { this.impactLevel = impactLevel; }

    public String getContext() { return context; }
    public void setContext(String context) { this.context = context; }
}
