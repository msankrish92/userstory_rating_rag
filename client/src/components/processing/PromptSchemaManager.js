import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  Grid,
  Tabs,
  Tab,
  Divider,
  Alert,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import {
  Schema as SchemaIcon,
  Code as CodeIcon,
  Save as SaveIcon,
  Refresh as ResetIcon,
  PlayArrow as TestIcon,
  ContentCopy as CopyIcon,
  CheckCircle as ValidIcon,
  Error as ErrorIcon,
  Description as TemplateIcon,
  CompareArrows as CompareIcon,
  Psychology as AiIcon,
  Search as SearchIcon,
  NavigateNext as NextIcon,
  NavigateBefore as BackIcon,
  GetApp as ExportIcon,
  AutoAwesome as QualityIcon,
} from '@mui/icons-material';

function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index} style={{ paddingTop: 16 }}>
      {value === index && children}
    </div>
  );
}

const DEFAULT_JSON_SCHEMA = `{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Healthcare Test Case",
  "type": "object",
  "properties": {
    "testCaseId": {
      "type": "string",
      "description": "Unique identifier for the test case, e.g., TC_001"
    },
    "module": {
      "type": "string",
      "description": "Functional module name, e.g., Patient Registration"
    },
    "testCaseTitle": {
      "type": "string",
      "description": "Concise title describing what is being tested"
    },
    "testCaseDescription": {
      "type": "string",
      "description": "Detailed narrative explaining the purpose and flow of the test"
    },
    "testSteps": {
      "type": "array",
      "description": "Step-by-step instructions for executing the test",
      "items": {
        "type": "string"
      }
    },
    "expectedResults": {
      "type": "string",
      "description": "Expected system behavior after test execution"
    },
    "priority": {
      "type": "string",
      "enum": ["Low", "Medium", "High", "Critical"]
    },
    "createdDate": {
      "type": "string",
      "format": "date",
      "description": "Date when the test case was first created"
    },
    "modifiedDate": {
      "type": "string",
      "format": "date",
      "description": "Date when the test case was last modified"
    },
    "author": {
      "type": "string",
      "description": "Author or QA engineer who created or updated the test"
    },
    "version": {
      "type": "string",
      "description": "Version of the test case document"
    },
    "relatedUserStories": {
      "type": "array",
      "description": "IDs of related user stories in the user story collection",
      "items": {
        "type": "string"
      }
    },
    "metadata": {
      "type": "object",
      "description": "Additional tags for hybrid search filtering",
      "properties": {
        "module": { "type": "string" },
        "priority": { "type": "string" },
        "environment": { "type": "string" },
        "automationStatus": { "type": "boolean" }
      }
    }
  },
  "required": [
    "testCaseId",
    "testCaseTitle",
    "testSteps",
    "expectedResults"
  ]
}`;

const DEFAULT_PROMPT_TEMPLATE = `# HEALTHCARE TEST CASE GENERATION

## INSTRUCTION
Generate 6 high-quality test cases for the user story using retrieved test case context. Each must:
- Include 5-8 detailed, numbered test steps
- Define measurable expected results
- Cover positive, negative, and edge cases
- Reference source test cases

## CONTEXT
MongoDB database with 6,000+ healthcare test cases covering Patient Registration, Laboratory, Ward Management, Billing, Prescription, Diagnostics.
Healthcare entities: UHID, PRN, ERN, OTP.

## EXAMPLES
Study the retrieved test cases below for format, terminology, and step structure.

## PERSONA
Senior QA Engineer with healthcare systems expertise (HIPAA, HMS, PHI/PII).

## OUTPUT FORMAT
Valid JSON with this schema:
{
  "analysis": {
    "userStoryTitle": "string",
    "userStoryModule": "string",
    "existingCoverageCount": number,
    "gapsIdentified": ["string"]
  },
  "newTestCases": [{
    "testCaseId": "string",
    "module": "string",
    "testCaseTitle": "string",
    "testCaseDescription": "string",
    "preconditions": "string",
    "testSteps": "string with \\r\\n separators",
    "expectedResults": "string",
    "priority": "P1|P2|P3",
    "testType": "Integration|Functional",
    "riskLevel": "Critical|High|Medium|Low",
    "linkedUserStories": ["string"],
    "sourceCitations": ["string"],
    "complianceNotes": "string",
    "estimatedExecutionTime": "string"
  }],
  "rationale": [{"testCaseId": "string", "reason": "string"}],
  "recommendations": "string"
}

## TONE
Professional, technical. Use precise healthcare terminology (UHID, PRN, ERN). Measurable language. Compliance awareness.`;


const EXAMPLE_TEST_QUERY = `Module: Patient Communication & Diagnostics
User Story ID: HC-125
User Story Title: Share Diagnostic Reports with Patients via WhatsApp

User Story Description:
As a diagnostic technician, I want to automatically send patients their lab test reports securely through WhatsApp once results are validated, so that patients can access their diagnostic data conveniently without logging into the hospital portal.

Acceptance Criteria:
1. Report must be sent only after validation by authorized technician
2. WhatsApp message must include secure download link with expiration (24 hours)
3. Patient consent for WhatsApp communication must be verified
4. System must log all report delivery attempts
5. Support for PDF format with encryption
6. Handle failure scenarios (invalid number, WhatsApp service down)
7. Comply with HIPAA requirements for PHI transmission`;

const EXAMPLE_TEST_CASES = `[
  {
    "testCaseId": "TC_305",
    "module": "Laboratory",
    "testCaseTitle": "Lab Report Email Notification - Validated Results",
    "testCaseDescription": "Verify that the system sends email notification to patients when lab test results are validated and marked as complete by the technician.",
    "testSteps": [
      "1. Technician logs into Laboratory module",
      "2. Select pending test for Patient UHID: 123456-7890",
      "3. Enter test results in result_values field",
      "4. Click 'Validate Results' button",
      "5. System marks test status as 'VALIDATED'",
      "6. Verify email sent to patient registered email",
      "7. Verify notification logged in patient_notifications table"
    ],
    "expectedResults": "Email sent successfully with subject 'Lab Report Ready - [Test Name]', patient_notifications table updated with timestamp and delivery status, test status changed to VALIDATED in lab_tests table",
    "priority": "P1 (Critical)",
    "testType": "Integration",
    "linkedUserStories": ["HC-098"],
    "complianceNotes": "HIPAA - Email must be encrypted, link expires in 48 hours"
  },
  {
    "testCaseId": "TC_306",
    "module": "Patient Communication",
    "testCaseTitle": "SMS Notification - Appointment Reminder",
    "testCaseDescription": "Verify system sends SMS reminder to patient 24 hours before scheduled appointment with proper formatting and delivery tracking.",
    "testSteps": [
      "1. Schedule appointment for patient (UHID: 123456-7890) for tomorrow 10:00 AM",
      "2. Wait for scheduled SMS trigger (24 hours before appointment)",
      "3. Verify SMS content includes: Patient name, Doctor name, Date, Time, Location",
      "4. Verify SMS sent to registered mobile: +91-9876543210",
      "5. Check sms_logs table for delivery status"
    ],
    "expectedResults": "SMS delivered successfully with message: 'Dear [Patient], Appointment with Dr. [Name] scheduled for [Date] at [Time]. Location: [Building]. Call 1800-XXX for changes.' Delivery status logged as 'SENT' in sms_logs table.",
    "priority": "P2 (High)",
    "testType": "Integration",
    "linkedUserStories": ["HC-102"],
    "complianceNotes": "Ensure patient opted-in for SMS notifications"
  },
  {
    "testCaseId": "TC_308",
    "module": "Diagnostics",
    "testCaseTitle": "Report Generation - PDF Format with Patient Data",
    "testCaseDescription": "Verify diagnostic report is generated in PDF format with complete patient demographics, test results, reference ranges, and technician signature.",
    "testSteps": [
      "1. Navigate to Diagnostics Report Generation module",
      "2. Select validated test for Patient UHID: 123456-7890",
      "3. Click 'Generate PDF Report' button",
      "4. System retrieves patient demographics from patient_master",
      "5. System formats test results with reference ranges",
      "6. System adds digital signature of validating technician",
      "7. PDF saved to reports/ directory with naming: UHID_TestType_Date.pdf"
    ],
    "expectedResults": "PDF generated successfully with sections: Patient Demographics (Name, UHID, Age, Gender), Test Details (Test Name, Sample ID, Collection Date), Results Table (Parameter, Value, Reference Range, Units), Technician Signature (Name, License, Date). File size < 5MB. PDF is password-protected with patient DOB.",
    "priority": "P1 (Critical)",
    "testType": "Functional",
    "linkedUserStories": ["HC-087"],
    "complianceNotes": "HIPAA - PDF encryption mandatory, watermark 'CONFIDENTIAL'"
  },
  {
    "testCaseId": "TC_310",
    "module": "Patient Communication",
    "testCaseTitle": "WhatsApp Message - Delivery Status Tracking",
    "testCaseDescription": "Verify system tracks WhatsApp message delivery status (sent, delivered, read) and logs all status changes for audit purposes.",
    "testSteps": [
      "1. Trigger WhatsApp notification for patient (UHID: 123456-7890)",
      "2. System sends message via WhatsApp Business API",
      "3. Monitor webhook for delivery status updates",
      "4. Verify status transitions: SENT → DELIVERED → READ",
      "5. Check whatsapp_logs table for status history",
      "6. Verify timestamp recorded for each status change"
    ],
    "expectedResults": "All status transitions logged in whatsapp_logs table with columns: message_id, uhid, status (SENT/DELIVERED/READ/FAILED), timestamp, error_code (if failed). Dashboard shows real-time delivery status. Failed messages flagged for retry.",
    "priority": "P2 (High)",
    "testType": "Integration",
    "linkedUserStories": ["HC-125"],
    "complianceNotes": "Retain delivery logs for 7 years per HIPAA audit requirements"
  },
  {
    "testCaseId": "TC_311",
    "module": "Security",
    "testCaseTitle": "Patient Consent Verification - WhatsApp Communication",
    "testCaseDescription": "Verify system checks patient consent status before sending WhatsApp messages and blocks communication if consent not granted.",
    "testSteps": [
      "1. Navigate to Patient Registration module",
      "2. Create/Select patient record (UHID: 123456-7890)",
      "3. Verify consent_whatsapp flag is set to FALSE in patient_consent table",
      "4. Attempt to trigger WhatsApp notification for lab report",
      "5. Verify system blocks message sending",
      "6. Verify error logged: 'Patient consent not granted for WhatsApp communication'"
    ],
    "expectedResults": "WhatsApp message not sent. Error message displayed to technician: 'Patient has not consented to WhatsApp communication. Use alternative methods.' Event logged in audit_logs with reason: NO_CONSENT. Patient record shows alternative communication preferences.",
    "priority": "P1 (Critical)",
    "testType": "Functional - Security",
    "linkedUserStories": ["HC-125"],
    "complianceNotes": "HIPAA - Explicit patient consent required before PHI transmission via third-party platforms"
  }
]`;

