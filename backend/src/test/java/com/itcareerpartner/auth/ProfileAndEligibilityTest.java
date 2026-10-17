package com.itcareerpartner.auth;

import com.itcareerpartner.auth.dto.UserProfileDto;
import com.itcareerpartner.verification.EligibilityGateService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockHttpServletRequest;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class ProfileAndEligibilityTest {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EligibilityGateService eligibilityGateService;

    @Test
    @DisplayName("1. Create and edit personal and education details with MongoDB persistence")
    public void test1_PersonalAndEducationPersistence() {
        String testEmail = "profile.test." + UUID.randomUUID().toString().substring(0, 8) + "@college.edu";
        User user = new User();
        user.setEmail(testEmail);
        user.setFullName("Rohan Sharma");
        user.setPasswordHash("$2a$10$hashedpass1234567890123456789012345678901234567890");
        userRepository.save(user);

        MockHttpServletRequest request = new MockHttpServletRequest();
        request.getSession(true).setAttribute(AuthService.SESSION_USER_KEY, user.getId());

        UserProfileDto updateDto = new UserProfileDto();
        updateDto.setEmail(testEmail);
        updateDto.setFullName("Rohan Sharma Updated");
        updateDto.setPhone("98765 43210");

        List<EducationCredential> edus = new ArrayList<>();
        edus.add(new EducationCredential(
                "edu_btech", "higher_ed", "Primary Degree", "Current Qualification", true,
                "B.Tech / B.E.", "2026", "Computer Science", "IIT Bombay", "cgpa", "9.2"
        ));
        edus.add(new EducationCredential(
                "edu_12th", "school", "Class XII", "Completed", false,
                "CBSE", "2022", "PCM", "DPS Delhi", "pct", "94.5"
        ));
        updateDto.setEducationList(edus);

        UserProfileDto result = authService.updateProfile(updateDto, request);
        assertNotNull(result);
        assertEquals("Rohan Sharma Updated", result.getFullName());
        assertEquals("98765 43210", result.getPhone());
        assertEquals(2, result.getEducationList().size());
        assertEquals("IIT Bombay", result.getCollegeName());
        assertEquals("9.2", result.getCgpa());

        // Verify from MongoDB Atlas directly
        User dbUser = userRepository.findById(user.getId()).orElseThrow();
        assertEquals("Rohan Sharma Updated", dbUser.getFullName());
        assertEquals(2, dbUser.getEducationList().size());

        // Clean up
        userRepository.delete(dbUser);
    }

    @Test
    @DisplayName("2. Remove education detail and verify MongoDB reflects removal and promotes primary")
    public void test2_RemoveEducationCredential() {
        String testEmail = "remove.edu." + UUID.randomUUID().toString().substring(0, 8) + "@college.edu";
        User user = new User();
        user.setEmail(testEmail);
        user.setFullName("Priya Patel");
        user.setPasswordHash("$2a$10$hashedpass1234567890123456789012345678901234567890");
        
        List<EducationCredential> initialEdus = new ArrayList<>();
        initialEdus.add(new EducationCredential(
                "edu_1", "higher_ed", "Primary Degree", "Current Qualification", true,
                "B.Tech", "2025", "CSE", "NIT Surathkal", "cgpa", "8.9"
        ));
        initialEdus.add(new EducationCredential(
                "edu_2", "school", "Class XII", "Completed", false,
                "State Board", "2021", "Science", "Kendriya Vidyalaya", "pct", "91.0"
        ));
        user.setEducationList(initialEdus);
        userRepository.save(user);

        MockHttpServletRequest request = new MockHttpServletRequest();
        request.getSession(true).setAttribute(AuthService.SESSION_USER_KEY, user.getId());

        // Remove edu_1 (primary) and keep only edu_2
        UserProfileDto updateDto = new UserProfileDto();
        updateDto.setEmail(testEmail);
        List<EducationCredential> remainingEdus = new ArrayList<>();
        remainingEdus.add(new EducationCredential(
                "edu_2", "school", "Class XII", "Completed", false,
                "State Board", "2021", "Science", "Kendriya Vidyalaya", "pct", "91.0"
        ));
        updateDto.setEducationList(remainingEdus);

        UserProfileDto result = authService.updateProfile(updateDto, request);
        assertEquals(1, result.getEducationList().size());
        assertTrue(result.getEducationList().get(0).isPrimary(), "Remaining credential must be promoted to primary");
        assertEquals("State Board", result.getDegree());
        assertEquals("Kendriya Vidyalaya", result.getCollegeName());

        // Verify direct from MongoDB
        User dbUser = userRepository.findById(user.getId()).orElseThrow();
        assertEquals(1, dbUser.getEducationList().size());
        assertEquals("edu_2", dbUser.getEducationList().get(0).getId());

        userRepository.delete(dbUser);
    }

    @Test
    @DisplayName("3. Add, remove, and persist technical skills")
    public void test3_SkillsPersistence() {
        String testEmail = "skills.test." + UUID.randomUUID().toString().substring(0, 8) + "@college.edu";
        User user = new User();
        user.setEmail(testEmail);
        user.setFullName("Karan Verma");
        user.setPasswordHash("$2a$10$hashedpass1234567890123456789012345678901234567890");
        userRepository.save(user);

        MockHttpServletRequest request = new MockHttpServletRequest();
        request.getSession(true).setAttribute(AuthService.SESSION_USER_KEY, user.getId());

        // Add skills
        UserProfileDto updateDto = new UserProfileDto();
        updateDto.setEmail(testEmail);
        updateDto.setSkills(List.of("Java", "Spring Boot", "Docker", "PostgreSQL", "Kafka"));
        authService.updateProfile(updateDto, request);

        User dbUser = userRepository.findById(user.getId()).orElseThrow();
        assertEquals(5, dbUser.getSkills().size());
        assertTrue(dbUser.getSkills().contains("Docker"));

        // Remove Docker and Kafka
        updateDto.setSkills(List.of("Java", "Spring Boot", "PostgreSQL"));
        authService.updateProfile(updateDto, request);

        User dbUserAfterRemove = userRepository.findById(user.getId()).orElseThrow();
        assertEquals(3, dbUserAfterRemove.getSkills().size());
        assertFalse(dbUserAfterRemove.getSkills().contains("Docker"));

        userRepository.delete(dbUserAfterRemove);
    }

    @Test
    @DisplayName("4. Job preferences persistence (roles, locations, work modes, interview & working days)")
    public void test4_JobPreferencesPersistence() {
        String testEmail = "prefs.test." + UUID.randomUUID().toString().substring(0, 8) + "@college.edu";
        User user = new User();
        user.setEmail(testEmail);
        user.setFullName("Ananya Sengupta");
        user.setPasswordHash("$2a$10$hashedpass1234567890123456789012345678901234567890");
        userRepository.save(user);

        MockHttpServletRequest request = new MockHttpServletRequest();
        request.getSession(true).setAttribute(AuthService.SESSION_USER_KEY, user.getId());

        UserProfileDto prefsDto = new UserProfileDto();
        prefsDto.setEmail(testEmail);
        prefsDto.setTargetRoles(List.of("Backend Developer", "Cloud Engineer", "SDE-1"));
        prefsDto.setPreferredLocations(List.of("Bengaluru", "Hyderabad", "Pune"));
        prefsDto.setWorkModes(List.of("Remote", "Hybrid"));
        prefsDto.setEmploymentTypes(List.of("Full-time Direct Hire", "Paid Technical Internships"));
        prefsDto.setInterviewPreference("online");
        prefsDto.setWorkingDaysPreference("5_days");
        prefsDto.setSalaryFloorLpa(3.6);

        UserProfileDto saved = authService.updateProfile(prefsDto, request);
        assertEquals(3, saved.getTargetRoles().size());
        assertEquals(2, saved.getWorkModes().size());
        assertEquals("online", saved.getInterviewPreference());
        assertEquals("5_days", saved.getWorkingDaysPreference());
        assertEquals(3.6, saved.getSalaryFloorLpa());

        User dbUser = userRepository.findById(user.getId()).orElseThrow();
        assertEquals(3.6, dbUser.getSalaryFloorLpa());
        assertEquals("online", dbUser.getInterviewPreference());

        userRepository.delete(dbUser);
    }

    @Test
    @DisplayName("5. Backend rejects invalid CGPA (> 10.0) and invalid percentage (> 100.0)")
    public void test5_BackendValidationRejectsInvalidScores() {
        String testEmail = "val.test." + UUID.randomUUID().toString().substring(0, 8) + "@college.edu";
        User user = new User();
        user.setEmail(testEmail);
        user.setFullName("Test Candidate");
        user.setPasswordHash("$2a$10$hashedpass1234567890123456789012345678901234567890");
        userRepository.save(user);

        MockHttpServletRequest request = new MockHttpServletRequest();
        request.getSession(true).setAttribute(AuthService.SESSION_USER_KEY, user.getId());

        // Test CGPA > 10.0
        UserProfileDto invalidCgpa = new UserProfileDto();
        invalidCgpa.setEmail(testEmail);
        invalidCgpa.setEducationList(List.of(
                new EducationCredential("edu_bad", "higher_ed", "Degree", "Current", true, "B.Tech", "2025", "CS", "College", "cgpa", "14.2")
        ));
        Exception ex1 = assertThrows(IllegalArgumentException.class, () -> authService.updateProfile(invalidCgpa, request));
        assertTrue(ex1.getMessage().contains("CGPA must be between 0.0 and 10.0"));

        // Test Percentage > 100.0
        UserProfileDto invalidPct = new UserProfileDto();
        invalidPct.setEmail(testEmail);
        invalidPct.setEducationList(List.of(
                new EducationCredential("edu_bad2", "school", "Class XII", "Completed", true, "CBSE", "2021", "Science", "School", "pct", "115.0")
        ));
        Exception ex2 = assertThrows(IllegalArgumentException.class, () -> authService.updateProfile(invalidPct, request));
        assertTrue(ex2.getMessage().contains("Percentage aggregate must be between 0.0 and 100.0"));

        userRepository.delete(user);
    }

    @Test
    @DisplayName("6. Backend enforces mandatory statutory salary floor >= 2.4 LPA (BR-02)")
    public void test6_BackendEnforcesSalaryFloor() {
        String testEmail = "salary.test." + UUID.randomUUID().toString().substring(0, 8) + "@college.edu";
        User user = new User();
        user.setEmail(testEmail);
        user.setFullName("Salary Test Candidate");
        user.setPasswordHash("$2a$10$hashedpass1234567890123456789012345678901234567890");
        userRepository.save(user);

        MockHttpServletRequest request = new MockHttpServletRequest();
        request.getSession(true).setAttribute(AuthService.SESSION_USER_KEY, user.getId());

        UserProfileDto lowSalaryDto = new UserProfileDto();
        lowSalaryDto.setEmail(testEmail);
        lowSalaryDto.setSalaryFloorLpa(1.8); // Below 2.4 LPA statutory threshold

        Exception ex = assertThrows(IllegalArgumentException.class, () -> authService.updateProfile(lowSalaryDto, request));
        assertTrue(ex.getMessage().contains("2.4 LPA"));

        userRepository.delete(user);
    }

    @Test
    @DisplayName("7. EligibilityGateService enforces fresher 0 YOE, 2.4 LPA salary floor, and scam blacklisting")
    public void test7_EligibilityGateServiceRules() {
        // 0 YOE and >= 2.4 LPA: Eligible
        assertTrue(eligibilityGateService.isEligibleFresherJob(0, new BigDecimal("3.5"), "Junior Software Engineer", "Java, Spring Boot backend"));

        // > 0 YOE: Ineligible for fresher tracks
        assertFalse(eligibilityGateService.isEligibleFresherJob(2, new BigDecimal("6.0"), "Software Engineer", "Experienced developer"));

        // < 2.4 LPA: Ineligible due to sub-statutory salary floor
        assertFalse(eligibilityGateService.isEligibleFresherJob(0, new BigDecimal("1.8"), "Graduate Engineer Trainee", "Entry level role"));

        // Blacklisted keywords / Scam / BPO: Ineligible
        assertFalse(eligibilityGateService.isEligibleFresherJob(0, new BigDecimal("3.0"), "Customer Support Associate", "Voice process and telecalling"));
        assertFalse(eligibilityGateService.isEligibleFresherJob(0, new BigDecimal("4.0"), "Developer", "Registration fee required for training deposit"));
    }

    @Test
    @DisplayName("8. EligibilityGateService enforces internship stipend matrix")
    public void test8_InternshipStipendMatrix() {
        // Unpaid internship: strictly rejected
        assertFalse(eligibilityGateService.isEligibleInternship(2, true, BigDecimal.ZERO));

        // Short term (<=2mo) WFH: min 5,000/mo
        assertTrue(eligibilityGateService.isEligibleInternship(2, true, new BigDecimal("5000")));
        assertFalse(eligibilityGateService.isEligibleInternship(2, true, new BigDecimal("3000")));

        // Short term (<=2mo) WFO: min 10,000/mo
        assertTrue(eligibilityGateService.isEligibleInternship(2, false, new BigDecimal("10000")));
        assertFalse(eligibilityGateService.isEligibleInternship(2, false, new BigDecimal("7000")));

        // Long term (>2mo): min 8,000/mo
        assertTrue(eligibilityGateService.isEligibleInternship(6, true, new BigDecimal("8000")));
        assertFalse(eligibilityGateService.isEligibleInternship(6, false, new BigDecimal("6000")));
    }
}
