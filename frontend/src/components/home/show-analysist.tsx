"use client"
import Image from "next/image"

export default function ShowAnalysist() {
  return (
    <div>
      <section className="hero  max-lg:pt-[60px] pt-[100px] z-40">
        <div className="container">
          <div
            className="max-w-[948px] mx-auto text-center"
            data-aos="fade-up"
            data-aos-offset={200}
            data-aos-duration={1000}
            data-aos-once="true"
          >
            <p className="mb-4 font-medium uppercase">QUẢN LÝ AI</p>
            <h1 className="max-lg:mb-10 mb-6">Quản lý hiệu suất AI</h1>
            <p className="max-lg:mb-10 mb-12 max-w-[590px] mx-auto">
              {" "}
              Theo dõi mức độ hiệu quả của AI trong việc hỗ trợ chuyển đổi đơn hàng.
            </p>
          </div>
        </div>
      </section>

      <section className="relative ">
        <div className="container relative">
          {/* Background blur effects */}
          <div className="absolute left-1/2 top-50 -translate-x-1/2 -translate-y-1/2 flex max-md:flex-col -z-10 max-md:hidden">
            <div className="max-1xl:w-[335px] max-1xl:h-[335px] 1xl:w-[442px] 1xl:h-[442px] rounded-full bg-primary-200/20 blur-[145px]" />
            <div className="max-1xl:w-[335px] max-1xl:h-[335px] 1xl:w-[442px] 1xl:h-[442px] rounded-full bg-primary-200/25 -ml-[170px] max-md:ml-0 blur-[145px]" />
            <div className="max-1xl:w-[335px] max-1xl:h-[335px] 1xl:w-[442px] 1xl:h-[442px] rounded-full bg-primary-200/20 -ml-[170px] max-md:ml-0 blur-[145px]" />
          </div>

          {/* Main content with responsive grid */}
          <div className="grid grid-cols-12 items-center relative z-10 max-md:mb-20 md:mb-32 max-md:mt-20 md:mt-25">
            <div className="col-span-12">
              <div className="relative flex items-center justify-center">
                {/* Main analysist image */}
                <div
                  className="relative w-full  md:max-w-[650px] lg:max-w-[750px] xl:max-w-[1020px] mx-auto"
                  data-aos="fade-up"
                  data-aos-offset={200}
                  data-aos-duration={1000}
                  data-aos-once="true"
                >
                  <div className="w-full aspect-[16/10] md:aspect-[16/9] relative">
                    <Image
                      src="/images/banking/analysist.png"
                      alt="AI Analytics Dashboard"
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 750px, 1020px"
                      className="object-contain dark:hidden"
                      priority
                    />
                  </div>

                  {/* Shape 1 - Right side */}
                  <div
                    className="absolute max-xs:right-[-20px] max-md:right-[-30px] max-md:w-[120px] max-lg:right-[-80px] max-lg:w-[180px] max-xl:right-[-120px] max-xl:w-[250px] max-1xl:w-[300px] right-[-150px] bottom-[10%] md:bottom-[15%]"
                    data-aos="fade-left"
                    data-aos-offset={200}
                    data-aos-duration={1000}
                    data-aos-once="true"
                  >
                    <div className="relative w-[0px] h-[0px] md:w-[180px] md:h-[180px] lg:w-[250px] lg:h-[250px] xl:w-[300px] xl:h-[300px]">
                      <Image
                        src="/images/banking/banner-shape-1.png"
                        alt="Decorative shape"
                        fill
                        sizes="(max-width: 768px) 100px, (max-width: 1024px) 180px, 300px"
                        className="object-contain dark:hidden"
                      />
                    </div>
                  </div>

                  {/* Shape 2 - Left side */}
                  <div
                    className="absolute max-xs:left-[-20px] max-md:left-[-30px] max-md:w-[120px] max-lg:left-[-80px] max-lg:w-[180px] max-xl:left-[-120px] max-xl:w-[250px] max-1xl:w-[300px] left-[-150px] top-[10%] md:top-[15%]"
                    data-aos="fade-right"
                    data-aos-offset={200}
                    data-aos-duration={1000}
                    data-aos-once="true"
                  >
                    <div className="relative w-[0px] h-[0px] md:w-[180px] md:h-[180px] lg:w-[250px] lg:h-[250px] xl:w-[300px] xl:h-[300px]">
                      <Image
                        src="/images/banking/banner-shape-2.png"
                        alt="Decorative shape"
                        fill
                        sizes="(max-width: 768px) 100px, (max-width: 1024px) 180px, 300px"
                        className="object-contain dark:hidden"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
