import React, { useState } from 'react';

const CreateUserForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    phone: '',
    website: ''
  });

  const [errors, setErrors] = useState({
    name: '',
    username: '',
    email: '',
    phone: '',
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });
    validateField(name, value);
  };

  const validateField = (fieldName, value) => {
    let error = '';
    if (fieldName === 'username' && value.length <= 3) {
      error = 'Username must be longer than 3 characters.';
    }
    setErrors({
      ...errors,
      [fieldName]: error
    });
  };

  const handleSelectChange = (event) => {
    const selectedValue = event.detail.value;
    setFormData({
      ...formData,
      website: selectedValue
    });
  };

  const isFormValid = () => {
    return Object.values(formData).every(input => input) && !Object.values(errors).some(error => error);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isFormValid()) {
      fetch('https://jsonplaceholder.typicode.com/users', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          console.log('User created:', data);
          // Handle success (e.g., show success message)
        })
        .catch(error => {
          console.error('Error:', error);
          document.getElementById('serverErrorAlert').style.display = 'block';
        });
    } else {
      Object.keys(formData).forEach(field => validateField(field, formData[field]));
    }
  };

  const websiteOptions = [
    { value: 'example.com', label: 'example.com' },
    { value: 'another-example.com', label: 'another-example.com' },
    { value: 'yetanother.com', label: 'yetanother.com' }
  ];

  return (
    <div>
      <nef-typography variant="h3">Create New User</nef-typography>
      <form onSubmit={handleSubmit}>
        <nef-text-input
          label="Name"
          placeholder="Enter your name"
          required
          name="name"
          onChange={handleInputChange}
        >
          <span slot="help-text">Please provide your full name.</span>
          {errors.name && <span slot="error-text" style={{ color: 'red' }}>{errors.name}</span>}
        </nef-text-input>

        <nef-text-input
          label="Username"
          placeholder="Enter your username"
          required
          name="username"
          onChange={handleInputChange}
        >
          <span slot="help-text">Username must be longer than 3 characters.</span>
          {errors.username && <span slot="error-text" style={{ color: 'red' }}>{errors.username}</span>}
        </nef-text-input>

        <nef-text-input
          label="Email"
          placeholder="Enter your email"
          type="email"
          required
          name="email"
          onChange={handleInputChange}
        >
          <span slot="help-text">Please provide a valid email address.</span>
          {errors.email && <span slot="error-text" style={{ color: 'red' }}>{errors.email}</span>}
        </nef-text-input>

        <nef-text-input
          label="Phone"
          placeholder="Enter your phone number"
          required
          name="phone"
          onChange={handleInputChange}
        >
          <span slot="help-text">Please provide your contact number.</span>
          {errors.phone && <span slot="error-text" style={{ color: 'red' }}>{errors.phone}</span>}
        </nef-text-input>

        <nef-select
          label="Website"
          placeholder="Select a website"
          items={websiteOptions}
          onNefSelectChange={handleSelectChange}
        >
          <span slot="help-text">Optional: Choose your website.</span>
        </nef-select>

        <nef-button type="submit">Submit</nef-button>
      </form>

      <nef-alert id="serverErrorAlert" variant="error" dismissible style={{ display: 'none' }}>
        <span>There was an error creating the user. Please try again later.</span>
      </nef-alert>
    </div>
  );
};

export default CreateUserForm;