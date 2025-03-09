// src/components/ApplyJob.js
import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Paper,
  Card,
  CardContent,
  Divider,
  Grid,
  CircularProgress,
  Alert,
  Stack
} from '@mui/material';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import WorkIcon from '@mui/icons-material/Work';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import ArticleIcon from '@mui/icons-material/Article';

function ApplyJob() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const [jobDetails, setJobDetails] = useState(null);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);

  // Fetch job details
  useEffect(() => {
    async function fetchJobDetails() {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get(`/api/jobs/${jobId}/`, {
          headers: { Authorization: token ? `Bearer ${token}` : '' },
        });
        setJobDetails(response.data);
      } catch (err) {
        console.error('Error fetching job details', err);
        setError('Could not load job details. Please try again later.');
      }
    }
    fetchJobDetails();
  }, [jobId]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check for PDF file type using both MIME type and file extension
      const isPdf = file.type === 'application/pdf' ||
        file.name.toLowerCase().endsWith('.pdf');

      if (!isPdf) {
        setError('Please upload a PDF file only');
        return;
      }
      setError('');
      setResume(file);
    }
  };

  // Handle drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  // Handle drop event
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      // Check for PDF file type using both MIME type and file extension
      const isPdf = file.type === 'application/pdf' ||
        file.name.toLowerCase().endsWith('.pdf');

      if (!isPdf) {
        setError('Please upload a PDF file only');
        return;
      }
      setError('');
      setResume(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resume) {
      setError('Please select a resume file.');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('job', jobDetails?._id || jobDetails?.id || jobId);
    formData.append('resume', resume);

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError('You must be logged in to submit an application.');
        setLoading(false);
        return;
      }

      await axios.post('/api/applications/', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert('Application submitted successfully!');
      navigate('/');
    } catch (err) {
      console.error('Application submission failed', err);

      if (err.response) {
        if (err.response.status === 400) {
          setError('Invalid application data. Please check your resume format (PDF only).');
        } else if (err.response.status === 401) {
          setError('Authentication error. Please log in again.');
        } else if (err.response.status === 413) {
          setError('Resume file is too large. Please upload a smaller file.');
        } else {
          setError(`Application submission failed: ${err.response.data?.message || 'Please try again.'}`);
        }
      } else if (err.request) {
        setError('No response from server. Please check your internet connection and try again.');
      } else {
        setError(`Application submission failed: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5, mb: 8 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 3, backgroundColor: 'primary.main', color: 'white' }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Apply for Job
        </Typography>
        <Typography variant="subtitle1">
          Submit your resume to apply for this position
        </Typography>
      </Paper>

      <Card sx={{ mb: 4, borderRadius: 2 }}>
        <CardContent sx={{ p: 3 }}>
          {jobDetails ? (
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <WorkIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h5" fontWeight="bold">
                  {jobDetails.title}
                </Typography>
              </Box>

              {jobDetails.company && (
                <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                  Company: {jobDetails.company}
                </Typography>
              )}

              <Divider sx={{ my: 2 }} />

              <Typography variant="body1" style={{
                whiteSpace: 'pre-line', // preserves line breaks
                // or pre-wrap if you also need to preserve consecutive spaces
              }} sx={{ mb: 2 }} >
                {jobDetails.description}
              </Typography>
            </Box>
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          )}
        </CardContent>
      </Card>

      <Card sx={{ borderRadius: 2 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Submit Your Application
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Please upload your resume in PDF format. Make sure your resume is up-to-date and highlights your relevant skills and experience.
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Box
              sx={{
                border: '2px dashed',
                borderColor: dragActive ? 'primary.main' : 'grey.300',
                borderRadius: 2,
                p: 3,
                mb: 3,
                textAlign: 'center',
                backgroundColor: dragActive ? 'rgba(25, 118, 210, 0.04)' : 'transparent',
                transition: 'all 0.2s ease-in-out',
                cursor: 'pointer',
              }}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => document.getElementById('resume-upload').click()}
            >
              <input
                type="file"
                id="resume-upload"
                accept="application/pdf"
                hidden
                onChange={handleFileChange}
              />

              <UploadFileIcon color="primary" sx={{ fontSize: 48, mb: 2 }} />

              <Typography variant="body1" gutterBottom>
                {resume ? 'Replace your resume' : 'Drag & drop your resume here'}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                or click to browse (PDF only)
              </Typography>
            </Box>

            {resume && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  p: 2,
                  mb: 3,
                  backgroundColor: 'rgba(25, 118, 210, 0.08)',
                  borderRadius: 2
                }}
              >
                <ArticleIcon color="primary" sx={{ mr: 2 }} />
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="body1" fontWeight="medium">
                    {resume.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {(resume.size / 1024).toFixed(2)} KB
                  </Typography>
                </Box>
              </Box>
            )}

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={handleCancel}
                  sx={{ py: 1.5, borderRadius: 2 }}
                >
                  Cancel
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={loading || !resume}
                  sx={{ py: 1.5, borderRadius: 2 }}
                >
                  {loading ? <CircularProgress size={24} /> : 'Submit Application'}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}

export default ApplyJob;
