// src/pages/BusinessAnalystJob.js
import React from 'react';
import { Container, Box } from '@mui/material';
import JobDetail from '../components/JobDetail';
import NavBar from '../components/NavBar';

function BusinessAnalystJob() {
  // Business Analyst job data
  const businessAnalystJob = {
    title: 'Business Analyst',
    company: 'LotusFlare',
    location: 'Silicon Valley',
    status: 'open',
    description: {
      introduction: 'LotusFlare is a provider of cloud-native SaaS products based in the heart of Silicon Valley. Founded by the team that helped Facebook reach over one billion users, LotusFlare was founded to make affordable mobile communications available to everyone on Earth. Today, LotusFlare focuses on designing, building, and continuously evolving a digital commerce and monetization platform that delivers valuable outcomes for enterprises. Our platform, Digital Network Operator (DNO ) Cloud, is licensed to telecommunications services providers and supports millions of customers globally. LotusFlare has also designed and built the leading eSIM travel product - Nomad. Nomad provides global travelers with high-speed, affordable data connectivity in over 190 countries. Nomad is available as an iOS or Android app or via getnomad.app. Job Description: We are seeking a Business Analyst (BA) with expertise in Telecom Business Support Systems (BSS) to join our team. The BA will work closely with stakeholders to analyze, document, and optimize BSS processes, value streams, capabilities, product requirements, process pain points, and business & project objectives at various levels of the organization. This role requires strong analytical skills, the ability to translate business needs into actionable requirements, and proficiency in Business Process Model and Notation (BPMN) for process visualization.',
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

  return (
    <Box>
      <NavBar />
      <JobDetail jobData={businessAnalystJob} />
    </Box>
  );
}

export default BusinessAnalystJob;