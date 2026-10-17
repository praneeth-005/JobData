package com.itcareerpartner.job.dto;

public class StartScanRequest {

    private String scope; // "ALL" or "SINGLE"
    private String targetCompanyName;
    private String targetSourceId;

    public StartScanRequest() {
        this.scope = "ALL";
    }

    public StartScanRequest(String scope, String targetCompanyName, String targetSourceId) {
        this.scope = scope;
        this.targetCompanyName = targetCompanyName;
        this.targetSourceId = targetSourceId;
    }

    public String getScope() {
        return scope;
    }

    public void setScope(String scope) {
        this.scope = scope;
    }

    public String getTargetCompanyName() {
        return targetCompanyName;
    }

    public void setTargetCompanyName(String targetCompanyName) {
        this.targetCompanyName = targetCompanyName;
    }

    public String getTargetSourceId() {
        return targetSourceId;
    }

    public void setTargetSourceId(String targetSourceId) {
        this.targetSourceId = targetSourceId;
    }
}
