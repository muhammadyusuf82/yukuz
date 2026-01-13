import React, { useState, useEffect, useRef, useCallback } from 'react'
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
  FaPhone,
  FaLock,
  FaUserCircle,
} from "react-icons/fa";
import { RiCheckboxCircleFill } from "react-icons/ri";

const baseUrl = 'https://tokennoty.pythonanywhere.com/'

const Login = () => {
  const [counter, setCounter] = useState(0)
  const [job, setJob] = useState(0)
  const [login, setLogin] = useState(true)
  const [language, setLanguage] = useState(localStorage.getItem("language") || 'uz')
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
  const [verificationEmail, setVerificationEmail] = useState('')
  const [isEmailVerified, setIsEmailVerified] = useState(false)
  const [temporaryToken, setTemporaryToken] = useState('')
  
  const navigate = useNavigate();
  const inputRefs = useRef([])

  // Translations
  const translations = {
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
      back: "Orqaga",
      enterEmailFirst: "Avval email manzilingizni kiriting",
      emailVerification: "Email Tasdiqlash",
      enterEmail: "Email manzilingizni kiriting",
      sendCode: "Kod yuborish",
      codeSent: "Emailingizga tasdiqlash kodi yuborildi",
      verifyEmail: "Emailni tasdiqlang",
      completeRegistration: "Ro'yxatdan o'tishni yakunlash",
      emailRequired: "Email manzili talab qilinadi",
      invalidEmailFormat: "Noto'g'ri email formati",
      registrationComplete: "Ro'yxatdan o'tish yakunlandi!",
      startRegistration: "Ro'yxatdan o'tishni boshlash",
      emailVerified: "Email tasdiqlandi",
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
      invalidEmail: "Неправильный формат электронной почты",
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
      back: "Назад",
      enterEmailFirst: "Сначала введите ваш email",
      emailVerification: "Подтверждение Email",
      enterEmail: "Введите ваш email",
      sendCode: "Отправить код",
      codeSent: "Код подтверждения отправлен на ваш email",
      verifyEmail: "Подтвердите email",
      completeRegistration: "Завершите регистрацию",
      emailRequired: "Email обязателен",
      invalidEmailFormat: "Неверный формат email",
      registrationComplete: "Регистрация завершена!",
      startRegistration: "Начать регистрацию",
      emailVerified: "Email подтвержден",
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
      back: "Back",
      enterEmailFirst: "First enter your email address",
      emailVerification: "Email Verification",
      enterEmail: "Enter your email",
      sendCode: "Send Code",
      codeSent: "Verification code sent to your email",
      verifyEmail: "Verify Email",
      completeRegistration: "Complete Registration",
      emailRequired: "Email is required",
      invalidEmailFormat: "Invalid email format",
      registrationComplete: "Registration complete!",
      startRegistration: "Start Registration",
      emailVerified: "Email verified",
    },
  };

  // Helper function for translations
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
  }, [language, login, job, resendCountdown]);

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
  const handleChange = (e) => {
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
  };

  // Handle email input for verification
  const handleEmailChange = (e) => {
    const { value } = e.target;
    setFormData(prev => ({
      ...prev,
      email: value
    }));
    
    if (error) setError('');
    if (success) setSuccess('');
  };

  // Confirmation code handlers
  const handleCodeChange = (index, value) => {
    const newCode = [...confirmationCode];
    newCode[index] = value.replace(/\D/g, '').slice(0, 1);
    setConfirmationCode(newCode);
    
    if (value && index < 3 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
    
    if (error) setError('');
  };

  const handleCodeKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !confirmationCode[index] && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1].focus();
    }
  };

  // Step 1: Send verification code to email
  const handleSendVerificationCode = async (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    
    const email = formData.email.trim();
    
    if (!email) {
      setError(t('emailRequired'));
      return;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError(t('invalidEmailFormat'));
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // Step 1: Send email to get verification code
      // This endpoint should exist on your backend
      const response = await fetch(`${baseUrl}api/users/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: email,
          // role: job === 1 ? 'shipper' : 'driver' 
        })
      });

      const responseData = await response.json();

      if (response.ok) {
        setVerificationEmail(email);
        setSuccess(t('codeSent'));
        setResendCountdown(30);
        
        // If backend returns a temporary token, store it
        if (responseData.temp_token) {
          setTemporaryToken(responseData.temp_token);
        }
        
        // Move to verification step
        setCounter(3);
      } else {
        setError(responseData.detail || responseData.error || t('errorMessage'));
      }
    } catch (err) {
      console.error('Send verification error:', err);
      setError(t('networkError'));
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify the code
  const handleVerifyCode = async () => {
    const code = confirmationCode.join('');
    
    if (code.length !== 4) {
      setError(t('invalidCode'));
      return;
    }
    
    setConfirmationLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // Step 2: Verify the code with the email
      const response = await fetch(`${baseUrl}api/verify-user/${verificationEmail}/${code}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const responseData = await response.json();

      if (response.ok) {
        if (responseData.verified) {
          setIsEmailVerified(true);
          setSuccess(t('codeVerified'));
          
          // Store verification token if provided
          if (responseData.verification_token) {
            setTemporaryToken(responseData.verification_token);
          }
          
          // Move to complete registration step
          setTimeout(() => {
            setCounter(4);
            setConfirmationCode(['', '', '', '']);
            setSuccess('');
          }, 1000);
        } else {
          setError(t('invalidCode'));
        }
      } else {
        setError(responseData.detail || responseData.error || t('invalidCode'));
      }
    } catch (err) {
      console.error('Verification error:', err);
      setError(t('networkError'));
    } finally {
      setConfirmationLoading(false);
    }
  };

  // Resend confirmation code
  const handleResendCode = async () => {
    if (resendCountdown > 0) return;
    
    setResendCountdown(30);
    setError('');
    setSuccess('');
    
    try {
      const response = await fetch(`${baseUrl}api/resend-verification-code/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: verificationEmail,
        })
      });

      const responseData = await response.json();

      if (response.ok) {
        setSuccess(t('confirmationSent'));
      } else {
        setError(responseData.detail || responseData.error || t('errorMessage'));
      }
    } catch (err) {
      console.error('Resend error:', err);
      setError(t('errorMessage'));
    }
  };

  // Step 3: Complete registration with all data
  const handleCompleteRegistration = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setError('');
    setSuccess('');
    
    const cleanedPhone = formData.phone.replace(/\D/g, '').slice(0, 9);
    
    if (cleanedPhone.length !== 9) {
      setError(t('invalidPhone'));
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
      // Step 3: Complete registration with all data
      const apiData = {
        username: cleanedPhone,
        phone_number: `+998${cleanedPhone}`,
        email: verificationEmail,
        telegram: "",
        facebook: "",
        whatsapp: "",
        is_verified: true,
        password: formData.password,
        role: job === 1 ? 'shipper' : 'driver',
        verification_token: temporaryToken || '',
        ...(job === 2 && formData.document ? { document: formData.document } : {})
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
          throw new Error(language === 'uz' ? 'Bu telefon raqami allaqachon ro\'yxatdan o\'tgan. Iltimos, tizimga kiring.' : 
                         language === 'ru' ? 'Этот номер телефона уже зарегистрирован. Пожалуйста, войдите в систему.' : 
                         'This phone number is already registered. Please login instead.');
        }
        throw new Error(`Registration failed with status: ${response.status}`);
      }
      
      // Get token after successful registration
      const tokenResponse = await fetch(baseUrl + 'api/token/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          phone_number: `+998${cleanedPhone}`,
          password: formData.password,
          role: job === 1 ? 'Yuk beruvchi' : 'Haydovchi',
        })
      });

      const tokenData = await tokenResponse.json();

      if (tokenResponse.ok && tokenData.token) {
        localStorage.setItem('token', tokenData.token);
        localStorage.setItem('user', JSON.stringify({
          phone: `+998${cleanedPhone}`,
          email: verificationEmail,
          role: job,
          language: language,
          location: location,
          isVerified: true
        }));
        
        setSuccess(t('successRegister'));
        
        setTimeout(() => {
          navigate('/profile-setup');
        }, 1500);
      } else {
        throw new Error(t('errorMessage'));
      }
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

  // Regular login (unchanged)
  const handleLogin = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setError('');
    setSuccess('');
    
    const cleanedPhone = formData.phone.replace(/\D/g, '').slice(0, 9);
    
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
      const response = await fetch(baseUrl + 'api/token/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          phone_number: `+998${cleanedPhone}`,
          password: formData.password,
          role: job === 1 ? 'Yuk beruvchi' : 'Haydovchi',
        })
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.detail || responseData.error || t('invalidCredentials'));
      }

      if (responseData.token) {
        localStorage.setItem('token', responseData.token);
        localStorage.setItem('user', JSON.stringify({
          phone: `+998${cleanedPhone}`,
          email: formData.email,
          role: job,
          language: language,
          location: location
        }));
        setSuccess(t('successLogin'));
        navigate('/freight/asosiy');
      } else {
        throw new Error(t('errorMessage'));
      }
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
          className={`flex justify-center px-4 cursor-pointer items-center gap-x-3 md:gap-x-6 border-2 transition-all duration-300 rounded-2xl mx-5 py-5 ${job === roleId ? 'border-blue-700' : 'border-zinc-200'} ${roleId === 2 ? 'my-3' : ''}`}
        >
          <p className={`p-3 rounded-xl ${roleId === 1 ? 'bg-blue-600' : 'bg-purple-700'}`}>
            {roleId === 1 ? <FaBox className='text-white text-xl' /> : <FaTruck className='text-white text-xl' />}
          </p>
          <div className='flex-1'>
            <h1 className='text-lg'>{t(roleId === 1 ? "sender" : "driver")}</h1>
            <p className='text-zinc-600 text-sm'>{t(roleId === 1 ? "senderDesc" : "driverDesc")}</p>
          </div>
          <p><FaAngleRight className='text-2xl text-zinc-800' /></p>
        </div>
      ))}
      
      <button 
        onClick={() => setCounter(counter + 1)} 
        disabled={job === 0} 
        className='flex cursor-pointer justify-center mx-5 rounded-xl bg-blue-700 transition-all duration-200 items-center gap-x-2 py-3 text-white disabled:bg-blue-700/50 disabled:cursor-not-allowed'
      >
        <FaArrowRight className='inline' />{t("continue")}
      </button>
      <p className='text-center py-4 text-zinc-600'>
        {t("haveAccount")} 
        <button 
          type="button" 
          onClick={() => {setCounter(2); setLogin(true);}} 
          className='text-blue-700 cursor-pointer ml-1'
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
          className={`flex justify-between px-4 cursor-pointer items-center gap-x-5 border-2 transition-all duration-300 rounded-2xl mx-5 py-5 ${language === lang ? 'border-blue-700' : 'border-zinc-300'}`}
        >
          <div className='flex gap-x-5 items-center'>
            <div>
              <p className={`p-3 rounded-lg font-medium ${lang === 'uz' ? 'uzb-bg' : lang === 'ru' ? 'rus-bg text-white' : 'eng-bg'}`}>
                {lang.toUpperCase()}
              </p>
            </div>
            <div>
              <p className='text-xl text-zinc-900'>
                {lang === 'uz' ? "O'zbekcha" : lang === 'ru' ? "Русский" : "English"}
              </p>
              <p className='text-zinc-600'>
                {lang === 'uz' ? "O'zbek tili" : lang === 'ru' ? "Русский язык" : "English language"}
              </p>
            </div>
          </div>
          {language === lang && <RiCheckboxCircleFill className='text-2xl text-blue-700' />}
        </div>
      ))}
      
      <div className='flex justify-center mx-5 rounded-xl bg-blue-700 cursor-pointer transition-all duration-200'>
        <button onClick={() => setCounter(counter + 1)} className='flex items-center cursor-pointer gap-x-2 py-3 text-white'>
          <FaArrowRight className='inline' />{t("continue")}
        </button>
      </div>
      <p className='text-center py-4 text-zinc-600'>
        {t("haveAccount")} 
        <button type="button" onClick={() => {setCounter(2); setLogin(true);}} className='text-blue-700 cursor-pointer ml-1'>
          {t("login")}
        </button>
      </p>
    </div>
  );

  const renderLoginForm = () => (
    <div className="w-full h-full">
      <form onSubmit={handleLogin}>
        <div className="px-7 flex flex-col gap-y-1 py-4">
          <div>
            <h1 className='font-medium text-zinc-800 text-3xl py-3'>
              {t('login')}
            </h1>
            <p>{t('loginText')}</p>
          </div>
          
          {/* Success/Error Messages */}
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-3">
              <span className="block sm:inline">{success}</span>
            </div>
          )}
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-3">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          
          {/* Phone Input */}
          <p className='py-2 text-sm font-medium text-zinc-800'>{t('phone')}</p>
          <div className='grid grid-cols-5'>
            <div>
              <p className='sm:p-3 p-2 col-span-1 bg-zinc-200 border border-zinc-300 rounded-xl'>
                <FaFlag className='inline' /> +998
              </p>
            </div>
            <input 
              required 
              type="tel" 
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className='border col-span-4 mx-2 px-3 rounded-xl outline-0 border-zinc-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500' 
              placeholder='90 123 45 67'
              pattern="[0-9]{9}"
              title={t('invalidPhone')}
              inputMode="numeric"
              maxLength="9"
            />
          </div>
          
          {/* Password Field */}
          <p className='py-2 text-sm font-medium text-zinc-800'>{t('password')}</p>
          <input 
            required 
            type="password" 
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder={t('placeholder_1')} 
            className='outline-0 border border-zinc-300 rounded-xl p-3 w-[99%] focus:border-blue-500 focus:ring-1 focus:ring-blue-500' 
            minLength="3"
            autoComplete="current-password"
          />
          
          {/* Forgot Password */}
          <button type="button" className='underline text-xs font-medium text-blue-700 cursor-pointer text-left'>
            {t('forgotPassword')}
          </button>
          
          {/* Submit Button */}
          <div className='flex my-2 justify-center rounded-xl bg-blue-700 transition-all duration-200'>
            <button 
              type="submit" 
              disabled={loading || formData.phone.length !== 9 || !formData.password}
              className={`flex items-center justify-center gap-x-2 py-4 text-white w-full rounded-xl ${loading || formData.phone.length !== 9 || !formData.password ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-800'}`}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  <span>{t('loading')}</span>
                </>
              ) : (
                <>
                  <FaArrowRight className='inline' />
                  <span>{t('login')}</span>
                </>
              )}
            </button>
          </div>
          
          {/* Don't have account? */}
          <p className='text-center py-4 text-zinc-600'>
            {language === 'uz' ? "Akkauntingiz yo'qmi?" : 
             language === 'ru' ? "Нет аккаунта?" : 
             "Don't have an account?"} 
            <button 
              type="button" 
              onClick={() => {setLogin(false); setCounter(2);}} 
              className='text-blue-700 cursor-pointer ml-1'
            >
              {t("register")}
            </button>
          </p>
        </div>
      </form>
    </div>
  );

  const renderEmailStep = () => (
    <div className="w-full h-full">
      <form onSubmit={handleSendVerificationCode}>
        <div className="px-7 flex flex-col gap-y-1 py-4">
          <div className="text-center mb-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <FaEnvelope className="text-2xl text-blue-600" />
            </div>
            <h1 className='font-medium text-zinc-800 text-2xl py-2'>
              {t('enterEmailFirst')}
            </h1>
            <p className="text-zinc-600">{t('registerText')}</p>
          </div>
          
          {/* Success/Error Messages */}
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-3">
              <span className="block sm:inline">{success}</span>
            </div>
          )}
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-3">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          
          {/* Email Field */}
          <p className='py-2 text-sm font-medium text-zinc-800'>{t('enterEmail')}</p>
          <div className='relative mb-4'>
            <FaEnvelope className='absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400' />
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleEmailChange}
              placeholder={t('emailPlaceholder')} 
              className='outline-0 border border-zinc-300 rounded-xl p-3 w-full pl-10 focus:border-blue-500 focus:ring-2 focus:ring-blue-200' 
              autoComplete="email"
              required
              disabled={loading}
            />
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
            <p className="text-sm text-blue-800">
              <FaCheck className="inline mr-2" />
              {language === 'uz' ? "Emailingizga 4 raqamli tasdiqlash kodi yuboriladi" : 
               language === 'ru' ? "На ваш email будет отправлен 4-значный код подтверждения" : 
               "A 4-digit verification code will be sent to your email"}
            </p>
          </div>
          
          {/* Submit Button */}
          <div className='flex my-2 justify-center rounded-xl bg-blue-700 transition-all duration-200'>
            <button 
              type="submit" 
              disabled={loading || !formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)}
              className={`flex items-center justify-center gap-x-2 py-4 text-white w-full rounded-xl ${loading || !formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-800'}`}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  <span>{t('loading')}</span>
                </>
              ) : (
                <>
                  <FaArrowRight className='inline' />
                  <span>{t('sendCode')}</span>
                </>
              )}
            </button>
          </div>
          
          {/* Already have account? */}
          <p className='text-center py-4 text-zinc-600'>
            {t("haveAccount")} 
            <button 
              type="button" 
              onClick={() => {setLogin(true); setCounter(2);}} 
              className='text-blue-700 cursor-pointer ml-1'
            >
              {t("login")}
            </button>
          </p>
        </div>
      </form>
    </div>
  );

  const renderEmailVerification = () => (
    <div className="w-full h-full">
      <div className="px-7 flex flex-col gap-y-4 py-8">
        <div className="text-center">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaEnvelope className="text-3xl text-blue-600" />
          </div>
          <h1 className="text-2xl font-medium text-zinc-800 mb-2">{t('verifyEmail')}</h1>
          <p className="text-zinc-600 mb-1">{t('confirmationSent')}</p>
          <p className="text-sm text-blue-600 font-medium">
            {verificationEmail}
          </p>
          <p className="text-sm text-amber-600 font-medium mt-2">
            <FaCheck className="inline mr-1" />
            {t('checkSpam')}
          </p>
        </div>
        
        {/* Success/Error Messages */}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-3">
            <span className="block sm:inline">{success}</span>
          </div>
        )}
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-3">
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
                className="w-16 h-16 text-3xl text-center border-2 border-zinc-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                disabled={confirmationLoading}
              />
            ))}
          </div>
        </div>
        
        {/* Verify Button */}
        <button
          onClick={handleVerifyCode}
          disabled={confirmationLoading || confirmationCode.join('').length !== 4}
          className="flex justify-center items-center gap-x-2 py-4 text-white w-full rounded-xl bg-blue-700 hover:bg-blue-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
            className={`inline-flex items-center gap-x-2 px-4 py-2 rounded-lg transition-all ${
              resendCountdown > 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200 cursor-pointer'
            }`}
          >
            <FaRedo className={resendCountdown > 0 ? 'animate-spin' : ''} />
            {resendCountdown > 0 ? t('resendIn') : t('resendCode')}
          </button>
        </div>
        
        {/* Back to email input */}
        <button
          onClick={() => {
            setCounter(2);
            setConfirmationCode(['', '', '', '']);
            setError('');
            setSuccess('');
          }}
          className="text-center text-blue-700 hover:text-blue-800 cursor-pointer mt-4"
        >
          ← {t('back')}
        </button>
      </div>
    </div>
  );

  const renderCompleteRegistration = () => (
    <div className="w-full h-full">
      <form onSubmit={handleCompleteRegistration}>
        <div className="px-7 flex flex-col gap-y-1 py-4">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <FaUserCircle className="text-3xl text-green-600" />
            </div>
            <h1 className='font-medium text-zinc-800 text-2xl py-2'>
              {t('completeRegistration')}
            </h1>
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
              <FaCheck className="text-xs" />
              <span>{t('emailVerified')}: {verificationEmail}</span>
            </div>
          </div>
          
          {/* Success/Error Messages */}
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-3">
              <span className="block sm:inline">{success}</span>
            </div>
          )}
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-3">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          
          {/* Phone Input */}
          <p className='py-2 text-sm font-medium text-zinc-800'>{t('phone')}</p>
          <div className='grid grid-cols-5 mb-3'>
            <div>
              <p className='sm:p-3 p-2 col-span-1 bg-zinc-200 border border-zinc-300 rounded-xl'>
                <FaFlag className='inline' /> +998
              </p>
            </div>
            <input 
              required 
              type="tel" 
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className='border col-span-4 mx-2 px-3 rounded-xl outline-0 border-zinc-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500' 
              placeholder='90 123 45 67'
              pattern="[0-9]{9}"
              title={t('invalidPhone')}
              inputMode="numeric"
              maxLength="9"
              disabled={loading}
            />
          </div>
          
          {/* Document Field (Driver registration only) */}
          {job === 2 && (
            <>
              <p className='pt-2 pb-2 text-sm font-medium text-zinc-800'>{t('document')}</p>
              <input 
                type="text" 
                name="document"
                value={formData.document}
                onChange={handleChange}
                placeholder={language === 'uz' ? 'AA 1234567' : 'AA 1234567'} 
                className='outline-0 border border-zinc-300 rounded-xl p-3 w-full mb-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200' 
                disabled={loading}
              />
              <p className='text-xs text-zinc-500 py-1 mb-2'>{t('addable')}</p>
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
            className='outline-0 border border-zinc-300 rounded-xl p-3 w-full mb-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200' 
            minLength="6"
            autoComplete="new-password"
            disabled={loading}
          />
          
          <p className='py-2 text-sm font-medium text-zinc-800'>{t('confirmPassword')}</p>
          <input 
            required
            type="password" 
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder={t('place_holder_2')} 
            className='outline-0 border border-zinc-300 rounded-xl p-3 w-full mb-6 focus:border-blue-500 focus:ring-2 focus:ring-blue-200' 
            minLength="6"
            autoComplete="new-password"
            disabled={loading}
          />
          
          {/* Location Display */}
          <div className="p-4 border border-zinc-200 rounded-xl mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="flex items-center gap-2 text-sm font-medium text-zinc-800">
                <FaMapMarkerAlt className="text-blue-600" />
                {t('getLocation')}
              </span>
              <button 
                type="button"
                onClick={getUserLocation}
                disabled={locationLoading}
                className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50"
              >
                {locationLoading ? t('locationLoading') : t('getLocation')}
              </button>
            </div>
            {location.lat && location.lon && (
              <p className="text-xs text-green-600 mt-2">
                ✓ {t('locationSuccess')}
              </p>
            )}
          </div>
          
          {/* Terms Agreement */}
          <p className='text-xs py-2 text-center text-zinc-600 mb-4'>
            {t('agreeText_1')} 
            <span className='text-blue-700 cursor-pointer mx-1'>{t('agreeText_2')}</span> 
            {t('and')} 
            <span className='text-blue-700 cursor-pointer mx-1'>{t('agreeText_3')}</span>
          </p>
          
          {/* Submit Button */}
          <div className='flex my-2 justify-center rounded-xl bg-blue-700 transition-all duration-200'>
            <button 
              type="submit" 
              disabled={loading || formData.phone.length !== 9 || !formData.password || formData.password !== formData.confirmPassword}
              className={`flex items-center justify-center gap-x-2 py-4 text-white w-full rounded-xl ${loading || formData.phone.length !== 9 || !formData.password || formData.password !== formData.confirmPassword ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-800'}`}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  <span>{t('loading')}</span>
                </>
              ) : (
                <>
                  <FaCheck className="inline" />
                  <span>{t('register')}</span>
                </>
              )}
            </button>
          </div>
          
          {/* Back to verification */}
          <button
            type="button"
            onClick={() => {
              setCounter(3);
              setError('');
              setSuccess('');
            }}
            className="text-center text-blue-700 hover:text-blue-800 cursor-pointer mt-4"
          >
            ← {t('back')}
          </button>
        </div>
      </form>
    </div>
  );

  // Main render
  return (
    <div className='main-bg p-5 min-h-screen flex items-center justify-center'>
      <div className="lg:w-2/5 md:w-3/5 sm:w-4/5 w-full max-w-md m-auto">
        {/* Header */}
        <div className="rounded-t-2xl main-bg text-center p-5 text-white">
          <div className="flex justify-evenly items-center py-3">
            <button 
              onClick={() => {
                if (counter === 3) {
                  setCounter(2); // Go back to email step
                } else if (counter === 4) {
                  setCounter(3); // Go back to verification step
                } else {
                  setCounter(Math.max(0, counter - 1));
                }
                setError('');
                setSuccess('');
              }} 
              className={`p-3 cursor-pointer rounded-xl bg-white/20 hover:bg-white/40 transition-all duration-200 ${counter === 0 ? 'invisible' : 'visible'}`}
            >
              <FaArrowLeft />
            </button>
            <h1 className='text-2xl items-center flex justify-center'>
              <span className='p-2 mx-2 bg-white/20 rounded-2xl'>
                <FaTruckLoading className='inline mx-1' />
              </span> 
              Yuk.uz
            </h1>
            <div className='w-12'></div>
          </div>
          
          {/* Header Content */}
          <div className="py-3">
            {counter === 0 && <p className='py-2 text-sm'>{t("slogan")}</p>}
            {counter === 1 && <h1 className='text-xl'>{t("chooseLang")}</h1>}
            {counter === 2 && login && (
              <span className='text-center bg-white/30 py-1 px-3 rounded-full text-sm'>
                <FaUser className='inline mx-1' />
                {job === 1 ? t("role_1") : t("role_2")}
              </span>
            )}
            {counter === 2 && !login && <h1 className='text-xl'>{t("startRegistration")}</h1>}
            {counter === 3 && <h1 className='text-xl'>{t("emailVerification")}</h1>}
            {counter === 4 && <h1 className='text-xl'>{t("completeRegistration")}</h1>}
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-b-2xl overflow-hidden relative min-h-[500px] shadow-lg">
          {counter === 0 && renderRoleSelection()}
          {counter === 1 && renderLanguageSelection()}
          {counter === 2 && login && renderLoginForm()}
          {counter === 2 && !login && renderEmailStep()}
          {counter === 3 && renderEmailVerification()}
          {counter === 4 && renderCompleteRegistration()}
        </div>
      </div>
    </div>
  )
}

export default Login