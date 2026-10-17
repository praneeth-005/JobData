package com.itcareerpartner.resume;

public class MatchFactorItem {
    private String factorName;
    private int weightPercent;
    private int matchPercent;
    private String detail;
    private String icon;

    public MatchFactorItem() {}

    public MatchFactorItem(String factorName, int weightPercent, int matchPercent, String detail, String icon) {
        this.factorName = factorName;
        this.weightPercent = weightPercent;
        this.matchPercent = matchPercent;
        this.detail = detail;
        this.icon = icon;
    }

    public String getFactorName() { return factorName; }
    public void setFactorName(String factorName) { this.factorName = factorName; }

    public int getWeightPercent() { return weightPercent; }
    public void setWeightPercent(int weightPercent) { this.weightPercent = weightPercent; }

    public int getMatchPercent() { return matchPercent; }
    public void setMatchPercent(int matchPercent) { this.matchPercent = matchPercent; }

    public String getDetail() { return detail; }
    public void setDetail(String detail) { this.detail = detail; }

    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }
}
