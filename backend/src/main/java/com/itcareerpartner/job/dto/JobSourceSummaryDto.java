package com.itcareerpartner.job.dto;

import com.itcareerpartner.job.JobSource;

import java.util.List;

public class JobSourceSummaryDto {

    private int totalPortals;
    private int openOpportunities;
    private String systemHealthText;
    private List<JobSource> sources;

    public JobSourceSummaryDto() {
    }

    public JobSourceSummaryDto(int totalPortals, int openOpportunities, String systemHealthText, List<JobSource> sources) {
        this.totalPortals = totalPortals;
        this.openOpportunities = openOpportunities;
        this.systemHealthText = systemHealthText;
        this.sources = sources;
    }

    public int getTotalPortals() {
        return totalPortals;
    }

    public void setTotalPortals(int totalPortals) {
        this.totalPortals = totalPortals;
    }

    public int getOpenOpportunities() {
        return openOpportunities;
    }

    public void setOpenOpportunities(int openOpportunities) {
        this.openOpportunities = openOpportunities;
    }

    public String getSystemHealthText() {
        return systemHealthText;
    }

    public void setSystemHealthText(String systemHealthText) {
        this.systemHealthText = systemHealthText;
    }

    public List<JobSource> getSources() {
        return sources;
    }

    public void setSources(List<JobSource> sources) {
        this.sources = sources;
    }
}
