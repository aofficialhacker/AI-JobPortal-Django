import React, { useState } from 'react';
import { 
  TextField, 
  Button, 
  Container, 
  Typography, 
  Box, 
  Paper, 
  InputAdornment, 
  Avatar, 
  IconButton,
  MenuItem,
  Snackbar,
  Alert,
  CircularProgress,
  Divider,
  useTheme,
  useMediaQuery,
  FormControl,
  InputLabel,
  Select,
  FormHelperText
} from '@mui/material';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import VpnKeyOutlinedIcon from '@mui/icons-material/VpnKeyOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import GoogleIcon from '@mui/icons-material/Google';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('candidate');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const validateForm = () => {
    const errors = {};
    
    if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters long';
    }
    
    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    if (!email.match(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/)) {
      errors.email = 'Please enter a valid email address';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      await axios.post('http://127.0.0.1:8000/api/auth/register/', { 
        username, 
        email, 
        password, 
        role 
      });
      
      setOpenSnackbar(true);
      
      // Redirect to login after successful registration with delay for snackbar
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      console.error('Registration failed', error);
      setError(
        error.response?.data?.detail || 
        'Registration failed. Please try again with different credentials.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container maxWidth="sm">
      <Paper 
        elevation={6} 
        sx={{ 
          mt: isMobile ? 4 : 8, 
          p: isMobile ? 3 : 4, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          borderRadius: 3,
          background: `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
        }}
      >
        <Avatar sx={{ 
          m: 1, 
          bgcolor: 'secondary.main', 
          width: 56, 
          height: 56,
          boxShadow: 2
        }}>
          <PersonAddOutlinedIcon fontSize="large" />
        </Avatar>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom 
          fontWeight="500"
          sx={{ 
            color: 'secondary.main',
            letterSpacing: '-0.5px'
          }}
        >
          Create Account
        </Typography>
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ mb: 3, textAlign: 'center' }}
        >
          Join our platform and find your dream job or ideal candidate
        </Typography>
        
        {error && (
          <Alert 
            severity="error" 
            sx={{ width: '100%', mb: 2 }}
          >
            {error}
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
          <TextField
            label="Username"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonAddOutlinedIcon color="secondary" />
                </InputAdornment>
              ),
            }}
            sx={{ 
              mb: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&:hover fieldset': {
                  borderColor: 'secondary.light',
                },
              }
            }}
          />
          
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            error={!!formErrors.email}
            helperText={formErrors.email}
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailOutlinedIcon color="secondary" />
                </InputAdornment>
              ),
            }}
            sx={{ 
              mb: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&:hover fieldset': {
                  borderColor: 'secondary.light',
                },
              }
            }}
          />
          
          <TextField
            label="Password"
            type={showPassword ? 'text' : 'password'}
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            error={!!formErrors.password}
            helperText={formErrors.password}
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <VpnKeyOutlinedIcon color="secondary" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton 
                    onClick={togglePasswordVisibility}
                    edge="end"
                    aria-label="toggle password visibility"
                  >
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ 
              mb: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&:hover fieldset': {
                  borderColor: 'secondary.light',
                },
              }
            }}
          />
          
          <TextField
            label="Confirm Password"
            type={showPassword ? 'text' : 'password'}
            fullWidth
            margin="normal"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            error={!!formErrors.confirmPassword}
            helperText={formErrors.confirmPassword}
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <VpnKeyOutlinedIcon color="secondary" />
                </InputAdornment>
              ),
            }}
            sx={{ 
              mb: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&:hover fieldset': {
                  borderColor: 'secondary.light',
                },
              }
            }}
          />
          
          <FormControl 
            fullWidth 
            variant="outlined" 
            margin="normal"
            sx={{ 
              mb: 3,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&:hover fieldset': {
                  borderColor: 'secondary.light',
                },
              }
            }}
          >
            <InputLabel id="role-select-label">I am a</InputLabel>
            <Select
              labelId="role-select-label"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              label="I am a"
              startAdornment={
                <InputAdornment position="start">
                  {role === 'candidate' ? 
                    <SchoolOutlinedIcon color="secondary" /> : 
                    <WorkOutlineIcon color="secondary" />
                  }
                </InputAdornment>
              }
            >
              <MenuItem value="candidate">Candidate (Looking for a job)</MenuItem>
              <MenuItem value="recruiter">Recruiter (Hiring talent)</MenuItem>
            </Select>
            <FormHelperText>Select your account type</FormHelperText>
          </FormControl>
          
          <Button 
            variant="contained" 
            color="secondary" 
            type="submit" 
            fullWidth 
            size="large"
            disabled={isLoading}
            sx={{ 
              mt: 1, 
              py: 1.5, 
              borderRadius: 2,
              fontWeight: 'bold',
              boxShadow: 3,
              '&:hover': { 
                boxShadow: 5,
                background: `linear-gradient(45deg, ${theme.palette.secondary.main} 30%, ${theme.palette.secondary.dark} 90%)`,
                transform: 'translateY(-2px)'
              },
              transition: 'all 0.3s ease-in-out'
            }}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Create Account'
            )}
          </Button>
          
          <Box sx={{ position: 'relative', my: 3 }}>
            <Divider>
              <Typography variant="body2" color="text.secondary" sx={{ px: 1 }}>
                OR
              </Typography>
            </Divider>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <Button
              fullWidth
              variant="outlined"
              color="secondary"
              startIcon={<GoogleIcon />}
              sx={{ 
                py: 1.5, 
                borderRadius: 2,
                '&:hover': { 
                  backgroundColor: 'rgba(66, 133, 244, 0.04)',
                  borderColor: '#4285F4',
                },
              }}
            >
              Google
            </Button>
            <Button
              fullWidth
              variant="outlined"
              color="secondary"
              startIcon={<LinkedInIcon />}
              sx={{ 
                py: 1.5, 
                borderRadius: 2,
                '&:hover': { 
                  backgroundColor: 'rgba(10, 102, 194, 0.04)',
                  borderColor: '#0A66C2',
                },
              }}
            >
              LinkedIn
            </Button>
          </Box>
          
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{' '}
              <Link 
                to="/login" 
                style={{ 
                  color: theme.palette.secondary.main, 
                  fontWeight: 600,
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}
              >
                Sign in
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
      
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity="success" 
          sx={{ width: '100%' }}
        >
          Registration successful! Redirecting to login...
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default Register;