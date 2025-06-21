import { pricingPlans } from "@/constants/pricing"
import PricingCart from "../common/PricingCart"
import { forwardRef } from "react"

const Pricing = forwardRef<HTMLElement>((props, ref) => {
  return (
    <section
      ref={ref}
      className="bg-white dark:bg-dark-300 pt-150 max-md:pt-20 mb-150 max-md:mb-25 relative overflow-hidden"
    >
      <div className="container ">
        <div className="mb-12 text-center max-w-[475px] mx-auto relative z-10">
          <div>
            <p className="section-tagline">Phí dịch vụ</p>
            <h2>Bảng phí dịch vụ Viqium AI</h2>
          </div>
        </div>
        <div className="relative md:z-10">
          <div className="absolute inset-0 flex items-start justify-center max-md:flex-col -z-10 max-md:hidden">
            <div className="max-1xl:w-[335px] max-1xl:h-[335px] 1xl:w-[442px] 1xl:h-[442px] rounded-full bg-primary-200/20 blur-[145px]"></div>
            <div className="max-1xl:w-[335px] max-1xl:h-[335px] 1xl:w-[442px] 1xl:h-[442px] rounded-full bg-primary-200/25 -ml-[170px] max-md:ml-0 blur-[145px]"></div>
            <div className="max-1xl:w-[335px] max-1xl:h-[335px] 1xl:w-[442px] 1xl:h-[442px] rounded-full bg-primary-200/20 -ml-[170px] max-md:ml-0 blur-[145px]"></div>
          </div>
          <div className="absolute left-1/2 p-[350px] top-25 -translate-x-1/2 -translate-y-1/2 bg-no-repeat bg-center bg-contain opacity-70 md:hidden" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12 justify-center">
            {pricingPlans.map((p) => (
              <PricingCart key={p.id} data={p} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
})

Pricing.displayName = "Pricing"

export default Pricing
