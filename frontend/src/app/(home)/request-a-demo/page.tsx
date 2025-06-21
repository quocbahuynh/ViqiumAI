"use client"
import { useState } from "react"
import emailjs from "@emailjs/browser"

export default function RequestADemo() {
  const [name, setName] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")

  const sendEmail = async (e: any) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const serviceId = `${process.env.NEXT_PUBLIC_EMAIL_SERVICE_ID}`
    const templateId = `${process.env.NEXT_PUBLIC_EMAIL_TEMPLATE_ID}`
    const publicKey = `${process.env.NEXT_PUBLIC_EMAIL_PUBLIC_KEY}`

    console.log(templateId)

    const templateParams = {
      from_name: name,
      from_phoneNumber: phoneNumber,
      to_name: "Viqium AI",
      message: message,
    }

    // Send the email using EmailJS
    emailjs
      .send(serviceId, templateId, templateParams, publicKey)
      .then((response) => {
        console.log("Email sent successfully!", response)
        setName("")
        setPhoneNumber("")
        setMessage("")
        setIsSuccess(true)
        setIsLoading(false)

        // Hide success message after 5 seconds
        setTimeout(() => {
          setIsSuccess(false)
        }, 5000)
      })
      .catch((error) => {
        console.error("Error sending email:", error)
        setError("Có lỗi xảy ra khi gửi email. Vui lòng thử lại.")
        setIsLoading(false)
      })
  }

  return (
    <div>
      <section className="py-[200px] max-md:pt-150 relative overflow-hidden">
        <div className="absolute left-1/2 top-0 w-full h-[550px] -translate-x-1/2 bg-cover bg-hero-gradient bg-no-repeat bg-center opacity-70 md:hidden -z-10" />
        <div
          className="container relative"
          data-aos="fade-up"
          data-aos-offset={200}
          data-aos-duration={1000}
          data-aos-once="true"
        >
          <div className="mb-12 text-center max-w-[475px] mx-auto">
            <p className="section-tagline">Liên hệ</p>
            <h2>Đặt lịch demo</h2>
          </div>
          <div className="relative z-10 max-w-[850px] mx-auto">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex -z-10 max-md:hidden">
              <div className="w-[442px] h-[442px] rounded-full bg-primary-200/20 blur-[145px]" />
              <div className="w-[442px] h-[442px] rounded-full bg-primary-200/25 -ml-[170px] blur-[145px]" />
              <div className="w-[442px] h-[442px] rounded-full bg-primary-200/20 -ml-[170px] blur-[145px]" />
            </div>
            <div className="bg-white dark:bg-dark-200 rounded-medium p-2.5 shadow-nav">
              <div className="bg-white dark:bg-dark-200 border border-dashed rounded border-gray-100 dark:border-borderColour-dark p-12 max-md:p-5">
                {/* Success Message */}
                {isSuccess && (
                  <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-green-800 dark:text-green-200">
                          Gửi thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-red-800 dark:text-red-200">{error}</p>
                      </div>
                    </div>
                  </div>
                )}

                <form onSubmit={sendEmail}>
                  <div className="grid grid-cols-12 max-md:gap-y-10 md:gap-x-12 md:gap-8">
                    <div className="max-md:col-span-full md:col-span-6">
                      <label
                        htmlFor="fullname"
                        className="block text-sm font-medium font-jakarta_sans text-paragraph dark:text-white mb-2"
                      >
                        Họ và Tên
                      </label>
                      <input
                        type="text"
                        name="full-name"
                        id="fullname"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Họ và Tên"
                        disabled={isLoading}
                        className="block w-full text-sm rounded-[48px] border border-borderColour dark:border-borderColour-dark py-2.5 px-5 text-paragraph-light placeholder:text-paragraph-light dark:placeholder:text-paragraph-light outline-none bg-white dark:bg-dark-200 focus:border-primary dark:focus:border-primary duration-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </div>
                    <div className="max-md:col-span-full md:col-span-6">
                      <label
                        htmlFor="phonenumber"
                        className="block text-sm font-medium font-jakarta_sans text-paragraph dark:text-white mb-2"
                      >
                        Số điện thoại
                      </label>
                      <input
                        type="number"
                        name="phonenumber"
                        id="phonenumber"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="Số điện thoại"
                        disabled={isLoading}
                        className="block w-full text-sm rounded-[48px] border border-borderColour dark:border-borderColour-dark py-2.5 px-5 text-paragraph-light placeholder:text-paragraph-light dark:placeholder:text-paragraph-light outline-none bg-white dark:bg-dark-200 focus:border-primary dark:focus:border-primary duration-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </div>
                    <div className="col-span-full">
                      <label
                        htmlFor="message"
                        className="block text-sm font-medium font-jakarta_sans text-paragraph dark:text-white mb-2"
                      >
                        Lời nhắn
                      </label>
                      <textarea
                        name="message"
                        id="message"
                        rows={10}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        disabled={isLoading}
                        className="block w-full text-sm rounded border border-borderColour dark:border-borderColour-dark py-2.5 px-5 text-paragraph-light placeholder:text-paragraph-light outline-none resize-none bg-white dark:bg-dark-200 focus:border-primary dark:focus:border-primary duration-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </div>
                    <div className="mx-auto col-span-full text-center">
                      <button
                        type="submit"
                        disabled={isLoading || !name || !phoneNumber}
                        className="btn disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {isLoading && (
                          <svg
                            className="animate-spin h-4 w-4"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                        )}
                        {isLoading ? "Đang gửi..." : "Đặt lịch"}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
