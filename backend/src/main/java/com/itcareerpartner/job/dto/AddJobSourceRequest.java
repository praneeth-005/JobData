package com.itcareerpartner.job.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class AddJobSourceRequest {

    @NotBlank(message = "Company or portal name is required")
    private String companyName;

    private String portalName;

    @NotBlank(message = "Official portal link is required")
    @Pattern(regexp = "^(http|https)://.*$", message = "Portal link must be a valid URL starting with http:// or https://")
    private String portalUrl;

    @NotBlank(message = "Source type is required")
    private String sourceType; // PORTAL, CAMPUS, API

    public AddJobSourceRequest() {
    }

    public AddJobSourceRequest(String companyName, String portalName, String portalUrl, String sourceType) {
        this.companyName = companyName;
        this.portalName = portalName;
        this.portalUrl = portalUrl;
        this.sourceType = sourceType;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getPortalName() {
        return portalName;
    }

    public void setPortalName(String portalName) {
        this.portalName = portalName;
    }

    public String getPortalUrl() {
        return portalUrl;
    }

    public void setPortalUrl(String portalUrl) {
        this.portalUrl = portalUrl;
    }

    public String getSourceType() {
        return sourceType;
    }

    public void setSourceType(String sourceType) {
        this.sourceType = sourceType;
    }
}
