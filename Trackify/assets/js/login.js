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


  const USERS_KEY = 'trackify_users';
  let currentResetUser = null;


// Local Strorage Handlers
    function loadUsers () {
        try {
        const raw = localStorage.getItem(USERS_KEY);
        return raw ? JSON.parse(raw) : [];
        }
        catch (e) {
        console.error('Gagal parse users dari localStorage', e);
        return [];
        }
    };


    function saveUsers(users) {
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }


    function findUser(username) {
        if (!username) return undefined;
        const users = loadUsers();
        return users.find((u) => u.username.toLowerCase() === username.toLowerCase());
    };


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


    // Formulir Input Registrasi
    if (formRegister){
        formRegister.addEventListener('submit', (e) => {
            e.preventDefault();


            const fullname = (registerFullname && registerFullname.value || '').trim();
            const username = (registerUsername && registerUsername.value || '').trim();
            const password = (registerPassword && registerPassword.value || '').trim();


            if (!fullname || !username || !password) {
            showPopup('Silakan isi semua kolom yang disediakan.');
            return;
            }


            if (password.length < 5) {
            showPopup('Password minimal terdiri dari 5 karakter.');
            return;
            }


            if (findUser(username)) {
            showPopup('Username sudah digunakan. Silakan pilih username lain.');
            return;
            }


            // Buat PIN 4 digit (string)
            const pin = String(Math.floor(1000 + Math.random() * 9000));


            //Simpan informasi registrasi
            const users = loadUsers();
            users.push({fullname, username, password, pin });
            saveUsers(users);


            //Pop-up informasi registrasi berhasil
            formRegister.reset();


            showPopup(`Registrasi berhasil!<br>Pin pemulihan akun: <strong>${pin}</strong><br>Silakan melakukan login kembali!`, true, pin); 
           
            const onOk = () => {
                popupBtn.removeEventListener('click', onOk);
                tampilPanel(panelLogin);
                if (loginUsername) loginUsername.focus();
            };
            popupBtn.addEventListener('click', onOk, { once: true });
        });
    }


    // Formulir pengisian Login
    if (formLogin) {
        formLogin.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = (loginUsername && loginUsername.value || '').trim();
            const password = (loginPassword && loginPassword.value || '').trim();




            if (!username || !password) {
            showPopup('Silakan isi username serta password pada kolom yang disediakan.');
            return;
            }


            const user = findUser(username);
            if (!user) {
            showPopup('Akun tidak ditemukan. Pastikan informasi sudah benar atau lakukan registrasi jika belum memiliki akun.');
            return;
            }


            if (user.password !== password) {
            showPopup('Password salah. Silakan coba lagi.');
            return;
            }


            // Pesan Selamat bila Username dan Password benar
            showPopup(`Selamat datang kembali, ${user.fullname || user.username}!`);


            // Redirect ke beranda.html setelah 2 detik
            setTimeout(() => {
                window.location.href = 'beranda.html';
            }, 2000);
        });
    }


    // Formulir Input Pemulihan Akun
    if (formLupa) {
        formLupa.addEventListener('submit', (e) => {
        e.preventDefault();


        const username = (lupaUsername && lupaUsername.value || '').trim();
        const pin = (lupaPin && lupaPin.value || '').trim();


        if (!username || !pin) {
            showPopup('Silakan isi username dan PIN pemulihan.');
            return;
        }


        const user = findUser(username);
        if (!user) {
            showPopup('Username tidak ditemukan.');
            return;
        }


        if (user.pin !== pin) {
            showPopup('PIN tidak sesuai.');
            return;
        }


        // Bila berhasil
        currentResetUser = user.username;


        // Alihkan ke panel reset password
        showPopup('Verifikasi berhasil. Silakan buat password baru.');
        const onOk = () => {
            popupBtn.removeEventListener('click', onOk);
            tampilPanel(panelResetPassword);
            if (resetPassword) resetPassword.focus();
        };
        popupBtn.addEventListener('click', onOk, { once: true });
        });
    }


    // Formulir reset password
    if (formReset) {
        formReset.addEventListener('submit', (e) => {
        e.preventDefault();


        const passNew = (resetPassword && resetPassword.value || '').trim();
        if (!passNew) {
            showPopup('Silakan isi password baru.');
            return;
        }
        if (passNew.length < 5) {
            showPopup('Password minimal terdiri dari 5 karakter.');
            return;
        }


        const users = loadUsers();
        const idx = users.findIndex(u => u.username === currentResetUser);
        if (idx === -1) {
            showPopup('Terjadi kesalahan. Mulai ulang proses pemulihan.');
            return;
        }

        users[idx].password = passNew;
        saveUsers(users);

        currentResetUser = null;
        formReset.reset();


        showPopup('Password berhasil diubah. Silakan login dengan password baru.');
        const onOk = () => {
            popupBtn.removeEventListener('click', onOk);
            tampilPanel(panelLogin);
            if (loginUsername) loginUsername.focus();
        };
        popupBtn.addEventListener('click', onOk, { once: true });
        });
    }

    // initial focus
    if (loginUsername) loginUsername.focus();
});

