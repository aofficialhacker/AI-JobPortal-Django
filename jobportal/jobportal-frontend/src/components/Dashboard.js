// src/components/Dashboard.js
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
  IconButton,
  CircularProgress,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import axios from 'axios';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import WorkIcon from '@mui/icons-material/Work';
import AssessmentIcon from '@mui/icons-material/Assessment';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import VideocamIcon from '@mui/icons-material/Videocam';

function Dashboard() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scoreMap, setScoreMap] = useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusMenuAnchorEl, setStatusMenuAnchorEl] = useState(null);
  const [selectedApplicationId, setSelectedApplicationId] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Fetch recruiter-specific applications
  useEffect(() => {
    async function fetchApplications() {
      setLoading(true);
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get('/api/recruiter/applications/', {
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

  // Handle status menu open
  const handleStatusMenuOpen = (event, applicationId) => {
    setStatusMenuAnchorEl(event.currentTarget);
    setSelectedApplicationId(applicationId);
  };

  // Handle status menu close
  const handleStatusMenuClose = () => {
    setStatusMenuAnchorEl(null);
    setSelectedApplicationId(null);
  };

  // Handle status update
  const handleStatusUpdate = async (newStatus) => {
    if (!selectedApplicationId) return;
    
    setUpdatingStatus(true);
    try {
      const token = localStorage.getItem('accessToken');
      await axios.patch(
        `/api/applications/${selectedApplicationId}/status/`,
        { status: newStatus },
        { headers: { Authorization: token ? `Bearer ${token}` : '' } }
      );
      
      // Update the local state
      setApplications(applications.map(app => 
        app.id === selectedApplicationId ? { ...app, status: newStatus } : app
      ));
      
      handleStatusMenuClose();
    } catch (error) {
      console.error('Error updating application status', error);
    } finally {
      setUpdatingStatus(false);
    }
  };

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
    const candidateName = app.candidate?.toLowerCase() || '';
    const jobTitle = app.job_title?.toLowerCase() || '';
    const search = searchTerm.toLowerCase();
    return candidateName.includes(search) || jobTitle.includes(search);
  });

  // Calculate summary metrics
  const totalApplications = applications.length;
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

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Menu
        anchorEl={statusMenuAnchorEl}
        open={Boolean(statusMenuAnchorEl)}
        onClose={handleStatusMenuClose}
      >
        <MenuItem onClick={() => handleStatusUpdate('Interviewed')}>
          <ListItemIcon>
            <VideocamIcon fontSize="small" color="info" />
          </ListItemIcon>
          <ListItemText>Mark as Interviewed</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleStatusUpdate('Selected')}>
          <ListItemIcon>
            <CheckCircleIcon fontSize="small" color="success" />
          </ListItemIcon>
          <ListItemText>Mark as Selected</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleStatusUpdate('Rejected')}>
          <ListItemIcon>
            <CancelIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Mark as Rejected</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleStatusUpdate('On Hold')}>
          <ListItemIcon>
            <PauseCircleIcon fontSize="small" color="warning" />
          </ListItemIcon>
          <ListItemText>Put On Hold</ListItemText>
        </MenuItem>
      </Menu>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Recruiter Dashboard
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Manage and review all job applications in one place
        </Typography>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card elevation={2}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ 
                  backgroundColor: 'primary.light', 
                  borderRadius: '50%', 
                  p: 1, 
                  mr: 2,
                  display: 'flex'
                }}>
                  <PersonIcon color="primary" />
                </Box>
                <Typography variant="h6" color="text.secondary">
                  Total Applications
                </Typography>
              </Box>
              <Typography variant="h3" fontWeight="bold">
                {totalApplications}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card elevation={2}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ 
                  backgroundColor: 'success.light', 
                  borderRadius: '50%', 
                  p: 1, 
                  mr: 2,
                  display: 'flex'
                }}>
                  <WorkIcon color="success" />
                </Box>
                <Typography variant="h6" color="text.secondary">
                  Open Positions
                </Typography>
              </Box>
              <Typography variant="h3" fontWeight="bold">
                {/* This would ideally come from an API call */}
                {new Set(applications.map(app => app.job?.id).filter(Boolean)).size}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card elevation={2}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ 
                  backgroundColor: 'warning.light', 
                  borderRadius: '50%', 
                  p: 1, 
                  mr: 2,
                  display: 'flex'
                }}>
                  <AssessmentIcon color="warning" />
                </Box>
                <Typography variant="h6" color="text.secondary">
                  Average Score
                </Typography>
              </Box>
              <Typography variant="h3" fontWeight="bold">
                {averageScore}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search and Filter */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by candidate name or job title"
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
          sx={{ backgroundColor: 'white' }}
        />
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
          <CircularProgress />
          <Typography variant="h6" sx={{ ml: 2 }}>Loading applications...</Typography>
        </Box>
      ) : filteredApplications.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
          <Typography variant="h6" color="text.secondary">
            No applications found.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {searchTerm ? 'Try adjusting your search criteria.' : 'Applications will appear here once candidates apply.'}
          </Typography>
        </Paper>
      ) : (
        <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 2 }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'background.paper' }}>Application ID</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'background.paper' }}>Candidate</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'background.paper' }}>Job</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'background.paper' }}>Parsed Details</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'background.paper' }}>Score</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'background.paper' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredApplications
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((app) => (
                    <TableRow key={app.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell>
                        <Chip 
                          label={`#${app.id}`} 
                          size="small" 
                          color="primary" 
                          variant="outlined" 
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <PersonIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                          <Typography variant="body2">{app.candidate_username || 'N/A'}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <WorkIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                          <Typography variant="body2">{app.job_title || 'N/A'}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            whiteSpace: 'pre-line',
                            maxHeight: '100px',
                            overflow: 'auto',
                            p: 1,
                            border: '1px solid #eee',
                            borderRadius: 1,
                            backgroundColor: '#f9f9f9'
                          }}
                        >
                          {typeof app.parsed_fields === 'object'
                            ? app.parsed_fields.parsed_summary
                            : app.parsed_fields}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <Chip 
                            label={scoreMap[app.id] || 'Calculating...'} 
                            color={getScoreColor(scoreMap[app.id])} 
                            size="small"
                            sx={{ mb: 1, minWidth: '80px', justifyContent: 'center' }}
                          />
                          <LinearProgress 
                            variant="determinate" 
                            value={getScoreProgress(scoreMap[app.id])} 
                            sx={{ width: '100%', height: 6, borderRadius: 3 }}
                            color={getScoreColor(scoreMap[app.id])}
                          />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <IconButton 
                          size="small" 
                          onClick={(e) => handleStatusMenuOpen(e, app.id)}
                          disabled={updatingStatus}
                        >
                          <MoreVertIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Divider />
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredApplications.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      )}
    </Container>
  );
}

export default Dashboard;
