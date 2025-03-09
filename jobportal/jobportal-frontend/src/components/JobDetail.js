// src/components/JobDetail.js
import React from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Card,
  CardContent,
  Divider,
  Chip,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';
import BusinessIcon from '@mui/icons-material/Business';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SchoolIcon from '@mui/icons-material/School';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

function JobDetail({ jobData }) {
  // If no job data is provided, use the sample Business Analyst data
  const job = jobData || {
    title: 'Business Analyst',
    company: 'LotusFlare',
    location: 'Silicon Valley',
    status: 'open',
    description: {
      introduction: 'LotusFlare is a provider of cloud-native SaaS products based in the heart of Silicon Valley. Founded by the team that helped Facebook reach over one billion users, LotusFlare was founded to make affordable mobile communications available to everyone on Earth. Today, LotusFlare focuses on designing, building, and continuously evolving a digital commerce and monetization platform that delivers valuable outcomes for enterprises. Our platform, Digital Network Operator (DNO ) Cloud, is licensed to telecommunications services providers and supports millions of customers globally. LotusFlare has also designed and built the leading eSIM travel product - Nomad. Nomad provides global travelers with high-speed, affordable data connectivity in over 190 countries. Nomad is available as an iOS or Android app or via getnomad.app.',
      responsibilities: [
        'Analyze and document BSS business processes, value streams, and capabilities to identify optimization opportunities.',
        'Collaborate with stakeholders to define and document business requirements, product modeling needs, and process pain points.',
        'Model end-to-end business processes, workflows, and interactions.',
        'Work with product and technical teams to ensure alignment of business needs with BSS solutions.',
        'Assist in defining KPIs, business outcomes, and success criteria for BSS transformation initiatives.',
        'Provide data-driven insights to improve decision-making and process efficiency.'
      ],
      qualifications: {
        role: 'Business Analyst',
        industry: 'IT Services & Consulting',
        department: 'Data Science & Analytics',
        employmentType: 'Full Time, Permanent',
        category: 'Business Intelligence & Analytics',
        education: 'UG: Any Graduate PG: Any Postgraduate',
        skills: [
          'Business process',
          'Analytical skills',
          'Telecom',
          'BSS',
          'Business Analysis',
          'Process efficiency',
          'Cloud',
          'Commerce',
          'iOS',
          'Android'
        ]
      }
    }
  };

  // Extract description parts or use defaults
  const introduction = typeof job.description === 'object' ? job.description.introduction : job.description;
  const responsibilities = typeof job.description === 'object' ? job.description.responsibilities : [];
  const qualifications = typeof job.description === 'object' ? job.description.qualifications : null;

  // Function to format text with proper paragraph spacing
  const formatDescription = (text) => {
    if (!text) return null;
    
    // Split text by double newlines to identify paragraphs
    const paragraphs = text.split('\n\n');
    
    // If there's only one paragraph, check for single newlines
    if (paragraphs.length === 1) {
      const singleLineParagraphs = text.split('\n');
      if (singleLineParagraphs.length > 1) {
        return singleLineParagraphs.map((paragraph, index) => (
          <Typography key={index} variant="body1" paragraph>
            {paragraph}
          </Typography>
        ));
      }
    }
    
    return paragraphs.map((paragraph, index) => (
      <Typography key={index} variant="body1" paragraph>
        {paragraph}
      </Typography>
    ));
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5, mb: 8 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 3, backgroundColor: 'primary.main', color: 'white' }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          {job.title}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
          <BusinessIcon sx={{ mr: 1 }} />
          <Typography variant="subtitle1">
            {job.company}
          </Typography>
          <Box sx={{ mx: 2 }}>•</Box>
          <LocationOnIcon sx={{ mr: 1 }} />
          <Typography variant="subtitle1">
            {job.location || 'Remote'}
          </Typography>
          <Box sx={{ mx: 2 }}>•</Box>
          <Chip
            label={job.status === 'close' ? 'Closed' : 'Open'}
            color={job.status === 'close' ? 'error' : 'success'}
            size="small"
            sx={{ borderRadius: 1, color: 'white', fontWeight: 'bold' }}
          />
        </Box>
      </Paper>
      
      <Card sx={{ mb: 4, borderRadius: 2 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            About the Role
          </Typography>
          <Divider sx={{ my: 2 }} />
          
          <Box sx={{ whiteSpace: 'pre-wrap' }}>
            {formatDescription(introduction)}
          </Box>
          
          {responsibilities && responsibilities.length > 0 && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Key Responsibilities
              </Typography>
              <List>
                {responsibilities.map((responsibility, index) => (
                  <ListItem key={index} sx={{ py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <CheckCircleOutlineIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={responsibility} />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
          
          {qualifications && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Qualifications
              </Typography>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                {qualifications.role && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Role:</strong> {qualifications.role}
                    </Typography>
                  </Grid>
                )}
                {qualifications.industry && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Industry Type:</strong> {qualifications.industry}
                    </Typography>
                  </Grid>
                )}
                {qualifications.department && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Department:</strong> {qualifications.department}
                    </Typography>
                  </Grid>
                )}
                {qualifications.employmentType && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Employment Type:</strong> {qualifications.employmentType}
                    </Typography>
                  </Grid>
                )}
                {qualifications.category && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Role Category:</strong> {qualifications.category}
                    </Typography>
                  </Grid>
                )}
                {qualifications.education && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Education:</strong> {qualifications.education}
                    </Typography>
                  </Grid>
                )}
              </Grid>
              
              {qualifications.skills && qualifications.skills.length > 0 && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="body2" fontWeight="medium" gutterBottom>
                    Key Skills
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                    {qualifications.skills.map((skill, index) => (
                      <Chip 
                        key={index} 
                        label={skill} 
                        size="small" 
                        color="primary" 
                        variant="outlined"
                        sx={{ borderRadius: 1 }}
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </Box>
          )}
        </CardContent>
      </Card>
    </Container>
  );
}

export default JobDetail;