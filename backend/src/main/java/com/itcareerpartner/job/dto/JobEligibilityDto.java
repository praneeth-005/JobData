package com.itcareerpartner.job.dto;

import java.util.List;

public class JobEligibilityDto {
    private String jobId;
    private String company;
    private String title;
    private String ctcText;
    private Double ctcLpa;
    private int overallFitScore;
    private String fitRank;
    private boolean isEligible;
    private String auditHash;
    private String negativeContrastAlert;
    private List<RuleEvaluation> hardRules;
    private List<FactorBreakdown> candidateBreakdown;

    public static class RuleEvaluation {
        private int ruleNumber;
        private String ruleName;
        private String status; // "Pass", "N/A", "Fail"
        private String detail;

        public RuleEvaluation() {}

        public RuleEvaluation(int ruleNumber, String ruleName, String status, String detail) {
            this.ruleNumber = ruleNumber;
            this.ruleName = ruleName;
            this.status = status;
            this.detail = detail;
        }

        public int getRuleNumber() { return ruleNumber; }
        public void setRuleNumber(int ruleNumber) { this.ruleNumber = ruleNumber; }
        public String getRuleName() { return ruleName; }
        public void setRuleName(String ruleName) { this.ruleName = ruleName; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public String getDetail() { return detail; }
        public void setDetail(String detail) { this.detail = detail; }
    }

    public static class FactorBreakdown {
        private String factorName;
        private int weightPercent;
        private int matchPercent;
        private String description;
        private String icon;

        public FactorBreakdown() {}

        public FactorBreakdown(String factorName, int weightPercent, int matchPercent, String description, String icon) {
            this.factorName = factorName;
            this.weightPercent = weightPercent;
            this.matchPercent = matchPercent;
            this.description = description;
            this.icon = icon;
        }

        public String getFactorName() { return factorName; }
        public void setFactorName(String factorName) { this.factorName = factorName; }
        public int getWeightPercent() { return weightPercent; }
        public void setWeightPercent(int weightPercent) { this.weightPercent = weightPercent; }
        public int getMatchPercent() { return matchPercent; }
        public void setMatchPercent(int matchPercent) { this.matchPercent = matchPercent; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public String getIcon() { return icon; }
        public void setIcon(String icon) { this.icon = icon; }
    }

    public JobEligibilityDto() {}

    public String getJobId() { return jobId; }
    public void setJobId(String jobId) { this.jobId = jobId; }

    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getCtcText() { return ctcText; }
    public void setCtcText(String ctcText) { this.ctcText = ctcText; }

    public Double getCtcLpa() { return ctcLpa; }
    public void setCtcLpa(Double ctcLpa) { this.ctcLpa = ctcLpa; }

    public int getOverallFitScore() { return overallFitScore; }
    public void setOverallFitScore(int overallFitScore) { this.overallFitScore = overallFitScore; }

    public String getFitRank() { return fitRank; }
    public void setFitRank(String fitRank) { this.fitRank = fitRank; }

    public boolean isEligible() { return isEligible; }
    public void setEligible(boolean eligible) { isEligible = eligible; }

    public String getAuditHash() { return auditHash; }
    public void setAuditHash(String auditHash) { this.auditHash = auditHash; }

    public String getNegativeContrastAlert() { return negativeContrastAlert; }
    public void setNegativeContrastAlert(String negativeContrastAlert) { this.negativeContrastAlert = negativeContrastAlert; }

    public List<RuleEvaluation> getHardRules() { return hardRules; }
    public void setHardRules(List<RuleEvaluation> hardRules) { this.hardRules = hardRules; }

    public List<FactorBreakdown> getCandidateBreakdown() { return candidateBreakdown; }
    public void setCandidateBreakdown(List<FactorBreakdown> candidateBreakdown) { this.candidateBreakdown = candidateBreakdown; }
}
