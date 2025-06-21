export default function PrivacyPage() {
  return (
    <section className="relative pb-150 pt-[200px] max-md:pt-150 overflow-hidden">
      <div className="absolute left-0 right-0 -top-[800px] bg-core-gradient bg-no-repeat bg-center opacity-70 w-full h-full bg-[length:600px_1000px] md:hidden" />
      <div className="container relative !max-w-[800px]" data-aos="fade-up" data-aos-offset={200} data-aos-duration={1000} data-aos-once="true">
        <div className="absolute left-1/2 top-20 -translate-x-1/2 -translate-y-1/2 flex -z-10 max-md:hidden">
          <div className="w-[442px] h-[442px] rounded-full bg-primary-200/20 blur-[145px]" />
          <div className="w-[442px] h-[442px] rounded-full bg-primary-200/25 -ml-[170px] blur-[145px]" />
          <div className="w-[442px] h-[442px] rounded-full bg-primary-200/20 -ml-[170px] blur-[145px]" />
        </div>
        <div className="singlePage">
          <h2 className="mb-3 font-semibold leading-[1.33] max-w-[650px] text-3xl md:text-4xl text-gray-900 dark:text-gray-100">
            Chính sách bảo mật
          </h2>
        </div>
        <div className="singlePage space-y-6 text-gray-700 dark:text-gray-300">
          <div className="text-base leading-relaxed">
            Chào mừng đến với Viqium, nền tảng SaaS mạnh mẽ và được tối ưu hóa được thiết kế để tăng cường sự tương tác của khách hàng với nỗ lực tối thiểu. Tại Viqium, chúng tôi cam kết bảo vệ quyền riêng tư và bảo mật thông tin cá nhân của bạn. Chính sách quyền riêng tư này giải thích cách chúng tôi thu thập, sử dụng, tiết lộ và bảo vệ dữ liệu của bạn. Bằng cách sử dụng Viqium, bạn đồng ý với các hoạt động được mô tả trong Chính sách quyền riêng tư này.
          </div>

          <div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">1. Giới thiệu</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-xl font-medium text-gray-800 text-gray-800 mb-2">1.1 Mục đích thu thập thông tin cá nhân</h4>
                <p >
                  Mục đích của việc thu thập thông tin khách hàng nhằm liên quan đến các vấn đề như:

                </p>
                <div className="list-disc space-y-1">
                  <li>Hỗ trợ khách hàng: mua hàng, thanh toán, giao hàng khi sử dụng dịch vụ của Viqium.</li>
                  <li>Cung cấp thông tin sản phẩm, các dịch vụ và hỗ trợ theo yêu cầu của khách hàng.</li>
                  <li>Gửi thông báo các chương trình, sản phẩm mới nhất của chúng tôi.</li>
                  <li>Giải quyết vấn đề phát sinh khi mua hàng.</li>
                </div>
              </div>
              <div>
                <h4 style={{ fontSize: '1.25rem', fontWeight: 500, marginBottom: '1rem' }} className="text-gray-800">
                  1.2 Phạm vi thu thập thông tin
                </h4>
                <div style={{ fontSize: '1rem', lineHeight: '1.625', color: '#374151' }}>
                  Chính sách này áp dụng cho tất cả người dùng Viqium, bao gồm khách hàng và khách truy cập trang website của chúng tôi.
                  <div style={{ marginTop: '1rem', marginBottom: 0, fontWeight: 600 }} className="text-gray-800">
                    Thông tin cá nhân
                  </div>
                  <div style={{ marginTop: '1rem', marginBottom: 0, }}>
                    Chúng tôi có thể thu thập thông tin cá nhân như tên, địa chỉ email và thông tin liên lạc của bạn khi bạn tạo tài khoản hoặc liên hệ với chúng tôi.
                  </div>
                  <div style={{ marginTop: '1rem', marginBottom: 0, fontWeight: 600 }} className="text-gray-800">
                    Thông tin phi cá nhân
                  </div>
                  <div style={{ marginTop: '1rem', marginBottom: 0, }}>
                    Chúng tôi có thể thu thập thông tin phi cá nhân như thông tin thiết bị, loại trình duyệt và dữ liệu sử dụng để cải thiện dịch vụ của mình.
                  </div>
                  <div style={{ marginTop: '1rem', marginBottom: 0, fontWeight: 600 }} className="text-gray-800">
                    Cookie và Công nghệ theo dõi
                  </div>
                  <div style={{ marginTop: '1rem', marginBottom: 0, }}>
                    Chúng tôi sử dụng cookie và các công nghệ tương tự để nâng cao trải nghiệm của bạn trên Viqium và cho mục đích phân tích và tiếp thị. Bạn có thể quản lý tùy chọn cookie của mình thông qua cài đặt trình duyệt.
                  </div>
                  <div style={{ marginTop: '1rem', marginBottom: 0, fontWeight: 600 }} className="text-gray-800">
                    Thu thập dữ liệu của bên thứ ba
                  </div>
                  <div style={{ marginTop: '1rem' }}>
                    Chúng tôi có thể tích hợp với các dịch vụ của bên thứ ba thu thập dữ liệu độc lập. Vui lòng xem lại chính sách bảo mật của các bên thứ ba này để biết thêm thông tin.
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-xl font-medium text-gray-800 text-gray-800 mb-2">1.3 Sự đồng ý và chấp thuận</h4>
                <div className="text-base leading-relaxed">
                  Bằng cách sử dụng Viqium, bạn đồng ý với các điều khoản của Chính sách bảo mật này và chấp thuận việc thu thập, xử lý và chia sẻ thông tin của bạn như được mô tả ở đây.
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">2. Thời gian lưu trữ thông tin</h3>
            <div className="text-base leading-relaxed">
              Dữ liệu cá nhân của Thành viên sẽ được lưu trữ cho đến khi có yêu cầu hủy bỏ hoặc tự thành viên đăng nhập và thực hiện hủy bỏ. Còn lại trong mọi trường hợp thông tin cá nhân thành viên sẽ được bảo mật trên máy chủ của viqium.com.
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">3. Những người hoặc tổ chức có thể được tiếp cận với thông tin</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-xl font-medium text-gray-800 text-gray-800 mb-2">3.1 Sử dụng thông tin để cung cấp dịch vụ</h4>
                <div className="text-base leading-relaxed">
                  Chúng tôi sử dụng thông tin của bạn để cung cấp và cải thiện các dịch vụ của Viqium, bao gồm các tính năng tự động hóa và tương tác hỗ trợ khách hàng.
                </div>
              </div>
              <div>
                <h4 className="text-xl font-medium text-gray-800 text-gray-800 mb-2">3.2 Tự động hóa hỗ trợ khách hàng</h4>
                <div className="text-base leading-relaxed">
                  Viqium sử dụng AI để tự động hóa các quy trình hỗ trợ khách hàng. Tương tác của bạn với nền tảng của chúng tôi có thể được phân tích để cải thiện chất lượng phản hồi.
                </div>
              </div>
              <div>
                <h4 className="text-xl font-medium text-gray-800 text-gray-800 mb-2">3.3 Cá nhân hóa và sự tham gia của khách hàng</h4>
                <div className="text-base leading-relaxed">
                  Chúng tôi có thể sử dụng dữ liệu của bạn để cá nhân hóa trải nghiệm của bạn và tương tác với bạn thông qua email, thông báo hoặc tin nhắn trong ứng dụng.
                </div>
              </div>
              <div>
                <h4 className="text-xl font-medium text-gray-800 text-gray-800 mb-2">3.4 Cung cấp cho nhà cung cấp dịch vụ của bên thứ ba</h4>
                <div className="text-base leading-relaxed">
                  Chúng tôi có thể chia sẻ dữ liệu của bạn với các nhà cung cấp dịch vụ bên thứ ba hỗ trợ chúng tôi cung cấp và cải thiện các dịch vụ của Viqium.
                </div>
              </div>
              <div>
                <h4 className="text-xl font-medium text-gray-800 text-gray-800 mb-2">3.5 Yêu cầu pháp lý</h4>
                <div className="text-base leading-relaxed">
                  Chúng tôi có thể tiết lộ các thông tin cá nhân nếu điều đó do luật pháp yêu cầu và việc tiết lộ như vậy là cần thiết một cách hợp lý để tuân thủ các quy trình pháp lý.
                </div>
              </div>
              <div>
                <h4 className="text-xl font-medium text-gray-800 text-gray-800 mb-2">3.6 Dữ liệu tổng hợp hoặc ẩn danh</h4>
                <div className="text-base leading-relaxed">
                  Chúng tôi có thể chia sẻ dữ liệu tổng hợp hoặc ẩn danh cho mục đích phân tích và nghiên cứu.
                </div>
              </div>
              <div>
                <h4 style={{ fontSize: '1.25rem', fontWeight: 500, marginBottom: '1rem' }} className="text-gray-800">
                  3.7 Lựa chọn quyền riêng tư của bạn
                </h4>
                <div style={{ fontSize: '1rem', lineHeight: '1.625', color: '#374151' }}>
                  <div style={{ marginTop: '1rem', marginBottom: 0, fontWeight: 600 }} className="text-gray-800">
                    Truy cập và cập nhật thông tin của bạn
                  </div>
                  <div style={{ marginTop: '1rem', marginBottom: 0 }}>
                    Bạn có thể truy cập và cập nhật thông tin cá nhân của mình thông qua cài đặt tài khoản Viqium.
                  </div>
                  <div style={{ marginTop: '1rem', marginBottom: 0, fontWeight: 600 }} className="text-gray-800">
                    Sở thích giao tiếp
                  </div>
                  <div style={{ marginTop: '1rem', marginBottom: 0 }}>
                    Bạn có thể quản lý tùy chọn liên lạc của mình bằng cách điều chỉnh cài đặt trong tài khoản Viqium hoặc bằng cách hủy đăng ký nhận email.
                  </div>
                  <div style={{ marginTop: '1rem', marginBottom: 0, fontWeight: 600 }} className="text-gray-800">
                    Cookie và Theo dõi
                  </div>
                  <div style={{ marginTop: '1rem', marginBottom: 0 }}>
                    Bạn có thể quản lý cookie và tùy chọn theo dõi thông qua cài đặt trình duyệt của mình.
                  </div>
                  <div style={{ marginTop: '1rem', marginBottom: 0, fontWeight: 600 }} className="text-gray-800">
                    Không theo dõi tín hiệu
                  </div>
                  <div style={{ marginTop: '1rem' }}>
                    Hiện tại chúng tôi không phản hồi tín hiệu "Không theo dõi".
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">4. Bảo mật dữ liệu</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-xl font-medium text-gray-800 text-gray-800 mb-2">4.1 Biện pháp an ninh</h4>
                <div className="text-base leading-relaxed">
                  Chúng tôi sử dụng các biện pháp bảo mật theo tiêu chuẩn công nghiệp để bảo vệ dữ liệu của bạn.
                </div>
              </div>
              <div>
                <h4 className="text-xl font-medium text-gray-800 text-gray-800 mb-2">4.2 Phản hồi về vi phạm dữ liệu</h4>
                <div className="text-base leading-relaxed">
                  Trong trường hợp xảy ra vi phạm dữ liệu, chúng tôi sẽ thông báo cho người dùng bị ảnh hưởng theo luật hiện hành.
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">5. Liên kết và dịch vụ của bên thứ ba</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-xl font-medium text-gray-800 text-gray-800 mb-2">5.1 Trang web bên ngoài</h4>
                <div className="text-base leading-relaxed">
                  Viqium có thể chứa các liên kết đến các trang web bên ngoài. Chúng tôi không chịu trách nhiệm về các hoạt động bảo mật hoặc nội dung của các trang web này.
                </div>
              </div>
              <div>
                <h4 className="text-xl font-medium text-gray-800 text-gray-800 mb-2">5.2 Tích hợp với Dịch vụ của bên thứ ba</h4>
                <div className="text-base leading-relaxed">
                  Viqium có thể tích hợp với các dịch vụ của bên thứ ba. Việc bạn sử dụng các dịch vụ này phải tuân theo chính sách bảo mật tương ứng của họ.
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">6. Quyền riêng tư của trẻ em</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-xl font-medium text-gray-800 text-gray-800 mb-2">6.1 Giới hạn độ tuổi</h4>
                <div className="text-base leading-relaxed">
                  Viqium không dành cho trẻ em dưới 13 tuổi. Chúng tôi không cố ý thu thập thông tin cá nhân từ trẻ em dưới 13 tuổi.
                </div>
              </div>
              <div>
                <h4 className="text-xl font-medium text-gray-800 text-gray-800 mb-2">6.2 Sự đồng ý của cha mẹ</h4>
                <div className="text-base leading-relaxed">
                  Nếu bạn tin rằng chúng tôi đã thu thập thông tin từ trẻ em dưới 13 tuổi mà không có sự đồng ý của cha mẹ, vui lòng liên hệ với chúng tôi để yêu cầu xóa thông tin đó.
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">7. Người dùng quốc tế</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-xl font-medium text-gray-800 text-gray-800 mb-2">7.1 Chuyển dữ liệu xuyên biên giới</h4>
                <div className="text-base leading-relaxed">
                  Bằng cách sử dụng Viqium, bạn đồng ý chuyển dữ liệu của mình tới Hoa Kỳ và các khu vực pháp lý khác khi cần thiết cho các mục đích được nêu trong Chính sách quyền riêng tư này.
                </div>
              </div>
              <div>
                <h4 className="text-xl font-medium text-gray-800 text-gray-800 mb-2">7.2 Quyền của Người dùng EU (nếu có)</h4>
                <div className="text-base leading-relaxed">
                  Nếu bạn là người dùng EU, bạn có thể có thêm các quyền theo Quy định bảo vệ dữ liệu chung (GDPR). Vui lòng xem Thông báo về quyền riêng tư GDPR riêng của chúng tôi để biết thêm thông tin.
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">8. Địa chỉ của đơn vị thu thập và quản lý thông tin</h3>
            <div className="space-y-2">
              <div className="text-base leading-relaxed">
                <span className="font-semibold text-gray-800 text-gray-800">Tên doanh nghiệp:</span> CÔNG TY TNHH Vẻ Đẹp Chuyên Nghiệp Toàn Cầu - Thành lập và hoạt động theo Giấy chứng nhận đăng ký doanh nghiệp số: 0313944447 do Sở Kế hoạch và Đầu tư thành phố Hồ Chí Minh cấp lần đầu ngày 02 tháng 08 năm 2016, đăng ký thay đổi lần thứ 4 ngày 19 tháng 04 năm 2022.</div>
              <div className="text-base leading-relaxed">
                <span className="font-semibold text-gray-800 text-gray-800">Trụ sở chính:</span> 79 Ngô Thời Nhiệm, P. Võ Thị Sáu, Quận 3, Thành phố Hồ Chí Minh, Việt Nam.
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">9. Phương thức và công cụ để người dùng tiếp cận và chỉnh sửa dữ liệu</h3>
            <div className="text-base leading-relaxed">
              Nếu quý khách có bất cứ yêu cầu nào về việc tiếp cận và chỉnh sửa thông tin cá nhân đã cung cấp, quý khách liên hệ tới NDN để yêu cầu chỉnh sửa:
              <div className="list-disc mt-2 space-y-1">
                <li>
                  Gọi điện trực tiếp về số điện thoại: <a href="tel:0906688013" className="text-blue-600 hover:underline dark:text-blue-400">0906688013</a>
                </li>
                <li>
                  Gửi email: <a href="mailto:hi.viqium@gmail.com" className="text-blue-600 hover:underline dark:text-blue-400">hi.viqium@gmail.com</a>
                </li>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}