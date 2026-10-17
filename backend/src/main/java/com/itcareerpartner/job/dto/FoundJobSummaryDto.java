package com.itcareerpartner.job.dto;

import com.itcareerpartner.job.FoundJob;

import java.util.List;

public class FoundJobSummaryDto {

    private int allCount;
    private int verifiedCount;
    private int reviewCount;
    private int filteredCount;
    private List<FoundJob> jobs;

    public FoundJobSummaryDto() {
    }

    public FoundJobSummaryDto(int allCount, int verifiedCount, int reviewCount, int filteredCount, List<FoundJob> jobs) {
        this.allCount = allCount;
        this.verifiedCount = verifiedCount;
        this.reviewCount = reviewCount;
        this.filteredCount = filteredCount;
        this.jobs = jobs;
    }

    public int getAllCount() {
        return allCount;
    }

    public void setAllCount(int allCount) {
        this.allCount = allCount;
    }

    public int getVerifiedCount() {
        return verifiedCount;
    }

    public void setVerifiedCount(int verifiedCount) {
        this.verifiedCount = verifiedCount;
    }

    public int getReviewCount() {
        return reviewCount;
    }

    public void setReviewCount(int reviewCount) {
        this.reviewCount = reviewCount;
    }

    public int getFilteredCount() {
        return filteredCount;
    }

    public void setFilteredCount(int filteredCount) {
        this.filteredCount = filteredCount;
    }

    public List<FoundJob> getJobs() {
        return jobs;
    }

    public void setJobs(List<FoundJob> jobs) {
        this.jobs = jobs;
    }
}
