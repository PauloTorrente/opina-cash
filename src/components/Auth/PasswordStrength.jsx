import React from 'react';
import styled from 'styled-components';

// Container for the strength bar (the background bar)
const StrengthBarContainer = styled.div`
  width: 100%; // Full width of the container
  height: 8px; // Height of the bar
  background-color: #e0e0e0; // Light gray background color
  border-radius: 4px; // Rounded corners
  margin-top: 0.5rem; // Space above the bar
  overflow: hidden; // Hide overflow content
`;

// The actual strength bar that changes color based on password strength
const StrengthBar = styled.div`
  height: 100%; // The height of the bar takes the full container height
  border-radius: 4px; // Rounded corners for the bar
  background-color: ${(props) => {
    if (props.$strength === 'weak') return '#ff4d4d'; // Red for weak
    if (props.$strength === 'medium') return '#ffa500'; // Orange for medium
    if (props.$strength === 'strong') return '#28a745'; // Green for strong
    return '#e0e0e0'; // Default to light gray if no strength
  }};
`;

// Container for the password requirements list
const PasswordRequirements = styled.div`
  margin-top: 0.5rem; // Space above the list
  font-size: 0.9rem; // Smaller font size for the text
  color: #555; // Gray text color
`;

// Individual requirement item showing whether it's valid or not
const Requirement = styled.p`
  color: ${(props) => (props.$valid ? '#28a745' : '#ff4d4d')}; // Green if valid, red if invalid
  margin: 0.25rem 0; // Small margin between each requirement
`;

// The PasswordStrength component that shows password strength bar and requirements
const PasswordStrength = ({ password }) => {
  // Check if the password has letters, numbers, special characters, and is long enough
  const hasLetters = /[a-zA-Z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const isLongEnough = password.length >= 8;

  // Determine password strength based on the requirements
  const strength = isLongEnough && hasLetters && hasNumbers && hasSpecialChars ? 'strong' :
                   isLongEnough && (hasLetters || hasNumbers) ? 'medium' : 'weak';

  // Calculate the width of the strength bar based on password length
  const width = password.length > 0 ? (password.length / 12) * 100 : 0;

  return (
    <div>
      {/* The password strength bar */}
      <StrengthBarContainer>
        <StrengthBar $strength={strength} style={{ width: `${width}%` }} />
      </StrengthBarContainer>

      {/* List of password requirements */}
      <PasswordRequirements>
        <Requirement $valid={isLongEnough}>
          {isLongEnough ? '✓ ' : '✗ '}At least 8 characters
        </Requirement>
        <Requirement $valid={hasLetters}>
          {hasLetters ? '✓ ' : '✗ '}Include letters
        </Requirement>
        <Requirement $valid={hasNumbers}>
          {hasNumbers ? '✓ ' : '✗ '}Include numbers
        </Requirement>
        <Requirement $valid={hasSpecialChars}>
          {hasSpecialChars ? '✓ ' : '✗ '}Include special characters (!@#$%^&*)
        </Requirement>
      </PasswordRequirements>
    </div>
  );
};

export default PasswordStrength;
