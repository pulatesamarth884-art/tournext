const userUpdateForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');

//console.log(userUpdateForm);

const updateInfo = async(data, type) => {
    try {
        let url;
        if( type === 'password') {
            url = 'http://127.0.0.1:5000/api/v1/users/updateMyPassword'
        } else {
            url = 'http://127.0.0.1:5000/api/v1/users/updateMe'
        }

        const result = await axios({
            method: 'PATCH',
            url,
            data: data
        });

        if(result.data.status == 'success') {
            alert(`User ${type.toUpperCase()} updated successfully`);
        }
    } catch(err) {
        alert(err.response.data.message);
    }
}


if(userUpdateForm) {
    userUpdateForm.addEventListener('submit', e => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;

        //console.log(name, email);
        updateInfo({name, email}, 'data');
    });
}

if(userPasswordForm) {
    userPasswordForm.addEventListener('submit', async e => {
        e.preventDefault();
        const passwordCurrent = document.getElementById('password-current').value;
        const password = document.getElementById('password').value;
        const passwordConfirm = document.getElementById('password-confirm').value;

        await updateInfo({passwordCurrent, password, passwordConfirm}, 'password');
    });
}

