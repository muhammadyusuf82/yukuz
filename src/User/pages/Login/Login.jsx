import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom';
import {
  FaTruckLoading,
  FaFacebook,
  FaGoogle,
  FaFlag,
  FaUser,
  FaArrowLeft,
  FaArrowRight,
  FaTruck,
  FaAngleRight,
  FaBox,
  FaKey,
  FaEnvelope,
  FaMapMarkerAlt,
  FaRedo,
  FaCheck,
} from "react-icons/fa";
import { RiCheckboxCircleFill } from "react-icons/ri";

const baseUrl = 'https://tokennoty.pythonanywhere.com/'

// Flag images for languages
const FLAG_IMAGES = {
  uz: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Flag_of_Uzbekistan.svg/1280px-Flag_of_Uzbekistan.svg.png',
  ru: 'https://upload.wikimedia.org/wikipedia/en/thumb/f/f3/Flag_of_Russia.svg/1280px-Flag_of_Russia.svg.png',
  en: 'https://upload.wikimedia.org/wikipedia/en/thumb/a/ae/Flag_of_the_United_Kingdom.svg/1280px-Flag_of_the_United_Kingdom.svg.png'
};

// Small flag icons for display
const SMALL_FLAG_IMAGES = {
  uz: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMTQiIHZpZXdCb3g9IjAgMCAyMCAxNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjE0IiBmaWxsPSIjMDA5RTM2Ii8+CjxyZWN0IHk9IjMiIHdpZHRoPSIyMCIgaGVpZ2h0PSIxIiBmaWxsPSJ3aGl0ZSIvPgo8cmVjdCB5PSI0IiB3aWR0aD0iMjAiIGhlaWdodD0iMSIgZmlsbD0iI0RFQjQxMCIvPgo8cmVjdCB5PSI5IiB3aWR0aD0iMjAiIGhlaWdodD0iMSIgZmlsbD0id2hpdGUiLz4KPHJlY3QgeT0iMTAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIxIiBmaWxsPSIjREVCNDEwIi8+CjxjaXJjbGUgY3g9IjEwIiBjeT0iNyIgcj0iMiIgZmlsbD0id2hpdGUiLz4KPGNpcmNsZSBjeD0iMTAiIGN5PSI3IiByPSIxLjUiIGZpbGw9IiMwMDlFMzYiLz4KPHBhdGggZD0iTTEwIDYuNUwxMSA4SDlMMTAgNi41WiIgZmlsbD0iI0RFQjQxMCIvPgo8L3N2Zz4K',
  ru: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMTQiIHZpZXdCb3g9IjAgMCAyMCAxNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjUiIGZpbGw9IiNmZmYiLz4KPHJlY3QgeT0iNSIgd2lkdGg9IjIwIiBoZWlnaHQ9IjQiIGZpbGw9IiMwMDciLz4KPHJlY3QgeT0iOSIgd2lkdGg9IjIwIiBoZWlnaHQ9IjUiIGZpbGw9IiNkNTIiLz4KPC9zdmc+',
  en: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMTQiIHZpZXdCb3g9IjAgMCAyMCAxNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjE0IiBmaWxsPSIjMDAyNDdEIi8+CjxwYXRoIGQ9Ik0yLjE4NSAwSDB2NUgyLjE4NXYtNU0wIDloMi4xODV2NUgwVjlNMjAgMUg1LjEyNXY0SDIwVjFNMjAgOUg1LjEyNXY0SDIwVjlNNy44NzUgMGgzLjc1djUuNUg3Ljg3NVYwTTcuODc1IDguNWgzLjc1VjE0SDcuODc1VjguNVoiIGZpbGw9IiNmZmYiLz4KPHBhdGggZD0iTTAgMEw4IDE0SDIwVjBIMCIgZmlsbD0iI0M4MTQxMiIvPgo8cGF0aCBkPSJNMS4wNjIgMEwwIDEuOTY4VjBoMS4wNjJNMCA0LjI1bDQuMDMxIDUuNzVIMFY0LjI1IiBmaWxsPSIjZmZmIi8+CjxwYXRoIGQ9Ik0xNC41ODMgMGg1LjA4M0wyMCA0LjNWMGgtNS40MTdNOC41IDBWNS41SDBWOWg4LjV2NUgwVjkuNzVsNS42MjUtNC4yNVYwaDNtNy41IDkuNzVMMjAgN1YxNC40MUgxNi4wODNWOS43NU0xMy45MTcgMTRIOD40NThWOC41SDBWN2g4LjQ1OFYwaDIuMjA5djdoOC41VjE0SDEzLjkxN1oiIGZpbGw9IiNDODE0MTIiLz4KPC9zdmc+'
};

