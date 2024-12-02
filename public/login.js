

document.getElementById('show-signup').addEventListener('click', function() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('signup-form').style.display = 'block';
});




$(document).ready(function() {
    $('#login-form').on('submit', function(e) {
        e.preventDefault();
        const email = $('#login-email').val();
        const password = $('#login-password').val();
        // Add your login logic here
        alert('Login functionality not implemented yet.');
    });

    $('#signup-form').on('submit', function(e) {
        e.preventDefault();
        const email = $('#signup-email').val();
        const password = $('#signup-password').val();
        // Add your sign-up logic here
        alert('Sign-up functionality not implemented yet.');
    });
});