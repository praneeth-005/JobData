package com.itcareerpartner.resume;

import com.itcareerpartner.ai.AiProviderClient;
import com.itcareerpartner.ai.RuleBasedAiClient;
import com.itcareerpartner.resume.dto.ResumeDtos.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.core.io.Resource;
import org.springframework.mock.web.MockMultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class ResumeFeatureTest {

    private ResumeVersionRepository versionRepository;
    private ResumeAnalysisRepository analysisRepository;
    private ResumeStorageService storageService;
    private ResumeParserService parserService;
    private AiProviderClient aiClient;
    private ResumeService resumeService;

    @BeforeEach
    void setUp() {
        versionRepository = Mockito.mock(ResumeVersionRepository.class);
        analysisRepository = Mockito.mock(ResumeAnalysisRepository.class);
        storageService = new ResumeStorageService();
        parserService = new ResumeParserService();
        aiClient = new RuleBasedAiClient();

        resumeService = new ResumeService(
                versionRepository,
                analysisRepository,
                storageService,
                parserService,
                aiClient
        );
    }

    @Test
    @DisplayName("File Validation: Valid PDF with %PDF- header succeeds")
    void testValidatePdf_validPdf_succeeds() {
        byte[] validPdfBytes = "%PDF-1.5 test resume arjun rao".getBytes();
        MockMultipartFile file = new MockMultipartFile("file", "Arjun_Resume.pdf", "application/pdf", validPdfBytes);

        assertDoesNotThrow(() -> storageService.validatePdfFile(file));
    }

    @Test
    @DisplayName("File Validation: Rejects non-PDF extension")
    void testValidatePdf_nonPdfExtension_throwsException() {
        byte[] docBytes = "%PDF- fake doc content".getBytes();
        MockMultipartFile file = new MockMultipartFile("file", "resume.docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", docBytes);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> storageService.validatePdfFile(file));
        assertTrue(ex.getMessage().contains("Only official PDF documents"));
    }

    @Test
    @DisplayName("File Validation: Rejects file with invalid magic bytes (executable spoofed as PDF)")
    void testValidatePdf_invalidMagicBytes_throwsException() {
        byte[] spoofedBytes = "MZ\0\0fake-exe-header".getBytes();
        MockMultipartFile file = new MockMultipartFile("file", "malicious.pdf", "application/pdf", spoofedBytes);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> storageService.validatePdfFile(file));
        assertTrue(ex.getMessage().contains("magic bytes"));
    }

    @Test
    @DisplayName("File Validation: Rejects file exceeding 5MB max limit")
    void testValidatePdf_exceedsMaxSize_throwsException() {
        byte[] bigBytes = new byte[6 * 1024 * 1024];
        bigBytes[0] = '%'; bigBytes[1] = 'P'; bigBytes[2] = 'D'; bigBytes[3] = 'F'; bigBytes[4] = '-';
        MockMultipartFile file = new MockMultipartFile("file", "oversized.pdf", "application/pdf", bigBytes);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> storageService.validatePdfFile(file));
        assertTrue(ex.getMessage().contains("exceeds maximum permitted limit"));
    }

    @Test
    @DisplayName("Private PDF Storage: Writes to private path, computes SHA-256 hash, and retrieves resource")
    void testStorePrivatePdf_storesAndCalculatesSha256() throws IOException {
        byte[] validPdfBytes = "%PDF-1.4 sample content".getBytes();
        MockMultipartFile file = new MockMultipartFile("file", "test_resume.pdf", "application/pdf", validPdfBytes);

        ResumeStorageService.StorageResult result = storageService.storePrivatePdf(file, "user_arjun");

        assertNotNull(result);
        assertTrue(result.storagePath().startsWith("user_arjun/"));
        assertNotNull(result.sha256Hash());
        assertEquals(64, result.sha256Hash().length()); // SHA-256 is 64 hex chars

        Resource resource = storageService.loadAsResource(result.storagePath());
        assertNotNull(resource);
        assertTrue(resource.contentLength() > 0);
    }

    @Test
    @DisplayName("Tika Parsing: Extracts candidate name, technical skills, and 2026 Batch")
    void testParseResumeBytes_extractsNameSkillsAnd2026Batch() {
        String resumeContent = "%PDF-1.4\nArjun Rao\nB.Tech Computer Science 2026 Batch\narjun.rao@example.com\nSkills: Java 21, Spring Boot, PostgreSQL, Docker, Git, JUnit";
        ResumeParserService.ParsedResumeData parsed = parserService.parseResumeBytes(resumeContent.getBytes(), "Arjun_Rao_Resume.pdf");

        assertEquals("Arjun Rao", parsed.candidateName());
        assertEquals("arjun.rao@example.com", parsed.email());
        assertTrue(parsed.graduationBatch().contains("2026"));
        assertTrue(parsed.skills().contains("Java 21") || parsed.skills().contains("Java"));
        assertTrue(parsed.skills().contains("Spring Boot"));
        assertTrue(parsed.skills().contains("PostgreSQL"));
        assertTrue(parsed.atsScore() >= 70);
    }

    @Test
    @DisplayName("Provider-Independent AI: Evaluates matches, missing prerequisites, and honest suggestions")
    void testRuleBasedAiClient_evaluatesMatchesAndHonestSuggestions() {
        String resumeText = "Experienced with Java 21, Spring Boot, PostgreSQL, Docker, Git. Built high throughput backend systems.";
        String jd = "Looking for Graduate Software Consultant with Java, Spring Boot, microservices and automated testing.";

        AiProviderClient.AnalysisResponse response = aiClient.analyzeResumeAgainstJob(resumeText, jd);

        assertNotNull(response);
        assertTrue(response.jobMatchScore() >= 80);
        assertFalse(response.strongMatches().isEmpty());
        assertFalse(response.missingPrerequisites().isEmpty());
        assertFalse(response.honestSuggestions().isEmpty());
        assertTrue(response.honestSuggestions().get(0).recommended().contains("microservices"));
    }

    @Test
    @DisplayName("Resume Service: Uploads new version, increments version number, and sets as current")
    void testResumeService_uploadNewVersion_incrementsVersionAndSetsCurrent() throws IOException {
        byte[] pdfBytes = "%PDF-1.4\nArjun Rao\nB.Tech 2026 Batch\narjun.rao@example.com\nSkills: Java 21, Spring Boot, PostgreSQL, Docker, Git".getBytes();
        MockMultipartFile file = new MockMultipartFile("file", "Arjun_Rao_Resume_v2.2.pdf", "application/pdf", pdfBytes);

        ResumeUploadResponse response = resumeService.uploadResume(file, "user_arjun", "v2.2");

        assertNotNull(response);
        assertEquals("v2.2", response.versionLabel());
        assertTrue(response.atsScore() > 0);

        ResumeVersion current = resumeService.getCurrentResume("user_arjun");
        assertNotNull(current);
        assertEquals("v2.2", current.getVersionLabel());
        assertTrue(current.isCurrent());
    }

    @Test
    @DisplayName("Resume Service: Compares versions v2.0 to v2.1 and computes ATS score and skill deltas")
    void testResumeService_compareVersions_computesDeltaAndAddedSkills() {
        VersionDiffResponse diff = resumeService.compareVersions("res_v20", "res_v21");

        assertNotNull(diff);
        assertEquals("v2.0", diff.fromVersion().getVersionLabel());
        assertEquals("v2.1", diff.toVersion().getVersionLabel());
        assertEquals(7, diff.atsScoreDelta()); // 91 - 84 = +7
        assertTrue(diff.addedSkills().contains("Apache Kafka") || diff.addedSkills().contains("JUnit 5"));
        assertFalse(diff.removedWeakPhrases().isEmpty());
    }

    @Test
    @DisplayName("Resume Service: Job matching delivers confirmed line proofs and match factors")
    void testResumeService_getMultiJobMatch_providesEvidenceProofs() {
        MultiJobMatchResponse matchResponse = resumeService.getMultiJobMatch("res_v21");

        assertNotNull(matchResponse);
        assertFalse(matchResponse.evaluatedJobs().isEmpty());

        JobMatchItem topMatch = matchResponse.evaluatedJobs().get(0);
        assertEquals("Thoughtworks", topMatch.company());
        assertEquals(94, topMatch.matchScore());
        assertFalse(topMatch.confirmedEvidence().isEmpty());

        EvidenceItem firstEvidence = topMatch.confirmedEvidence().get(0);
        assertEquals("CONFIRMED", firstEvidence.getStatus());
        assertTrue(firstEvidence.getLineProof().contains("Line"));
        assertFalse(topMatch.matchFactors().isEmpty());
    }
}
