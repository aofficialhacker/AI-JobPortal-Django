// src/components/JobListings.js
import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  Chip,
  Divider,
  Paper,
  CircularProgress,
  Alert,
} from '@mui/material';
import axios from 'axios';
import { Link } from 'react-router-dom';
import WorkIcon from '@mui/icons-material/Work';
import BusinessIcon from '@mui/icons-material/Business';
import LocationOnIcon from '@mui/icons-material/LocationOn';

function JobListings() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const userRole = localStorage.getItem('userRole'); // "candidate" or "recruiter"

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get('/api/jobs/', {
        headers: { Authorization: token ? `Bearer ${token}` : '' },
      });
      setJobs(response.data);
    } catch (err) {
      console.error('Error fetching jobs', err);
      setError('Failed to load jobs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleDelete = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job posting?')) return;
    try {
      const token = localStorage.getItem('accessToken');
      await axios.delete(`/api/jobs/${jobId}/`, {
        headers: { Authorization: token ? `Bearer ${token}` : '' },
      });
      // Refresh the job list after deletion
      fetchJobs();
    } catch (err) {
      console.error('Error deleting job', err);
      alert('Failed to delete the job posting.');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 5, mb: 8 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 3, backgroundColor: 'primary.main', color: 'white' }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Discover Your Next Career Opportunity
        </Typography>
        <Typography variant="subtitle1">
          Browse through our curated list of job openings from top employers.
        </Typography>
      </Paper>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : jobs.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
          <Typography variant="h6" color="text.secondary">
            No jobs available at the moment.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Please check back later for new opportunities.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {jobs.map((job) => (
            <Grid item xs={12} sm={6} md={4} key={job.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <CardContent sx={{ pb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <WorkIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {job.title}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <BusinessIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      {job.company || 'Company Name'}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocationOnIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      {job.location || 'Remote'}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Chip
                      label={job.status === 'close' ? 'Closed' : 'Open'}
                      color={job.status === 'close' ? 'error' : 'success'}
                      size="small"
                      variant="outlined"
                      sx={{ borderRadius: 1 }}
                    />
                  </Box>

                  <Divider sx={{ my: 1.5 }} />
                  <Typography variant="body2" color="text.primary" sx={{ mb: 2, minHeight: '60px' }}>
                    {job.description.length > 120 ? `${job.description.substring(0, 120)}...` : job.description}
                  </Typography>
                </CardContent>
                <CardActions sx={{ p: 2, pt: 0 }}>
                  {userRole === 'candidate' ? (
                    job.status === 'close' ? (
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        disabled
                        sx={{ borderRadius: 2, opacity: 0.7 }}
                      >
                        Position Closed
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        component={Link}
                        to={`/apply/${job.id}`}
                        sx={{ borderRadius: 2 }}
                      >
                        Apply Now
                      </Button>
                    )
                  ) : (
                    <>
                      <Button
                        variant="contained"
                        color="secondary"
                        fullWidth
                        component={Link}
                        to={`/jobs/edit/${job.id}`}
                        sx={{ borderRadius: 2 }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        fullWidth
                        onClick={() => handleDelete(job.id)}
                        sx={{ borderRadius: 2, mt: 1 }}
                      >
                        Delete
                      </Button>
                    </>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}

export default JobListings;
