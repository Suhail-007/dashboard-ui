import View from './View.js';
import FORM from './components/Form.js';
import { updateURL } from '../helper.js'
import { defaultUserPic } from '../config.js'

class SignUpView extends View {
  _parentElem = document.querySelector('main');

  _generateMarkup() {
    return `
    <section class="form__section">
      <div class="form__section__logo--lg">
        <img class="form__section__img" loading='lazy' src="/src/images/m_logo.jpg" alt="Slack (website logo)">
      </div>

      <div class="form__container form__container--blur">

        <h2 class="form__container__heading login__heading">Create Account</h2>
        ${FORM('Sign up', defaultUserPic, 'block', 'required')}
      </div>
    </section>`
  }

  getSignInDetails(createUserSendEmailVerif, createUserData) {
    const form = document.querySelector('form');
    form.addEventListener('submit', async e => {
      try {
        e.preventDefault();
        const fd = new FormData(form);
        const fdObj = Object.fromEntries(fd);
        const isSame = this.#isPasswordsSame(fdObj);
        const isInputsCorrect = this.isInputsCorrect(fdObj);

        if (!isSame) throw Error('Passwords do not match');
        if (!isInputsCorrect) throw Error('Please enter full name');

        await this.renderMessage('Creating your account', 'success', 1500);

        const user = await createUserSendEmailVerif(fdObj.email, fdObj.password);

        if (user) await this.renderMessage('Account created. Check your mail inbox/spam tab to verify your account', 'success', 1000);

        //create user data in firebase database
        const userData = await createUserData(user, fdObj);

        if (userData) await this.renderMessage('User data created', 'success', 1500);

        updateURL('_', true);
      } catch (err) {
        await this.renderMessage(err, 'error', 3000);
      }
    })
  }

  isInputsCorrect(fdObj) {
    let { fullname } = fdObj;
    fullname = fullname.includes(' ');
    return fullname
  }

  #isPasswordsSame(fdObj) {
    let { password, Repassword: rePassword } = fdObj;
    password = password.split('');
    rePassword = rePassword.split('');
    const isSame = password.every((l, i) => rePassword[i] === l);
    return isSame
  }

  previewUserProfile() {
    const inputImgElem = document.querySelector('#profile');

    inputImgElem.addEventListener('change', () => {
      const img = document.querySelector('[data-img-preview]');
      const file = inputImgElem.files[0];

      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.addEventListener('load', () => img.src = fileReader.result);
    })
  }
}

export default new SignUpView();