async function fetchLogin() {
    const usernameInput = document.getElementById('userName');
    const passwordInput = document.getElementById('password');

    const username = usernameInput.value;
    const password = passwordInput.value;

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });
        const data = await response.json();
        console.log(data);
        if (data.code == 200) {
            location.href = '/admin'
        } else {
            // 登录失败的处理逻辑
            usernameInput.value = ''
            passwordInput.value = ''
        }
    } catch (error) {
        console.error('Error:', error);
    }
}
