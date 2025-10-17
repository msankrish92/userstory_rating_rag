import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  Grid,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
  Divider
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  TrendingUp as TrendingUpIcon,
  Assignment as AssignmentIcon,
  Speed as SpeedIcon
} from '@mui/icons-material';

const UserStoryValidationResults = ({ validationData }) => {
  if (!validationData || !validationData.analysis) {
    return (
      <Alert severity="warning">
        No validation data available
      </Alert>
    );
  }

  const { analysis, rationale, finalRecommendation } = validationData;
  const { criteriaRatings, averageScore, readinessStatus } = analysis;

  // Calculate grade based on average score (1-10 scale)
  const getGrade = (score) => {
    const percentage = (score / 10) * 100;
    if (percentage >= 90) return { grade: 'A+', color: 'success' };
    if (percentage >= 80) return { grade: 'A', color: 'success' };
    if (percentage >= 70) return { grade: 'B', color: 'info' };
    if (percentage >= 60) return { grade: 'C', color: 'warning' };
    if (percentage >= 50) return { grade: 'D', color: 'warning' };
    return { grade: 'F', color: 'error' };
  };

  const gradeInfo = getGrade(averageScore);
  const scorePercentage = (averageScore / 10) * 100;

  // Get status color and icon
  const getStatusProps = (status) => {
    switch (status) {
      case 'Ready for Dev': 
        return { color: 'success', icon: <CheckIcon /> };
      case 'Needs Refinement': 
        return { color: 'warning', icon: <WarningIcon /> };
      case 'Blocked': 
        return { color: 'error', icon: <ErrorIcon /> };
      default: 
        return { color: 'default', icon: <WarningIcon /> };
    }
  };

  const statusProps = getStatusProps(readinessStatus);

  // Extract priority from recommendation text
  const getPriorityFromText = (text) => {
    const priorityMatch = text.match(/\b(high|medium|low)\b/i);
    return priorityMatch ? priorityMatch[1].toLowerCase() : 'medium';
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'default';
    }
  };

  // Format criterion names for display
  const formatCriterionName = (criterion) => {
    return criterion
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header with Score and Grade */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" gutterBottom>
            User Story Validation Results
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {analysis.userStoryTitle && `"${analysis.userStoryTitle}"`}
            {analysis.userStoryModule && ` • Module: ${analysis.userStoryModule}`}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" color="primary.main" fontWeight="bold">
              {scorePercentage.toFixed(0)}%
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Overall Score
            </Typography>
          </Box>
          <Chip 
            label={`Grade: ${gradeInfo.grade}`}
            color={gradeInfo.color}
            size="large"
            icon={<SpeedIcon />}
            sx={{ 
              fontWeight: 'bold', 
              fontSize: '1rem', 
              px: 2,
              height: 40
            }}
          />
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Status Card */}
        <Grid item xs={12}>
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AssignmentIcon color="primary" />
                  Readiness Assessment
                </Typography>
                <Chip
                  label={readinessStatus}
                  color={statusProps.color}
                  icon={statusProps.icon}
                  sx={{ 
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                    px: 2,
                    height: 36
                  }}
                />
              </Box>
              
              {analysis.summary && (
                <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic' }}>
                  {analysis.summary}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Criteria Ratings */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Detailed Criteria Assessment
              </Typography>
              
              <Grid container spacing={3}>
                {Object.entries(criteriaRatings).map(([criterion, score]) => {
                  const percentage = (score / 10) * 100;
                  const criterionLabel = formatCriterionName(criterion);
                  
                  return (
                    <Grid item xs={12} sm={6} md={4} key={criterion}>
                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2" fontWeight="medium">
                            {criterionLabel}
                          </Typography>
                          <Typography variant="body2" fontWeight="bold" color="primary.main">
                            {score}/10
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={percentage}
                          sx={{
                            height: 10,
                            borderRadius: 5,
                            bgcolor: 'grey.200',
                            '& .MuiLinearProgress-bar': {
                              borderRadius: 5,
                              bgcolor: percentage >= 80 ? 'success.main' : 
                                      percentage >= 60 ? 'warning.main' : 'error.main'
                            }
                          }}
                        />
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                          {percentage.toFixed(0)}%
                        </Typography>
                      </Box>
                    </Grid>
                  );
                })}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Recommendations */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TrendingUpIcon color="primary" />
                Improvement Recommendations
              </Typography>
              
              {analysis.improvementRecommendations && analysis.improvementRecommendations.length > 0 ? (
                <List>
                  {analysis.improvementRecommendations.map((recommendation, index) => {
                    const priority = getPriorityFromText(recommendation);
                    
                    return (
                      <ListItem key={index} sx={{ pl: 0, alignItems: 'flex-start' }}>
                        <ListItemIcon sx={{ mt: 0.5 }}>
                          <Box
                            sx={{
                              width: 6,
                              height: 40,
                              bgcolor: getPriorityColor(priority) + '.main',
                              borderRadius: 3,
                              mr: 1
                            }}
                          />
                        </ListItemIcon>
                        <ListItemText>
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1 }}>
                            <Chip
                              label={priority.toUpperCase()}
                              size="small"
                              color={getPriorityColor(priority)}
                              sx={{ 
                                textTransform: 'uppercase', 
                                minWidth: 70,
                                fontWeight: 'bold',
                                fontSize: '0.7rem'
                              }}
                            />
                          </Box>
                          <Typography variant="body2">
                            {recommendation}
                          </Typography>
                        </ListItemText>
                      </ListItem>
                    );
                  })}
                </List>
              ) : (
                <Alert severity="info">
                  No specific recommendations - User story appears to be well-structured.
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Strengths and Gaps */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: 'success.main', display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckIcon />
                Strengths
              </Typography>
              {analysis.strengths && analysis.strengths.length > 0 ? (
                <List dense>
                  {analysis.strengths.map((strength, index) => (
                    <ListItem key={index} sx={{ pl: 0 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CheckIcon color="success" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>
                        <Typography variant="body2">{strength}</Typography>
                      </ListItemText>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary" fontStyle="italic">
                  No specific strengths identified.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: 'warning.main', display: 'flex', alignItems: 'center', gap: 1 }}>
                <WarningIcon />
                Gaps Identified
              </Typography>
              {analysis.gapsIdentified && analysis.gapsIdentified.length > 0 ? (
                <List dense>
                  {analysis.gapsIdentified.map((gap, index) => (
                    <ListItem key={index} sx={{ pl: 0 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <WarningIcon color="warning" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>
                        <Typography variant="body2">{gap}</Typography>
                      </ListItemText>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary" fontStyle="italic">
                  No significant gaps identified.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Analysis Details */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Analysis Details
              </Typography>
              
              {rationale?.scoringExplanation && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" gutterBottom color="primary.main">
                    Scoring Rationale:
                  </Typography>
                  <Paper sx={{ p: 2, bgcolor: 'grey.50', borderLeft: 4, borderColor: 'primary.main' }}>
                    <Typography variant="body2">
                      {rationale.scoringExplanation}
                    </Typography>
                  </Paper>
                </Box>
              )}

              {rationale?.impactSummary && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" gutterBottom color="warning.main">
                    Impact Assessment:
                  </Typography>
                  <Paper sx={{ p: 2, bgcolor: 'warning.50', borderLeft: 4, borderColor: 'warning.main' }}>
                    <Typography variant="body2">
                      {rationale.impactSummary}
                    </Typography>
                  </Paper>
                </Box>
              )}

              {finalRecommendation && (
                <Box>
                  <Typography variant="subtitle2" gutterBottom color="info.main">
                    Final Recommendation:
                  </Typography>
                  <Alert severity="info" sx={{ '& .MuiAlert-message': { width: '100%' } }}>
                    <Typography variant="body2" fontWeight="medium">
                      {finalRecommendation}
                    </Typography>
                  </Alert>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Additional Information */}
        {(analysis.linkedTestCases?.length > 0 || analysis.sourceCitations?.length > 0) && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  References & Context
                </Typography>
                
                <Grid container spacing={3}>
                  {/* {analysis.linkedTestCases?.length > 0 && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" gutterBottom>
                        Linked Test Cases:
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {analysis.linkedTestCases.map((testCase, index) => (
                          <Chip
                            key={index}
                            label={testCase}
                            size="small"
                            variant="outlined"
                            color="primary"
                          />
                        ))}
                      </Box>
                    </Grid>
                  )} */}
                  
                  {analysis.sourceCitations?.length > 0 && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" gutterBottom>
                        Source Citations:
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {analysis.sourceCitations.map((citation, index) => (
                          <Chip
                            key={index}
                            label={citation}
                            size="small"
                            variant="outlined"
                            color="secondary"
                          />
                        ))}
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default UserStoryValidationResults;