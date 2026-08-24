
const formBtn = document.querySelector('.form--login');
const logoutBtn = document.querySelector('.nav__btn--logout');

//AXIOS MAKING PROBLEM HER
const login = async(email, password) => {
    try{
        const result = await axios({
            method: 'POST',
            url: 'http://127.0.0.1:5000/api/v1/users/login',
            data: {
                email,
                password
            }
        });

        if(result.data.status === 'success') {
            alert("Login succesfull...");
        } else {
            alert("Login fail...");
        };

        console.log(result);
    } catch(err) {
        console.log(err.response);
    }; 
};
 
const isLogout = async() => {
    try {
        const result = await axios({
            method:  'GET',
            url: 'http://127.0.0.1:5000/api/v1/users/logout',
        })
        if(result.data.status === 'success') {
            location.reload(true);  
        }
    } catch(err) {
        console.log(err.response);
        alert('Loggin out fail...! try again later');
    };
};

if(formBtn) {
    formBtn.addEventListener('submit', e => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        login(email, password);
    });
}

if(logoutBtn) {
    logoutBtn.addEventListener('click', isLogout);
}
