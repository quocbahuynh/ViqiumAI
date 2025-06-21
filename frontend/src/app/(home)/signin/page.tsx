"use client"
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { Eye, EyeOff, MailWarning } from "lucide-react"
import axios from "axios"
import { apiLinks } from "@/lib/api-link"

type LoginFormData = {
  email: string
  password: string
}

type ForgotPasswordFormData = {
  email: string
}

type ResetPasswordFormData = {
  email: string
  verificationCode: string
  newPassword: string
  confirmPassword: string
}

type RegisterStep = 1 | 2

export default function Signin() {
  const router = useRouter()
  const [forgetPwd, setForgetPwd] = useState(false)
  const [step, setStep] = useState<RegisterStep>(1)
  const [emailStored, setEmailStored] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [sendingData, setSendingData] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSucess, setIsSuccess] = useState<boolean | null>(null)
  const [timer, setTimer] = useState(60)
  const [onResendCode, setOnResendCode] = useState(false)

  // Separate forms for different flows
  const loginForm = useForm<LoginFormData>({
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const forgotPasswordForm = useForm<ForgotPasswordFormData>({
    mode: "onChange",
    defaultValues: {
      email: "",
    },
  })

  const resetPasswordForm = useForm<ResetPasswordFormData>({
    mode: "onChange",
    defaultValues: {
      email: "",
      verificationCode: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  useEffect(() => {
    let countdown: NodeJS.Timeout
    if (timer > 0 && forgetPwd && step === 2) {
      countdown = setInterval(() => {
        setTimer((prev) => prev - 1)
      }, 1000)
    } else if (timer === 0) {
      setOnResendCode(true)
    }
    return () => clearInterval(countdown)
  }, [timer, forgetPwd, step])

  const handleSignupClick = () => {
    router.push("/signup")
  }

  const handleForgetPasswordClick = () => {
    setForgetPwd(true)
    setStep(1)
    loginForm.reset()
    forgotPasswordForm.reset()
    resetPasswordForm.reset()
    setErrorMessage(null)
    setIsSuccess(null)
  }

  const handleBackToLogin = () => {
    setForgetPwd(false)
    setStep(1)
    loginForm.reset()
    forgotPasswordForm.reset()
    resetPasswordForm.reset()
    setErrorMessage(null)
    setIsSuccess(null)
  }

  const handleTogglePassword = () => {
    setShowPassword(!showPassword)
  }

  const handleToggleNewPassword = () => {
    setShowNewPassword(!showNewPassword)
  }

  // Login submission
  const handleLogin = async (data: LoginFormData) => {
    try {
      setSendingData(true)
      setErrorMessage(null)

      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        setIsSuccess(false)
        setErrorMessage("Email hoặc mật khẩu không chính xác")
        setSendingData(false)
      } else {
        setIsSuccess(true)
        router.push("/dashboard")
        router.refresh()
      }
    } catch (error) {
      setIsSuccess(false)
      setSendingData(false)
      setErrorMessage("Đã xảy ra lỗi không xác định")
      console.error("Lỗi không xác định:", error)
    }
  }

  // Forgot password email verification
  const handleVerifyEmail = async (data: ForgotPasswordFormData) => {
    setSendingData(true)
    try {
      await axios.post(apiLinks.auth.forgetPwd, { email: data.email })

      setEmailStored(data.email)
      setStep(2)
      setOnResendCode(false)
      setTimer(60)
      setErrorMessage(null)
      // Set email in reset form
      resetPasswordForm.setValue("email", data.email)
    } catch (error) {
      console.log(error)
      setErrorMessage("Tài khoản không tồn tại hoặc đã bị khóa")
      setIsSuccess(false)
    } finally {
      setSendingData(false)
    }
  }

  // Reset password submission
  const handleResetPassword = async (data: ResetPasswordFormData) => {
    const payload = {
      email: emailStored || data.email,
      verificationCode: Number(data.verificationCode),
      newPassword: data.newPassword,
    }

    try {
      setSendingData(true)
      const response = await axios.post(apiLinks.auth.verifyNewPwd, payload)

      if (response.status === 200) {
        setIsSuccess(true)
        setErrorMessage(null)
        setTimeout(() => {
          setForgetPwd(false)
          setStep(1)
          loginForm.reset()
          forgotPasswordForm.reset()
          resetPasswordForm.reset()
        }, 3000)
      }
      setSendingData(false)
    } catch (error) {
      setIsSuccess(false)
      setSendingData(false)
      setErrorMessage("Mã xác nhận không đúng hoặc đã hết hạn")
      console.error("Lỗi API:", error)
    }
  }

  const handleResendCode = async () => {
    try {
      if (!onResendCode || !emailStored) return null

      const response = await axios.post(apiLinks.auth.resendCode, { email: emailStored })

      setOnResendCode(false)
      setTimer(60)
    } catch (error) {
      console.error(error)
    }
  }

  const newPassword = resetPasswordForm.watch("newPassword")

  return (
    <section className="pt-[200px] mb-150 max-md:mb-25 relative">
      <div className="absolute left-1/2 top-25 w-full h-[550px] -translate-x-1/2 bg-cover bg-hero-gradient bg-no-repeat bg-center opacity-70 md:hidden -z-10" />
      <div
        className="container relative"
        data-aos="fade-up"
        data-aos-offset={200}
        data-aos-duration={1000}
        data-aos-once="true"
      >
        <div className="mb-12 text-center max-w-[475px] mx-auto">
          <p className="section-tagline">
            {forgetPwd ? (step === 1 ? "QUÊN MẬT KHẨU" : "TẠO MẬT KHẨU MỚI") : "ĐĂNG NHẬP"}
          </p>
          <h2>{forgetPwd ? step === 1 ? <>Khôi phục mật khẩu</> : <>Tạo mật khẩu mới</> : <>Đăng nhập</>}</h2>
        </div>
        <div className="relative z-10 max-w-[510px] mx-auto">
          <div className="absolute inset-0 flex items-start justify-center max-md:flex-col -z-10 max-md:hidden">
            <div className="max-1xl:w-[335px] max-1xl:h-[335px] 1xl:w-[442px] 1xl:h-[442px] rounded-full bg-primary-200/20 blur-[145px]"></div>
            <div className="max-1xl:w-[335px] max-1xl:h-[335px] 1xl:w-[442px] rounded-full bg-primary-200/25 -ml-[170px] max-md:ml-0 blur-[145px]"></div>
            <div className="max-1xl:w-[335px] max-1xl:h-[335px] 1xl:w-[442px] rounded-full bg-primary-200/20 -ml-[170px] max-md:ml-0 blur-[145px]"></div>
          </div>
          <div className="bg-white dark:bg-dark-200 rounded-medium p-2.5 shadow-nav">
            <div className="bg-white dark:bg-dark-200 border border-dashed rounded border-gray-100 dark:border-borderColour-dark p-12 max-md:px-5 max-md:py-7">
              {isSucess === false && errorMessage && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-sm text-red-600 dark:text-red-400">{errorMessage}</p>
                </div>
              )}

              {isSucess === true && (
                <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <p className="text-sm text-green-600 dark:text-green-400">
                    {forgetPwd ? "Tạo mật khẩu mới thành công!" : "Đăng nhập thành công!"}
                  </p>
                </div>
              )}

              {/* Login Form */}
              {!forgetPwd && (
                <form onSubmit={loginForm.handleSubmit(handleLogin)}>
                  <div className="grid grid-cols-12 gap-y-6">
                    {/* Email Field */}
                    <div className="col-span-12">
                      <label
                        htmlFor="login-email"
                        className="block text-sm font-medium font-jakarta_sans text-paragraph dark:text-white mb-2"
                      >
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="login-email"
                        placeholder="Nhập địa chỉ email của bạn"
                        className={`block w-full text-sm rounded-[48px] border py-3.5 px-5 text-paragraph-light placeholder:text-paragraph-light dark:placeholder:text-paragraph-light outline-none bg-white dark:bg-dark-200 focus:border-primary dark:focus:border-primary duration-300 transition-all ${
                          loginForm.formState.errors.email
                            ? "border-red-500 dark:border-red-500"
                            : "border-borderColour dark:border-borderColour-dark"
                        }`}
                        {...loginForm.register("email", {
                          required: "Email là bắt buộc",
                          pattern: {
                            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                            message: "Email không hợp lệ",
                          },
                          maxLength: {
                            value: 100,
                            message: "Email không được vượt quá 100 ký tự",
                          },
                          validate: {
                            noSpaces: (value) => !/\s/.test(value) || "Email không được chứa khoảng trắng",
                            validDomain: (value) => {
                              const domain = value.split("@")[1]
                              return (domain && domain.includes(".")) || "Tên miền email không hợp lệ"
                            },
                          },
                        })}
                      />
                      {loginForm.formState.errors.email && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                          {loginForm.formState.errors.email.message}
                        </p>
                      )}
                    </div>

                    {/* Password Field */}
                    <div className="col-span-full">
                      <label
                        htmlFor="login-password"
                        className="block text-sm font-medium font-jakarta_sans text-paragraph dark:text-white mb-2"
                      >
                        Mật khẩu <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          id="login-password"
                          placeholder="Nhập mật khẩu của bạn"
                          className={`block w-full text-sm rounded-[48px] border py-3.5 px-5 pr-12 text-paragraph-light placeholder:text-paragraph-light outline-none bg-white dark:bg-dark-200 focus:border-primary dark:focus:border-primary duration-300 transition-all ${
                            loginForm.formState.errors.password
                              ? "border-red-500 dark:border-red-500"
                              : "border-borderColour dark:border-borderColour-dark"
                          }`}
                          {...loginForm.register("password", {
                            required: "Mật khẩu là bắt buộc",
                          })}
                        />
                        <button
                          type="button"
                          onClick={handleTogglePassword}
                          className="absolute right-4 top-[38px] -translate-y-1/2 flex items-center justify-center w-6 h-6 text-paragraph-light hover:text-paragraph transition-colors duration-300"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {loginForm.formState.errors.password && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                          {loginForm.formState.errors.password.message}
                        </p>
                      )}
                    </div>

                    {/* Forgot Password Link */}
                    <div className="col-span-full flex items-end justify-end">
                      <button
                        type="button"
                        onClick={handleForgetPasswordClick}
                        className="relative font-jakarta_sans inline-block overflow-hidden text-sm font-medium text-paragraph dark:text-white before:absolute before:bottom-0 before:left-0 before:h-[1px] before:w-full before:origin-right before:scale-x-0 before:bg-paragraph dark:before:bg-white before:transition-transform before:duration-500 before:content-[''] before:hover:origin-left before:hover:scale-x-100 leading-[24px] align-bottom hover:text-primary dark:hover:text-primary transition-colors duration-300"
                      >
                        Quên mật khẩu?
                      </button>
                    </div>

                    {/* Submit Button */}
                    <div className="col-span-full">
                      <button
                        type="submit"
                        className={`btn w-full block font-medium transition-all duration-300 ${
                          sendingData ? "opacity-50 cursor-not-allowed" : "hover:bg-primary/90"
                        }`}
                        disabled={sendingData}
                      >
                        {sendingData ? "Đang đăng nhập..." : "Đăng nhập"}
                      </button>
                    </div>

                    {/* Footer Links */}
                    <div className="col-span-full">
                      <p className="text-sm font-medium text-center font-jakarta_sans leading-[24px]">
                        Chưa có tài khoản?{" "}
                        <button
                          type="button"
                          onClick={handleSignupClick}
                          className="relative font-jakarta_sans inline-block overflow-hidden text-sm font-bold text-paragraph dark:text-white before:absolute before:bottom-0 before:left-0 before:h-[1px] before:w-full before:origin-right before:scale-x-0 before:bg-paragraph dark:before:bg-white before:transition-transform before:duration-500 before:content-[''] before:hover:origin-left before:hover:scale-x-100 leading-[24px] align-bottom hover:text-primary dark:hover:text-primary transition-colors duration-300"
                        >
                          Tạo tài khoản
                        </button>
                      </p>
                    </div>
                  </div>
                </form>
              )}

              {/* Forgot Password Form - Step 1 */}
              {forgetPwd && step === 1 && (
                <form onSubmit={forgotPasswordForm.handleSubmit(handleVerifyEmail)}>
                  <div className="grid grid-cols-12 gap-y-6">
                    {/* Email Field */}
                    <div className="col-span-12">
                      <label
                        htmlFor="forgot-email"
                        className="block text-sm font-medium font-jakarta_sans text-paragraph dark:text-white mb-2"
                      >
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="forgot-email"
                        placeholder="Nhập địa chỉ email của bạn"
                        className={`block w-full text-sm rounded-[48px] border py-3.5 px-5 text-paragraph-light placeholder:text-paragraph-light dark:placeholder:text-paragraph-light outline-none bg-white dark:bg-dark-200 focus:border-primary dark:focus:border-primary duration-300 transition-all ${
                          forgotPasswordForm.formState.errors.email
                            ? "border-red-500 dark:border-red-500"
                            : "border-borderColour dark:border-borderColour-dark"
                        }`}
                        {...forgotPasswordForm.register("email", {
                          required: "Email là bắt buộc",
                          pattern: {
                            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                            message: "Email không hợp lệ",
                          },
                          maxLength: {
                            value: 100,
                            message: "Email không được vượt quá 100 ký tự",
                          },
                          validate: {
                            noSpaces: (value) => !/\s/.test(value) || "Email không được chứa khoảng trắng",
                            validDomain: (value) => {
                              const domain = value.split("@")[1]
                              return (domain && domain.includes(".")) || "Tên miền email không hợp lệ"
                            },
                          },
                        })}
                      />
                      {forgotPasswordForm.formState.errors.email && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                          {forgotPasswordForm.formState.errors.email.message}
                        </p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <div className="col-span-full">
                      <button
                        type="submit"
                        className={`btn w-full block font-medium transition-all duration-300 ${
                          sendingData ? "opacity-50 cursor-not-allowed" : "hover:bg-primary/90"
                        }`}
                        disabled={sendingData}
                      >
                        {sendingData ? "Đang gửi mã..." : "Gửi mã xác nhận"}
                      </button>
                    </div>

                    {/* Footer Links */}
                    <div className="col-span-full">
                      <p className="text-sm font-medium text-center font-jakarta_sans leading-[24px]">
                        Bạn đã có tài khoản?{" "}
                        <button
                          type="button"
                          onClick={handleBackToLogin}
                          className="relative font-jakarta_sans inline-block overflow-hidden text-sm font-medium text-paragraph dark:text-white before:absolute before:bottom-0 before:left-0 before:h-[1px] before:w-full before:origin-right before:scale-x-0 before:bg-paragraph dark:before:bg-white before:transition-transform before:duration-500 before:content-[''] before:hover:origin-left before:hover:scale-x-100 leading-[24px] align-bottom hover:text-primary dark:hover:text-primary transition-colors duration-300"
                        >
                          Đăng nhập
                        </button>
                      </p>
                    </div>
                  </div>
                </form>
              )}

              {/* Reset Password Form - Step 2 */}
              {forgetPwd && step === 2 && (
                <form onSubmit={resetPasswordForm.handleSubmit(handleResetPassword)}>
                  <div className="grid grid-cols-12 gap-y-6">
                    {/* Hidden Email Field */}
                    <input type="hidden" {...resetPasswordForm.register("email")} />

                    {/* Verification Code Field */}
                    <div className="col-span-12">
                        <div className="mb-4 p-3  bg-yellow-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-500 rounded-lg">
                          <div className="flex items-start gap-2">
                            <div className="flex-shrink-0 mt-0.5">
                             <MailWarning/>
                            </div>
                            <div>
                              <p className=" text-yellow-800 dark:text-yellow-200 font-bold">
                                Không thấy email?
                              </p>
                              <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                                Hãy kiểm tra thư mục <strong>Spam/Junk</strong> hoặc <strong>Promotions</strong> trong
                                hộp thư của bạn.
                              </p>
                            </div>
                          </div>
                        </div>
                      <label
                        htmlFor="verificationCode"
                        className="block text-sm font-medium font-jakarta_sans text-paragraph dark:text-white mb-2"
                      >
                        Mã xác nhận ({String(Math.floor(timer / 60)).padStart(2, "0")}:
                        {String(timer % 60).padStart(2, "0")}) <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="verificationCode"
                          placeholder="Nhập mã xác nhận 6 số"
                          maxLength={6}
                          className={`block w-full text-sm rounded-[48px] border py-3.5 px-5 pr-20 text-paragraph-light placeholder:text-paragraph-light dark:placeholder:text-paragraph-light outline-none bg-white dark:bg-dark-200 focus:border-primary dark:focus:border-primary duration-300 transition-all ${
                            resetPasswordForm.formState.errors.verificationCode
                              ? "border-red-500 dark:border-red-500"
                              : "border-borderColour dark:border-borderColour-dark"
                          }`}
                          {...resetPasswordForm.register("verificationCode", {
                            required: "Mã xác nhận là bắt buộc",
                            pattern: {
                              value: /^\d{6}$/,
                              message: "Mã xác nhận phải là 6 chữ số",
                            },
                            minLength: {
                              value: 6,
                              message: "Mã xác nhận phải có đúng 6 chữ số",
                            },
                            maxLength: {
                              value: 6,
                              message: "Mã xác nhận phải có đúng 6 chữ số",
                            },
                          })}
                        />
                        <button
                          type="button"
                          onClick={handleResendCode}
                          className="absolute right-4 top-[36px] -translate-y-1/2 text-sm font-medium transition-colors duration-300"
                          disabled={!onResendCode}
                        >
                          {onResendCode ? (
                            <span className="text-primary hover:text-primary/80">Lấy mã</span>
                          ) : (
                            <span className="text-paragraph-light">Đã gửi</span>
                          )}
                        </button>
                      </div>
                      {resetPasswordForm.formState.errors.verificationCode && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                          {resetPasswordForm.formState.errors.verificationCode.message}
                        </p>
                      )}

                
                    </div>

                    {/* New Password Field */}
                    <div className="col-span-full">
                      <label
                        htmlFor="newPassword"
                        className="block text-sm font-medium font-jakarta_sans text-paragraph dark:text-white mb-2"
                      >
                        Mật khẩu mới <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          id="newPassword"
                          placeholder="Ít nhất 8 ký tự"
                          className={`block w-full text-sm rounded-[48px] border py-3.5 px-5 pr-12 text-paragraph-light placeholder:text-paragraph-light outline-none bg-white dark:bg-dark-200 focus:border-primary dark:focus:border-primary duration-300 transition-all ${
                            resetPasswordForm.formState.errors.newPassword
                              ? "border-red-500 dark:border-red-500"
                              : "border-borderColour dark:border-borderColour-dark"
                          }`}
                          {...resetPasswordForm.register("newPassword", {
                            required: "Mật khẩu là bắt buộc",
                            minLength: {
                              value: 8,
                              message: "Mật khẩu phải có ít nhất 8 ký tự",
                            },
                            maxLength: {
                              value: 128,
                              message: "Mật khẩu không được vượt quá 128 ký tự",
                            },
                           
                          })}
                        />
                        <button
                          type="button"
                          onClick={handleTogglePassword}
                          className="absolute right-4 top-[38px] -translate-y-1/2 flex items-center justify-center w-6 h-6 text-paragraph-light hover:text-paragraph transition-colors duration-300"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {resetPasswordForm.formState.errors.newPassword && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                          {resetPasswordForm.formState.errors.newPassword.message}
                        </p>
                      )}
                    </div>

                    {/* Confirm Password Field */}
                    <div className="col-span-full">
                      <label
                        htmlFor="confirmPassword"
                        className="block text-sm font-medium font-jakarta_sans text-paragraph dark:text-white mb-2"
                      >
                        Xác nhận mật khẩu mới <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          id="confirmPassword"
                          placeholder="Xác nhận mật khẩu mới"
                          className={`block w-full text-sm rounded-[48px] border py-3.5 px-5 pr-12 text-paragraph-light placeholder:text-paragraph-light outline-none bg-white dark:bg-dark-200 focus:border-primary dark:focus:border-primary duration-300 transition-all ${
                            resetPasswordForm.formState.errors.confirmPassword
                              ? "border-red-500 dark:border-red-500"
                              : "border-borderColour dark:border-borderColour-dark"
                          }`}
                          {...resetPasswordForm.register("confirmPassword", {
                            required: "Vui lòng xác nhận mật khẩu",
                            validate: {
                              matchPassword: (value) => value === newPassword || "Mật khẩu xác nhận không khớp",
                              notEmpty: (value) => value.trim() !== "" || "Mật khẩu xác nhận không được để trống",
                            },
                          })}
                        />
                        <button
                          type="button"
                          onClick={handleToggleNewPassword}
                          className="absolute right-4 top-[38px] -translate-y-1/2 flex items-center justify-center w-6 h-6 text-paragraph-light hover:text-paragraph transition-colors duration-300"
                        >
                          {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {resetPasswordForm.formState.errors.confirmPassword && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                          {resetPasswordForm.formState.errors.confirmPassword.message}
                        </p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <div className="col-span-full">
                      <button
                        type="submit"
                        className={`btn w-full block font-medium transition-all duration-300 ${
                          sendingData ? "opacity-50 cursor-not-allowed" : "hover:bg-primary/90"
                        }`}
                        disabled={sendingData}
                      >
                        {sendingData ? "Đang xác nhận..." : "Xác nhận"}
                      </button>
                    </div>

                    {/* Footer Links */}
                    <div className="col-span-full">
                      <p className="text-sm font-medium text-center font-jakarta_sans leading-[24px]">
                        Bạn đã có tài khoản?{" "}
                        <button
                          type="button"
                          onClick={handleBackToLogin}
                          className="relative font-jakarta_sans inline-block overflow-hidden text-sm font-medium text-paragraph dark:text-white before:absolute before:bottom-0 before:left-0 before:h-[1px] before:w-full before:origin-right before:scale-x-0 before:bg-paragraph dark:before:bg-white before:transition-transform before:duration-500 before:content-[''] before:hover:origin-left before:hover:scale-x-100 leading-[24px] align-bottom hover:text-primary dark:hover:text-primary transition-colors duration-300"
                        >
                          Đăng nhập
                        </button>
                      </p>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
