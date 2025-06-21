"use client"

import Label from "@/components/form/Label"
import Button from "@/components/ui/button/Button"
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "@/icons"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { useEffect, useState } from "react"
import Alert from "../ui/alert/Alert"
import axios from "axios"
import { apiLinks } from "@/lib/api-link"
import { signIn } from "next-auth/react"
import Input from "../form/input/InputField"

type FormData = {
  email: string
  password: string
}

interface LoginFormProps {
  forgetPwd: () => void
}

const LoginForm = ({ forgetPwd }: LoginFormProps) => {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>()
  const [showPassword, setShowPassword] = useState(false)
  const [sendingData, setSendingData] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSucess, setIsSuccess] = useState<boolean | null>(null)

  const onSubmit = async (data: FormData) => {
    try {
      setSendingData(true);
      setErrorMessage(null);

      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setIsSuccess(false);
        setErrorMessage("Email hoặc mật khẩu không chính xác");
        setSendingData(false);
      } else {
        setIsSuccess(true);
        router.push("/dashboard");
        router.refresh();
      }
    } catch (error) {
      setIsSuccess(false);
      setSendingData(false);
      setErrorMessage("Đã xảy ra lỗi không xác định");
      console.error("Lỗi không xác định:", error);
    }
  };

  return (
    <div>
      <div className="mb-5 sm:mb-8">
        <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
          Đăng nhập
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">Nhập email và mật khẩu của bạn để đăng nhập !</p>
        {isSucess == false && errorMessage && (
          <Alert variant="error" title="Đăng nhập thất bại" message={errorMessage} showLink={false} />
        )}
      </div>
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-6">
            <div>
              <Label>
                Email <span className="text-error-500">*</span>{" "}
              </Label>
              <Input
                placeholder="info@gmail.com"
                type="email"
                {...register("email", { required: "Vui lòng nhập email" })}
                error={!!errors.email}
                hint={errors.email?.message}
              />
            </div>
            <div>
              <Label>
                Mật khẩu <span className="text-error-500">*</span>{" "}
              </Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Nhập mật khẩu"
                  {...register("password", { required: "Mật khẩu là bắt buộc" })}
                  error={!!errors.password}
                  hint={errors.password?.message}
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                >
                  {showPassword ? (
                    <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                  ) : (
                    <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                  )}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-end">
              <Link
                href={""}
                onClick={forgetPwd}
                className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
              >
                Quên mật khẩu?
              </Link>
            </div>
            <div>
              <Button
                className={`w-full ${sendingData ? "bg-gray-400 cursor-not-allowed" : "bg-brand-500 hover:bg-brand-600"}`}
                size="md"
                disabled={sendingData}
              >
                {sendingData ? "Đang đăng nhập..." : "Đăng nhập"}
              </Button>
            </div>
          </div>
        </form>

        <div className="mt-5">
          <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
            Bạn chưa có tài khoản? {""}
            <Link href="/signup" className="text-brand-500 hover:text-brand-600 dark:text-brand-400">
              Đăng ký
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

type RegisterStep = 1 | 2

interface VerifyEmailFormProps {
  handleVerifyEmail: (email: string) => Promise<void>
  sendingData: boolean
}

const VerifyEmailForm = ({ handleVerifyEmail, sendingData }: VerifyEmailFormProps) => {
  const [email, setEmail] = useState<string | null>(null)

  const sendCode = () => {
    if (email) {
      handleVerifyEmail(email)
    }
  }
  return (
    <div>
      <div className="mb-5 sm:mb-8">
        <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
          Quên mật khẩu
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Nhập email để nhận mã xác thực !</p>
      </div>
      <div>
        <div>
          <div className="space-y-6">
            <div>
              <Label>
                Email <span className="text-error-500">*</span>{" "}
              </Label>
              <Input placeholder="info@gmail.com" type="email" onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <Button
                className={`w-full ${sendingData ? "bg-gray-400 cursor-not-allowed" : "bg-brand-500 hover:bg-brand-600"}`}
                size="md"
                disabled={sendingData}
                onClick={sendCode}
              >
                {sendingData ? "Đang gửi mã..." : "Gửi mã"}
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-5">
          <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
            Bạn đã có tài khoản?
            <Link href="/signin" className="text-brand-500 hover:text-brand-600 dark:text-brand-400">
              Đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

interface CreateNewPasswordFormProps {
  email: string | null
}

type ResendCodeFormData = {
  email: string
}

type CreateNewPwdForm = {
  email: string
  verificationCode: number
  newPassword: string
  confirmPassword: string
}

const CreateNewPassword = ({ email }: CreateNewPasswordFormProps) => {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [onResendCode, setOnResendCode] = useState(false)
  const [errorMessage, seterrorMessage] = useState<string | null>(null)
  const [isSucess, setIsSuccess] = useState<boolean | null>(null)
  const [sendingData, setSendingData] = useState<boolean>(false)
  const [timer, setTimer] = useState(60)
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreateNewPwdForm>()

  useEffect(() => {
    let countdown: NodeJS.Timeout
    if (timer > 0) {
      countdown = setInterval(() => {
        setTimer((prev) => prev - 1)
      }, 1000)
    } else {
      setOnResendCode(true) // Allow resend when timer reaches 0
    }
    return () => clearInterval(countdown)
  }, [timer])

  const resendCode = async () => {
    try {
      if (!onResendCode || !email) return null

      const data: ResendCodeFormData = { email }
      const response = await axios.post(apiLinks.auth.resendCode, data)
      if (response.status == 201) {
        setOnResendCode(false)
        setTimer(60)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const onSubmit = async (data: CreateNewPwdForm) => {
    const payload = {
      email,
      verificationCode: Number(data.verificationCode),
      newPassword: data.newPassword,
    }

    try {
      setSendingData(true)
      const response = await axios.post(apiLinks.auth.verifyNewPwd, payload)
      if (response.status == 200) {
        setIsSuccess(true)
        seterrorMessage(null)
      } else {
        setIsSuccess(false)
        seterrorMessage(response.data.message)
      }
      setSendingData(false)
      setTimeout(() => {
        window.location.reload()
      }, 3000)
    } catch (error) {
      setIsSuccess(false)
      setSendingData(false)
      if (axios.isAxiosError(error) && error.response) {
        const message = error.response.data?.message || "Đã xảy ra lỗi không xác định"
        seterrorMessage(message)
        console.error("Lỗi từ server:", message)
      } else {
        seterrorMessage("Lỗi kết nối hoặc lỗi không xác định")
        console.error("Lỗi không xác định:", error)
      }
      console.error(error)
    }
  }

  const newPassword = watch("newPassword")
  return (
    <div>
      <div className="mb-5 sm:mb-8">
        <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
          Tạo mật khẩu
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">Nhập mã xác thực và mật khẩu mới !</p>
        {isSucess && (
          <Alert
            variant="success"
            title="Tạo mật khẩu mới thành công!"
            message="Tiến hành đăng nhập."
            showLink={true}
            linkHref="/signin"
            linkText="Đăng nhập"
          />
        )}

        {isSucess == false && errorMessage && (
          <Alert variant="error" title="Tạo mật khẩu thất bại" message={errorMessage} showLink={false} />
        )}
      </div>
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-6">
            <div className="relative">
              <Label>
                Mã xác nhận ({String(Math.floor(timer / 60)).padStart(2, "0")}:{String(timer % 60).padStart(2, "0")})
                <span className="text-error-500">*</span>{" "}
              </Label>
              <Input
                type="number"
                {...register("verificationCode", { required: "Vui lòng nhập mã xác nhận" })}
                error={!!errors.verificationCode}
                hint={errors.verificationCode?.message}
              />
              <span onClick={resendCode} className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2">
                {onResendCode ? (
                  <p className="text-sm font-normal text-dark">Lấy mã</p>
                ) : (
                  <p className="text-sm font-normal text-gray-700 dark:text-gray-400 ">Đã gửi mã</p>
                )}
              </span>
            </div>
            <div>
              <Label>
                Mật khẩu mới <span className="text-error-500">*</span>{" "}
              </Label>
              <div className="relative">
                <Input
                  type="email"
                  value={email || ""}
                  hidden={true}
                  {...register("email", { required: "Vui lòng nhập email" })}
                />
                <Input
                  type={showPassword ? "text" : "password"}
                  {...register("newPassword", { required: "Vui lòng nhập mật khẩu" })}
                  error={!!errors.newPassword}
                  hint={errors.newPassword?.message}
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                >
                  {showPassword ? (
                    <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                  ) : (
                    <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                  )}
                </span>
              </div>
            </div>
            <div>
              <Label>
                Xác nhận mật khẩu mới <span className="text-error-500">*</span>{" "}
              </Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  {...register("confirmPassword", {
                    required: "Vui lòng xác nhận mật khẩu",
                    validate: (value) => value === newPassword || "Mật khẩu xác nhận không khớp",
                  })}
                  error={!!errors.confirmPassword}
                  hint={errors.confirmPassword?.message}
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                >
                  {showPassword ? (
                    <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                  ) : (
                    <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                  )}
                </span>
              </div>
            </div>
            <div>
              <Button
                className={`w-full ${sendingData ? "bg-gray-400 cursor-not-allowed" : "bg-brand-500 hover:bg-brand-600"}`}
                size="md"
                disabled={sendingData}
              >
                {sendingData ? "Đang xác nhận..." : "Xác nhận"}
              </Button>
            </div>
          </div>
        </form>

        <div className="mt-5">
          <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
            Bạn đã có tài khoản?
            <Link href="/signin" className="text-brand-500 hover:text-brand-600 dark:text-brand-400">
              Đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

const ForgetPassword = () => {
  const [step, setStep] = useState<RegisterStep>(1)
  const [emailStored, setEmailStored] = useState<string | null>(null)
  const [sendingData, setSendingData] = useState<boolean>(false)

  const handleVerifyEmail = async (email: string) => {
    if (!email) return

    setSendingData(true)
    try {
      await axios.post(apiLinks.auth.forgetPwd, {
        email: email,
      })

      setEmailStored(email)
      setStep(2)
    } catch (error) {
      console.log(error)
    } finally {
      setSendingData(false)
    }
  }

  return (
    <>
      {step === 1 && <VerifyEmailForm handleVerifyEmail={handleVerifyEmail} sendingData={sendingData} />}
      {step === 2 && <CreateNewPassword email={emailStored} />}
    </>
  )
}

export default function SignInForm() {
  const [forgetPwd, setForgetPwd] = useState(false)
  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="w-full max-w-md sm:pt-10 mx-auto mb-5">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon />
          Quay lại Trang chủ
        </Link>
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        {forgetPwd ? <ForgetPassword /> : <LoginForm forgetPwd={() => setForgetPwd(true)} />}
      </div>
    </div>
  )
}
