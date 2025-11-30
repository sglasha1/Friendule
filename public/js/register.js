const form = document.getElementById("registration");
form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const username = formData.get('username');
    const password = formData.get('password');
    const email = formData.get('email');
    console.log(username);
    console.log(password);
    form.reset();
});