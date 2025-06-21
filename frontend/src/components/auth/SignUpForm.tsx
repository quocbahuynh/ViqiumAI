"use client"
import Checkbox from "@/components/form/input/Checkbox"
import Input from "@/components/form/input/InputField"
import Label from "@/components/form/Label"
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "@/icons"
import axios from "axios"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { apiLinks } from "@/lib/api-link"
import { useRouter } from "next/navigation"
import Alert from "../ui/alert/Alert"

type FormData = {
  fullName: string
  email: string
  password: string
}

interface RegisterFormProps {
  errorMesseage: string | null
  onSending: boolean
  isSuccess: boolean | null
  onRegister: (data: FormData) => void
}

const RegisterForm = ({ onRegister, onSending, isSuccess, errorMesseage }: RegisterFormProps) => {
  const [showPassword, setShowPassword] = useState(false)
  const [isChecked, setIsChecked] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>()

  return (
    <div>
      <div className="mb-5 sm:mb-8">
        <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">Đăng ký</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">Nhập email và mật khẩu của bạn để đăng ký !</p>
        {isSuccess == false && errorMesseage && (
          <Alert variant="error" title="Đăng ký thất bại" message={errorMesseage} showLink={false} />
        )}
      </div>
      <div>
        <form onSubmit={handleSubmit(onRegister)}>
          <div className="space-y-5">
            {/* <!-- FullName --> */}
            <div>
              <Label>
                Họ và tên<span className="text-error-500">*</span>
              </Label>
              <Input
                type="text"
                id="fullName"
                placeholder="Nhập đầy đủ họ và tên"
                {...register("fullName", { required: "Họ và tên là bắt buộc" })}
                error={!!errors.fullName}
                hint={errors.fullName?.message}
              />
            </div>
            {/* <!-- Email --> */}
            <div>
              <Label>
                Email<span className="text-error-500">*</span>
              </Label>
              <Input
                type="email"
                placeholder="info@gmail.com"
                id="email"
                {...register("email", {
                  required: "Email là bắt buộc",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Email không hợp lệ",
                  },
                })}
                error={!!errors.email}
                hint={errors.email?.message}
              />
            </div>
            {/* <!-- Password --> */}
            <div>
              <Label>
                Mật khẩu<span className="text-error-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  error={!!errors.password}
                  hint={errors.password?.message}
                  {...register("password", {
                    required: "Mật khẩu là bắt buộc",
                    minLength: {
                      value: 8,
                      message: "Mật khẩu phải có ít nhất 8 ký tự",
                    },
                  })}
                  placeholder="Nhập mật khẩu"
                  type={showPassword ? "text" : "password"}
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
            {/* <!-- Checkbox --> */}
            <div className="flex items-center gap-3">
              <Checkbox className="w-5 h-5" checked={isChecked} onChange={setIsChecked} />
              <p className="inline-block font-normal text-gray-500 dark:text-gray-400">
                Bằng việc đăng ký, bạn đã đồng ý với ChatBot AI về <br />
                <span className="text-gray-800 dark:text-white/90">Điều khoản dịch vụ</span> &{" "}
                <span className="text-gray-800 dark:text-white">Chính sách bảo mật</span>
              </p>
            </div>
            {/* <!-- Button --> */}
            <div>
              <button
                type="submit"
                disabled={!isChecked || onSending}
                className={`flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg shadow-theme-xs ${!isChecked || onSending ? "bg-gray-400 cursor-not-allowed" : "bg-brand-500 hover:bg-brand-600"}`}
              >
                {onSending ? "Đang gửi mã..." : "Đăng ký"}
              </button>
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

type EnterCodeFormData = {
  email: string
  verificationCode: number
}

type ResendCodeFormData = {
  email: string
}

interface EnterCodeFormProps {
  errorMesseage: string | null
  onSending: boolean
  isSuccess: boolean | null
  email: string
  onEnterCode: (data: EnterCodeFormData) => void
}
const EnterCodeForm = ({ onEnterCode, email, isSuccess, onSending, errorMesseage }: EnterCodeFormProps) => {
  const [onResendCode, setOnResendCode] = useState(false)
  const [isChecked, setIsChecked] = useState(false)
  const [timer, setTimer] = useState(60)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<EnterCodeFormData>()

  const verificationCode = watch("verificationCode")

  useEffect(() => {
    setIsChecked(verificationCode?.toString().length === 6)
  }, [verificationCode])

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
      if (!onResendCode) return null

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

  return (
    <div>
      <div className="mb-5 sm:mb-8">
        <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
          Mã xác thực
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">Truy cập email để nhận mã xác thực !</p>
        {isSuccess && (
          <Alert
            variant="success"
            title="Đăng ký tài khoản thành công!"
            message="Tiến hành đăng nhập trải nghiệm."
            showLink={true}
            linkHref="/signin"
            linkText="Đăng nhập"
          />
        )}

        {isSuccess == false && errorMesseage && (
          <Alert variant="error" title="Đăng ký thất bại" message={errorMesseage} showLink={false} />
        )}
      </div>
      <div>
        <form onSubmit={handleSubmit(onEnterCode)}>
          <div className="space-y-5">
            {/* <!-- VeficationCode --> */}
            <div>
              <Label>
                Mã xác thực ({String(Math.floor(timer / 60)).padStart(2, "0")}:{String(timer % 60).padStart(2, "0")}){" "}
                <span className="text-error-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  hidden={true}
                  type="email"
                  id="email"
                  {...register("email", {
                    required: "Email là bắt buộc",
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: "Email không hợp lệ",
                    },
                  })}
                  value={email}
                  error={!!errors.email}
                  hint={errors.email?.message}
                />
                <Input
                  error={!!errors.verificationCode}
                  hint={errors.verificationCode?.message}
                  {...register("verificationCode", { required: "Mã xác thực là bắt buộc" })}
                  placeholder="Nhập mã xác thực"
                  type="number"
                />
                <span onClick={resendCode} className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2">
                  {onResendCode ? (
                    <p className="text-sm font-normal text-dark">Lấy mã</p>
                  ) : (
                    <p className="text-sm font-normal text-gray-700 dark:text-gray-400 ">Đã gửi mã</p>
                  )}
                </span>
              </div>
            </div>
            {/* <!-- Button --> */}
            <div>
              <button
                type="submit"
                disabled={!isChecked || onSending}
                className={`flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg shadow-theme-xs ${!isChecked ? "bg-gray-400 cursor-not-allowed" : "bg-brand-500 hover:bg-brand-600"}`}
              >
                {onSending ? "Đang gửi mã..." : "Gửi mã"}
              </button>
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

type RegisterStep = 1 | 2

export default function SignUpForm() {
  const router = useRouter()
  const [sendingData, setSendingData] = useState<boolean>(false)
  const [errorMesseage, setErrorMesseage] = useState<string | null>(null)
  const [isSucess, setIsSuccess] = useState<boolean | null>(null)
  const [email, setEmail] = useState<string | null>(null)
  const [step, setStep] = useState<RegisterStep>(1)

  const onRegister = async (data: FormData) => {
    try {
      setSendingData(true)
      const response = await axios.post(apiLinks.auth.register, data)
      if (response.status == 201) {
        setIsSuccess(null)
        setErrorMesseage(null)
        setEmail(data.email)
        setStep(2)
      } else {
        setIsSuccess(false)
        setErrorMesseage(response.data.message)
      }
      setSendingData(false)
    } catch (error: any) {
      setIsSuccess(false)
      setSendingData(false)
      if (axios.isAxiosError(error) && error.response) {
        const message = error.response.data?.message || "Đã xảy ra lỗi không xác định"
        setErrorMesseage(message)
        console.error("Lỗi từ server:", message)
      } else {
        setErrorMesseage("Lỗi kết nối hoặc lỗi không xác định")
        console.error("Lỗi không xác định:", error)
      }
      console.error(error)
    }
  }

  const onEnterCode = async (data: EnterCodeFormData) => {
    try {
      setSendingData(true)
      const payload = {
        ...data,
        verificationCode: Number(data.verificationCode), // Convert to number
      }
      const response = await axios.post(apiLinks.auth.enterCode, payload)
      if (response.status == 200) {
        setIsSuccess(true)
        setTimeout(() => {
          router.push("/signin")
        }, 3000)
        setSendingData(false)
      } else {
        setErrorMesseage(response.data.message)
        setIsSuccess(false)
        setSendingData(false)
      }
    } catch (error: any) {
      setIsSuccess(false)
      setSendingData(false)

      if (axios.isAxiosError(error) && error.response) {
        const message = error.response.data?.message || "Đã xảy ra lỗi không xác định"
        setErrorMesseage(message)
        console.error("Lỗi từ server:", message)
      } else {
        setErrorMesseage("Lỗi kết nối hoặc lỗi không xác định")
        console.error("Lỗi không xác định:", error)
      }
      console.error(error)
    }
  }

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full overflow-y-auto no-scrollbar">
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
        {step === 1 && (
          <RegisterForm
            onRegister={onRegister}
            onSending={sendingData}
            errorMesseage={errorMesseage}
            isSuccess={isSucess}
          />
        )}
        {step === 2 && email && (
          <EnterCodeForm
            onEnterCode={onEnterCode}
            email={email}
            isSuccess={isSucess}
            onSending={sendingData}
            errorMesseage={errorMesseage}
          />
        )}
      </div>
    </div>
  )
}
