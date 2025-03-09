// src/components/CandidateDashboard.js
import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Box,
  Grid,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Divider,
  TableContainer,
  TablePagination,
  TextField,
  InputAdornment,
  CircularProgress,
  Fade,
  Tooltip,
  useTheme,
  alpha,
} from '@mui/material';
import axios from 'axios';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import WorkIcon from '@mui/icons-material/Work';
import AssessmentIcon from '@mui/icons-material/Assessment';
import BusinessIcon from '@mui/icons-material/Business';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

function CandidateDashboard() {
  const theme = useTheme();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scoreMap, setScoreMap] = useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch candidate-specific applications
  useEffect(() => {
    async function fetchApplications() {
      setLoading(true);
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get('/api/candidate/applications/', {
          headers: { Authorization: token ? `Bearer ${token}` : '' },
        });
        setApplications(response.data);
      } catch (error) {
        console.error('Error fetching applications', error);
      } finally {
        setLoading(false);
      }
    }
    fetchApplications();
  }, []);

  // For each application, fetch its score from the dedicated score endpoint.
  useEffect(() => {
    async function updateScores() {
      const newScoreMap = {};
      const token = localStorage.getItem('accessToken');
      await Promise.all(
        applications.map(async (app) => {
          try {
            const scoreResponse = await axios.get(`/api/applications/${app.id}/score/`, {
              headers: { Authorization: token ? `Bearer ${token}` : '' },
            });
            newScoreMap[app.id] = scoreResponse.data.score;
          } catch (error) {
            console.error(`Error fetching score for application ${app.id}`, error);
            newScoreMap[app.id] = 'Error';
          }
        })
      );
      setScoreMap(newScoreMap);
    }
    if (applications.length > 0) {
      updateScores();
    }
  }, [applications]);

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle search
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  // Filter applications based on search term
  const filteredApplications = applications.filter((app) => {
    const jobTitle = app.job?.title?.toLowerCase() || '';
    const search = searchTerm.toLowerCase();
    return jobTitle.includes(search);
  });

  // Calculate summary metrics
  const totalApplications = applications.length;
  const pendingApplications = applications.filter(app => !scoreMap[app.id] || scoreMap[app.id] === 'Calculating...').length;
  const averageScore = Object.values(scoreMap).length > 0
    ? (Object.values(scoreMap).reduce((sum, score) => {
        const numScore = parseFloat(score);
        return isNaN(numScore) ? sum : sum + numScore;
      }, 0) / Object.values(scoreMap).length).toFixed(1)
    : 'N/A';

  // Get score color based on value
  const getScoreColor = (score) => {
    if (score === 'Calculating...' || score === 'Error' || score === 'N/A') return 'default';
    const numScore = parseFloat(score);
    if (isNaN(numScore)) return 'default';
    if (numScore >= 8) return 'success';
    if (numScore >= 6) return 'primary';
    if (numScore >= 4) return 'warning';
    return 'error';
  };

  // Get score progress value
  const getScoreProgress = (score) => {
    if (score === 'Calculating...' || score === 'Error' || score === 'N/A') return 0;
    const numScore = parseFloat(score);
    return isNaN(numScore) ? 0 : (numScore * 10);
  };

  // Get application status based on score
  const getApplicationStatus = (score) => {
    return 'Application Sent - Awaiting Recruiter Review';
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      {/* Enhanced Header Section */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 4, 
          mb: 4, 
          borderRadius: 3, 
          background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 2 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            My Applications
          </Typography>
          <Typography variant="subtitle1">
            Track and manage all your job applications in one place
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
            <Chip 
              icon={<TrendingUpIcon />} 
              label={`Average Match Score: ${averageScore}`}
              sx={{ 
                bgcolor: alpha('#fff', 0.2), 
                color: 'white', 
                fontWeight: 'bold',
                '& .MuiChip-icon': { color: 'white' } 
              }} 
            />
          </Box>
        </Box>
        
        {/* Decorative elements */}
        <Box sx={{ 
          position: 'absolute', 
          right: -20, 
          bottom: -20, 
          width: 200, 
          height: 200, 
          borderRadius: '50%', 
          bgcolor: alpha('#fff', 0.05),
          zIndex: 1
        }} />
        <Box sx={{ 
          position: 'absolute', 
          right: 40, 
          bottom: -60, 
          width: 120, 
          height: 120, 
          borderRadius: '50%', 
          bgcolor: alpha('#fff', 0.05),
          zIndex: 1
        }} />
      </Paper>

      {/* Enhanced Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Fade in={true} timeout={500}>
            <Card elevation={3} sx={{ 
              height: '100%', 
              borderRadius: 3, 
              transition: 'transform 0.3s, box-shadow 0.3s', 
              '&:hover': { 
                transform: 'translateY(-5px)', 
                boxShadow: theme.shadows[10] 
              } 
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ 
                    backgroundColor: 'primary.light', 
                    borderRadius: '50%', 
                    p: 1.5, 
                    mr: 2,
                    display: 'flex',
                    boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.4)}`
                  }}>
                    <PersonIcon color="primary" fontSize="medium" />
                  </Box>
                  <Typography variant="h6" color="text.secondary">
                    Total Applications
                  </Typography>
                </Box>
                <Typography variant="h3" fontWeight="bold" sx={{ ml: 1 }}>
                  {totalApplications}
                </Typography>
              </CardContent>
            </Card>
          </Fade>
        </Grid>
        <Grid item xs={12} md={4}>
          <Fade in={true} timeout={700}>
            <Card elevation={3} sx={{ 
              height: '100%', 
              borderRadius: 3, 
              transition: 'transform 0.3s, box-shadow 0.3s', 
              '&:hover': { 
                transform: 'translateY(-5px)', 
                boxShadow: theme.shadows[10] 
              } 
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ 
                    backgroundColor: 'success.light', 
                    borderRadius: '50%', 
                    p: 1.5, 
                    mr: 2,
                    display: 'flex',
                    boxShadow: `0 4px 14px ${alpha(theme.palette.success.main, 0.4)}`
                  }}>
                    <WorkIcon color="success" fontSize="medium" />
                  </Box>
                  <Typography variant="h6" color="text.secondary">
                    Pending Review
                  </Typography>
                </Box>
                <Typography variant="h3" fontWeight="bold" sx={{ ml: 1 }}>
                  {pendingApplications}
                </Typography>
              </CardContent>
            </Card>
          </Fade>
        </Grid>
        <Grid item xs={12} md={4}>
          <Fade in={true} timeout={900}>
            <Card elevation={3} sx={{ 
              height: '100%', 
              borderRadius: 3, 
              transition: 'transform 0.3s, box-shadow 0.3s', 
              '&:hover': { 
                transform: 'translateY(-5px)', 
                boxShadow: theme.shadows[10] 
              } 
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ 
                    backgroundColor: 'info.light', 
                    borderRadius: '50%', 
                    p: 1.5, 
                    mr: 2,
                    display: 'flex',
                    boxShadow: `0 4px 14px ${alpha(theme.palette.info.main, 0.4)}`
                  }}>
                    <AssessmentIcon color="info" fontSize="medium" />
                  </Box>
                  <Typography variant="h6" color="text.secondary">
                    Average Score
                  </Typography>
                </Box>
                <Typography variant="h3" fontWeight="bold" sx={{ ml: 1 }}>
                  {averageScore}
                </Typography>
              </CardContent>
            </Card>
          </Fade>
        </Grid>
      </Grid>

      {/* Enhanced Search and Filter */}
      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by job title"
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="primary" />
              </InputAdornment>
            ),
          }}
          sx={{ 
            backgroundColor: 'white',
            borderRadius: 2,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.primary.main,
              },
            },
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
          }}
        />
      </Box>

      {loading ? (
        <Fade in={loading}>
          <Paper elevation={3} sx={{ p: 5, textAlign: 'center', borderRadius: 3 }}>
            <CircularProgress size={60} thickness={4} sx={{ mb: 2 }} />
            <Typography variant="h6" sx={{ ml: 2 }}>Loading your applications...</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Please wait while we fetch your application data
            </Typography>
          </Paper>
        </Fade>
      ) : filteredApplications.length === 0 ? (
        <Fade in={!loading}>
          <Paper sx={{ p: 5, textAlign: 'center', borderRadius: 3, bgcolor: alpha(theme.palette.background.paper, 0.8) }}>
            <Box sx={{ mb: 3 }}>
              <WorkIcon sx={{ fontSize: 60, color: 'text.secondary', opacity: 0.6 }} />
            </Box>
            <Typography variant="h5" color="text.secondary" gutterBottom>
              No applications found
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1, maxWidth: 500, mx: 'auto' }}>
              {searchTerm ? 'Try adjusting your search criteria or use different keywords.' : 'You have not applied to any jobs yet. Start exploring opportunities!'}
            </Typography>
          </Paper>
        </Fade>
      ) : (
        <Fade in={!loading}>
          <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 3, boxShadow: theme.shadows[3] }}>
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ 
                      fontWeight: 'bold', 
                      backgroundColor: alpha(theme.palette.primary.light, 0.1),
                      color: theme.palette.primary.dark,
                      fontSize: '0.95rem'
                    }}>Job Title</TableCell>
                    <TableCell sx={{ 
                      fontWeight: 'bold', 
                      backgroundColor: alpha(theme.palette.primary.light, 0.1),
                      color: theme.palette.primary.dark,
                      fontSize: '0.95rem'
                    }}>Company</TableCell>
                    <TableCell sx={{ 
                      fontWeight: 'bold', 
                      backgroundColor: alpha(theme.palette.primary.light, 0.1),
                      color: theme.palette.primary.dark,
                      fontSize: '0.95rem'
                    }}>Applied Date</TableCell>
                    <TableCell sx={{ 
                      fontWeight: 'bold', 
                      backgroundColor: alpha(theme.palette.primary.light, 0.1),
                      color: theme.palette.primary.dark,
                      fontSize: '0.95rem'
                    }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredApplications
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((app) => (
                      <TableRow 
                        key={app.id} 
                        hover 
                        sx={{ 
                          '&:last-child td, &:last-child th': { border: 0 },
                          transition: 'background-color 0.2s',
                          cursor: 'pointer',
                          '&:hover': {
                            backgroundColor: alpha(theme.palette.primary.light, 0.05)
                          }
                        }}
                      >
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <WorkIcon fontSize="small" sx={{ mr: 1.5, color: theme.palette.primary.main }} />
                            <Typography variant="body1" fontWeight="medium">
                              {app.job && app.job.title ? app.job.title : app.job_title || 'N/A'}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <BusinessIcon fontSize="small" sx={{ mr: 1.5, color: 'text.secondary' }} />
                            <Typography variant="body2">
                              {app.job && app.job.company ? app.job.company : app.company || 'Company Name'}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <CalendarTodayIcon fontSize="small" sx={{ mr: 1.5, color: 'text.secondary' }} />
                            <Typography variant="body2">{new Date(app.applied_at).toLocaleDateString()}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Tooltip title={`Match score: ${scoreMap[app.id] || 'Calculating...'}`} arrow placement="top">
                            <Chip 
                              label={getApplicationStatus(scoreMap[app.id])} 
                              color={getScoreColor(scoreMap[app.id])} 
                              size="small"
                              sx={{ 
                                minWidth: '120px', 
                                justifyContent: 'center',
                                fontWeight: 'medium',
                                boxShadow: '0 2px 5px rgba(0,0,0,0.08)'
                              }}
                            />
                          </Tooltip>
                          {scoreMap[app.id] && scoreMap[app.id] !== 'Error' && scoreMap[app.id] !== 'N/A' && (
                            <Box sx={{ width: '100%', mt: 1 }}>
                              <LinearProgress 
                                variant="determinate" 
                                value={getScoreProgress(scoreMap[app.id])} 
                                sx={{ 
                                  height: 6, 
                                  borderRadius: 3,
                                  bgcolor: alpha(theme.palette.grey[500], 0.2),
                                  '& .MuiLinearProgress-bar': {
                                    borderRadius: 3,
                                  }
                                }}
                              />
                            </Box>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredApplications.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{ 
                borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
                  color: theme.palette.text.secondary
                }
              }}
            />
          </Paper>
        </Fade>
      )}
    </Container>
  );
}

export default CandidateDashboard;