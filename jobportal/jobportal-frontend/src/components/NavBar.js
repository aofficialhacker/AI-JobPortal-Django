// src/components/NavBar.js
import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Container, Avatar } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import WorkIcon from '@mui/icons-material/Work';

function NavBar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('accessToken');
  const userRole = localStorage.getItem('userRole'); // Ensure this is set upon login

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  return (
    <AppBar position="static" elevation={4} sx={{ backgroundColor: 'primary.main' }}>
      <Container maxWidth="lg">
        <Toolbar sx={{ py: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
            <Avatar sx={{ bgcolor: 'secondary.main', mr: 1 }}>
              <WorkIcon />
            </Avatar>
            <Typography 
              variant="h5" 
              component={Link} 
              to="/" 
              sx={{ 
                flexGrow: 1, 
                fontWeight: 'bold',
                textDecoration: 'none',
                color: 'white',
                '&:hover': { opacity: 0.9 }
              }}
            >
              Job Portal
            </Typography>
          </Box>
          
          <Box sx={{ flexGrow: 1 }} />
          
          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
            {token &&(
              <Button 
              color="inherit" 
              component={Link} 
              to="/" 
              sx={{ 
                fontWeight: 'medium',
                borderRadius: 2,
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
              }}
            >
              Jobs
            </Button>
            )}
            
            {token ? (
              <>
                {userRole === 'recruiter' && (
                  <>
                    <Button 
                      color="inherit" 
                      component={Link} 
                      to="/post-job"
                      sx={{ 
                        fontWeight: 'medium',
                        borderRadius: 2,
                        '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
                      }}
                    >
                      Post Job
                    </Button>
                    <Button 
                      color="inherit" 
                      component={Link} 
                      to="/dashboard"
                      sx={{ 
                        fontWeight: 'medium',
                        borderRadius: 2,
                        '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
                      }}
                    >
                      Dashboard
                    </Button>
                  </>
                )}
                {userRole === 'candidate' && (
                  <Button 
                    color="inherit" 
                    component={Link} 
                    to="/my-applications"
                    sx={{ 
                      fontWeight: 'medium',
                      borderRadius: 2,
                      '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
                    }}
                  >
                    My Applications
                  </Button>
                )}
                <Button 
                  variant="outlined" 
                  color="inherit" 
                  onClick={handleLogout}
                  sx={{ 
                    borderColor: 'white', 
                    '&:hover': { 
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      borderColor: 'white'
                    }
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button 
                  color="inherit" 
                  component={Link} 
                  to="/login"
                  sx={{ 
                    fontWeight: 'medium',
                    borderRadius: 2,
                    '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
                  }}
                >
                  Login
                </Button>
                <Button 
                  variant="outlined" 
                  color="inherit" 
                  component={Link} 
                  to="/register"
                  sx={{ 
                    borderColor: 'white', 
                    '&:hover': { 
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      borderColor: 'white'
                    }
                  }}
                >
                  Register
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default NavBar;
