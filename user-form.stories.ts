import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

import ".";

const UserFormStories: Meta = {
  title: "Forms/User Form",
  component: "user-form",
};

const Template: StoryObj = {
  render: () => html`
    <nef-alert id="alert" variant="success" style="display:none; margin-bottom: 10px;">
      Form submitted!
    </nef-alert>
    <form id="userForm">
      <nef-text-input 
        label="Name" 
        placeholder="Enter your name" 
        name="name" 
        required>
      </nef-text-input>
      
      <nef-text-input 
        label="Username" 
        placeholder="Enter your username" 
        name="username" 
        required>
      </nef-text-input>

      <nef-text-input 
        label="Email" 
        placeholder="Enter your email" 
        type="email" 
        name="email" 
        required>
      </nef-text-input>

      <nef-text-input 
        label="Phone" 
        placeholder="Enter your phone number" 
        type="tel" 
        name="phone" 
        required>
      </nef-text-input>

      <nef-text-input 
        label="Website" 
        placeholder="Enter your website URL" 
        type="url" 
        name="website">
      </nef-text-input>

      <nef-button type="submit" variant="primary">Submit</nef-button>
    </form>

    <script>
    document.getElementById('userForm').addEventListener('submit', function(event) {
      event.preventDefault(); // Prevent the default form submission

      const formData = new FormData(this);
      const userData = {
        name: formData.get('name'),
        username: formData.get('username'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        website: formData.get('website'),
      };

      // Show nef-alert
      const alertDiv = document.getElementById('alert');
      alertDiv.style.display = 'block';

      // Make a POST request to the JSONPlaceholder API
      fetch('https://jsonplaceholder.typicode.com/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })
      .then(response => response.json())
      .then(data => {
        console.log('User created:', data);
        alert('User created successfully!');
      })
      .catch(error => {
        console.error('Error creating user:', error);
        alert('An error occurred while creating the user.');
      });
    });
    </script>
  `,
};

export const UserForm = Template;
export default UserFormStories;