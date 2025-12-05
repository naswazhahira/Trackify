document.addEventListener('DOMContentLoaded', () => {
  const panelLogin = document.getElementById('panelLogin');
  const panelRegister = document.getElementById('panelRegister');
  const panelPemulihan = document.getElementById('panelPemulihan');
  const panelResetPassword = document.getElementById('panelResetPassword');


  const formLogin = document.getElementById('formLogin');
  const loginUsername = document.getElementById('login-username');
  const loginPassword = document.getElementById('login-password');


  const tombolLogin = document.getElementById('tombolLogin');
  const tombolRegister = document.getElementById('tombolRegister');
  const tombolLupaPassword = document.getElementById('tombolLupaPassword');


  const formRegister = document.getElementById('formRegister');
  const registerFullname = document.getElementById('register-namalengkap');
  const registerUsername = document.getElementById('register-username');
  const registerPassword = document.getElementById('register-password');
  const tombolDaftar = document.getElementById('tombolDaftar');
  const tombolBatal = document.getElementById('tombolBatal');


  const formLupa = document.getElementById('formLupaPassword');
  const lupaUsername = document.getElementById('lupa-username');
  const lupaPin = document.getElementById('lupa-pin');
  const tombolVerifikasi = document.getElementById('tombolVerifikasi');
  const tombolBatalPemulihan = document.getElementById('tombolBatalPemulihan');


  const formReset = document.getElementById('formResetPassword');
  const resetPassword = document.getElementById('reset-password');
  const tombolSimpanPassword = document.getElementById('tombolSimpanPassword');
  const tombolBatalReset = document.getElementById('tombolBatalReset');
 
  //Pop up peringatan
  const popupOverlay = document.getElementById('popupOverlay');
  const popupText = document.getElementById('popupText');
  const popupBtn = document.getElementById('popupBtn');


  // safety: jika elemen penting tidak ditemukan, tunjukkan peringatan di console
  const required = [
    ['panelLogin', panelLogin],
    ['formLogin', formLogin],
    ['popupOverlay', popupOverlay],
    ['popupBtn', popupBtn]
  ];
  required.forEach(([name, el]) => {
    if (!el) console.warn(`Elemen "${name}" tidak ditemukan.`);
  });


  let currentResetUser = null;
  const API_BASE = 'http://localhost:5000/api/users';


  // Handler untuk error inline
  function setError(id, message) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = message || '';
    if (message) {
      el.classList.remove('hidden');
      el.classList.add('show');
      const input = el.previousElementSibling;
      if (input && (input.tagName === 'INPUT' || input.tagName === 'TEXTAREA')) {
        input.classList.add('error');
      }
    } else {
      el.classList.remove('show');
      el.classList.add('hidden');
      const input = el.previousElementSibling;
      if (input && (input.tagName === 'INPUT' || input.tagName === 'TEXTAREA')) {
        input.classList.remove('error');
      }
    }
  }


  function clearAllErrorsInForm(formEl) {
    if (!formEl) return;
    const errs = formEl.querySelectorAll('.error-text');
    errs.forEach(e => {
      e.textContent = '';
      e.classList.remove('show');
      e.classList.add('hidden');
      const input = e.previousElementSibling;
      if (input && (input.tagName === 'INPUT' || input.tagName === 'TEXTAREA')) {
        input.classList.remove('error');
      }
    });
  }


  // Pop-up Handler
  function showPopup(messageHtml, withCopy = false, copyText = '') {
    popupText.innerHTML = messageHtml;
    const oldCopy = popupText.querySelector('.popup-copy-btn');
    if (oldCopy) oldCopy.remove();


    if (withCopy && copyText) {
      const copyBtn = document.createElement('button');
      copyBtn.type = 'button';
      copyBtn.textContent = 'Salin PIN';
      copyBtn.className = 'popup-copy-btn popup-btn';
      copyBtn.style.marginTop = '8px';
      copyBtn.style.display = 'inline-block';
      copyBtn.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(copyText);
          copyBtn.textContent = 'Disalin!';
          copyBtn.disabled = true;
        } catch {
          copyBtn.textContent = 'Gagal salin';
        }
      });
      popupText.appendChild(copyBtn);
    }


    // Tampilkan Pop-up
    popupOverlay.classList.add('tampil');
    popupBtn.focus();
    const onOk = () => {
      popupBtn.removeEventListener('click', onOk);
      popupOverlay.classList.remove('tampil');
    };
    popupBtn.addEventListener('click', onOk);
  }


  // Peralihan panel
  function tampilPanel(el) {
    const panels = [panelLogin, panelRegister, panelPemulihan, panelResetPassword];
    panels.forEach(p => {
      if (!p) return;
      if (p === el) {
        p.classList.remove('tersembunyi');
        p.classList.add('tampil');
      } else {
        p.classList.remove('tampil');
        p.classList.add('tersembunyi');
      }
    });
  }


  // Tombol pada halaman registrasi
  if (tombolRegister) {
    tombolRegister.addEventListener('click', (e) => {
      e.preventDefault();
      if (panelRegister) tampilPanel(panelRegister);
      if (registerUsername) registerUsername.focus();
    });
  }


  if (tombolBatal) {
    tombolBatal.addEventListener('click', (e) => {
      e.preventDefault();
      if (formRegister) formRegister.reset();
      tampilPanel(panelLogin);
      if (loginUsername) loginUsername.focus();
    });
  }


  // Tombol lupa password
  if (tombolLupaPassword) {
    tombolLupaPassword.addEventListener('click', (e) => {
      e.preventDefault();
      if (panelPemulihan) tampilPanel(panelPemulihan);
      if (lupaUsername) lupaUsername.focus();
    });
  }


  // Tombol batal pemulihan akun
  if (tombolBatalPemulihan) {
    tombolBatalPemulihan.addEventListener('click', (e) => {
      e.preventDefault();
      if (formLupa) formLupa.reset();
      tampilPanel(panelLogin);
    });
  }


  // Tombol batal reset password
  if (tombolBatalReset) {
    tombolBatalReset.addEventListener('click', (e) => {
      e.preventDefault();
      if (formReset) formReset.reset();
      tampilPanel(panelLogin);
    });
  }


  // Attach input listeners to clear per-field error on input
  const mapInputsToErrors = [
    {input: loginUsername, errId: 'err-login-username'},
    {input: loginPassword, errId: 'err-login-password'},
    {input: registerFullname, errId: 'err-register-namalengkap'},
    {input: registerUsername, errId: 'err-register-username'},
    {input: registerPassword, errId: 'err-register-password'},
    {input: lupaUsername, errId: 'err-lupa-username'},
    {input: lupaPin, errId: 'err-lupa-pin'},
    {input: resetPassword, errId: 'err-reset-password'}
  ];


  mapInputsToErrors.forEach(mapping => {
    if (!mapping.input) return;
    mapping.input.addEventListener('input', () => {
      setError(mapping.errId, '');
    });
  });


  // ========== FORM REGISTER ==========
  if (formRegister) {
    formRegister.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearAllErrorsInForm(formRegister);


      const fullname = registerFullname.value.trim();
      const username = registerUsername.value.trim();
      const password = registerPassword.value.trim();


      let valid = true;


      if (!fullname) {
        setError('err-register-namalengkap', 'Nama lengkap wajib diisi');
        valid = false;
      }


      if (!username) {
        setError('err-register-username', 'Nama pengguna wajib diisi');
        valid = false;
      }


      if (!password) {
        setError('err-register-password', 'Kata sandi wajib diisi');
        valid = false;
      } else if (password.length < 5) {
        setError('err-register-password', 'Kata sandi minimal terdiri dari 5 karakter');
        valid = false;
      }


      if(!valid) return;


      try {
        const res = await fetch(`${API_BASE}/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fullname, username, password })
        });
        const data = await res.json();


        if (!res.ok) {
          showPopup(data.error || 'Terjadi kesalahan pada proses registrasi');
          return;
        }


        // Reset form
        formRegister.reset();
       
        // Tampilkan popup dengan PIN
        showPopup(`Registrasi berhasil!<br>Pin pemulihan akun: <strong>${data.user.pin}</strong><br>Silakan melakukan login kembali!`, true, data.user.pin);
       
        // Ketika popup OK diklik, kembali ke login
        const onOk = () => {
          popupBtn.removeEventListener('click', onOk);
          tampilPanel(panelLogin);
          if (loginUsername) loginUsername.focus();
        };
        popupBtn.addEventListener('click', onOk, { once: true });
       
      } catch (err) {
        console.error(err);
        showPopup('Tidak dapat terhubung ke server.');
      }
    });
  }


  // ========== FORM LOGIN ==========
  if (formLogin) {
    formLogin.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearAllErrorsInForm(formLogin);


      const username = (loginUsername && loginUsername.value || '').trim();
      const password = (loginPassword && loginPassword.value || '').trim();


      let valid = true;


      if (!username) {
        setError('err-login-username', 'Nama pengguna wajib diisi');
        valid = false;
      }


      if (!password) {
        setError('err-login-password', 'Kata sandi wajib diisi');
        valid = false;
      } else if (password.length < 5) {
        setError('err-login-password', 'Kata sandi minimal terdiri dari 5 karakter');
        valid = false;
      }


      if (!valid) return;


      try {
        const res = await fetch(`${API_BASE}/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });
        const data = await res.json();


        if (!res.ok) {
          showPopup(data.error || 'Login gagal');
          return;
        }


        // ========== PERBAIKAN DI SINI ==========
        // Format data user dengan konsisten
        const userData = {
          id: data.user?.id || null,
          username: data.user?.username || username,
          fullname: data.user?.fullname || '',
          profile_picture: data.user?.profilePicture || data.user?.profile_picture || null,
          created_at: data.user?.created_at || new Date().toISOString()
        };


        // Simpan ke localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(userData));


        // Pesan Selamat
        showPopup(`Selamat datang, ${userData.fullname || userData.username}!`);


        // Redirect ke profile.html setelah 2 detik
        setTimeout(() => {
          window.location.href = 'beranda.html';
        }, 2000);
       
      } catch (err) {
        console.error(err);
        showPopup('Tidak dapat terhubung ke server.');
      }
    });
  }


  // ========== FORM LUPA PASSWORD ==========
  if (formLupa) {
    formLupa.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearAllErrorsInForm(formLupa);


      const username = (lupaUsername && lupaUsername.value || '').trim();
      const pin = (lupaPin && lupaPin.value || '').trim();


      let valid = true;


      if (!username) {
        setError('err-lupa-username', 'Nama pengguna wajib diisi');
        valid = false;
      }


      if (!pin) {
        setError('err-lupa-pin', 'PIN pemulihan wajib diisi');
        valid = false;
      } else if (pin.length < 4) {
        setError('err-lupa-pin', 'PIN harus terdiri dari 4 digit angka');
        valid = false;
      }


      if(!valid) return;


      try {
        const res = await fetch(`${API_BASE}/verify-pin`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, pin })
        });
        const data = await res.json();


        if (!res.ok) {
          showPopup(data.error || 'Verifikasi PIN gagal');
          return;
        }


        // Bila berhasil
        currentResetUser = username;


        // Alihkan ke panel reset password
        showPopup('Verifikasi berhasil. Silakan buat password baru.');
        const onOk = () => {
          popupBtn.removeEventListener('click', onOk);
          tampilPanel(panelResetPassword);
          if (resetPassword) resetPassword.focus();
        };
        popupBtn.addEventListener('click', onOk, { once: true });
       
      } catch (err) {
        console.error(err);
        showPopup('Tidak dapat terhubung ke server.');
      }
    });
  }


  // ========== FORM RESET PASSWORD ==========
  if (formReset) {
    formReset.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearAllErrorsInForm(formReset);


      const newPassword = (resetPassword && resetPassword.value || '').trim();
      if (!newPassword) {
        setError('err-reset-password', 'Silakan masukkan kata sandi baru.');
        return;
      }
      if (newPassword.length < 5) {
        setError('err-reset-password', 'Kata sandi minimal terdiri dari 5 karakter.');
        return;
      }


      try {
        const res = await fetch(`${API_BASE}/reset-password`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: currentResetUser, newPassword })
        });
        const data = await res.json();


        if (!res.ok) {
          showPopup(data.error || 'Reset password gagal');
          return;
        }


        currentResetUser = null;
        formReset.reset();


        showPopup('Password berhasil diubah. Silakan login dengan password baru.');
        const onOk = () => {
          popupBtn.removeEventListener('click', onOk);
          tampilPanel(panelLogin);
          if (loginUsername) loginUsername.focus();
        };
        popupBtn.addEventListener('click', onOk, { once: true });
       
      } catch (err) {
        console.error(err);
        showPopup('Tidak dapat terhubung ke server.');
      }
    });
  }


  // initial focus
  if (loginUsername) loginUsername.focus();
});
