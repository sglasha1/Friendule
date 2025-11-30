async function create_email_list() {
    console.log('writing email');
    const email_box = document.getElementById('emails');
    const lines = email_box.value.split('\n');
    const email_list = [];
    const params = new URLSearchParams(window.location.search);
    const url = params.get('url');
    lines.forEach(line => {
        const trimmedLine = line.trim();
        if (trimmedLine !== '') {
        email_list.push(trimmedLine);
        }
    }); 

    const data = {
        email_list: email_list,
        url: url
      };

    try {
        const response = await fetch('/send_calendar', {
          method: "POST",
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(data)
        });
        const result = await response.json();
        console.log(result);
        console.log('success!');
      } catch (error) {
        console.error('Error:', error);
      }
}

document.getElementById('submit').addEventListener('click', create_email_list);
