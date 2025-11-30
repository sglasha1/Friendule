async function submitFriend() {
    if (window.event) {
      window.event.preventDefault();
    }

    const name = document.getElementById('add_friend_name').value;
    const description = document.getElementById('add_friend_desc').value;
    const image = document.getElementById('add_friend_img').files[0];
    const formData = new FormData();
    formData.append("name", name);
    formData.append("desc", description)
    formData.append("image", image);

    try {
      const response = await fetch('/update_friends', {
        method: "POST",
        body: formData
      });
      const result = await response.json();
      console.log(result);
      const messageDiv = document.getElementById('addFriendMessage');
      messageDiv.textContent = result.message;
      document.getElementById('add_friend').reset(); 
    } catch (error) {
      console.error('Error:', error);
    }
  }

async function editFriend() {
  const curr_name = document.getElementById('editFriendChoice').value;
  const new_name = document.getElementById('edit_friend_name').value;
  const new_desc = document.getElementById('edit_friend_desc').value;
  const image = document.getElementById('update_friend_img').files[0];

  const formData = new FormData();
  formData.append("curr_name", curr_name);
  formData.append("new_name", new_name);
  formData.append("desc", new_desc)
  formData.append("image", image);

  try {
    const response = await fetch('/update_friends', {
      method: "PUT",
      body: formData
    });

    if (response.ok) {
      const result = await response.json();
      console.log(result);
      messageDiv = document.getElementById('editFriendMessage');
      messageDiv.textContent = result.message;
      document.getElementById('updateFriendForm').reset(); 
    } else {
      const errorData = await response.json();
      console.log(errorData);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Doesn't automatically show friend options in dropdown after deletion: user needs to refresh page
async function deleteFriend() {
  const name = document.getElementById('editFriendChoice').value;
  const data = {
    name: name
  };

  try {
    const response = await fetch('/update_friends', {
      method: "DELETE",
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data)
    });

    const result = await response.json();
    if (response.ok) {
      messageDiv = document.getElementById('editFriendMessage');
      messageDiv.textContent = result.message;
      document.getElementById('updateFriendForm').reset(); 
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

async function create_mailing_list() {
  const email_box = document.getElementById('emails');
  const lines = email_box.value.split('\n');
  const email_list = [];

  lines.forEach(line => {
      const trimmedLine = line.trim();
      if (trimmedLine !== '') {
      email_list.push(trimmedLine);
      }
  }); 

  const data = {
      email_list: email_list
    };

  try {
      const response = await fetch('/create_mailing_list', {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
      });
      const result = await response.json();
      messageDiv = document.getElementById('mailing_list_msg');
      messageDiv.textContent = result.message;
      console.log(result);
      console.log('success!');
    } catch (error) {
      console.error('Error:', error);
    }
}

document.getElementById('submit').addEventListener('click', create_mailing_list);
document.getElementById('add_friend').addEventListener('submit', submitFriend);
document.getElementById('update_friend_submit').addEventListener('click', editFriend);
document.getElementById('delete_friend_submit').addEventListener('click', deleteFriend);
