// src/components/PostJob.js
import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box, Paper, Divider } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function PostJob() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  // Default status can be "open"
  const [status, setStatus] = useState('open');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.post(
        '/api/jobs/',
        { title, description, status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Job posted successfully!');
      navigate('/');
    } catch (error) {
      console.error('Error posting job', error);
      alert('Error posting job');
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom>
          Post a Job
        </Typography>
        <Divider sx={{ mb: 3 }} />
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            label="Job Title"
            fullWidth
            margin="normal"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            sx={{ mb: 2 }}
          />
          
          <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
            Job Description
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Please enter a detailed job description with proper formatting. Use blank lines to separate paragraphs for better readability.
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={10}
            margin="normal"
            placeholder="Enter job description with proper paragraph spacing..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            sx={{ mb: 3 }}
          />
          
          <TextField
            label="Status"
            fullWidth
            margin="normal"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            sx={{ mb: 3 }}
          />
          
          <Button 
            variant="contained" 
            color="primary" 
            type="submit" 
            fullWidth 
            sx={{ mt: 2, py: 1.5, borderRadius: 2 }}
          >
            Post Job
          </Button>
        </Box>
      </Paper>
      
      {description && (
        <Paper elevation={2} sx={{ mt: 4, p: 4, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Preview Job Description
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ whiteSpace: 'pre-wrap' }}>
            {description.split('\n\n').map((paragraph, index) => (
              <Typography key={index} variant="body1" paragraph>
                {paragraph}
              </Typography>
            ))}
          </Box>
        </Paper>
      )}
    </Container>
  );
}

export default PostJob;