const Login = () => {
  const [counter, setCounter] = useState(0)
  const [job, setJob] = useState(0)
  const [login, setLogin] = useState(true)
  const [language, setLanguage] = useState(() => localStorage.getItem("language") || 'uz')
  const [formData, setFormData] = useState({
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    document: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [location, setLocation] = useState({ lat: null, lon: null })
  const [locationLoading, setLocationLoading] = useState(false)
  
  // Email verification states
  const [confirmationCode, setConfirmationCode] = useState(['', '', '', ''])
  const [confirmationLoading, setConfirmationLoading] = useState(false)
  const [resendCountdown, setResendCountdown] = useState(0)
  
  // Store registration data for verification
  const [registrationData, setRegistrationData] = useState(null)
  
  const navigate = useNavigate();
  const inputRefs = useRef([])

  // Translations with useMemo for optimization
  const translations = useMemo(() => ({
    uz: {
      slogan: "O'zbekiston №1 Yuk Tashish Platformasi",
      welcome: "Xush kelibsiz!",
      welcomeText: "Yuk tashish va topishning eng qulay va ishonchli yechimi. Davom etish uchun rolingizni tanlang:",
      sender: "Yuk Jo'natish",
      senderDesc: "Yuk topshirish yoki transport izlayapsizmi?",
      driver: "Yuk Tashish",
      driverDesc: "Mashinangiz bilan daromad topmoqchimisiz?",
      continue: "Davom etish",
      haveAccount: "Akkauntingiz bormi?",
      login: "Kirish",
      loginText: "Akkauntingizga kirish uchun telefon raqamingizni kiriting",
      chooseLang: "Tilni tanlang",
      chooseLangText: "Qaysi tilda foydalanmoqchisiz?\nKeyinchalik sozlamalardan o'zgartirishingiz mumkin.",
      register: "Ro'yxatdan o'tish",
      registerText: `Yangi {role} sifatida ro'yxatdan o'tish`,
      phone: "Telefon raqami",
      email: "Email manzil",
      password: "Parol",
      confirmPassword: "Parolni tasdiqlang",
      forgotPassword: "Parolni unitdingizmi?",
      or: "Yoki",
      agreeText_1: "Davom etish orqali siz quyidagilarga rozilik bildirasiz: ",
      agreeText_2: "Foydalanish Shartlari",
      and: 'va',
      agreeText_3: "Maxfiylik Siyosati",
      addable: "Keyinchalik to'ldirishingiz mumkin",
      placeholder_1: 'Parolingizni kiriting',
      place_holder_2: 'Parolingizni tasdiqlang',
      emailPlaceholder: 'example@mail.com',
      document: 'Haydovchilik guvohnomasi raqami',
      role_1: "Yuk Beruvchi",
      role_2: "Haydovchi",
      loading: "Yuklanmoqda...",
      successRegister: "Muvaffaqiyatli ro'yxatdan o'tdingiz!",
      successLogin: "Muvaffaqiyatli kirdingiz!",
      errorMessage: "Xatolik yuz berdi. Iltimos, qayta urinib ko'ring.",
      requiredField: "Bu maydon to'ldirilishi shart",
      passwordMismatch: "Parollar mos kelmaydi",
      invalidPhone: "Telefon raqami noto'g'ri formatda (9 ta raqam bo'lishi kerak)",
      invalidEmail: "Email manzil noto'g'ri formatda",
      networkError: "Internet aloqasi yo'q. Iltimos, internetingizni tekshiring.",
      invalidCredentials: "Telefon raqami yoki parol noto'g'ri",
      loginWithGoogle: "Google orqali kirish",
      loginWithFacebook: "Facebook orqali kirish",
      loginWithOneID: "OneID orqali kirish",
      getLocation: "Joylashuvni aniqlash",
      locationLoading: "Joylashuv aniqlanmoqda...",
      locationSuccess: "Joylashuv muvaffaqiyatli aniqlandi",
      locationError: "Joylashuvni aniqlashda xatolik",
      confirmEmail: "Email manzilingizni tasdiqlang",
      confirmationSent: "Emailingizga 4 raqamli tasdiqlash kodi yuborildi",
      enterCode: "Kodni kiriting",
      checkSpam: "Iltimos, spam papkani tekshiring",
      verify: "Tasdiqlash",
      resendCode: "Kodni qayta yuborish",
      resendIn: "Qayta yuborish {seconds}",
      verifying: "Tasdiqlanmoqda...",
      codeVerified: "Email muvaffaqiyatli tasdiqlandi!",
      invalidCode: "Noto'g'ri kod. Iltimos, qayta urinib ko'ring.",
      continueToApp: "Dasturga o'tish",
      didntReceiveCode: "Kodni olmadingizmi?",
      back: "Orqaga"
    },
    ru: {
      slogan: "Платформа грузоперевозок №1 в Узбекистане",
      welcome: "Добро пожаловать!",
      welcomeText: "Самое удобное и надёжное решение для поиска и перевозки грузов. Выберите вашу роль:",
      sender: "Отправка груза",
      senderDesc: "Хотите отправить груз или найти транспорт?",
      driver: "Перевозка груза",
      driverDesc: "Хотите зарабатывать на своём транспорте?",
      continue: "Продолжить",
      haveAccount: "У вас есть аккаунт?",
      login: "Войти",
      loginText: "Введите номер телефона, чтобы войти в аккаунт",
      chooseLang: "Выберите язык",
      chooseLangText: "На каком языке вы хотите пользоваться?\nПозже можно изменить в настройках.",
      register: "Регистрация",
      registerText: `Войти в качестве нового {role}`,
      phone: "Номер телефона",
      email: "Электронная почта",
      password: "Пароль",
      confirmPassword: "Подтвердите пароль",
      forgotPassword: "Забыли пароль?",
      or: "Или",
      agreeText_1: "Продолжая, вы соглашаетесь с",
      agreeText_2: "Условиями Использования",
      and: 'и',
      agreeText_3: "Политикой Конфиденциальности",
      addable: "Можно заполнить позже",
      placeholder_1: 'Введите пароль',
      place_holder_2: 'Подтвердите пароль',
      emailPlaceholder: 'example@mail.com',
      document: 'Номер водительских прав',
      role_1: "Отправитель Груза",
      role_2: "Водитель",
      loading: "Загрузка...",
      successRegister: "Успешная регистрация!",
      successLogin: "Успешный вход!",
      errorMessage: "Произошла ошибка. Пожалуйста, попробуйте еще раз.",
      requiredField: "Это поле обязательно для заполнения",
      passwordMismatch: "Пароли не совпадают",
      invalidPhone: "Номер телефона в неправильном формате (должно быть 9 цифр)",
      invalidEmail: "Неправильный формат электронной почта",
      networkError: "Нет подключения к интернету. Пожалуйста, проверьте ваше интернет-соединение.",
      invalidCredentials: "Неверный номер телефона или пароль",
      loginWithGoogle: "Войти через Google",
      loginWithFacebook: "Войти через Facebook",
      loginWithOneID: "Войти через OneID",
      getLocation: "Определить местоположение",
      locationLoading: "Определение местоположения...",
      locationSuccess: "Местоположение успешно определено",
      locationError: "Ошибка при определении местоположения",
      confirmEmail: "Подтвердите ваш email",
      confirmationSent: "На вашу почту отправлен 4-значный код подтверждения",
      enterCode: "Введите код",
      checkSpam: "Пожалуйста, проверьте папку спам",
      verify: "Подтвердить",
      resendCode: "Отправить код повторно",
      resendIn: "Отправить снова через {seconds}",
      verifying: "Подтверждение...",
      codeVerified: "Email успешно подтвержден!",
      invalidCode: "Неверный код. Пожалуйста, попробуйте еще раз.",
      continueToApp: "Перейти в приложение",
      didntReceiveCode: "Не получили код?",
      back: "Назад"
    },
    en: {
      slogan: "Uzbekistan's #1 Freight Platform",
      welcome: "Welcome!",
      welcomeText: "The most convenient and reliable solution for finding and transporting cargo. Choose your role:",
      sender: "Send Cargo",
      senderDesc: "Looking to send cargo or find transport?",
      driver: "Transport Cargo",
      driverDesc: "Want to earn money with your vehicle?",
      continue: "Continue",
      haveAccount: "Already have an account?",
      login: "Login",
      loginText: "Enter phone number to login",
      chooseLang: "Choose language",
      chooseLangText: "Which language would you like to use?\nYou can change it later in settings.",
      register: "Sign up",
      registerText: `Register as a new {role}`,
      phone: "Phone number",
      email: "Email address",
      password: "Password",
      confirmPassword: "Confirm password",
      forgotPassword: "Forgot password?",
      or: "Or",
      agreeText_1: "By continuing, you agree to the",
      agreeText_2: 'Terms of Service',
      and: 'and',
      agreeText_3: 'Privacy Policy',
      addable: "Can be filled later",
      placeholder_1: 'Enter your password',
      place_holder_2: 'Confirm your password',
      emailPlaceholder: 'example@mail.com',
      document: 'Driving license number',
      role_1: "Shipper",
      role_2: "Carrier",
      loading: "Loading...",
      successRegister: "Successfully registered!",
      successLogin: "Successfully logged in!",
      errorMessage: "An error occurred. Please try again.",
      requiredField: "This field is required",
      passwordMismatch: "Passwords do not match",
      invalidPhone: "Invalid phone number format (must be 9 digits)",
      invalidEmail: "Invalid email format",
      networkError: "No internet connection. Please check your internet connection.",
      invalidCredentials: "Invalid phone number or password",
      loginWithGoogle: "Continue with Google",
      loginWithFacebook: "Continue with Facebook",
      loginWithOneID: "Continue with OneID",
      getLocation: "Get Location",
      locationLoading: "Getting location...",
      locationSuccess: "Location successfully obtained",
      locationError: "Error getting location",
      confirmEmail: "Confirm your email",
      confirmationSent: "A 4-digit verification code has been sent to your email",
      enterCode: "Enter the code",
      checkSpam: "Please check your spam folder",
      verify: "Verify",
      resendCode: "Resend code",
      resendIn: "Resend in {seconds}",
      verifying: "Verifying...",
      codeVerified: "Email successfully verified!",
      invalidCode: "Invalid code. Please try again.",
      continueToApp: "Continue to app",
      didntReceiveCode: "Didn't receive the code?",
      back: "Back"
    },
  }), []);

  // Helper function for translations with useCallback
  const t = useCallback((key) => {
    const translation = translations[language]?.[key] || key;
    
    if (key === 'registerText' && !login) {
      const roleKey = job === 1 ? 'role_1' : 'role_2';
      const role = translations[language]?.[roleKey] || '';
      return translation.replace('{role}', role);
    }
    
    if (key === 'resendIn') {
      return translation.replace('{seconds}', resendCountdown);
    }
    
    return translation;
  }, [language, login, job, resendCountdown, translations]);

  // Location functions
  const getUserLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError(t('locationError') + ": Geolocation not supported");
      return;
    }

    setLocationLoading(true);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lon: longitude });
        localStorage.setItem('userLocation', JSON.stringify({ lat: latitude, lon: longitude }));
        setLocationLoading(false);
      },
      (error) => {
        console.error("Geolocation error:", error);
        setError(t('locationError') + ": " + error.message);
        setLocationLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  }, [t]);

  // Countdown timer
  useEffect(() => {
    let timer;
    if (resendCountdown > 0) {
      timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCountdown]);

  // Initialize on mount
  useEffect(() => {
    if (language) {
      localStorage.setItem("language", language);
    }
    getUserLocation();
  }, [language, getUserLocation]);

  // Form handlers
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    
    if (name === 'phone') {
      const cleanedValue = value.replace(/\D/g, '');
      setFormData(prev => ({
        ...prev,
        [name]: cleanedValue.slice(0, 9)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    if (error) setError('');
    if (success) setSuccess('');
  }, [error, success]);

  // Confirmation code handlers
  const handleCodeChange = useCallback((index, value) => {
    const newCode = [...confirmationCode];
    newCode[index] = value.replace(/\D/g, '').slice(0, 1);
    setConfirmationCode(newCode);
    
    if (value && index < 3 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
    
    if (error) setError('');
  }, [confirmationCode, error]);

  const handleCodeKeyDown = useCallback((index, e) => {
    if (e.key === 'Backspace' && !confirmationCode[index] && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1].focus();
    }
  }, [confirmationCode]);

  // Resend confirmation code
  const handleResendCode = async () => {
    if (resendCountdown > 0) return;
    
    setResendCountdown(30);
    setError('');
    
    try {
      const response = await fetch(`${baseUrl}api/resend-verification/${formData.email}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setSuccess(t('confirmationSent'));
      } else {
        setError(t('errorMessage'));
      }
    } catch (err) {
      console.error('Resend error:', err);
      setError(t('errorMessage'));
    }
  };

  // Get token after successful verification
  const getAuthToken = async (phone, password) => {
    try {
      const response = await fetch(baseUrl + 'api/token/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          phone_number: `+998${phone}`,
          password: password,
          role: job === 1 ? 'Yuk beruvchi' : 'Haydovchi',
        })
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.detail || responseData.error || t('invalidCredentials'));
      }

      if (responseData.token) {
        localStorage.setItem('token', responseData.token);
        return responseData.token;
      }

      throw new Error(t('errorMessage'));
    } catch (error) {
      console.error('Token API Error:', error);
      throw error;
    }
  };

  // Verify confirmation code and get token
  const handleVerifyCode = async () => {
    const code = confirmationCode.join('');
    
    if (code.length !== 4) {
      setError(t('invalidCode'));
      return;
    }
    
    setConfirmationLoading(true);
    setError('');
    
    try {
      const userData = {
        username: registrationData.phone,
        phone_number: `+998${registrationData.phone}`,
        email: registrationData.email,
        telegram: "",
        facebook: "",
        whatsapp: "",
        is_verified: false,
        password: registrationData.password,
        role: registrationData.role === 1 ? 'shipper' : 'driver',
      };
      
      const response = await fetch(`${baseUrl}api/verify-user/${registrationData.email}/${code}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });

      if (response.ok) {
        const data = await response.json();
        
        try {
          const token = await getAuthToken(registrationData.phone, registrationData.password);
          localStorage.setItem('token', token);
          
          localStorage.setItem('user', JSON.stringify({
            phone: `+998${registrationData.phone}`,
            email: registrationData.email,
            role: registrationData.role === 1 ? 'shipper' : 'driver',
            language: registrationData.language,
            location: location,
            isVerified: true
          }));
          
          setSuccess(t('codeVerified'));
          
          setTimeout(() => {
            navigate('/profile-setup');
          }, 1000);
        } catch (tokenError) {
          setError(t('errorMessage'));
        }
      } else {
        const errorData = await response.json();
        setError(errorData.detail || errorData.error || t('invalidCode'));
      }
    } catch (err) {
      console.error('Verification error:', err);
      setError(t('errorMessage'));
    } finally {
      setConfirmationLoading(false);
    }
  };

  // Form validation
  const validateForm = useCallback(() => {
    if (login) {
      return formData.phone.length === 9 && formData.password.trim() !== '';
    } else {
      const baseValidation = formData.phone.length === 9 && 
                            formData.password.trim() !== '' && 
                            formData.confirmPassword.trim() !== '';
      const passwordMatch = formData.password === formData.confirmPassword;
      
      const emailValid = formData.email === '' || 
                        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
      
      return baseValidation && passwordMatch && emailValid;
    }
  }, [login, formData]);

  // Clean phone number
  const cleanPhoneNumber = (phone) => phone.replace(/\D/g, '').slice(0, 9);

  // API functions
  const performLogin = async (phone, password) => {
    try {
      const loginData = {
        phone_number: `+998${phone}`,
        password: password,
        role: job === 1 ? 'Yuk beruvchi' : 'Haydovchi',
      };

      const response = await fetch(baseUrl + 'api/token/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(loginData)
      });

      const responseData = await response.json();

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error(t('invalidCredentials'));
        }
        const errorMsg = responseData.detail || responseData.error || responseData.message || `Login failed (${response.status})`;
        throw new Error(errorMsg);
      }

      if (responseData.token) {
        localStorage.setItem('token', responseData.token);
      }

      return responseData;
    } catch (error) {
      console.error('Login API Error:', error);
      throw error;
    }
  };

  const performRegistration = async (data) => {
    const apiData = {
      username: data.phone,
      phone_number: `+998${data.phone}`,
      email: data.email || "",
      telegram: "",
      facebook: "",
      whatsapp: "",
      is_verified: false,
      password: data.password,
      role: job === 1 ? 'shipper' : 'driver',
    };
    
    const response = await fetch(baseUrl + 'api/users/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(apiData)
    });
    localStorage.setItem('job', job === 1 ? 'shipper' : 'driver')

    const responseData = await response.json();
    
    if (!response.ok) {
      if (response.status === 400) {
        if (responseData.phone_number) {
          throw new Error(`Phone number error: ${responseData.phone_number[0]}`);
        } else if (responseData.email) {
          throw new Error(`Email error: ${responseData.email[0]}`);
        }
        throw new Error(`Registration error: ${JSON.stringify(responseData)}`);
      } else if (response.status === 409) {
        throw new Error('This phone number is already registered. Please login instead.');
      }
      throw new Error(`Registration failed with status: ${response.status}`);
    }

    return responseData;
  };

  // Main submit handler for registration - collects data and sends verification
  const handleRegistrationSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setError('');
    setSuccess('');
    
    const cleanedPhone = cleanPhoneNumber(formData.phone);
    
    if (cleanedPhone.length !== 9) {
      setError(t('invalidPhone'));
      return;
    }
    
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError(t('invalidEmail'));
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError(t('passwordMismatch'));
      return;
    }
    
    if (formData.password.length < 6) {
      setError(language === 'uz' ? "Parol kamida 6 belgidan iborat bo'lishi kerak" : 
              language === 'ru' ? "Пароль должен содержать не менее 6 символов" : 
              "Password must be at least 6 characters long");
      return;
    }
    
    setLoading(true);
    
    try {
      const submitData = {
        phone: cleanedPhone,
        email: formData.email,
        password: formData.password,
        role: job,
        language: language
      };
      
      await performRegistration(submitData);
      
      setRegistrationData({
        phone: cleanedPhone,
        email: formData.email,
        password: formData.password,
        role: job,
        language: language
      });
      
      setResendCountdown(30);
      setCounter(3);
      
      setSuccess(t('confirmationSent'));
    } catch (error) {
      console.error('Registration error:', error);
      
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        setError(t('networkError'));
      } else {
        setError(error.message || t('errorMessage'));
      }
    } finally {
      setLoading(false);
    }
  };

  // Regular login handler
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setError('');
    setSuccess('');
    
    const cleanedPhone = cleanPhoneNumber(formData.phone);
    
    if (cleanedPhone.length !== 9) {
      setError(t('invalidPhone'));
      return;
    }
    
    if (!formData.password) {
      setError(t('requiredField'));
      return;
    }
    
    setLoading(true);
    
    try {
      await performLogin(cleanedPhone, formData.password);
      setSuccess(t('successLogin'));
      
      localStorage.setItem('user', JSON.stringify({
        phone: `+998${cleanedPhone}`,
        email: formData.email,
        role: job,
        language: language,
        location: location
      }));
      navigate('/freight/asosiy');
    } catch (error) {
      console.error('Login error:', error);
      
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        setError(t('networkError'));
      } else {
        setError(error.message || t('errorMessage'));
      }
    } finally {
      setLoading(false);
    }
  };

  // Social login handlers
  const handleGoogleLogin = () => {
    window.open(baseUrl + 'api/google-oauth/start/', '_blank');
  };

  const handleFacebookLogin = () => {
    console.log('Facebook login clicked');
  };

  const handleOneIDLogin = () => {
    console.log('OneID login clicked');
  };

  // Render functions for each step
  const renderRoleSelection = () => (
    <div className="py-3 flex flex-col gap-y-2 px-4">
      <div className="py-5 px-5 flex-col text-center">
        <h1 className='text-3xl font-medium text-zinc-800'>{t("welcome")}</h1>
        <p className='py-5 text-zinc-600'>{t("welcomeText")}</p>
      </div>
      
      {[1, 2].map((roleId) => (
        <div 
          key={roleId}
          onClick={() => setJob(roleId)} 
          className={`flex justify-center px-4 cursor-pointer items-center gap-x-3 md:gap-x-6 border-2 transition-all duration-300 rounded-2xl mx-5 py-5 ${job === roleId ? 'border-blue-700 shadow-lg shadow-blue-200' : 'border-zinc-200 hover:border-blue-300'} ${roleId === 2 ? 'my-3' : ''}`}
        >
          <p className={`p-3 rounded-xl ${roleId === 1 ? 'bg-blue-600' : 'bg-purple-700'} shadow-md`}>
            {roleId === 1 ? <FaBox className='text-white text-xl' /> : <FaTruck className='text-white text-xl' />}
          </p>
          <div className='flex-1'>
            <h1 className='text-lg font-semibold text-zinc-800'>{t(roleId === 1 ? "sender" : "driver")}</h1>
            <p className='text-zinc-600 text-sm'>{t(roleId === 1 ? "senderDesc" : "driverDesc")}</p>
          </div>
          <p><FaAngleRight className={`text-2xl transition-transform duration-300 ${job === roleId ? 'text-blue-700 scale-110' : 'text-zinc-800'}`} /></p>
        </div>
      ))}
      
      <button 
        onClick={() => setCounter(counter + 1)} 
        disabled={job === 0} 
        className='flex cursor-pointer justify-center mx-5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-800 transition-all duration-300 items-center gap-x-2 py-3 text-white disabled:bg-blue-700/50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-blue-500/30 transform hover:-translate-y-0.5'
      >
        <FaArrowRight className='inline transition-transform duration-300 group-hover:translate-x-1' />{t("continue")}
      </button>
      <p className='text-center py-4 text-zinc-600'>
        {t("haveAccount")} 
        <button 
          type="button" 
          onClick={() => {setCounter(2); setLogin(true);}} 
          className='text-blue-700 cursor-pointer ml-1 font-medium hover:text-blue-800 transition-colors'
        >
          {t("login")}
        </button>
      </p>
    </div>
  );

  const renderLanguageSelection = () => (
    <div className="flex flex-col gap-y-3 px-4 py-4">
      <div className="py-5 flex-col text-center">
        <p className='pt-5 text-zinc-600 whitespace-pre-line'>{t("chooseLangText")}</p>
      </div>
      
      {['uz', 'ru', 'en'].map((lang) => (
        <div 
          key={lang}
          onClick={() => setLanguage(lang)} 
          className={`relative overflow-hidden flex justify-between px-4 cursor-pointer items-center gap-x-5 border-2 transition-all duration-300 rounded-2xl mx-5 py-5 ${language === lang ? 'border-blue-700 shadow-lg shadow-blue-100 bg-blue-50' : 'border-zinc-300 hover:border-blue-400 hover:shadow-md bg-white'} group`}
        >
          {/* Content */}
          <div className='flex gap-x-5 items-center'>
            <div className="relative">
              {/* Flag container with beautiful flag image */}
              <div 
                className="p-3 rounded-lg font-medium text-white shadow-lg overflow-hidden border border-zinc-200"
                style={{
                  backgroundImage: `url(${FLAG_IMAGES[lang]})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  width: '48px',
                  height: '48px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative'
                }}
              >
                {/* Dark overlay for better text visibility */}
                <div className="absolute inset-0 bg-black/30"></div>
                {/* Small flag icon in corner */}
                
                <span className="relative z-10 font-bold text-white drop-shadow-md">
                  {lang.toUpperCase()}
                </span>
              </div>
            </div>
            <div>
              <p className='text-lg font-medium text-zinc-800'>
                {lang === 'uz' ? "O'zbekcha" : lang === 'ru' ? "Русский" : "English"}
              </p>
              <p className='text-zinc-600 text-sm'>
                {lang === 'uz' ? "O'zbek tili" : lang === 'ru' ? "Русский язык" : "English language"}
              </p>
            </div>
          </div>
          {language === lang && (
            <RiCheckboxCircleFill className='text-2xl text-blue-600 animate-pulse' />
          )}
        </div>
      ))}
      
      <label for="continue1" className='flex justify-center mx-5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-800 cursor-pointer transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/30'>
        <button id='continue1' onClick={() => setCounter(counter + 1)} className='flex items-center cursor-pointer gap-x-2 py-3 text-white'>
          <FaArrowRight className='inline transition-transform duration-300 group-hover:translate-x-1' />{t("continue")}
        </button>
      </label>
      <p className='text-center py-4 text-zinc-600'>
        {t("haveAccount")} 
        <button type="button" onClick={() => {setCounter(2); setLogin(true);}} className='text-blue-700 cursor-pointer ml-1 font-medium hover:text-blue-800 transition-colors'>
          {t("login")}
        </button>
      </p>
    </div>
  );

  const renderLoginRegisterForm = () => (
    <div className="w-full h-full">
      <form onSubmit={login ? handleLoginSubmit : handleRegistrationSubmit}>
        <div className="px-7 flex flex-col gap-y-1 py-4">
          <div>
            <h1 className={`font-medium text-zinc-800 text-3xl py-3 ${login ? '' : 'hidden'}`}>
              {t('login')}
            </h1>
            <h1 className={`font-medium text-zinc-800 text-3xl py-3 ${login ? 'hidden' : ''}`}>
              {t('register')}
            </h1>
            <p className={`text-zinc-600 ${login ? '' : 'hidden'}`}>{t('loginText')}</p>
            <p className={`text-zinc-600 ${login ? 'hidden' : ''}`}>{t('registerText')}</p>
          </div>
          
          {/* Success/Error Messages */}
          {success && (
            <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl relative mb-3 animate-fadeIn">
              <span className="block sm:inline">{success}</span>
            </div>
          )}
          
          {error && (
            <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative mb-3 animate-fadeIn">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          
          {/* Login/Register Tabs */}
          <div className='grid grid-cols-2 text-center text-zinc-600 py-4'>
            {['login', 'register'].map((tab) => (
              <button 
                key={tab}
                type="button" 
                onClick={() => {
                  setLogin(tab === 'login');
                  setError('');
                  setSuccess('');
                  if (tab === 'login') {
                    setFormData(prev => ({...prev, confirmPassword: ''}));
                  }
                }} 
                className={`md:text-xl cursor-pointer py-2 transition-all duration-300 ${(tab === 'login' && login) || (tab === 'register' && !login) ? 'border-b-3 border-blue-700 text-blue-700 font-semibold' : 'border-b-3 border-zinc-300 hover:text-blue-600'}`}
              >
                {t(tab)}
              </button>
            ))}
          </div>
          
          {/* Phone Input */}
          <p className='py-2 text-sm font-medium text-zinc-800'>{t('phone')}</p>
          <div className='grid grid-cols-5 gap-2'>
            <div>
              <p className='sm:p-3 p-2 col-span-1 bg-gradient-to-r from-zinc-100 to-zinc-200 border border-zinc-300 rounded-xl shadow-sm flex items-center justify-center'>
                +998
              </p>
            </div>
            <input 
              required 
              type="tel" 
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className='border col-span-4 px-3 rounded-xl outline-0 border-zinc-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 shadow-sm' 
              placeholder='90 123 45 67'
              pattern="[0-9]{9}"
              title={t('invalidPhone')}
              inputMode="numeric"
              maxLength="9"
            />
          </div>

          {/* Email Field (Registration only) */}
          {!login && (
            <>
              <p className='py-2 text-sm font-medium text-zinc-800'>{t('email')}</p>
              <div className='relative'>
                <FaEnvelope className='absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400' />
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={t('emailPlaceholder')} 
                  className='outline-0 border border-zinc-300 rounded-xl p-3 w-[99%] pl-10 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 shadow-sm' 
                  autoComplete="email"
                  required
                />
              </div>
            </>
          )}
          
          {/* Document Field (Driver registration only) */}
          {!login && job === 2 && (
            <>
              <p className='pt-4 pb-2 text-sm font-medium text-zinc-800'>{t('document')}</p>
              <input 
                type="text" 
                name="document"
                value={formData.document}
                onChange={handleChange}
                placeholder='AA 1234567' 
                className='outline-0 border border-zinc-300 rounded-xl p-3 w-[99%] focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 shadow-sm' 
              />
              <p className='text-xs text-zinc-500 py-2'>{t('addable')}</p>
            </>
          )}
          
          {/* Password Fields */}
          <p className='py-2 text-sm font-medium text-zinc-800'>{t('password')}</p>
          <input 
            required 
            type="password" 
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder={t('placeholder_1')} 
            className='outline-0 border border-zinc-300 rounded-xl p-3 w-[99%] focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 shadow-sm' 
            minLength="3"
            autoComplete={login ? "current-password" : "new-password"}
          />
          
          {!login && (
            <>
              <p className='py-2 text-sm font-medium text-zinc-800'>{t('confirmPassword')}</p>
              <input 
                required
                type="password" 
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder={t('place_holder_2')} 
                className='outline-0 border border-zinc-300 rounded-xl p-3 w-[99%] focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 shadow-sm' 
                minLength="6"
                autoComplete="new-password"
              />
            </>
          )}
          
          {/* Forgot Password */}
          {login && (
            <button type="button" className='underline text-xs font-medium text-blue-700 cursor-pointer text-left hover:text-blue-800 transition-colors'>
              {t('forgotPassword')}
            </button>
          )}
          
          {/* Submit Button */}
          <div className='flex my-2 justify-center rounded-xl bg-gradient-to-r from-blue-600 to-blue-800 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/30'>
            <button 
              type="submit" 
              disabled={!validateForm() || loading}
              className={`flex items-center justify-center gap-x-2 py-4 text-white w-full rounded-xl transition-all duration-300 ${!validateForm() || loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-800'}`}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  <span>{t('loading')}</span>
                </>
              ) : (
                <>
                  <FaArrowRight className='inline transition-transform duration-300 group-hover:translate-x-1' />
                  <span>{login ? t('login') : t('register')}</span>
                </>
              )}
            </button>
          </div>

          {/* Location Display */}
          <div className="p-4 border border-zinc-200 rounded-xl bg-gradient-to-r from-zinc-50 to-white shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="flex items-center gap-2 text-sm font-medium text-zinc-800">
                <FaMapMarkerAlt className="text-blue-600 animate-pulse" />
                {t('getLocation')}
              </span>
              <button 
                onClick={getUserLocation}
                disabled={locationLoading}
                className="text-xs bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 px-3 py-1 rounded-lg hover:from-blue-200 hover:to-blue-300 transition-all duration-300 shadow-sm"
              >
                {locationLoading ? (
                  <span className="flex items-center gap-1">
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-700"></div>
                    {t('locationLoading')}
                  </span>
                ) : t('getLocation')}
              </button>
            </div>
          </div>
          
          {/* Divider */}
          <div className="flex justify-center items-center gap-x-3 my-4">
            <div className="bg-gradient-to-r from-zinc-300 to-transparent h-0.5 flex-1"></div>
            <p className='text-zinc-700 font-medium'>{t('or')}</p>
            <div className="bg-gradient-to-l from-zinc-300 to-transparent h-0.5 flex-1"></div>
          </div>
          
          {/* Social Login Buttons */}
          <div className="grid grid-cols-1 gap-3 mb-4">
            <button 
              type="button" 
              onClick={handleGoogleLogin}
              className='flex items-center justify-center gap-x-3 p-3 rounded-xl border border-zinc-300 hover:border-red-400 hover:shadow-lg transition-all duration-300 bg-white transform hover:-translate-y-0.5'
            >
              <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-white border border-zinc-200 shadow-sm">
                <FaGoogle className='text-red-500 text-lg' />
              </div>
              <span className='flex-1 text-left font-medium text-zinc-700'>
                {t('loginWithGoogle')}
              </span>
            </button>
            
            <button 
              type="button" 
              onClick={handleFacebookLogin}
              className='flex items-center justify-center gap-x-3 p-3 rounded-xl border border-blue-600 hover:border-blue-700 hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-blue-600 to-blue-700 text-white transform hover:-translate-y-0.5'
            >
              <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-white shadow-sm">
                <FaFacebook className='text-blue-600 text-lg' />
              </div>
              <span className='flex-1 text-left font-medium'>
                {t('loginWithFacebook')}
              </span>
            </button>
            
            <button 
              type="button" 
              onClick={handleOneIDLogin}
              className='flex items-center justify-center gap-x-3 p-3 rounded-xl border border-purple-600 hover:border-purple-700 hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-purple-600 to-indigo-600 text-white transform hover:-translate-y-0.5'
            >
              <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 shadow-sm">
                <FaKey className='text-white text-lg' />
              </div>
              <span className='flex-1 text-left font-medium'>
                {t('loginWithOneID')}
              </span>
            </button>
          </div>
          
          {/* Terms Agreement */}
          <p className='text-xs py-2 text-center text-zinc-600'>
            {t('agreeText_1')} 
            <span className='text-blue-700 cursor-pointer mx-1 hover:text-blue-800 transition-colors'>{t('agreeText_2')}</span> 
            {t('and')} 
            <span className='text-blue-700 cursor-pointer mx-1 hover:text-blue-800 transition-colors'>{t('agreeText_3')}</span>
          </p>
        </div>
      </form>
    </div>
  );

  const renderEmailConfirmation = () => (
    <div className="w-full h-full">
      <div className="px-7 flex flex-col gap-y-4 py-8">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <FaEnvelope className="text-3xl text-green-600" />
          </div>
          <h1 className="text-2xl font-medium text-zinc-800 mb-2">{t('confirmEmail')}</h1>
          <p className="text-zinc-600 mb-1">{t('confirmationSent')}</p>
          <p className="text-sm text-amber-600 font-medium animate-pulse">
            <FaCheck className="inline mr-1" />
            {t('checkSpam')}
          </p>
          {registrationData?.email && (
            <p className="text-sm text-blue-600 font-medium mt-2">
              Email: {registrationData.email}
            </p>
          )}
        </div>
        
        {/* Success/Error Messages */}
        {success && (
          <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl relative mb-3 animate-fadeIn">
            <span className="block sm:inline">{success}</span>
          </div>
        )}
        
        {error && (
          <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative mb-3 animate-fadeIn">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        {/* Code Input */}
        <div>
          <p className="text-sm font-medium text-zinc-800 mb-3 text-center">{t('enterCode')}</p>
          <div className="flex justify-center gap-3 mb-6">
            {[0, 1, 2, 3].map((index) => (
              <input
                key={index}
                ref={el => inputRefs.current[index] = el}
                type="text"
                inputMode="numeric"
                maxLength="1"
                value={confirmationCode[index]}
                onChange={(e) => handleCodeChange(index, e.target.value)}
                onKeyDown={(e) => handleCodeKeyDown(index, e)}
                className="w-16 h-16 text-3xl text-center border-2 border-zinc-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-300 shadow-sm hover:border-blue-400"
              />
            ))}
          </div>
        </div>
        
        {/* Verify Button */}
        <button
          onClick={handleVerifyCode}
          disabled={confirmationLoading || confirmationCode.join('').length !== 4}
          className="flex justify-center items-center gap-x-2 py-4 text-white w-full rounded-xl bg-gradient-to-r from-blue-600 to-blue-800 hover:shadow-lg hover:shadow-blue-500/30 transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {confirmationLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              <span>{t('verifying')}</span>
            </>
          ) : (
            <>
              <FaCheck className="inline" />
              <span>{t('verify')}</span>
            </>
          )}
        </button>
        
        {/* Resend Code */}
        <div className="text-center">
          <p className="text-zinc-600 mb-2">{t('didntReceiveCode')}</p>
          <button
            onClick={handleResendCode}
            disabled={resendCountdown > 0}
            className={`inline-flex items-center gap-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${resendCountdown > 0
                ? 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 hover:from-blue-200 hover:to-blue-300 hover:shadow-md cursor-pointer'
            }`}
          >
            <FaRedo className={resendCountdown > 0 ? 'animate-spin' : ''} />
            {resendCountdown > 0 ? t('resendIn') : t('resendCode')}
          </button>
        </div>
        
        {/* Back to registration button */}
        <button
          onClick={() => {
            setCounter(2);
            setConfirmationCode(['', '', '', '']);
            setError('');
            setSuccess('');
          }}
          className="text-center text-blue-700 hover:text-blue-800 cursor-pointer mt-4 transition-colors duration-300"
        >
          ← {t('back')}
        </button>
      </div>
    </div>
  );

  // Main render
  return (
    <div className='p-5 min-h-screen main-bg'>
      <div className="lg:w-2/5 md:w-3/5 sm:w-4/5 m-auto">
        {/* Header */}
        <div className="rounded-t-2xl main-bg text-center p-5 text-white shadow-xl">
          <div className="flex justify-evenly items-center py-5">
            <button 
              onClick={() => {
                if (counter === 3) {
                  setCounter(2);
                } else {
                  setCounter(Math.max(0, counter - 1));
                }
              }} 
              className={`p-3 cursor-pointer rounded-xl bg-white/20 hover:bg-white/40 transition-all duration-300 transform hover:scale-110 ${counter === 0 ? 'invisible' : 'visible'}`}
            >
              <FaArrowLeft />
            </button>
            <h1 className='text-3xl items-center flex justify-center'>
              <span className='p-2 mx-2 bg-white/20 rounded-2xl backdrop-blur-sm'>
                <FaTruckLoading className='inline mx-2' />
              </span> 
              Yuk.uz
            </h1>
            <div className='w-12'></div>
          </div>
          
          {/* Header Content */}
          <div>
            {counter === 0 && <p className='py-4 text-white/90'>{t("slogan")}</p>}
            {counter === 1 && <h1 className='text-2xl font-semibold'>{t("chooseLang")}</h1>}
            {counter === 2 && (
              <span className='text-center bg-white/30 py-2 px-4 rounded-full backdrop-blur-sm'>
                <FaUser className='inline my-4 mx-1' />
                {job === 1 ? t("role_1") : t("role_2")}
              </span>
            )}
            {counter === 3 && <h1 className='text-2xl font-semibold'>{t("confirmEmail")}</h1>}
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-b-2xl overflow-hidden relative min-h-[600px] shadow-2xl">
          {counter === 0 && renderRoleSelection()}
          {counter === 1 && renderLanguageSelection()}
          {counter === 2 && renderLoginRegisterForm()}
          {counter === 3 && renderEmailConfirmation()}
        </div>
      </div>
      
      {/* Add CSS animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}

export default Login