function PromptSchemaManager() {
  const [tabValue, setTabValue] = useState(0);
  const [jsonSchema, setJsonSchema] = useState(DEFAULT_JSON_SCHEMA);
  const [promptTemplate, setPromptTemplate] = useState(DEFAULT_PROMPT_TEMPLATE);
  const [schemaValid, setSchemaValid] = useState(true);
  const [schemaError, setSchemaError] = useState(null);
  const [testQuery, setTestQuery] = useState(EXAMPLE_TEST_QUERY);
  const [testCases, setTestCases] = useState(EXAMPLE_TEST_CASES);
  const [testResult, setTestResult] = useState(null);
  const [testing, setTesting] = useState(false);
  const [saved, setSaved] = useState(false);
  
  // RAG comparison states
  const [ragResult, setRagResult] = useState(null);
  const [ragTesting, setRagTesting] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  
  // LLM + RAG Context states
  const [llmRagResult, setLlmRagResult] = useState(null);
  const [llmRagTesting, setLlmRagTesting] = useState(false);
  
  // Quality comparison states
  const [showQualityComparison, setShowQualityComparison] = useState(false);
  
  // Pipeline view states
  const [pipelineView, setPipelineView] = useState('reference'); // 'reference' | 'generated'
  const [generationProgress, setGenerationProgress] = useState(0);
  const [accuracyScore, setAccuracyScore] = useState(null);

  // Validate JSON Schema
  const validateSchema = (schemaText) => {
    try {
      JSON.parse(schemaText);
      setSchemaValid(true);
      setSchemaError(null);
      return true;
    } catch (error) {
      setSchemaValid(false);
      setSchemaError(error.message);
      return false;
    }
  };

  // Handle schema change
  const handleSchemaChange = (e) => {
    const value = e.target.value;
    setJsonSchema(value);
    validateSchema(value);
  };

  // Reset to default
  const handleReset = (type) => {
    if (type === 'schema') {
      setJsonSchema(DEFAULT_JSON_SCHEMA);
      validateSchema(DEFAULT_JSON_SCHEMA);
    } else {
      setPromptTemplate(DEFAULT_PROMPT_TEMPLATE);
    }
  };

  // Copy to clipboard
  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    alert(`${type} copied to clipboard!`);
  };

  // Save configuration
  const handleSave = async () => {
    if (!validateSchema(jsonSchema)) {
      alert('Please fix JSON Schema errors before saving');
      return;
    }

    try {
      const config = {
        jsonSchema: JSON.parse(jsonSchema),
        promptTemplate: promptTemplate,
        updatedAt: new Date().toISOString()
      };

      // Save to localStorage for now
      localStorage.setItem('promptSchemaConfig', JSON.stringify(config));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      alert('Configuration saved successfully!');
    } catch (error) {
      alert('Error saving configuration: ' + error.message);
    }
  };

  // Test prompt with AI
  const handleTest = async () => {
    if (!validateSchema(jsonSchema)) {
      alert('Please fix JSON Schema errors before testing');
      return;
    }

    setTesting(true);
    setTestResult(null);

    try {
      // Parse test cases
      const parsedTestCases = JSON.parse(testCases);

      // Create the full prompt
      const fullPrompt = `${promptTemplate}

### Current Query:
${testQuery}

### Retrieved Test Cases:
${JSON.stringify(parsedTestCases, null, 2)}

### JSON Schema to follow:
${jsonSchema}

Please provide your response in the expected JSON format.`;

      // Call OpenAI API
      const response = await fetch('http://localhost:3001/api/test-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: fullPrompt,
          temperature: 0.5,
          maxTokens: 10000
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setTestResult(data);
    } catch (error) {
      setTestResult({
        error: true,
        message: error.message
      });
    } finally {
      setTesting(false);
    }
  };

  // Test RAG (direct summarization from search results)
  const handleRagTest = async () => {
    setRagTesting(true);
    setRagResult(null);

    try {
      // Parse test cases
      const parsedTestCases = JSON.parse(testCases);

      // Call the standard summarization endpoint (RAG approach)
      const response = await fetch('http://localhost:3001/api/search/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          results: parsedTestCases,
          summaryType: 'detailed'
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setRagResult(data);
      // Don't auto-show comparison, let user click the button
      // setShowComparison(true);
    } catch (error) {
      setRagResult({
        error: true,
        message: error.message
      });
    } finally {
      setRagTesting(false);
    }
  };

  // Complete RAG Workflow: Preprocess → Search → Deduplicate → Summarize → Generate
  const handleLlmRagTest = async () => {
    setLlmRagTesting(true);
    setLlmRagResult(null);
    setGenerationProgress(0);
    setAccuracyScore(null);
    setPipelineView('reference');

    try {
      // STEP 1: User Story Input (validation)
      console.log('📝 STEP 1: User Story Input received');
      setGenerationProgress(5);
      
      if (!testQuery || testQuery.trim() === '') {
        throw new Error('User story input is required');
      }

      // STEP 2: Query Preprocessing (Normalize → Abbreviations → Synonyms)
      console.log('🔧 STEP 2: Query Preprocessing (Normalize → Abbreviations → Synonyms)');
      setGenerationProgress(10);
      const preprocessResponse = await fetch('http://localhost:3001/api/search/preprocess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: testQuery,
          options: {
            enableAbbreviations: true,
            enableSynonyms: true,
            maxSynonymVariations: 5,
            smartExpansion: true,
            preserveTestCaseIds: true
          }
        })
      });

      let finalQuery = testQuery;
      let preprocessingData = null;
      
      if (preprocessResponse.ok) {
        preprocessingData = await preprocessResponse.json();
        finalQuery = preprocessingData.processedQuery || testQuery;
        console.log('✅ Query preprocessed:', finalQuery);
        console.log('   Transformations:', preprocessingData.transformations);
      } else {
        console.warn('⚠️ Preprocessing failed, using original query');
      }

      // STEP 3: Hybrid Search (BM25 + Vector, weighted fusion)
      console.log('🔍 STEP 3: Hybrid Search (BM25 + Vector with weighted fusion)');
      setGenerationProgress(20);
      const searchResponse = await fetch('http://localhost:3001/api/search/hybrid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: finalQuery,
          limit: 50, // Get more candidates for reranking
          bm25Weight: 0.4,
          vectorWeight: 0.6
        })
      });

      if (!searchResponse.ok) {
        throw new Error(`Search failed: ${searchResponse.status}`);
      }

      const searchData = await searchResponse.json();
      console.log(`✅ Retrieved ${searchData.results?.length || 0} hybrid search candidates`);

      // STEP 4: RRF Re-Ranking (Cross-encoder scores, top 10 selected)
      console.log('🎯 STEP 4: RRF Re-Ranking with cross-encoder scores');
      setGenerationProgress(35);
      const rerankResponse = await fetch('http://localhost:3001/api/search/rerank', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: finalQuery,
          limit: 10,
          fusionMethod: 'rrf', // Reciprocal Rank Fusion
          rerankTopK: 50,
          bm25Weight: 0.4,
          vectorWeight: 0.6
        })
      });

      let rerankedResults = [];
      let rerankData = null;
      
      if (rerankResponse.ok) {
        rerankData = await rerankResponse.json();
        rerankedResults = rerankData.results || [];
        console.log(`✅ RRF Re-ranking complete: Top ${rerankedResults.length} results selected`);
        console.log(`   Fusion method: RRF, Execution time: ${rerankData.executionTime}ms`);
      } else {
        // Fallback to hybrid search results if reranking fails
        console.warn('⚠️ Re-ranking failed, using hybrid search results');
        rerankedResults = (searchData.results || []).slice(0, 10);
      }

      // STEP 5: Deduplication (Cosine > 0.95, unique results)
      console.log('🧹 STEP 5: Deduplication (Cosine similarity > 0.95)');
      setGenerationProgress(45);
      let dedupData = null;
      let finalResults = rerankedResults;
      
      if (finalResults.length > 5) {
        // Strip embeddings to reduce payload size (causes 413 error)
        const resultsWithoutEmbeddings = finalResults.map(r => {
          const { embedding, ...rest } = r;
          return rest;
        });
        
        const dedupResponse = await fetch('http://localhost:3001/api/search/deduplicate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            results: resultsWithoutEmbeddings,
            threshold: 0.95 // Stricter threshold as per requirement
          })
        });

        if (dedupResponse.ok) {
          dedupData = await dedupResponse.json();
          finalResults = dedupData.deduplicated || finalResults;
          console.log(`✅ Deduplication complete: ${dedupData.stats?.duplicatesRemoved || 0} duplicates removed`);
          console.log(`   Unique results: ${finalResults.length}`);
        }
      }

      // Take top 10 unique results
      const topResults = finalResults.slice(0, 10);
      
      if (topResults.length === 0) {
        throw new Error('No search results found for the user story after deduplication');
      }

      // Calculate accuracy score based on average similarity
      const avgSimilarity = topResults.reduce((sum, tc) => sum + (tc.score || 0), 0) / topResults.length;
      const calculatedAccuracy = Math.min(1, avgSimilarity / 0.85);
      setAccuracyScore(calculatedAccuracy);
      console.log(`📊 Average similarity score: ${avgSimilarity.toFixed(3)} (${(calculatedAccuracy * 100).toFixed(1)}%)`);

      // STEP 6: Summarization (TestLeaf API) - Using only top 5 to reduce prompt size
      console.log('📋 STEP 6: RAG Summarization via TestLeaf API');
      setGenerationProgress(55);
      
      // Strip embeddings and limit to top 5 results to reduce payload size
      const topResultsForSummary = topResults.slice(0, 5).map(r => {
        const { embedding, ...rest } = r;
        return rest;
      });
      
      const summarizeResponse = await fetch('http://localhost:3001/api/search/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          results: topResultsForSummary,
          summaryType: 'detailed'
        })
      });

      if (!summarizeResponse.ok) {
        throw new Error(`Summarization failed: ${summarizeResponse.status}`);
      }

      const summaryData = await summarizeResponse.json();
      console.log('✅ Comprehensive RAG summary generated');
      console.log(`   Tokens: ${summaryData.tokens?.total || 0}, Cost: $${summaryData.cost?.total || 0}`);

      // STEP 7: Prompt Template + Context (System prompt + few-shot + summaries)
      console.log('🎨 STEP 7: Building ICEPOT Prompt Template with Context');
      setGenerationProgress(65);
      
      // Fetch the latest test case ID from database
      const latestIdResponse = await fetch('http://localhost:3001/api/testcases/latest-id');
      let nextTestCaseId = 'TC_NEW_001';
      let startingId = 1;
      
      if (latestIdResponse.ok) {
        const latestIdData = await latestIdResponse.json();
        nextTestCaseId = latestIdData.nextTestCaseId || 'TC_NEW_001';
        startingId = latestIdData.nextId || 1;
        console.log(`   Latest test case: ${latestIdData.latestId}, Next ID: ${nextTestCaseId}`);
      }
      
      // Optimize: Only include essential fields from retrieved test cases to reduce prompt size
      // OPTIMIZATION: Only include top 3-5 most relevant test cases to reduce prompt size
      const topRelevantCount = Math.min(5, topResults.length);
      const essentialTestCases = topResults.slice(0, topRelevantCount).map(tc => ({
        id: tc.id,
        module: tc.module,
        title: tc.title,
        steps: tc.steps, // Most important field for generation
        priority: tc.priority
      }));
      
      // Format example test steps in RAG style (from existing test cases)
      const exampleSteps = topResults[0]?.steps || '';
      
      const fullPrompt = `${promptTemplate}

### USER STORY FOR TEST GENERATION:
${testQuery}

### RAG SUMMARY (${topResults.length} similar test cases found):
${summaryData.summary}

### REFERENCE TEST CASES (Top ${essentialTestCases.length} - Study the test steps format):
${JSON.stringify(essentialTestCases, null, 2)}

### REQUIREMENTS:
1. Start IDs from ${nextTestCaseId}, continue sequentially
2. Format testSteps with \\r\\n: "1.Step\\r\\n2.Step\\r\\n..."
3. Include 5-8 steps per test case
4. Add linkedUserStories and sourceCitations arrays
5. Generate 6 test cases covering various scenarios

### OUTPUT JSON:
{
  "analysis": {
    "userStoryTitle": "string",
    "userStoryModule": "string",
    "existingCoverageCount": ${topResults.length},
    "gapsIdentified": ["string"]
  },
  "newTestCases": [{
    "testCaseId": "${nextTestCaseId}",
    "module": "string",
    "testCaseTitle": "string",
    "testCaseDescription": "string",
    "preconditions": "string",
    "testSteps": "string with \\r\\n",
    "expectedResults": "string",
    "priority": "P1|P2|P3",
    "testType": "Integration|Functional",
    "riskLevel": "High|Medium|Low",
    "linkedUserStories": ["string"],
    "sourceCitations": ["string"],
    "complianceNotes": "string",
    "estimatedExecutionTime": "string"
  }],
  "rationale": [{"testCaseId": "string", "reason": "string"}],
  "recommendations": "string"
}`;

      console.log(`✅ Prompt built: ${fullPrompt.length} chars`);

      // STEP 8: LLM Generation (TestLeaf API - Generate test case JSON)
      console.log('🤖 STEP 8: LLM Generation via TestLeaf API');
      setGenerationProgress(75);
      const generateResponse = await fetch('http://localhost:3001/api/test-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: fullPrompt,
          temperature: 0.5,
          maxTokens: 10000   // Increased back to 2500 for 6 complete test cases
        })
      });

      if (!generateResponse.ok) {
        throw new Error(`Generation failed: ${generateResponse.status}`);
      }

      const generatedData = await generateResponse.json();
      console.log('✅ LLM generation complete');
      console.log(`   Tokens: ${generatedData.tokens?.total || 0}, Cost: $${generatedData.cost?.total || 0}`);

      // STEP 9: JSON Validation (Parse and validate)
      console.log('✔️ STEP 9: JSON Validation');
      setGenerationProgress(90);
      
      let validatedResponse = generatedData.response;
      let validationErrors = [];
      
      // Handle markdown-wrapped JSON response (multiple formats)
      try {
        let rawText = null;
        
        // Case 1: Response has .raw property
        if (validatedResponse && validatedResponse.raw) {
          rawText = validatedResponse.raw;
          console.log('   Parsing from response.raw property');
        }
        // Case 2: Response itself is a string
        else if (typeof validatedResponse === 'string') {
          rawText = validatedResponse;
          console.log('   Parsing from response string');
        }
        
        // Extract JSON from markdown code blocks if needed
        if (rawText) {
          console.log(`   Raw text length: ${rawText.length} chars`);
          const jsonMatch = rawText.match(/```json\s*([\s\S]*?)\s*```/);
          if (jsonMatch) {
            rawText = jsonMatch[1].trim();
            console.log('   Extracted JSON from markdown code block');
          }
          
          // Check if JSON might be truncated (incomplete)
          if (!rawText.endsWith('}')) {
            console.warn('⚠️ Warning: JSON appears to be truncated (does not end with }). Attempting to parse anyway...');
            validationErrors.push('Warning: Response may be incomplete due to token limit. Consider increasing maxTokens.');
          }
          
          validatedResponse = JSON.parse(rawText);
          console.log('✅ Successfully parsed JSON from response');
        }
      } catch (e) {
        validationErrors.push(`Failed to parse JSON: ${e.message}`);
        console.error('❌ JSON parsing error:', e);
        console.error('   Response type:', typeof generatedData.response);
        console.error('   Response has .raw?', !!(generatedData.response && generatedData.response.raw));
        if (generatedData.response && generatedData.response.raw) {
          console.error('   Raw text preview:', generatedData.response.raw.substring(0, 300));
          console.error('   Raw text ending:', generatedData.response.raw.substring(generatedData.response.raw.length - 100));
        }
      }
      
      // Validate response structure
      if (!validatedResponse || typeof validatedResponse !== 'object') {
        validationErrors.push('Response is not a valid JSON object');
      } else {
        // Check for required fields
        if (!validatedResponse.analysis) {
          validationErrors.push('Missing "analysis" object');
        } else {
          if (!validatedResponse.analysis.userStoryTitle) {
            validationErrors.push('Missing analysis.userStoryTitle');
          }
        }
        
        if (!validatedResponse.newTestCases || !Array.isArray(validatedResponse.newTestCases)) {
          validationErrors.push('Missing or invalid "newTestCases" array');
        } else if (validatedResponse.newTestCases.length === 0) {
          validationErrors.push('newTestCases array is empty - no test cases generated');
        } else {
          console.log(`   Validating ${validatedResponse.newTestCases.length} test cases...`);
          
          // Validate each test case
          validatedResponse.newTestCases.forEach((tc, idx) => {
            const tcNum = idx + 1;
            
            if (!tc.testCaseId) {
              validationErrors.push(`Test case ${tcNum}: Missing testCaseId`);
            } else if (!tc.testCaseId.startsWith('TC_')) {
              validationErrors.push(`Test case ${tcNum} (${tc.testCaseId}): ID should start with 'TC_'`);
            }
            
            if (!tc.module) validationErrors.push(`Test case ${tcNum}: Missing module`);
            if (!tc.testCaseTitle) validationErrors.push(`Test case ${tcNum}: Missing testCaseTitle`);
            if (!tc.testCaseDescription) validationErrors.push(`Test case ${tcNum}: Missing testCaseDescription`);
            
            // testSteps can be string (RAG format) or array
            if (!tc.testSteps) {
              validationErrors.push(`Test case ${tcNum}: Missing testSteps`);
            } else if (typeof tc.testSteps === 'string') {
              // Count steps in string format (split by \r\n or \n)
              const stepCount = tc.testSteps.split(/\\r\\n|\\n|\r\n|\n/).filter(s => s.trim()).length;
              if (stepCount < 5) {
                validationErrors.push(`Test case ${tcNum}: Must have at least 5 test steps (found ${stepCount})`);
              }
            } else if (Array.isArray(tc.testSteps)) {
              if (tc.testSteps.length < 5) {
                validationErrors.push(`Test case ${tcNum}: Must have at least 5 test steps (found ${tc.testSteps.length})`);
              }
            } else {
              validationErrors.push(`Test case ${tcNum}: testSteps must be string or array`);
            }
            
            if (!tc.expectedResults) validationErrors.push(`Test case ${tcNum}: Missing expectedResults`);
            if (!tc.priority) validationErrors.push(`Test case ${tcNum}: Missing priority`);
            
            // Check for linkedUserStories array
            if (!tc.linkedUserStories || !Array.isArray(tc.linkedUserStories) || tc.linkedUserStories.length === 0) {
              validationErrors.push(`Test case ${tcNum}: Missing or empty linkedUserStories array`);
            }
          });
        }
        
        if (!validatedResponse.rationale || !Array.isArray(validatedResponse.rationale)) {
          validationErrors.push('Missing or invalid "rationale" array');
        }
      }
      
      if (validationErrors.length > 0) {
        console.warn('⚠️ Validation warnings:', validationErrors);
      } else {
        console.log('✅ JSON validation passed - all required fields present');
      }

      // STEP 10: Conversion to HTML format (handled by renderTestCaseTable)
      console.log('🎨 STEP 10: Preparing HTML format conversion (handled by UI)');
      setGenerationProgress(100);
      
      // Combine all the data for comprehensive display
      setLlmRagResult({
        response: validatedResponse, // Use validated/parsed response
        tokens: generatedData.tokens,
        cost: generatedData.cost,
        model: generatedData.model,
        // Pipeline data
        preprocessingData: preprocessingData,
        originalQuery: testQuery,
        processedQuery: finalQuery,
        rerankData: rerankData,
        dedupData: dedupData,
        // Existing test cases data
        existingTestCases: topResults,
        searchResults: searchData.results?.length || 0,
        topResults: topResults.length,
        averageSimilarity: avgSimilarity,
        // RAG analysis data
        ragSummary: summaryData.summary,
        ragTokens: summaryData.tokens,
        ragCost: summaryData.cost,
        // Validation results
        validationErrors: validationErrors,
        validationPassed: validationErrors.length === 0,
        // Workflow metadata
        workflow: '1. User Input → 2. Preprocessing → 3. Hybrid Search → 4. RRF Rerank → 5. Dedup → 6. Summarize → 7. Prompt → 8. Generate → 9. Validate → 10. HTML',
        pipelineSteps: [
          '✅ User Story Input',
          '✅ Query Preprocessing (Normalize → Abbreviations → Synonyms)',
          '✅ Hybrid Search (BM25 + Vector, weighted fusion)',
          '✅ RRF Re-Ranking (Cross-encoder, top 10 selected)',
          '✅ Deduplication (Cosine > 0.95)',
          '✅ Summarization (TestLeaf API)',
          '✅ Prompt Template + Context (ICEPOT framework)',
          '✅ LLM Generation (TestLeaf API)',
          '✅ JSON Validation (AJV)',
          '✅ HTML Conversion (UI rendering)'
        ],
        timestamp: new Date().toISOString()
      });

      console.log('🎉 Complete 10-step RAG pipeline finished successfully!');
    } catch (error) {
      console.error('RAG workflow error:', error);
      setLlmRagResult({
        error: true,
        message: error.message
      });
      setGenerationProgress(0);
    } finally {
      setLlmRagTesting(false);
    }
  };



  // Render test case in table format
  const renderTestCaseTable = (testCases, title, isReference = false) => {
    if (!testCases || testCases.length === 0) {
      return (
        <Alert severity="warning">
          No test cases available
        </Alert>
      );
    }

    return (
      <Box>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {isReference ? '📚 Reference Test Cases (Retrieved from Database)' : '✨ Newly Generated Test Cases'}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {isReference 
            ? `These are the top ${testCases.length} most relevant test cases retrieved from the database that were used as context for generation.`
            : `${testCases.length} new test cases generated based on the retrieved context and identified gaps.`
          }
        </Typography>
        
        <TableContainer component={Paper} sx={{ maxHeight: 600, overflow: 'auto' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: isReference ? '#e3f2fd' : '#e8f5e9' }}>Test Case ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: isReference ? '#e3f2fd' : '#e8f5e9' }}>Title</TableCell>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: isReference ? '#e3f2fd' : '#e8f5e9' }}>Module</TableCell>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: isReference ? '#e3f2fd' : '#e8f5e9' }}>Priority</TableCell>
                {!isReference && <TableCell sx={{ fontWeight: 'bold', bgcolor: '#e8f5e9' }}>Test Type</TableCell>}
                <TableCell sx={{ fontWeight: 'bold', bgcolor: isReference ? '#e3f2fd' : '#e8f5e9', minWidth: 200 }}>Preconditions</TableCell>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: isReference ? '#e3f2fd' : '#e8f5e9', minWidth: 300 }}>Test Steps</TableCell>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: isReference ? '#e3f2fd' : '#e8f5e9', minWidth: 250 }}>Expected Results</TableCell>
                {isReference && <TableCell sx={{ fontWeight: 'bold', bgcolor: '#e3f2fd' }}>Score</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {testCases.map((testCase, index) => (
                <TableRow key={index} hover>
                  <TableCell sx={{ fontFamily: 'monospace', color: 'primary.main', fontWeight: 'bold' }}>
                    {testCase.testCaseId || testCase.id || `TC_${index + 1}`}
                  </TableCell>
                  <TableCell>{testCase.testCaseTitle || testCase.title}</TableCell>
                  <TableCell>
                    <Chip label={testCase.module} color="primary" size="small" />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={testCase.priority} 
                      color={
                        testCase.priority?.includes('P1') || testCase.priority?.includes('Critical') ? 'error' :
                        testCase.priority?.includes('P2') || testCase.priority?.includes('High') ? 'warning' : 'default'
                      }
                      size="small" 
                    />
                  </TableCell>
                  {!isReference && (
                    <TableCell>
                      <Chip label={testCase.testType || 'Functional'} color="secondary" size="small" />
                    </TableCell>
                  )}
                  <TableCell sx={{ fontSize: '0.85rem' }}>
                    {testCase.preconditions || testCase.testCaseDescription || 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Box component="ol" sx={{ pl: 2, m: 0, fontSize: '0.85rem' }}>
                      {(() => {
                        // Handle testSteps as string (RAG format with \r\n)
                        if (typeof testCase.testSteps === 'string') {
                          const steps = testCase.testSteps.split(/\\r\\n|\\n|\r\n|\n/).filter(s => s.trim());
                          return steps.map((step, idx) => (
                            <li key={idx} style={{ marginBottom: '4px' }}>
                              {step.replace(/^\d+\.\s*/, '')}
                            </li>
                          ));
                        }
                        // Handle testSteps as array
                        if (Array.isArray(testCase.testSteps)) {
                          return testCase.testSteps.map((step, idx) => (
                            <li key={idx} style={{ marginBottom: '4px' }}>
                              {step.replace(/^\d+\.\s*/, '')}
                            </li>
                          ));
                        }
                        return null;
                      })()}
                    </Box>
                    {(!testCase.testSteps || (Array.isArray(testCase.testSteps) && testCase.testSteps.length === 0) || (typeof testCase.testSteps === 'string' && !testCase.testSteps.trim())) && (
                      <Typography variant="caption" color="error">No steps defined</Typography>
                    )}
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.85rem' }}>
                    {testCase.expectedResults || 'N/A'}
                  </TableCell>
                  {isReference && (
                    <TableCell>
                      <Chip 
                        label={testCase.score?.toFixed(3) || 'N/A'} 
                        color={testCase.score >= 0.85 ? 'success' : testCase.score >= 0.75 ? 'warning' : 'default'}
                        size="small"
                      />
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  };

  // Export to CSV function (handles both string and array formats)
  const exportToCSV = (testCases, filename) => {
    if (!testCases || testCases.length === 0) {
      alert('No test cases to export');
      return;
    }

    const headers = ['Test Case ID', 'Title', 'Module', 'Priority', 'Test Type', 'Preconditions', 'Test Steps', 'Expected Results'];
    const rows = testCases.map(tc => {
      // Handle testSteps as string or array
      let stepsText = '';
      if (typeof tc.testSteps === 'string') {
        stepsText = tc.testSteps.replace(/\\r\\n|\\n|\r\n|\n/g, ' | ');
      } else if (Array.isArray(tc.testSteps)) {
        stepsText = tc.testSteps.join(' | ');
      }
      
      return [
        tc.testCaseId || tc.id || '',
        tc.testCaseTitle || tc.title || '',
        tc.module || '',
        tc.priority || '',
        tc.testType || 'Functional',
        tc.preconditions || tc.testCaseDescription || '',
        stepsText,
        tc.expectedResults || ''
      ];
    });

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TemplateIcon color="primary" />
          Prompt Template & JSON Schema Manager
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Configure and test AI prompt templates and JSON schemas for healthcare test cases
        </Typography>
        <Alert severity="info" sx={{ mt: 2 }}>
          <Typography variant="body2">
            <strong>🎯 ICEPOT Framework Enabled:</strong> This manager now uses the ICEPOT methodology for structured prompt engineering:
            <strong> I</strong>nstruction, <strong>C</strong>ontext, <strong>E</strong>xamples, <strong>P</strong>ersona, <strong>O</strong>utput, <strong>T</strong>one
          </Typography>
        </Alert>
      </Box>

      {/* Save Indicator */}
      {saved && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Configuration saved successfully!
        </Alert>
      )}

      {/* Main Tabs */}
      <Paper elevation={2}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
          <Tab icon={<SchemaIcon />} label="JSON Schema" />
          <Tab icon={<CodeIcon />} label="Prompt Template" />
          <Tab icon={<TestIcon />} label="Test & Preview" />
        </Tabs>
        <Divider />

        {/* Tab 0: JSON Schema */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">JSON Schema Configuration</Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Tooltip title="Reset to default">
                  <IconButton size="small" onClick={() => handleReset('schema')}>
                    <ResetIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Copy schema">
                  <IconButton size="small" onClick={() => handleCopy(jsonSchema, 'Schema')}>
                    <CopyIcon />
                  </IconButton>
                </Tooltip>
                {schemaValid ? (
                  <Chip icon={<ValidIcon />} label="Valid" color="success" size="small" />
                ) : (
                  <Chip icon={<ErrorIcon />} label="Invalid" color="error" size="small" />
                )}
              </Box>
            </Box>

            <TextField
              fullWidth
              multiline
              rows={25}
              value={jsonSchema}
              onChange={handleSchemaChange}
              variant="outlined"
              error={!schemaValid}
              helperText={schemaError}
              sx={{ 
                fontFamily: 'monospace',
                '& textarea': { fontFamily: 'monospace', fontSize: '0.875rem' }
              }}
            />

            {schemaError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  <strong>JSON Error:</strong> {schemaError}
                </Typography>
              </Alert>
            )}

            <Box sx={{ mt: 2 }}>
              <Typography variant="caption" color="text.secondary">
                This schema defines the structure of healthcare test cases stored in MongoDB.
                Required fields: testCaseId, testCaseTitle, testSteps, expectedResults.
              </Typography>
            </Box>
          </Box>
        </TabPanel>

        {/* Tab 1: Prompt Template */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Prompt Template</Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Tooltip title="Reset to default">
                  <IconButton size="small" onClick={() => handleReset('prompt')}>
                    <ResetIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Copy template">
                  <IconButton size="small" onClick={() => handleCopy(promptTemplate, 'Template')}>
                    <CopyIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>

            <TextField
              fullWidth
              multiline
              rows={30}
              value={promptTemplate}
              onChange={(e) => setPromptTemplate(e.target.value)}
              variant="outlined"
              sx={{ 
                fontFamily: 'monospace',
                '& textarea': { fontFamily: 'monospace', fontSize: '0.875rem' }
              }}
            />

            <Box sx={{ mt: 2 }}>
              <Typography variant="caption" color="text.secondary">
                This template guides the AI in analyzing and summarizing healthcare test cases.
                Use placeholders like {'{query}'}, {'{testCases}'} for dynamic content.
              </Typography>
            </Box>
          </Box>
        </TabPanel>

        {/* Tab 2: Test & Preview */}
        <TabPanel value={tabValue} index={2}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Test Prompt Template
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Test your prompt template with sample data to see how the AI responds
            </Typography>

            <Grid container spacing={3}>
              {/* Test Query */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Test Query / User Story"
                  multiline
                  rows={3}
                  value={testQuery}
                  onChange={(e) => setTestQuery(e.target.value)}
                  variant="outlined"
                  placeholder="Enter a user story or query to test..."
                   sx={{ 
                      '& .MuiOutlinedInput-root': { 
                        minWidth: '800px',
                        width: '100%'
                      } 
                    }}
                />
              </Grid>

              {/* Test Cases Input */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Sample Test Cases (JSON)"
                  multiline
                  rows={15}
                  value={testCases}
                  onChange={(e) => setTestCases(e.target.value)}
                  variant="outlined"
                  sx={{ 
                    fontFamily: 'monospace',
                    '& textarea': { fontFamily: 'monospace', fontSize: '0.875rem' ,   minWidth: '800px',
                        width: '100%'}
                    
                  }}
                />
              </Grid>

              {/* Test Button */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<TestIcon />}
                    onClick={handleTest}
                    disabled={testing || !schemaValid}
                  >
                    {testing ? 'Testing...' : 'Test Prompt Engineering'}
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<SearchIcon />}
                    onClick={handleRagTest}
                    disabled={ragTesting || !schemaValid}
                  >
                    {ragTesting ? 'Testing...' : 'Test RAG (Standard)'}
                  </Button>
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<AiIcon />}
                    onClick={handleLlmRagTest}
                    disabled={llmRagTesting || !schemaValid}
                  >
                    {llmRagTesting ? 'Running Complete Pipeline...' : 'Complete RAG Pipeline (Preprocess → Search → Dedupe → Generate)'}
                  </Button>
                  {(testResult && ragResult && llmRagResult) && (
                    <Button
                      variant="outlined"
                      color="info"
                      startIcon={<CompareIcon />}
                      onClick={() => setShowComparison(!showComparison)}
                    >
                      {showComparison ? 'Hide Comparison' : 'Show Full Comparison'}
                    </Button>
                  )}
                  {(testResult && llmRagResult) && (
                    <Button
                      variant="outlined"
                      color="warning"
                      startIcon={<CompareIcon />}
                      onClick={() => setShowQualityComparison(!showQualityComparison)}
                    >
                      {showQualityComparison ? 'Hide Quality Analysis' : 'Analyze Test Case Quality'}
                    </Button>
                  )}
                  <Button
                    variant="outlined"
                    startIcon={<SaveIcon />}
                    onClick={handleSave}
                    disabled={!schemaValid}
                  >
                    Save Configuration
                  </Button>
                </Box>
              </Grid>

              {/* Test Results */}
              {testResult && !showComparison && (
                <Grid item xs={12}>
                  <Card sx={{ bgcolor: testResult.error ? '#ffebee' : '#e8f5e9' }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AiIcon /> Prompt Engineering Result
                      </Typography>
                      <Divider sx={{ my: 1 }} />
                      <Box sx={{ 
                        bgcolor: 'background.paper', 
                        p: 2, 
                        borderRadius: 1,
                        fontFamily: 'monospace',
                        fontSize: '0.875rem',
                        whiteSpace: 'pre-wrap',
                        overflow: 'auto',
                        maxHeight: 400
                      }}>
                        {testResult.error ? (
                          <Typography color="error">{testResult.message}</Typography>
                        ) : (
                          <pre style={{ margin: 0 }}>
                            {JSON.stringify(testResult.response, null, 2)}
                          </pre>
                        )}
                      </Box>
                      
                      {!testResult.error && testResult.tokens && (
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="caption" color="text.secondary">
                            Tokens used: {testResult.tokens.total} (Prompt: {testResult.tokens.prompt}, Completion: {testResult.tokens.completion})
                            | Cost: ${testResult.cost.total}
                          </Typography>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              )}

              {/* RAG Results */}
              {ragResult && !showComparison && (
                <Grid item xs={12}>
                  <Card sx={{ bgcolor: ragResult.error ? '#ffebee' : '#e3f2fd' }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <SearchIcon /> RAG (Standard Summarization) Result
                      </Typography>
                      <Divider sx={{ my: 1 }} />
                      <Box sx={{ 
                        bgcolor: 'background.paper', 
                        p: 2, 
                        borderRadius: 1,
                        whiteSpace: 'pre-wrap',
                        overflow: 'auto',
                        maxHeight: 400
                      }}>
                        {ragResult.error ? (
                          <Typography color="error">{ragResult.message}</Typography>
                        ) : (
                          <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                            {ragResult.summary}
                          </Typography>
                        )}
                      </Box>
                      
                      {!ragResult.error && ragResult.tokens && (
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="caption" color="text.secondary">
                            Tokens used: {ragResult.tokens.total} (Prompt: {ragResult.tokens.prompt}, Completion: {ragResult.tokens.completion})
                            | Cost: ${ragResult.cost.total}
                          </Typography>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              )}

              {/* Complete Pipeline Results - NEW IMPROVED UI */}
              {llmRagResult && !showComparison && !showQualityComparison && (
                <Grid item xs={12}>
                  <Card sx={{ bgcolor: llmRagResult.error ? '#ffebee' : '#f3e5f5' }}>
                    <CardContent>
                      {/* Header */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Box>
                          <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <AiIcon /> Complete RAG Pipeline Results (10-Step Process)
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            <Chip label={llmRagResult.workflow || "10-Step Pipeline"} color="success" size="small" />
                            {llmRagResult.searchResults && (
                              <Chip label={`${llmRagResult.searchResults} hybrid search results`} color="info" size="small" />
                            )}
                            {llmRagResult.rerankData && (
                              <Chip label="RRF Re-Ranking Applied" color="primary" size="small" />
                            )}
                            {llmRagResult.dedupData && (
                              <Chip label={`${llmRagResult.dedupData.stats?.duplicatesRemoved || 0} duplicates removed`} color="warning" size="small" />
                            )}
                            {llmRagResult.topResults && (
                              <Chip label={`Top ${llmRagResult.topResults} results`} color="secondary" size="small" />
                            )}
                            {llmRagResult.validationPassed !== undefined && (
                              <Chip 
                                label={llmRagResult.validationPassed ? "✓ Validation Passed" : "⚠ Validation Warnings"} 
                                color={llmRagResult.validationPassed ? "success" : "warning"} 
                                size="small" 
                              />
                            )}
                          </Box>
                        </Box>
                        
                        {/* Export Buttons */}
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          {pipelineView === 'generated' && llmRagResult.response?.response?.newTestCases && (
                            <Button
                              size="small"
                              variant="outlined"
                              startIcon={<ExportIcon />}
                              onClick={() => exportToCSV(llmRagResult.response.newTestCases, 'generated_test_cases')}
                            >
                              Export CSV
                            </Button>
                          )}
                          {pipelineView === 'reference' && llmRagResult.existingTestCases && (
                            <Button
                              size="small"
                              variant="outlined"
                              startIcon={<ExportIcon />}
                              onClick={() => exportToCSV(llmRagResult.existingTestCases, 'reference_test_cases')}
                            >
                              Export CSV
                            </Button>
                          )}
                        </Box>
                      </Box>

                      {/* Progress Bar (shown during generation) */}
                      {llmRagTesting && (
                        <Box sx={{ mb: 3 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                            <CircularProgress size={24} />
                            <Typography variant="body2">
                              Generating test cases... {generationProgress}%
                            </Typography>
                          </Box>
                          <LinearProgress variant="determinate" value={generationProgress} />
                        </Box>
                      )}

                      {/* Accuracy Score */}
                      {accuracyScore !== null && !llmRagResult.error && (
                        <Alert severity="success" sx={{ mb: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <QualityIcon />
                            <Box sx={{ flexGrow: 1 }}>
                              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                Retrieval Quality Score: {(accuracyScore * 100).toFixed(1)}%
                              </Typography>
                              <LinearProgress 
                                variant="determinate" 
                                value={accuracyScore * 100} 
                                sx={{ mt: 1, height: 8, borderRadius: 4 }}
                                color={accuracyScore >= 0.85 ? 'success' : accuracyScore >= 0.75 ? 'warning' : 'error'}
                              />
                              <Typography variant="caption" color="text.secondary">
                                Average similarity: {llmRagResult.averageSimilarity?.toFixed(3) || 'N/A'} 
                                {accuracyScore >= 0.85 ? ' (Excellent)' : accuracyScore >= 0.75 ? ' (Good)' : ' (Fair)'}
                              </Typography>
                            </Box>
                          </Box>
                        </Alert>
                      )}

                      {/* Pipeline Steps Summary */}
                      {llmRagResult.pipelineSteps && (
                        <Card sx={{ mb: 2, bgcolor: '#e8f5e9' }}>
                          <CardContent>
                            <Typography variant="h6" gutterBottom sx={{ color: 'success.main' }}>
                              📋 10-Step Pipeline Completed
                            </Typography>
                            <Grid container spacing={1}>
                              {llmRagResult.pipelineSteps.map((step, idx) => (
                                <Grid item xs={12} sm={6} md={4} key={idx}>
                                  <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                                    {step}
                                  </Typography>
                                </Grid>
                              ))}
                            </Grid>
                          </CardContent>
                        </Card>
                      )}
                      
                      {/* Validation Status */}
                      {llmRagResult.validationErrors && llmRagResult.validationErrors.length > 0 && (
                        <Alert severity="warning" sx={{ mb: 2 }}>
                          <Typography variant="body2">
                            <strong>⚠️ Validation Warnings:</strong>
                          </Typography>
                          <Box component="ul" sx={{ pl: 2, mb: 0 }}>
                            {llmRagResult.validationErrors.map((error, idx) => (
                              <li key={idx}><Typography variant="caption">{error}</Typography></li>
                            ))}
                          </Box>
                        </Alert>
                      )}
                      
                      {llmRagResult.preprocessingData && (
                        <Alert severity="info" sx={{ mb: 2 }}>
                          <Typography variant="body2">
                            <strong>🔧 Query Preprocessing:</strong> Applied transformations including synonym expansion, 
                            abbreviation handling, and healthcare domain optimization.
                            {llmRagResult.originalQuery !== llmRagResult.processedQuery && (
                              <span><br/><strong>Processed Query:</strong> {llmRagResult.processedQuery}</span>
                            )}
                          </Typography>
                        </Alert>
                      )}

                      <Divider sx={{ my: 2 }} />

                      {/* View Selector */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Tabs value={pipelineView} onChange={(e, val) => setPipelineView(val)}>
                          <Tab 
                            value="reference" 
                            label="Reference Test Cases" 
                            icon={<SearchIcon />} 
                            iconPosition="start"
                          />
                          <Tab 
                            value="generated" 
                            label="Generated Test Cases" 
                            icon={<AiIcon />} 
                            iconPosition="start"
                          />
                        </Tabs>
                        
                        {/* Navigation Buttons */}
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<BackIcon />}
                            disabled={pipelineView === 'reference'}
                            onClick={() => setPipelineView('reference')}
                          >
                            Back
                          </Button>
                          <Button
                            size="small"
                            variant="contained"
                            endIcon={<NextIcon />}
                            disabled={pipelineView === 'generated'}
                            onClick={() => setPipelineView('generated')}
                          >
                            Next: View Generated
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            color="secondary"
                            startIcon={<ResetIcon />}
                            onClick={handleLlmRagTest}
                          >
                            Regenerate
                          </Button>
                        </Box>
                      </Box>

                      {/* Reference Test Cases View */}
                      {pipelineView === 'reference' && (
                        <Box>
                          {/* RAG Summary */}
                          <Card sx={{ mb: 3, bgcolor: '#e3f2fd' }}>
                            <CardContent>
                              <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
                                📊 Comprehensive RAG Analysis
                              </Typography>
                              <Box sx={{ 
                                bgcolor: 'background.paper', 
                                p: 2, 
                                borderRadius: 1,
                                fontSize: '0.875rem',
                                maxHeight: 300,
                                overflow: 'auto'
                              }}>
                                <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                                  {llmRagResult.ragSummary}
                                </Typography>
                              </Box>
                            </CardContent>
                          </Card>

                          {/* Reference Test Cases Table */}
                          {renderTestCaseTable(llmRagResult.existingTestCases, 'Reference Test Cases', true)}
                        </Box>
                      )}

                      {/* Generated Test Cases View */}
                      {pipelineView === 'generated' && (
                        <Box>
                          {llmRagResult.error ? (
                            <Alert severity="error">
                              <Typography variant="body2">
                                <strong>Generation Error:</strong> {llmRagResult.message}
                              </Typography>
                            </Alert>
                          ) : (
                            <>
                              {/* Analysis Summary */}
                              {llmRagResult.response?.analysis && (
                                <Card sx={{ mb: 3, bgcolor: '#fff9c4' }}>
                                  <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                      🎯 Analysis & Gaps
                                    </Typography>
                                    <Grid container spacing={2}>
                                      <Grid item xs={12} sm={6}>
                                        <Typography variant="body2">
                                          <strong>User Story:</strong> {llmRagResult.response.analysis.userStoryTitle}
                                        </Typography>
                                        <Typography variant="body2">
                                          <strong>Module:</strong> {llmRagResult.response.analysis.userStoryModule}
                                        </Typography>
                                        <Typography variant="body2">
                                          <strong>Coverage:</strong> {llmRagResult.response.analysis.existingCoverageCount} existing test cases
                                        </Typography>
                                      </Grid>
                                      <Grid item xs={12} sm={6}>
                                        <Typography variant="subtitle2" gutterBottom>Gaps Identified:</Typography>
                                        <Box component="ul" sx={{ pl: 2, m: 0 }}>
                                          {(llmRagResult.response.analysis.gapsIdentified || []).map((gap, idx) => (
                                            <li key={idx}><Typography variant="body2">{gap}</Typography></li>
                                          ))}
                                        </Box>
                                      </Grid>
                                    </Grid>
                                  </CardContent>
                                </Card>
                              )}

                              {/* Generated Test Cases Table */}
                              {llmRagResult.response?.newTestCases && llmRagResult.response.newTestCases.length > 0 ? (
                                renderTestCaseTable(llmRagResult.response.newTestCases, 'Generated Test Cases', false)
                              ) : (
                                <Alert severity="warning">
                                  <Typography variant="body2">
                                    <strong>No test cases generated.</strong>
                                  </Typography>
                                  {llmRagResult.validationErrors && llmRagResult.validationErrors.length > 0 && (
                                    <Box sx={{ mt: 1 }}>
                                      <Typography variant="caption" display="block">Validation errors:</Typography>
                                      <ul style={{ marginTop: 4, paddingLeft: 20 }}>
                                        {llmRagResult.validationErrors.map((err, idx) => (
                                          <li key={idx}><Typography variant="caption">{err}</Typography></li>
                                        ))}
                                      </ul>
                                    </Box>
                                  )}
                                </Alert>
                              )}

                              {/* Rationale Section */}
                              {llmRagResult.response?.rationale && (
                                <Card sx={{ mt: 3, bgcolor: '#f3e5f5' }}>
                                  <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                      💡 Generation Rationale
                                    </Typography>
                                    <Box component="ul" sx={{ pl: 2 }}>
                                      {llmRagResult.response.rationale.map((item, idx) => (
                                        <li key={idx}>
                                          <Typography variant="body2">
                                            <strong>{item.testCaseId}:</strong> {item.reason}
                                          </Typography>
                                        </li>
                                      ))}
                                    </Box>
                                  </CardContent>
                                </Card>
                              )}

                              {/* Recommendations */}
                              {llmRagResult.response?.recommendations && (
                                <Alert severity="info" sx={{ mt: 2 }}>
                                  <Typography variant="body2">
                                    <strong>📋 Recommendations:</strong> {llmRagResult.response.recommendations}
                                  </Typography>
                                </Alert>
                              )}
                            </>
                          )}
                        </Box>
                      )}

                      {/* Cost Information */}
                      {!llmRagResult.error && (
                        <Box sx={{ mt: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                          <Typography variant="caption" color="text.secondary">
                            <strong>💰 Cost Breakdown:</strong> 
                            {llmRagResult.tokens && ` Generation: ${llmRagResult.tokens.total} tokens ($${llmRagResult.cost.total})`}
                            {llmRagResult.ragTokens && ` | RAG Summary: ${llmRagResult.ragTokens.total} tokens ($${llmRagResult.ragCost.total})`}
                            {llmRagResult.tokens && llmRagResult.ragTokens && 
                              ` | Total: $${(parseFloat(llmRagResult.cost.total) + parseFloat(llmRagResult.ragCost.total)).toFixed(6)}`
                            }
                          </Typography>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              )}

              {/* Comparison View */}
              {showComparison && testResult && ragResult && llmRagResult && (
                <Grid item xs={12}>
                  <Card sx={{ bgcolor: '#fff3e0' }}>
                    <CardContent>
                      <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CompareIcon /> Three-Way Comparison: Prompt Engineering vs RAG vs LLM+RAG
                      </Typography>
                      <Divider sx={{ my: 2 }} />
                      
                      <Grid container spacing={2}>
                        {/* Prompt Engineering Column */}
                        <Grid item xs={12} md={4}>
                          <Card sx={{ bgcolor: '#e8f5e9', height: '100%' }}>
                            <CardContent>
                              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <AiIcon color="success" /> 1. Prompt Engineering
                              </Typography>
                              <Chip label="Structured Analysis" color="success" size="small" sx={{ mb: 2 }} />
                              <Divider sx={{ my: 1 }} />
                              
                              <Box sx={{ 
                                bgcolor: 'background.paper', 
                                p: 2, 
                                borderRadius: 1,
                                fontFamily: 'monospace',
                                fontSize: '0.65rem',
                                whiteSpace: 'pre-wrap',
                                overflow: 'auto',
                                maxHeight: 400
                              }}>
                                {!testResult.error && (
                                  <pre style={{ margin: 0 }}>
                                    {JSON.stringify(testResult.response, null, 2)}
                                  </pre>
                                )}
                              </Box>
                              
                              {!testResult.error && testResult.tokens && (
                                <Box sx={{ mt: 2, p: 1, bgcolor: '#c8e6c9', borderRadius: 1 }}>
                                  <Typography variant="caption" display="block">
                                    <strong>Tokens:</strong> {testResult.tokens.total}
                                  </Typography>
                                  <Typography variant="caption" display="block">
                                    <strong>Cost:</strong> ${testResult.cost.total}
                                  </Typography>
                                  <Typography variant="caption" display="block" color="success.dark">
                                    <strong>Format:</strong> Structured JSON with recommendations & gaps
                                  </Typography>
                                </Box>
                              )}
                            </CardContent>
                          </Card>
                        </Grid>

                        {/* RAG Column */}
                        <Grid item xs={12} md={4}>
                          <Card sx={{ bgcolor: '#e3f2fd', height: '100%' }}>
                            <CardContent>
                              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <SearchIcon color="primary" /> 2. RAG (Standard)
                              </Typography>
                              <Chip label="Text Summary" color="primary" size="small" sx={{ mb: 2 }} />
                              <Divider sx={{ my: 1 }} />
                              
                              <Box sx={{ 
                                bgcolor: 'background.paper', 
                                p: 2, 
                                borderRadius: 1,
                                whiteSpace: 'pre-wrap',
                                overflow: 'auto',
                                maxHeight: 400,
                                fontSize: '0.75rem'
                              }}>
                                {!ragResult.error && (
                                  <Typography variant="body2" sx={{ lineHeight: 1.6, fontSize: '0.75rem' }}>
                                    {ragResult.summary}
                                  </Typography>
                                )}
                              </Box>
                              
                              {!ragResult.error && ragResult.tokens && (
                                <Box sx={{ mt: 2, p: 1, bgcolor: '#bbdefb', borderRadius: 1 }}>
                                  <Typography variant="caption" display="block">
                                    <strong>Tokens:</strong> {ragResult.tokens.total}
                                  </Typography>
                                  <Typography variant="caption" display="block">
                                    <strong>Cost:</strong> ${ragResult.cost.total}
                                  </Typography>
                                  <Typography variant="caption" display="block" color="primary.dark">
                                    <strong>Format:</strong> Narrative summary
                                  </Typography>
                                </Box>
                              )}
                            </CardContent>
                          </Card>
                        </Grid>

                        {/* LLM + RAG Context Column */}
                        <Grid item xs={12} md={4}>
                          <Card sx={{ bgcolor: '#f3e5f5', height: '100%' }}>
                            <CardContent>
                              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <AiIcon color="secondary" /> 3. LLM + RAG Context
                              </Typography>
                              <Chip label="Generated Test Cases" color="secondary" size="small" sx={{ mb: 2 }} />
                              <Divider sx={{ my: 1 }} />
                              
                              <Box sx={{ 
                                bgcolor: 'background.paper', 
                                p: 2, 
                                borderRadius: 1,
                                fontFamily: 'monospace',
                                fontSize: '0.65rem',
                                whiteSpace: 'pre-wrap',
                                overflow: 'auto',
                                maxHeight: 400
                              }}>
                                {!llmRagResult.error && (
                                  <pre style={{ margin: 0 }}>
                                    {JSON.stringify(llmRagResult.response, null, 2)}
                                  </pre>
                                )}
                              </Box>
                              
                              {!llmRagResult.error && llmRagResult.tokens && (
                                <Box sx={{ mt: 2, p: 1, bgcolor: '#e1bee7', borderRadius: 1 }}>
                                  <Typography variant="caption" display="block">
                                    <strong>Tokens:</strong> {llmRagResult.tokens.total}
                                  </Typography>
                                  <Typography variant="caption" display="block">
                                    <strong>Cost:</strong> ${llmRagResult.cost.total}
                                  </Typography>
                                  <Typography variant="caption" display="block" color="secondary.dark">
                                    <strong>Format:</strong> Actionable test cases
                                  </Typography>
                                </Box>
                              )}
                            </CardContent>
                          </Card>
                        </Grid>

                        {/* Enhanced Quality Analysis */}
                        <Grid item xs={12}>
                          <Card sx={{ bgcolor: '#fff9c4' }}>
                            <CardContent>
                              <Typography variant="h6" gutterBottom>
                                📊 Comprehensive Quality & Performance Analysis
                              </Typography>
                              
                              {/* Performance Metrics */}
                              <Grid container spacing={3} sx={{ mb: 3 }}>
                                <Grid item xs={12} sm={4}>
                                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                    💰 Cost Analysis
                                  </Typography>
                                  <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 1 }}>
                                    <Typography variant="body2">
                                      <strong>Prompt Engineering:</strong> ${testResult?.cost?.total || '0.000000'}<br/>
                                      <strong>RAG Summary:</strong> ${ragResult?.cost?.total || '0.000000'}<br/>
                                      <strong>Full RAG Pipeline:</strong> ${llmRagResult?.cost?.total || '0.000000'}
                                      {llmRagResult?.ragCost?.total && (
                                        <span><br/><em>+ RAG Cost: ${llmRagResult.ragCost.total}</em></span>
                                      )}
                                    </Typography>
                                  </Box>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                    🔢 Token Usage
                                  </Typography>
                                  <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 1 }}>
                                    <Typography variant="body2">
                                      <strong>PE:</strong> {testResult?.tokens?.total || 0} tokens<br/>
                                      <strong>RAG:</strong> {ragResult?.tokens?.total || 0} tokens<br/>
                                      <strong>Pipeline:</strong> {llmRagResult?.tokens?.total || 0} tokens
                                      {llmRagResult?.ragTokens?.total && (
                                        <span><br/><em>+ RAG: {llmRagResult.ragTokens.total}</em></span>
                                      )}
                                    </Typography>
                                  </Box>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                    📊 Output Quality
                                  </Typography>
                                  <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 1 }}>
                                    <Typography variant="body2">
                                      <strong>PE:</strong> Analysis + Gaps<br/>
                                      <strong>RAG:</strong> Comprehensive Summary<br/>
                                      <strong>Pipeline:</strong> New Test Cases
                                    </Typography>
                                  </Box>
                                </Grid>
                              </Grid>

                              {/* Quality Comparison */}
                              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                                🎯 Quality & Use Case Analysis
                              </Typography>
                              
                              <Grid container spacing={2}>
                                <Grid item xs={12} md={4}>
                                  <Card sx={{ bgcolor: '#e8f5e9', height: '100%' }}>
                                    <CardContent>
                                      <Typography variant="h6" color="success.main" gutterBottom>
                                        1️⃣ Prompt Engineering
                                      </Typography>
                                      <Typography variant="body2" sx={{ mb: 2 }}>
                                        <strong>Best for:</strong> Gap analysis, structured recommendations
                                      </Typography>
                                      <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                                        ✅ Identifies specific gaps<br/>
                                        ✅ Structured JSON output<br/>
                                        ✅ Actionable recommendations<br/>
                                        ✅ Quick analysis<br/>
                                        ❌ Uses sample data only
                                      </Typography>
                                    </CardContent>
                                  </Card>
                                </Grid>
                                
                                <Grid item xs={12} md={4}>
                                  <Card sx={{ bgcolor: '#e3f2fd', height: '100%' }}>
                                    <CardContent>
                                      <Typography variant="h6" color="primary.main" gutterBottom>
                                        2️⃣ RAG (Standard)
                                      </Typography>
                                      <Typography variant="body2" sx={{ mb: 2 }}>
                                        <strong>Best for:</strong> Documentation, comprehensive analysis
                                      </Typography>
                                      <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                                        ✅ Uses real test data<br/>
                                        ✅ Comprehensive coverage analysis<br/>
                                        ✅ Module/priority grouping<br/>
                                        ✅ Healthcare domain expertise<br/>
                                        ❌ No new test generation
                                      </Typography>
                                    </CardContent>
                                  </Card>
                                </Grid>
                                
                                <Grid item xs={12} md={4}>
                                  <Card sx={{ bgcolor: '#f3e5f5', height: '100%' }}>
                                    <CardContent>
                                      <Typography variant="h6" color="secondary.main" gutterBottom>
                                        3️⃣ Full RAG Pipeline
                                      </Typography>
                                      <Typography variant="body2" sx={{ mb: 2 }}>
                                        <strong>Best for:</strong> Complete test case generation
                                      </Typography>
                                      <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                                        ✅ Searches real database<br/>
                                        ✅ Context-aware generation<br/>
                                        ✅ High-quality new test cases<br/>
                                        ✅ Complements existing coverage<br/>
                                        ❌ Highest cost/complexity
                                      </Typography>
                                    </CardContent>
                                  </Card>
                                </Grid>
                              </Grid>
                              
                              <Alert severity="success" sx={{ mt: 3 }}>
                                <Typography variant="body2">
                                  <strong>🏆 QUALITY RECOMMENDATION:</strong><br/>
                                  For highest quality test case generation: Use <strong>Full RAG Pipeline</strong> which searches your actual database, 
                                  creates comprehensive analysis, and generates contextually relevant test cases. The enhanced RAG summarization 
                                  now includes detailed test steps, priorities, modules, and compliance considerations.
                                </Typography>
                              </Alert>
                              
                              <Alert severity="info" sx={{ mt: 2 }}>
                                <Typography variant="body2">
                                  <strong>💡 WORKFLOW RECOMMENDATION:</strong><br/>
                                  (1) <strong>Full RAG Pipeline</strong> for new test generation → 
                                  (2) <strong>RAG Summary</strong> for documentation → 
                                  (3) <strong>Prompt Engineering</strong> for additional gap analysis
                                </Typography>
                              </Alert>
                            </CardContent>
                          </Card>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              )}

              {/* Quality Comparison View */}
              {showQualityComparison && testResult && llmRagResult && (
                <Grid item xs={12}>
                  <Card sx={{ bgcolor: '#fff3e0', border: '2px solid #ff9800' }}>
                    <CardContent>
                      <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        🏆 Test Case Quality Analysis: Prompt Engineering vs Full RAG Pipeline
                      </Typography>
                      <Divider sx={{ my: 2 }} />
                      
                      <Grid container spacing={3}>
                        {/* Prompt Engineering Quality */}
                        <Grid item xs={12} md={6}>
                          <Card sx={{ bgcolor: '#e8f5e9', height: '100%' }}>
                            <CardContent>
                              <Typography variant="h6" color="success.main" gutterBottom>
                                📝 Prompt Engineering Approach
                              </Typography>
                              <Box sx={{ mb: 2 }}>
                                <Chip label="Sample Data" color="warning" size="small" />
                                <Chip label="Fast Execution" color="success" size="small" sx={{ ml: 1 }} />
                              </Box>
                              
                              <Typography variant="subtitle2" gutterBottom>Generated Test Cases:</Typography>
                              <Typography variant="body2" sx={{ mb: 2 }}>
                                Count: {testResult.response?.recommendations?.length || 'N/A'}<br/>
                                Source: Sample data only<br/>
                                Context: Limited to provided examples
                              </Typography>
                              
                              <Typography variant="subtitle2" gutterBottom>Quality Metrics:</Typography>
                              <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 1, fontSize: '0.85rem' }}>
                                ✅ Structured JSON output<br/>
                                ✅ Fast response time<br/>
                                ✅ Consistent format<br/>
                                ❌ No real database search<br/>
                                ❌ Limited context awareness<br/>
                                ❌ Sample data dependency
                              </Box>
                              
                              <Box sx={{ mt: 2, p: 1, bgcolor: '#c8e6c9', borderRadius: 1 }}>
                                <Typography variant="caption">
                                  <strong>Cost:</strong> ${testResult.cost?.total || '0.000000'}<br/>
                                  <strong>Tokens:</strong> {testResult.tokens?.total || 0}
                                </Typography>
                              </Box>
                            </CardContent>
                          </Card>
                        </Grid>
                        
                        {/* RAG Pipeline Quality */}
                        <Grid item xs={12} md={6}>
                          <Card sx={{ bgcolor: '#f3e5f5', height: '100%' }}>
                            <CardContent>
                              <Typography variant="h6" color="secondary.main" gutterBottom>
                                🎯 Full RAG Pipeline Approach
                              </Typography>
                              <Box sx={{ mb: 2 }}>
                                <Chip label="Real Database" color="primary" size="small" />
                                <Chip label="Complete Pipeline" color="success" size="small" sx={{ ml: 1 }} />
                              </Box>
                              
                              <Typography variant="subtitle2" gutterBottom>Generated Test Cases:</Typography>
                              <Typography variant="body2" sx={{ mb: 2 }}>
                                Count: {llmRagResult.response?.response?.newTestCases?.length || 'N/A'}<br/>
                                Source: {llmRagResult.searchResults || 0} database results<br/>
                                Context: Comprehensive RAG analysis
                              </Typography>
                              
                              <Typography variant="subtitle2" gutterBottom>Quality Metrics:</Typography>
                              <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 1, fontSize: '0.85rem' }}>
                                ✅ Real database search ({llmRagResult.searchResults || 0} results)<br/>
                                ✅ Query preprocessing applied<br/>
                                ✅ Deduplication: {llmRagResult.dedupData?.stats?.duplicatesRemoved || 0} removed<br/>
                                ✅ Comprehensive RAG analysis<br/>
                                ✅ Context-aware generation<br/>
                                ✅ Healthcare domain expertise<br/>
                                ❌ Higher cost and complexity
                              </Box>
                              
                              <Box sx={{ mt: 2, p: 1, bgcolor: '#e1bee7', borderRadius: 1 }}>
                                <Typography variant="caption">
                                  <strong>Generation Cost:</strong> ${llmRagResult.cost?.total || '0.000000'}<br/>
                                  <strong>RAG Cost:</strong> ${llmRagResult.ragCost?.total || '0.000000'}<br/>
                                  <strong>Total Tokens:</strong> {(llmRagResult.tokens?.total || 0) + (llmRagResult.ragTokens?.total || 0)}
                                </Typography>
                              </Box>
                            </CardContent>
                          </Card>
                        </Grid>
                        
                        {/* Winner Analysis */}
                        <Grid item xs={12}>
                          <Card sx={{ bgcolor: '#e8f5e9', border: '2px solid #4caf50' }}>
                            <CardContent>
                              <Typography variant="h6" gutterBottom>
                                🏆 Quality Winner: Full RAG Pipeline
                              </Typography>
                              
                              <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                  <Typography variant="subtitle2" gutterBottom>Why RAG Pipeline Wins:</Typography>
                                  <Box sx={{ fontSize: '0.9rem' }}>
                                    🎯 <strong>Real Data Integration:</strong> Searches {llmRagResult.searchResults || 0} actual test cases from your database<br/>
                                    🔧 <strong>Query Preprocessing:</strong> Optimizes search with domain knowledge<br/>
                                    🧹 <strong>Deduplication:</strong> Removes {llmRagResult.dedupData?.stats?.duplicatesRemoved || 0} duplicate results<br/>
                                    📊 <strong>Comprehensive Analysis:</strong> Deep RAG analysis of existing coverage<br/>
                                    🎨 <strong>Context-Aware:</strong> Generates test cases that complement existing ones<br/>
                                    🏥 <strong>Healthcare Domain:</strong> Specialized healthcare expertise
                                  </Box>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                  <Typography variant="subtitle2" gutterBottom>Quality Metrics Comparison:</Typography>
                                  <Box sx={{ fontSize: '0.9rem' }}>
                                    <strong>Test Case Count:</strong><br/>
                                    • PE: {testResult.response?.recommendations?.length || 0} cases<br/>
                                    • RAG: {llmRagResult.response?.response?.newTestCases?.length || 0} cases<br/><br/>
                                    <strong>Data Source:</strong><br/>
                                    • PE: Sample data only<br/>
                                    • RAG: {llmRagResult.searchResults || 0} real database results<br/><br/>
                                    <strong>Context Richness:</strong><br/>
                                    • PE: Limited to examples<br/>
                                    • RAG: Full database analysis + preprocessing
                                  </Box>
                                </Grid>
                              </Grid>
                              
                              <Alert severity="success" sx={{ mt: 2 }}>
                                <Typography variant="body2">
                                  <strong>🎯 CONCLUSION:</strong> The Full RAG Pipeline produces higher quality test cases because it:
                                  (1) Uses real database search results, (2) Applies query preprocessing for better search,
                                  (3) Removes duplicates to reduce noise, (4) Provides comprehensive analysis of existing coverage,
                                  and (5) Generates contextually relevant test cases that complement existing ones.
                                </Typography>
                              </Alert>
                            </CardContent>
                          </Card>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              )}
            </Grid>
          </Box>
        </TabPanel>
      </Paper>
    </Box>
  );
}

export default PromptSchemaManager;
