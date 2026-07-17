import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

// Custom hook to fetch and manage survey data
// accessTokenParam: optional override; if not provided, reads from URL query string
export const useSurvey = (accessTokenParam) => {
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const queryParams = new URLSearchParams(location.search);
  // Prefer the directly passed token, fall back to URL param
  const accessToken = accessTokenParam || queryParams.get('accessToken');

  const [survey, setSurvey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Convert an Imgur page URL (imgur.com/xxx) to its direct image format
  // (i.imgur.com/xxx.jpg). Any other host is left untouched — rewriting it
  // here would silently break images hosted anywhere else.
  const processImgurUrl = (url) => {
    if (!url) return null;
    if (!url.includes('imgur.com') || url.includes('i.imgur.com')) return url;
    const imageId = url.split('/').pop().split('.')[0];
    return imageId ? `https://i.imgur.com/${imageId}.jpg` : url;
  };

  // Convert YouTube URL to embed format for iframe
  const processYoutubeUrl = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = (match && match[2].length === 11) ? match[2] : null;
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  };

  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        // Check if user is authenticated before fetching
        if (!user) {
          return;
        }

        // Get authentication token from localStorage
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Authentication token not found');

        // Fetch survey data from API
        const apiUrl = `https://enova-backend.onrender.com/api/surveys/respond?accessToken=${accessToken}`;
        
        const response = await fetch(apiUrl, {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        // Parse response data (read the body once, whether it's an error or not)
        const rawText = await response.text();
        let surveyData;
        try {
          surveyData = rawText ? JSON.parse(rawText) : null;
        } catch (parseError) {
          throw new Error('Invalid JSON response from API');
        }

        if (!response.ok) {
          throw new Error(surveyData?.message || 'Error fetching survey');
        }

        if (!surveyData) throw new Error('Survey not found');

        // Parse questions (handle both string and object formats)
        let questions = typeof surveyData.questions === 'string' 
          ? JSON.parse(surveyData.questions) 
          : surveyData.questions;

        // Normalize question structure for consistent handling
        questions = questions.map((q, index) => {
          // Handle simple string questions (convert to object)
          if (typeof q === 'string') {
            return {
              questionId: index + 1,
              question: q,
              type: 'text',
              multipleSelections: false, // Text questions are single selection by default
              answerLength: null,
              otherOption: false, // Text questions don't have "other" option
              otherOptionText: null
            };
          }
          
          // Handle full question objects
          const questionId = q.id || q.questionId || index + 1;
          
          // Convert "yes"/"no" to boolean for internal use
          const isMultiple = q.multipleSelections === "yes";
          
          // Detect if question has "other" option enabled (accepts multiple formats)
          const hasOtherOption = 
            q.otherOption === true || 
            q.otherOption === 'true' || 
            q.otherOption === 'yes' || 
            q.otherOption === 1 ||
            q.otherOption === '1';
          
          // Get the custom text for "other" option or use default
          const otherOptionText = q.otherOptionText || 'Otro (especificar)';
          
          // Create normalized question object with all required fields
          const normalizedQuestion = {
            questionId,
            id: questionId,
            question: q.question || q.text,
            type: q.type || 'text',
            options: q.options || [],
            multipleSelections: isMultiple, // Store as boolean internally
            selectionLimit: q.selectionLimit, // Preserve selection limit from API
            originalMultipleSelection: q.multipleSelections, // Keep original value
            imagem: q.imagem ? processImgurUrl(q.imagem) : null,
            video: q.video ? processYoutubeUrl(q.video) : null,
            answerLength: q.answerLength ? String(q.answerLength) : null,
            required: q.required || false,
            // 👇 ADDED: Preserve "other" option properties from backend
            otherOption: hasOtherOption, // Ensure boolean value
            otherOptionText: otherOptionText // Keep custom text or use default
          };

          return normalizedQuestion;
        });

        // Create final survey object with normalized questions
        const fixedSurvey = { 
          ...surveyData, 
          questions,
          // Store metadata about the survey format
          _metadata: {
            multipleSelectionsFormat: 'yes/no', // Document the expected format
            selectionLimitsPreserved: questions.every(q => 'selectionLimit' in q),
            otherOptionsPreserved: questions.some(q => q.otherOption === true) // Track if any "other" options exist
          }
        };

        setSurvey(fixedSurvey);
        
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch survey if we have access token and user is authenticated
    if (accessToken && user) {
      fetchSurvey();
    } else {
      setLoading(false);
    }
  }, [accessToken, user]);

  return { survey, loading, error };
};
