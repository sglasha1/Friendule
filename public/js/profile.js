// const submitButton = document.getElementById("submit");
const calendarCode = document.getElementById("code");
const errormsg = document.getElementById("calendarerror")

// submitButton.addEventListener('click', async (event) => {
//     const url = calendarCode.value;
//     console.log("trying to find calendar");
//     try {
//         const response = await fetch('/finished_calendar/' + url, {
//             method: "GET",
//             headers: {'Accept': 'application/json'},
//         });
//         if (response.ok) {
//             const result = await response.json();
//             console.log(result);
//              if (result.redirect) {
//                 console.log("Redirecting to:", result.redirect);
//                 window.location.href = result.redirect;
//             } else {
//                 console.log("No redirect URL found in the response.");
//             }
            
//         } else {
//             console.log("not found...");
//             errormsg.innerHTML = "Calendar not found";
//         }
//     } catch (error) {
//         console.log("why am i here");
//         console.error('Error:', error);
//     }
// });

console.log("I'm here.");
document.querySelectorAll(".friend-details").forEach(btn => {
    console.log("Found a button");
    btn.addEventListener('click', () => {
        const id = btn.getAttribute("data-target");
        const hidden_p = document.getElementById(id);
        hidden_p.classList.toggle('hidden');
        if(hidden_p.classList.contains("hidden")){
            btn.textContent = "Show Details";
        } else{
            btn.textContent = "Hide Details";
        }
    });
});

async function send_email() {
    const email = document.getElementById('emails');
    const data = {
        email: email.value
      };
    try {
        const response = await fetch('/send_email', {
          method: "POST",
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(data)
        });
        const result = await response.json();
        messageDiv = document.getElementById('email_msg');
        messageDiv.textContent = result.message;
        console.log(result);
        console.log('success!');
      } catch (error) {
        console.error('Error:', error);
      }
}

async function updateLastSeen() {
  const friend_id = this.dataset.friendId;
  const last_seen = this.value;

  // Send update to backend
  try {
    const response = await fetch("/update_last_seen", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      friend_id: friend_id,
      last_seen: last_seen
    })
  }) 
  const result = await response.json();
  messageDiv = document.getElementById(`friend_update_msg-${friend_id}`);
  messageDiv.textContent = result.message;
  console.log(result);
} catch (error) {
  console.error('Error:', error);
}
}

document.querySelectorAll(".last_seen_input").forEach(input => {
  input.addEventListener("change", updateLastSeen);
});
document.getElementById('submit_email').addEventListener('click', send_email);
