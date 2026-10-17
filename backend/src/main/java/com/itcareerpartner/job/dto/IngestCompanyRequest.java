package com.itcareerpartner.job.dto;

public class IngestCompanyRequest {
    private String companyName;

    public IngestCompanyRequest() {}

    public IngestCompanyRequest(String companyName) {
        this.companyName = companyName;
    }

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }
}
