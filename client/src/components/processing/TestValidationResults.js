import React from 'react';
import UserStoryValidationResults from './UserStoryValidationResults';
import { Box } from '@mui/material';

// Sample test data matching your JSON schema
const sampleValidationData = {
  analysis: {
    userStoryTitle: "User Authentication and Authorization",
    userStoryModule: "Security",
    summary: "This user story covers comprehensive user authentication and authorization functionality including login, logout, password management, and role-based access control.",
    criteriaRatings: {
      titleClarity: 8,
      descriptionCompleteness: 7,
      acceptanceCriteriaQuality: 6,
      businessValueAlignment: 9,
      technicalFeasibility: 8,
      complianceCoverage: 7
    },
    averageScore: 7.5,
    readinessStatus: "Needs Refinement",
    strengths: [
      "Clear business value proposition",
      "Well-defined security requirements",
      "Comprehensive scope covering multiple auth scenarios"
    ],
    gapsIdentified: [
      "Missing specific acceptance criteria for password complexity",
      "No error handling scenarios defined",
      "Accessibility requirements not specified"
    ],
    improvementRecommendations: [
      "HIGH - Define specific password complexity requirements and validation rules",
      "MEDIUM - Add comprehensive error handling and user feedback scenarios", 
      "LOW - Include accessibility standards (WCAG 2.1) compliance requirements"
    ],
    linkedTestCases: ["TC_AUTH_001", "TC_AUTH_002", "TC_ROLE_001"],
    sourceCitations: ["Security Requirements Doc v2.1", "OWASP Guidelines"]
  },
  rationale: {
    scoringExplanation: "The user story demonstrates strong business value alignment and technical feasibility but lacks specific acceptance criteria and detailed error handling scenarios. Title clarity is good but could be more specific about the scope.",
    impactSummary: "The identified gaps in acceptance criteria and error handling could lead to implementation inconsistencies and poor user experience during authentication failures."
  },
  finalRecommendation: "Refine the acceptance criteria to include specific password requirements, error handling, and accessibility standards before proceeding to development. Consider breaking into smaller, more focused user stories for better testability."
};

const TestValidationResults = () => {
  return (
    <Box sx={{ p: 2 }}>
      <UserStoryValidationResults validationData={sampleValidationData} />
    </Box>
  );
};

export default TestValidationResults;