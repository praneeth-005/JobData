package com.itcareerpartner.job.dto;

import com.itcareerpartner.job.FoundJob;
import java.util.List;

public class JobSearchResponseDto {
    private List<FoundJob> jobs;
    private int totalFound;
    private int verifiedCount;
    private List<String> companiesFound;
    private String query;

    public JobSearchResponseDto() {}

    public JobSearchResponseDto(List<FoundJob> jobs, int totalFound, int verifiedCount, List<String> companiesFound, String query) {
        this.jobs = jobs;
        this.totalFound = totalFound;
        this.verifiedCount = verifiedCount;
        this.companiesFound = companiesFound;
        this.query = query;
    }

    public List<FoundJob> getJobs() { return jobs; }
    public void setJobs(List<FoundJob> jobs) { this.jobs = jobs; }

    public int getTotalFound() { return totalFound; }
    public void setTotalFound(int totalFound) { this.totalFound = totalFound; }

    public int getVerifiedCount() { return verifiedCount; }
    public void setVerifiedCount(int verifiedCount) { this.verifiedCount = verifiedCount; }

    public List<String> getCompaniesFound() { return companiesFound; }
    public void setCompaniesFound(List<String> companiesFound) { this.companiesFound = companiesFound; }

    public String getQuery() { return query; }
    public void setQuery(String query) { this.query = query; }
}
