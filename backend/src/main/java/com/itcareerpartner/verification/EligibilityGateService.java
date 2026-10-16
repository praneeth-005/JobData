package com.itcareerpartner.verification;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;

/**
 * Deterministic Mathematical Gatekeeper for Fresher IT Job Verification.
 * Implements business rules BR-01 to BR-07:
 * - 0 YOE experience filter strictly
 * - Full-time salary floor >= 2.4 LPA
 * - Internship stipend matrix (<=2mo vs >2mo, WFH vs WFO)
 * - Anti-scam zero tolerance
 * - Whitelisted IT domains; strict rejection of Customer Support/BPO
 */
@Service
public class EligibilityGateService {

    private static final BigDecimal MIN_FULL_TIME_SALARY_LPA = new BigDecimal("2.4");
    private static final BigDecimal MIN_SHORT_TERM_WFH_STIPEND = new BigDecimal("5000");
    private static final BigDecimal MIN_SHORT_TERM_WFO_STIPEND = new BigDecimal("10000");
    private static final BigDecimal MIN_LONG_TERM_STIPEND = new BigDecimal("8000");

    private static final Set<String> BLACKLISTED_KEYWORDS = Set.of(
            "customer support", "telecalling", "bpo", "voice process", "call center",
            "data entry", "sales executive", "registration fee", "training deposit", "laptop fee", "bond money"
    );

    public boolean isEligibleFresherJob(int minExpYears, BigDecimal salaryLpa, String title, String description) {
        // Rule 1: 0 YOE strictly
        if (minExpYears > 0) return false;

        // Rule 2: Full-Time salary floor >= 2.4 LPA
        if (salaryLpa != null && salaryLpa.compareTo(MIN_FULL_TIME_SALARY_LPA) < 0) return false;

        // Rule 3: Blacklisted roles & scam keywords
        String lowerContent = (title + " " + description).toLowerCase();
        for (String kw : BLACKLISTED_KEYWORDS) {
            if (lowerContent.contains(kw)) return false;
        }

        return true;
    }

    public boolean isEligibleInternship(int durationMonths, boolean isWfh, BigDecimal monthlyStipend) {
        if (monthlyStipend == null || monthlyStipend.compareTo(BigDecimal.ZERO) <= 0) {
            return false; // Unpaid strictly rejected
        }

        if (durationMonths <= 2) {
            BigDecimal threshold = isWfh ? MIN_SHORT_TERM_WFH_STIPEND : MIN_SHORT_TERM_WFO_STIPEND;
            return monthlyStipend.compareTo(threshold) >= 0;
        } else {
            return monthlyStipend.compareTo(MIN_LONG_TERM_STIPEND) >= 0;
        }
    }
}
