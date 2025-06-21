import React from 'react'

export default function Customer() {
    return (
        <section className="bg-white dark:bg-dark-300  max-md:py-20 pt-150 pb-150 relative">
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 bg-service-bg bg-no-repeat bg-center opacity-70 w-full h-full  md:hidden" />
            <div className="container relative">
                <div className="text-center max-w-[550px] mx-auto mb-16">
                    <p className="section-tagline">LỜI KHEN</p>
                    <h2>Khách hàng của chúng tôi</h2>
                </div>
                <div className="relative z-10">
                    <div className="absolute left-1/2 top-[37%] -translate-x-1/2 -translate-y-1/2 flex max-lg:flex-col max-lg:item-center -z-10 max-md:hidden">
                        <div className="w-[350px] h-[350px] lg:w-[442px] lg:h-[442px] blur-[80px] lg:blur-[145px] rounded-full bg-primary-200/20 " />
                        <div className="w-[350px] h-[350px] lg:w-[442px] lg:h-[442px] blur-[80px] lg:blur-[145px] rounded-full bg-primary-200/25 lg:-ml-[170px]" />
                        <div className="w-[350px] h-[350px] lg:w-[442px] lg:h-[442px] blur-[80px] lg:blur-[145px] rounded-full bg-primary-200/20 lg:-ml-[170px] " />
                    </div>
                    <div className=" flex flex-wrap max-md:flex-col gap-6 gap-y-8 justify-center mb-12">
                        <div className="bg-white dark:bg-dark-200 rounded-medium p-2.5  md:w-[calc(50%_-_20px)] lg:w-[calc(33.33%_-_20px)] shadow-nav">
                            <div className="border border-dashed rounded border-gray-100 dark:border-borderColour-dark p-7 ">
                                <img src="images/testimonial/bodygroup.svg" alt="image" className="inline-block dark:hidden mb-6" />
                                <img src="images/testimonial/bodygroup-dark.svg" alt="image" className="hidden dark:inline-block mb-6" />
                                <blockquote className="text-paragraph dark:text-white italic mb-5 leading-[1.75]">
                                    “Until recently, the prevailing view assumed lorem ipsum was born as a nonsense text. It's not Latin
                                    though it looks like it, and it actually says nothing.”
                                </blockquote>
                                <div className="mb-7">
                                    <i className="fa-solid fa-star text-paragraph dark:text-white" />
                                    <i className="fa-solid fa-star text-paragraph dark:text-white" />
                                    <i className="fa-solid fa-star text-paragraph dark:text-white" />
                                    <i className="fa-solid fa-star text-paragraph dark:text-white" />
                                    <i className="fa-solid fa-star text-[#A7A7B4] dark:text-[#646463]" />
                                </div>
                                <div className="pt-7 flex items-center border-t border-dashed border-gray-100 dark:border-borderColour-dark">
                                    <img src="images/testimonial/avatar1.png" alt="avatar" className="mr-4 rounded-full" />
                                    <div className="block">
                                        <h3 className="text-base font-semibold">Robert Frost</h3>
                                        <p className="text-paragraph-light dark:text-[#A1A49D] font-jakarta_sans text-sm font-medium">
                                            Lead Designer
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-dark-200 rounded-medium p-2.5  md:w-[calc(50%_-_20px)] lg:w-[calc(33.33%_-_20px)] shadow-nav">
                            <div className="border border-dashed rounded border-gray-100 dark:border-borderColour-dark p-7 ">
                                <img src="images/testimonial/caudile.svg" alt="image" className="inline-block dark:hidden mb-6" />
                                <img src="images/testimonial/caudile-dark.svg" alt="image" className="hidden dark:inline-block mb-6" />
                                <blockquote className="text-paragraph dark:text-white italic mb-5 leading-[1.75]">
                                    “Until recently, the prevailing view assumed lorem ipsum was born as a nonsense text. It's not Latin
                                    though it looks like it, and it actually says nothing.”
                                </blockquote>
                                <div className="mb-7">
                                    <i className="fa-solid fa-star text-paragraph dark:text-white" />
                                    <i className="fa-solid fa-star text-paragraph dark:text-white" />
                                    <i className="fa-solid fa-star text-paragraph dark:text-white" />
                                    <i className="fa-solid fa-star text-paragraph dark:text-white" />
                                    <i className="fa-solid fa-star text-[#A7A7B4] dark:text-[#646463]" />
                                </div>
                                <div className="pt-7 flex items-center border-t border-dashed border-gray-100 dark:border-borderColour-dark">
                                    <img src="images/testimonial/avatar2.png" alt="avatar" className="mr-4 rounded-full" />
                                    <div className="block">
                                        <h3 className="text-base font-semibold">Guy Hawkins</h3>
                                        <p className="text-paragraph-light dark:text-[#A1A49D]  font-jakarta_sans text-sm font-medium">Developer</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-dark-200 rounded-medium p-2.5 md:w-[calc(50%_-_20px)] lg:w-[calc(33.33%_-_20px)] shadow-nav">
                            <div className="border border-dashed rounded border-gray-100 dark:border-borderColour-dark p-7 ">
                                <img src="images/testimonial/axeptio.svg" alt="image" className="inline-block dark:hidden mb-6" />
                                <img src="images/testimonial/axeptio-dark.svg" alt="image" className="hidden dark:inline-block mb-6" />
                                <blockquote className="text-paragraph dark:text-white italic mb-5 leading-[1.75]">
                                    “Until recently, the prevailing view assumed lorem ipsum was born as a nonsense text. It's not Latin
                                    though it looks like it, and it actually says nothing.”
                                </blockquote>
                                <div className="mb-7">
                                    <i className="fa-solid fa-star text-paragraph dark:text-white" />
                                    <i className="fa-solid fa-star text-paragraph dark:text-white" />
                                    <i className="fa-solid fa-star text-paragraph dark:text-white" />
                                    <i className="fa-solid fa-star text-paragraph dark:text-white" />
                                    <i className="fa-solid fa-star text-[#A7A7B4] dark:text-[#646463]" />
                                </div>
                                <div className="pt-7 flex items-center border-t border-dashed border-gray-100 dark:border-borderColour-dark">
                                    <img src="images/testimonial/avatar3.png" alt="avatar" className="mr-4 rounded-full" />
                                    <div className="block">
                                        <h3 className="text-base font-semibold">Cody Fisher</h3>
                                        <p className="text-paragraph-light dark:text-[#A1A49D]  font-jakarta_sans text-sm font-medium">
                                            UI Designer
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-dark-200 rounded-medium p-2.5  md:w-[calc(50%_-_20px)] lg:w-[calc(33.33%_-_20px)] shadow-nav">
                            <div className="border border-dashed rounded border-gray-100 dark:border-borderColour-dark p-7 ">
                                <img src="images/testimonial/infinity.svg" alt="image" className="inline-block dark:hidden mb-6" />
                                <img src="images/testimonial/infinity-dark.svg" alt="image" className="hidden dark:inline-block mb-6" />
                                <blockquote className="text-paragraph dark:text-white italic mb-5 leading-[1.75]">
                                    “Until recently, the prevailing view assumed lorem ipsum was born as a nonsense text. It's not Latin
                                    though it looks like it, and it actually says nothing.”
                                </blockquote>
                                <div className="mb-7">
                                    <i className="fa-solid fa-star text-paragraph dark:text-white" />
                                    <i className="fa-solid fa-star text-paragraph dark:text-white" />
                                    <i className="fa-solid fa-star text-paragraph dark:text-white" />
                                    <i className="fa-solid fa-star text-paragraph dark:text-white" />
                                    <i className="fa-solid fa-star text-[#A7A7B4] dark:text-[#646463]" />
                                </div>
                                <div className="pt-7 flex items-center border-t border-dashed border-gray-100 dark:border-borderColour-dark">
                                    <img src="images/testimonial/avatar4.png" alt="avatar" className="mr-4 rounded-full" />
                                    <div className="block">
                                        <h3 className="text-base font-semibold">Albert Flores</h3>
                                        <p className="text-paragraph-light dark:text-[#A1A49D]  font-jakarta_sans text-sm font-medium">
                                            Junior Designer
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-dark-200 rounded-medium p-2.5 md:w-[calc(50%_-_20px)] lg:w-[calc(33.33%_-_20px)] shadow-nav">
                            <div className="border border-dashed rounded border-gray-100 dark:border-borderColour-dark p-7">
                                <img src="images/testimonial/mfinity.svg" alt="image" className="inline-block dark:hidden mb-6" />
                                <img src="images/testimonial/mfinity-dark.svg" alt="image" className="hidden dark:inline-block mb-6" />
                                <blockquote className="text-paragraph dark:text-white italic mb-5 leading-[1.75]">
                                    “Until recently, the prevailing view assumed lorem ipsum was born as a nonsense text. It's not Latin
                                    though it looks like it, and it actually says nothing.”
                                </blockquote>
                                <div className="mb-7">
                                    <i className="fa-solid fa-star text-paragraph dark:text-white" />
                                    <i className="fa-solid fa-star text-paragraph dark:text-white" />
                                    <i className="fa-solid fa-star text-paragraph dark:text-white" />
                                    <i className="fa-solid fa-star text-paragraph dark:text-white" />
                                    <i className="fa-solid fa-star text-[#A7A7B4] dark:text-[#646463]" />
                                </div>
                                <div className="pt-7 flex items-center border-t border-dashed border-gray-100 dark:border-borderColour-dark">
                                    <img src="images/testimonial/avatar5.png" alt="avatar" className="mr-4 rounded-full" />
                                    <div className="block">
                                        <h3 className="text-base font-semibold">Floyed Miles</h3>
                                        <p className="text-paragraph-light dark:text-[#A1A49D]  font-jakarta_sans text-sm font-medium">Designer</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-center">
                        <a href="contact.html" className="btn">
                            Start Your jouney
                        </a>
                    </div>
                </div>
                <div className="w-full h-[450px] absolute bottom-15 left-0 z-10 bg-gradient-to-b  from-transparent  to-white dark:to-dark-300 to-100%" />
            </div>
        </section>

    )
}
