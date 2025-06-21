"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, MailWarning } from "lucide-react"
import axios from "axios"
import { apiLinks } from "@/lib/api-link"

type FormData = {
  fullName: string
  email: string
  password: string
}

type EnterCodeFormData = {
  email: string
  verificationCode: string
}

type ResendCodeFormData = {
  email: string
}

type RegisterStep = 1 | 2

export default function SignupPage() {
  const router = useRouter()
  const [step, setStep] = useState<RegisterStep>(1)
  const [email, setEmail] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [sendingData, setSendingData] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null)
  const [timer, setTimer] = useState(60)
  const [onResendCode, setOnResendCode] = useState(false)
  const [isChecked, setIsChecked] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)

  // Separate forms for each step
  const registerForm = useForm<FormData>({
    mode: "onChange", // Validate on change for real-time feedback
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
  })

  const codeForm = useForm<EnterCodeFormData>({
    mode: "onChange",
    defaultValues: {
      email: "",
      verificationCode: "",
    },
  })

  // Get the appropriate form based on current step
  const currentForm = step === 1 ? registerForm : codeForm
  const { handleSubmit } = currentForm

  // Watch verification code for step 2
  const verificationCode = codeForm.watch("verificationCode")

  // Auto-enable submit button when verification code is 6 digits
  useEffect(() => {
    if (step === 2) {
      setIsChecked(verificationCode?.length === 6 && /^\d{6}$/.test(verificationCode))
    }
  }, [verificationCode, step])

  // Timer effect for resend code
  useEffect(() => {
    let countdown: NodeJS.Timeout
    if (timer > 0 && step === 2) {
      countdown = setInterval(() => {
        setTimer((prev) => prev - 1)
      }, 1000)
    } else if (timer === 0) {
      setOnResendCode(true)
    }
    return () => clearInterval(countdown)
  }, [timer, step])

  // Handle signin navigation
  const handleSigninClick = () => {
    router.push("/signin")
  }

  // Toggle password visibility
  const handleTogglePassword = () => {
    setShowPassword(!showPassword)
  }

  // Handle terms checkbox
  const handleTermsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTermsAccepted(e.target.checked)
  }

  // Check if form is valid for step 1
  const isStep1Valid = () => {
    const { formState } = registerForm
    return formState.isValid && termsAccepted && !formState.isSubmitting
  }

  // Handle registration (step 1)
  const onRegister = async (data: FormData) => {
    try {
      setSendingData(true)
      setErrorMessage(null)

      const response = await axios.post(apiLinks.auth.register, data)

      if (response.status === 201) {
        setIsSuccess(null)
        setErrorMessage(null)
        setEmail(data.email)
        setStep(2)
        setTimer(60)
        setOnResendCode(false)
      } else {
        setIsSuccess(false)
        setErrorMessage("Đăng ký thất bại")
      }
      setSendingData(false)
    } catch (error: any) {
      setIsSuccess(false)
      setSendingData(false)
      console.error("Lỗi đăng ký:", error)
      setErrorMessage(error.response?.data?.message || "Đã xảy ra lỗi không xác định")
    }
  }

  // Handle enter verification code (step 2)
  const onEnterCode = async (data: EnterCodeFormData) => {
    try {
      setSendingData(true)
      setErrorMessage(null)

      const payload = {
        email: email || data.email,
        verificationCode: Number(data.verificationCode),
      }

      const response = await axios.post(apiLinks.auth.enterCode, payload)

      if (response.status === 200) {
        setIsSuccess(true)
        setTimeout(() => {
          router.push("/signin")
        }, 3000)
      } else {
        setErrorMessage("Mã xác thực không chính xác")
        setIsSuccess(false)
      }
      setSendingData(false)
    } catch (error: any) {
      setIsSuccess(false)
      setSendingData(false)
      setErrorMessage(error.response?.data?.message || "Đã xảy ra lỗi không xác định")
      console.error("Lỗi xác thực:", error)
    }
  }

  // Handle resend verification code
  const handleResendCode = async () => {
    try {
      if (!onResendCode || !email) return

      const response = await axios.post(apiLinks.auth.resendCode, { email })

      setOnResendCode(false)
      setTimer(60)
    } catch (error) {
      console.error("Lỗi gửi lại mã:", error)
    }
  }

  // Form submit handler
  const onSubmit = async (data: any) => {
    if (step === 1) {
      await onRegister(data as FormData)
    } else {
      codeForm.setValue("email", email || "")
      await onEnterCode(data as EnterCodeFormData)
    }
  }

  return (
    <section className="pt-[200px] mb-150 relative">
      <div className="absolute left-1/2 top-25 w-full h-[550px] -translate-x-1/2 bg-cover bg-hero-gradient bg-no-repeat bg-center opacity-70 md:hidden -z-10" />
      <div
        className="container relative"
        data-aos="fade-up"
        data-aos-offset={200}
        data-aos-duration={1000}
        data-aos-once="true"
      >
        <div className="mb-12 text-center max-w-[475px] mx-auto">
          <p className="section-tagline">{step === 1 ? "ĐĂNG KÝ" : "MÃ XÁC THỰC"}</p>
          <h2>
            {step === 1 ? (
              <>Tạo tài khoản</>
            ) : (
              <>
                Xác thực <br />
                tài khoản của bạn
              </>
            )}
          </h2>
        </div>

        <div className="relative z-10 max-w-[510px] mx-auto">
          <div className="absolute inset-0 flex items-start justify-center max-md:flex-col -z-10 max-md:hidden">
            <div className="max-1xl:w-[335px] max-1xl:h-[335px] 1xl:w-[442px] 1xl:h-[442px] rounded-full bg-primary-200/20 blur-[145px]"></div>
            <div className="max-1xl:w-[335px] max-1xl:h-[335px] 1xl:w-[442px] 1xl:h-[442px] rounded-full bg-primary-200/25 -ml-[170px] max-md:ml-0 blur-[145px]"></div>
            <div className="max-1xl:w-[335px] max-1xl:h-[335px] 1xl:w-[442px] 1xl:h-[442px] rounded-full bg-primary-200/20 -ml-[170px] max-md:ml-0 blur-[145px]"></div>
          </div>
          <div className="bg-white dark:bg-dark-200 rounded-medium p-2.5 shadow-nav">
            <div className="bg-white dark:bg-dark-200 border border-dashed rounded border-gray-100 dark:border-borderColour-dark p-12 max-md:px-5 max-md:py-7">
              {/* Error/Success Messages */}
              {isSuccess === false && errorMessage && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-sm text-red-600 dark:text-red-400">{errorMessage}</p>
                </div>
              )}

              {isSuccess === true && (
                <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <p className="text-sm text-green-600 dark:text-green-400">Đăng ký tài khoản thành công!</p>
                </div>
              )}

              <div className="mb-8">
                <div className="grid grid-cols-12 gap-y-6">
                  {/* Step 1: Registration Form */}
                  {step === 1 && (
                    <>
                      {/* Full Name Field */}
                      <div className="col-span-12">
                        <label
                          htmlFor="fullName"
                          className="block text-sm font-medium font-jakarta_sans text-paragraph dark:text-white mb-2"
                        >
                          Họ và tên <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="fullName"
                          placeholder="Nhập đầy đủ họ và tên"
                          className={`block w-full text-sm rounded-[48px] border py-3.5 px-5 text-paragraph-light placeholder:text-paragraph-light dark:placeholder:text-paragraph-light outline-none bg-white dark:bg-dark-200 focus:border-primary dark:focus:border-primary duration-300 transition-all ${
                            registerForm.formState.errors.fullName
                              ? "border-red-500 dark:border-red-500"
                              : "border-borderColour dark:border-borderColour-dark"
                          }`}
                          {...registerForm.register("fullName", {
                            required: "Họ và tên là bắt buộc",
                            minLength: {
                              value: 2,
                              message: "Họ và tên phải có ít nhất 2 ký tự",
                            },
                            maxLength: {
                              value: 50,
                              message: "Họ và tên không được vượt quá 50 ký tự",
                            },
                            pattern: {
                              value: /^[a-zA-ZÀ-ỹ\s]+$/,
                              message: "Họ và tên chỉ được chứa chữ cái và khoảng trắng",
                            },
                            validate: {
                              noMultipleSpaces: (value) =>
                                !/\s{2,}/.test(value) || "Không được có nhiều khoảng trắng liên tiếp",
                              noLeadingTrailingSpaces: (value) =>
                                value.trim() === value || "Không được có khoảng trắng ở đầu hoặc cuối",
                            },
                          })}
                        />
                        {registerForm.formState.errors.fullName && (
                          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                            {registerForm.formState.errors.fullName.message}
                          </p>
                        )}
                      </div>

                      {/* Email Field */}
                      <div className="col-span-12">
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium font-jakarta_sans text-paragraph dark:text-white mb-2"
                        >
                          Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          id="email"
                          placeholder="info@gmail.com"
                          className={`block w-full text-sm rounded-[48px] border py-3.5 px-5 text-paragraph-light placeholder:text-paragraph-light dark:placeholder:text-paragraph-light outline-none bg-white dark:bg-dark-200 focus:border-primary dark:focus:border-primary duration-300 transition-all ${
                            registerForm.formState.errors.email
                              ? "border-red-500 dark:border-red-500"
                              : "border-borderColour dark:border-borderColour-dark"
                          }`}
                          {...registerForm.register("email", {
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
                        {registerForm.formState.errors.email && (
                          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                            {registerForm.formState.errors.email.message}
                          </p>
                        )}
                      </div>

                      {/* Password Field */}
                      <div className="col-span-full">
                        <label
                          htmlFor="password"
                          className="block text-sm font-medium font-jakarta_sans text-paragraph dark:text-white mb-2"
                        >
                          Mật khẩu <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            placeholder="Ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số"
                            className={`block w-full text-sm rounded-[48px] border py-3.5 px-5 pr-12 text-paragraph-light placeholder:text-paragraph-light outline-none bg-white dark:bg-dark-200 focus:border-primary dark:focus:border-primary duration-300 transition-all ${
                              registerForm.formState.errors.password
                                ? "border-red-500 dark:border-red-500"
                                : "border-borderColour dark:border-borderColour-dark"
                            }`}
                            {...registerForm.register("password", {
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
                            className="absolute right-4 top-[36px] -translate-y-1/2 flex items-center justify-center w-5 h-5 text-paragraph-light hover:text-paragraph transition-colors duration-300"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        {registerForm.formState.errors.password && (
                          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                            {registerForm.formState.errors.password.message}
                          </p>
                        )}
                      </div>

                      {/* Terms and Conditions */}
                      <div className="col-span-full">
                        <div className="flex items-start gap-3">
                          <label htmlFor="terms" className="flex items-center gap-3 cursor-pointer">
                            <input
                              id="terms"
                              type="checkbox"
                              className="sr-only peer"
                              checked={termsAccepted}
                              onChange={handleTermsChange}
                            />
                            <div className="w-5 h-5 rounded border border-borderColour dark:border-borderColour-dark relative after:absolute after:w-3 after:h-3 after:bg-primary after:rounded-sm after:top-[15px] after:left-[15.3px] after:-translate-x-1/2 after:-translate-y-1/2 after:opacity-0 peer-checked:after:opacity-100 peer-checked:border-primary dark:peer-checked:border-primary cursor-pointer transition-all duration-300" />
                          </label>
                          <p className="text-sm font-normal text-paragraph-light dark:text-gray-400">
                            Bằng việc đăng ký, bạn đã đồng ý với Viqium về{" "}
                            <button
                              type="button"
                              onClick={() => router.push("/terms-and-conditions")}
                              className="text-paragraph dark:text-white font-medium hover:text-primary dark:hover:text-primary transition-colors duration-300"
                            >
                              Điều khoản dịch vụ
                            </button>{" "}
                            &{" "}
                            <button
                              type="button"
                              onClick={() => router.push("/privacy")}
                              className="text-paragraph dark:text-white font-medium hover:text-primary dark:hover:text-primary transition-colors duration-300"
                            >
                              Chính sách bảo mật
                            </button>
                          </p>
                        </div>
                        {!termsAccepted && registerForm.formState.isSubmitted && (
                          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                            Bạn phải đồng ý với điều khoản dịch vụ để tiếp tục
                          </p>
                        )}
                      </div>
                    </>
                  )}

                  {/* Step 2: Verification Code Form */}
                  {step === 2 && (
                    <>
                      {/* Hidden Email Field */}
                      <input type="hidden" {...codeForm.register("email", { value: email || "" })} />

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
                          Mã xác thực ({String(Math.floor(timer / 60)).padStart(2, "0")}:
                          {String(timer % 60).padStart(2, "0")}) <span className="text-red-500">*</span>
                        </label>
                        <div className="relative mb-4">
                          <input
                            type="text"
                            id="verificationCode"
                            placeholder="Nhập mã xác thực 6 số"
                            maxLength={6}
                            className={`block w-full text-sm rounded-[48px] border py-3.5 px-5 pr-20 text-paragraph-light placeholder:text-paragraph-light dark:placeholder:text-paragraph-light outline-none bg-white dark:bg-dark-200 focus:border-primary dark:focus:border-primary duration-300 transition-all ${
                              codeForm.formState.errors.verificationCode
                                ? "border-red-500 dark:border-red-500"
                                : "border-borderColour dark:border-borderColour-dark"
                            }`}
                            {...codeForm.register("verificationCode", {
                              required: "Mã xác thực là bắt buộc",
                              pattern: {
                                value: /^\d{6}$/,
                                message: "Mã xác thực phải là 6 chữ số",
                              },
                              minLength: {
                                value: 6,
                                message: "Mã xác thực phải có đúng 6 chữ số",
                              },
                              maxLength: {
                                value: 6,
                                message: "Mã xác thực phải có đúng 6 chữ số",
                              },
                            })}
                          />
                          <button
                            type="button"
                            onClick={handleResendCode}
                            className="absolute right-4 top-[34px] -translate-y-1/2 text-sm font-medium transition-colors duration-300"
                            disabled={!onResendCode}
                          >
                            {onResendCode ? (
                              <span className="text-primary hover:text-primary/80">Lấy mã</span>
                            ) : (
                              <span className="text-paragraph-light">Đã gửi</span>
                            )}
                          </button>
                        </div>

                        <p className="text-sm text-paragraph-light dark:text-gray-400">
                          Truy cập email <strong>{email}</strong> để nhận mã xác thực!
                        </p>

                        {/* Spam folder reminder */}
                    

                        {codeForm.formState.errors.verificationCode && (
                          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                            {codeForm.formState.errors.verificationCode.message}
                          </p>
                        )}
                      </div>
                    </>
                  )}

                  {/* Submit Button */}
                  <div className="col-span-full">
                    <button
                      type="submit"
                      onClick={handleSubmit(onSubmit)}
                      disabled={
                        sendingData || (step === 1 && (!isStep1Valid() || !termsAccepted)) || (step === 2 && !isChecked)
                      }
                      className={`btn w-full block font-medium transition-all duration-300 ${
                        sendingData || (step === 1 && (!isStep1Valid() || !termsAccepted)) || (step === 2 && !isChecked)
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-primary/90"
                      }`}
                    >
                      {sendingData
                        ? step === 1
                          ? "Đang đăng ký..."
                          : "Đang xác thực..."
                        : step === 1
                          ? "Đăng ký"
                          : "Xác thực"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Footer Links */}
              <p className="text-center font-jakarta_sans text-sm font-medium leading-[24px]">
                Bạn đã có tài khoản?{" "}
                <button
                  onClick={handleSigninClick}
                  className="relative font-jakarta_sans inline-block overflow-hidden text-sm font-bold text-paragraph dark:text-white before:absolute before:bottom-0 before:left-0 before:h-[1px] before:w-full before:origin-right before:scale-x-0 before:bg-paragraph dark:before:bg-white before:transition-transform before:duration-500 before:content-[''] before:hover:origin-left before:hover:scale-x-100 leading-[24px] align-bottom hover:text-primary dark:hover:text-primary transition-colors duration-300"
                >
                  Đăng nhập
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
