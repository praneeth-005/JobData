package com.itcareerpartner.job.dto;

public class CompanyItemDto {
    private String name;
    private String logoText;
    private int openingsCount;
    private String avgSalaryText;
    private String category;
    private boolean isVerified;
    private String website;

    public CompanyItemDto() {
    }

    public CompanyItemDto(String name, String logoText, int openingsCount, String avgSalaryText, String category, boolean isVerified, String website) {
        this.name = name;
        this.logoText = logoText;
        this.openingsCount = openingsCount;
        this.avgSalaryText = avgSalaryText;
        this.category = category;
        this.isVerified = isVerified;
        this.website = website;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLogoText() {
        return logoText;
    }

    public void setLogoText(String logoText) {
        this.logoText = logoText;
    }

    public int getOpeningsCount() {
        return openingsCount;
    }

    public void setOpeningsCount(int openingsCount) {
        this.openingsCount = openingsCount;
    }

    public String getAvgSalaryText() {
        return avgSalaryText;
    }

    public void setAvgSalaryText(String avgSalaryText) {
        this.avgSalaryText = avgSalaryText;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public boolean isVerified() {
        return isVerified;
    }

    public void setVerified(boolean verified) {
        isVerified = verified;
    }

    public String getWebsite() {
        return website;
    }

    public void setWebsite(String website) {
        this.website = website;
    }
}
