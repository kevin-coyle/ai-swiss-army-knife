import React from 'react';

const UserForm = () => {
  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission logic here
  };

  return (
    <form onSubmit={handleSubmit}>
      <nef-typography variant="header-default">Create New User</nef-typography>
      
      <nef-text-input
        label="Name"
        placeholder="Enter name"
        required
      >
        <span slot="help-text">Please enter the user's full name.</span>
        <span slot="error-text">Name is required.</span>
      </nef-text-input>

      <nef-text-input
        label="Email"
        placeholder="Enter email"
        required
        type="email"
      >
        <span slot="help-text">Please enter the user's email address.</span>
        <span slot="error-text">Valid email is required.</span>
      </nef-text-input>
      
      <nef-text-input
        label="Age"
        placeholder="Enter age"
        required
        type="number"
      >
        <span slot="help-text">Please enter the user's age.</span>
        <span slot="error-text">Age must be a number.</span>
      </nef-text-input>

      <nef-select
        label="Role"
        placeholder="Select a role"
        required
      >
        <span slot="help-text">Please select a user role.</span>
        <span slot="error-text">Role selection is required.</span>
        <option value="admin">Admin</option>
        <option value="editor">Editor</option>
        <option value="viewer">Viewer</option>
      </nef-select>

      <nef-button type="submit">Create User</nef-button>
    </form>
  );
};

export default UserForm;