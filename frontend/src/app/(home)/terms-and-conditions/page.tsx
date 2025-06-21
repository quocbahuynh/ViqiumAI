export default function TermPage() {
  return (
    <section className="relative pb-150 pt-[200px] max-md:pt-150 overflow-hidden">
      <div className="absolute left-0 right-0 -top-[800px] bg-core-gradient bg-no-repeat bg-center opacity-70 w-full h-full bg-[length:600px_1000px] md:hidden" />
      <div className="container relative !max-w-[800px]" data-aos="fade-up" data-aos-offset={200} data-aos-duration={1000} data-aos-once="true">
        <div className="absolute inset-0 flex items-start justify-center max-md:flex-col -z-10 max-md:hidden">
          <div className="max-1xl:w-[335px] max-1xl:h-[335px] 1xl:w-[442px] 1xl:h-[442px] rounded-full bg-primary-200/20 blur-[145px]"></div>
          <div className="max-1xl:w-[335px] max-1xl:h-[335px] 1xl:w-[442px] 1xl:h-[442px] rounded-full bg-primary-200/25 -ml-[170px] max-md:ml-0 blur-[145px]"></div>
          <div className="max-1xl:w-[335px] max-1xl:h-[335px] 1xl:w-[442px] 1xl:h-[442px] rounded-full bg-primary-200/20 -ml-[170px] max-md:ml-0 blur-[145px]"></div>
        </div>
        <div className="singlePage">
          <h2 className="mb-3 font-semibold leading-[1.33] max-w-[650px] text-3xl md:text-4xl text-gray-900 dark:text-gray-100">
            Điều khoản
          </h2>
        </div>
        <div className="singlePage space-y-6 text-gray-700 dark:text-gray-300">
          <div className="text-base leading-relaxed">
            Chào mừng đến với <strong>Viqium</strong>!
          </div>

          <div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">1. Giới thiệu</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-xl font-medium text-gray-800 text-gray-800 mb-2">1.1 Mục đích thu thập thông tin cá nhân</h4>
                <p>
                  Cảm ơn bạn đã chọn <strong>Viqium</strong>, một nền tảng Phần mềm dưới dạng dịch vụ tiên tiến tận dụng trí tuệ nhân tạo để tự động hóa và tối ưu hóa quy trình hỗ trợ khách hàng. <strong>Viqium</strong> được thiết kế để giúp bạn tăng cường sự tương tác với khách hàng với nỗ lực tối thiểu, cung cấp cho bạn một công cụ mạnh mẽ để cải thiện dịch vụ khách hàng và hoạt động hỗ trợ của bạn. Vui lòng đọc kỹ các Điều khoản sử dụng này trước khi sử dụng dịch vụ của chúng tôi.
                </p>
              </div>
              <div>
                <h4 style={{ fontSize: '1.25rem', fontWeight: 500, marginBottom: '1rem' }} className="text-gray-800">
                  1.2 Phạm vi thu thập thông tin
                </h4>
                <div style={{ fontSize: '1rem', lineHeight: '1.625', color: '#374151' }}>
                  <div style={{ marginTop: '1rem', marginBottom: 0, fontWeight: 600 }} className="text-gray-800">
                    Thông tin cá nhân
                  </div>
                  <div style={{ marginTop: '1rem', marginBottom: 0 }}>
                    Chúng tôi có thể thu thập thông tin cá nhân như tên, địa chỉ email và thông tin liên lạc của bạn khi bạn tạo tài khoản hoặc liên hệ với chúng tôi.
                  </div>
                  <div style={{ marginTop: '1rem', marginBottom: 0, fontWeight: 600 }} className="text-gray-800">
                    Thông tin phi cá nhân
                  </div>
                  <div style={{ marginTop: '1rem', marginBottom: 0 }}>
                    Chúng tôi có thể thu thập thông tin phi cá nhân như thông tin thiết bị, loại trình duyệt và dữ liệu sử dụng để cải thiện dịch vụ của mình.
                  </div>
                  <div style={{ marginTop: '1rem', marginBottom: 0, fontWeight: 600 }} className="text-gray-800">
                    Cookie và Công nghệ theo dõi
                  </div>
                  <div style={{ marginTop: '1rem', marginBottom: 0 }}>
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
                  Bằng cách truy cập hoặc sử dụng <strong>Viqium</strong>, bạn đồng ý bị ràng buộc bởi các Điều khoản sử dụng này. Nếu bạn không đồng ý với bất kỳ phần nào trong các điều khoản này, vui lòng không sử dụng dịch vụ của chúng tôi. Các điều khoản này đại diện cho một thỏa thuận ràng buộc về mặt pháp lý giữa bạn và <strong>Viqium</strong>, vì vậy điều quan trọng là phải hiểu đầy đủ các điều khoản này.
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">2. Thay đổi điều khoản</h3>
            <div className="text-base leading-relaxed">
              <strong>Viqium</strong> có quyền sửa đổi các Điều khoản sử dụng này bất kỳ lúc nào. Chúng tôi sẽ thông báo cho bạn về bất kỳ thay đổi nào bằng cách đăng các điều khoản đã cập nhật trên trang web của chúng tôi hoặc thông qua các phương tiện truyền thông khác. Bạn có trách nhiệm xem lại các điều khoản định kỳ và việc bạn tiếp tục sử dụng dịch vụ của chúng tôi sau bất kỳ thay đổi nào cấu thành sự chấp nhận những thay đổi đó.
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">3. Tài khoản người dùng</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-xl font-medium text-gray-800 text-gray-800 mb-2">3.1 Đăng ký</h4>
                <div className="text-base leading-relaxed">
                  Để sử dụng <strong>Viqium</strong>, bạn có thể được yêu cầu tạo một tài khoản người dùng. Bạn đồng ý cung cấp thông tin chính xác, đầy đủ và cập nhật trong quá trình đăng ký. Bạn hoàn toàn chịu trách nhiệm duy trì tính bảo mật của thông tin đăng nhập tài khoản của mình.
                </div>
              </div>
              <div>
                <h4 className="text-xl font-medium text-gray-800 text-gray-800 mb-2">3.2 Kiểm soát truy cập</h4>
                <div className="text-base leading-relaxed">
                  Bạn chịu trách nhiệm cho mọi hoạt động diễn ra trong tài khoản của bạn. Bạn đồng ý không chia sẻ thông tin tài khoản của mình và bạn chịu trách nhiệm đảm bảo rằng không có người trái phép nào có thể truy cập vào tài khoản của bạn.
                </div>
              </div>
              <div>
                <h4 className="text-xl font-medium text-gray-800 text-gray-800 mb-2">3.3 Tài khoản khách hàng không được xóa khỏi hệ thống</h4>
                <div className="text-base leading-relaxed">
                  Khi khách hàng đăng ký tại <strong>Viqium</strong> cung cấp email và số điện thoại để xác minh, <strong>Viqium</strong> sẽ không xóa tài khoản trên database dù khách có dừng gói dịch vụ. Chúng tôi làm điều này để tránh những trường hợp hack dịch vụ.
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">4. Sử dụng Viqium</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-xl font-medium text-gray-800 text-gray-800 mb-2">4.1 Sử dụng được phép</h4>
                <div className="text-base leading-relaxed">
                  Bạn có thể sử dụng <strong>Viqium</strong> cho mục đích dự định của nó, đó là tăng cường hỗ trợ và tương tác của khách hàng. Điều này bao gồm việc sử dụng các tính năng và công cụ hỗ trợ AI của nền tảng như được mô tả trong tài liệu của chúng tôi.
                </div>
              </div>
              <div>
                <h4 className="text-xl font-medium text-gray-800 text-gray-800 mb-2">4.2 Hoạt động bị cấm</h4>
                <div className="text-base leading-relaxed">
                  Bạn đồng ý không tham gia vào bất kỳ hoạt động nào là bất hợp pháp, có hại hoặc vi phạm quyền của người khác khi sử dụng <strong>Viqium</strong>. Điều này bao gồm nhưng không giới hạn ở việc gửi thư rác, phát tán phần mềm độc hại hoặc vi phạm quyền sở hữu trí tuệ.
                </div>
              </div>
              <div>
                <h4 className="text-xl font-medium text-gray-800 text-gray-800 mb-2">4.3 Trách nhiệm nội dung kịch bản</h4>
                <div className="text-base leading-relaxed">
                  Người dùng khi sử dụng <strong>Viqium</strong> phải đảm bảo có trách nhiệm nội dung kịch bản chatbot. Nội dung chatbot phải đảm bảo thuần phong mỹ tục, không có nội dung gây công kích, bạo động hay phản động. Nếu người dùng vi phạm những điều này sẽ bị khóa tài khoản vĩnh viễn.
                </div>
              </div>
              <div>
                <h4 className="text-xl font-medium text-gray-800 text-gray-800 mb-2">4.4 Hỗ trợ khách hàng sử dụng Viqium</h4>
                <div className="text-base leading-relaxed">
                  Hiện tại <strong>Viqium</strong> có 3 gói: cơ bản, nâng cao và doanh nghiệp. Về việc hỗ trợ kỹ thuật, chăm sóc khách hàng, kế toán bạn có thể liên hệ gửi Ticket để nhận hỗ trợ từ <strong>Viqium</strong>.<br /><br />
                  <em>Ghi chú: Đối với gói doanh nghiệp được tạo group support đội ngũ Viqium 1:1 theo sự ưu tiên.</em>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">5. Đăng ký và thanh toán</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-xl font-medium text-gray-800 text-gray-800 mb-2">5.1 Gói đăng ký</h4>
                <div className="text-base leading-relaxed">
                  <strong>Viqium</strong> cung cấp nhiều gói đăng ký khác nhau, mỗi gói có các tính năng và giá riêng. Khi đăng ký một gói, bạn đồng ý trả các khoản phí liên quan như mô tả trên trang web của chúng tôi.
                </div>
              </div>
              <div>
                <h4 className="text-xl font-medium text-gray-800 text-gray-800 mb-2">5.2 Thanh toán</h4>
                <div className="text-base leading-relaxed">
                  Thanh toán được xử lý thông qua bộ xử lý thanh toán của bên thứ ba an toàn. Bạn đồng ý cung cấp thông tin thanh toán chính xác và ủy quyền cho chúng tôi hoặc bộ xử lý thanh toán của chúng tôi tính phí theo phương thức thanh toán bạn đã chọn.
                </div>
              </div>
              <div>
                <h4 className="text-xl font-medium text-gray-800 text-gray-800 mb-2">5.3 Hủy bỏ</h4>
                <div className="text-base leading-relaxed">
                  Bạn có thể hủy đăng ký bất kỳ lúc nào và quyền truy cập <strong>Viqium</strong> của bạn sẽ tiếp tục cho đến khi kết thúc chu kỳ thanh toán hiện tại. Sẽ không hoàn lại tiền cho các giai đoạn đăng ký một phần.
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">6. Quyền riêng tư và bảo mật dữ liệu</h3>
            <div className="text-base leading-relaxed">
              <strong>Viqium</strong> coi trọng quyền riêng tư và bảo mật dữ liệu của bạn. Chính sách quyền riêng tư của chúng tôi nêu rõ cách chúng tôi thu thập, sử dụng và bảo vệ thông tin cá nhân của bạn. Vui lòng xem lại Chính sách quyền riêng tư của chúng tôi để hiểu chi tiết về các hoạt động của chúng tôi.
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">7. Chấm dứt dịch vụ</h3>
            <div className="text-base leading-relaxed">
              <strong>Viqium</strong> có toàn quyền chấm dứt hoặc tạm ngừng quyền truy cập của bạn vào các dịch vụ của chúng tôi mà không cần thông báo trước nếu bạn vi phạm các Điều khoản sử dụng này hoặc bất kỳ lý do nào khác mà chúng tôi cho là phù hợp.
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">8. Tuyên bố từ chối bảo hành</h3>
            <div className="text-base leading-relaxed">
              <strong>Viqium</strong> cung cấp các dịch vụ của mình 'nguyên trạng' và 'khi có sẵn'. Chúng tôi không đưa ra bất kỳ bảo đảm nào, dù là rõ ràng hay ngụ ý, về tính chính xác, độ tin cậy hoặc tính khả dụng của các dịch vụ của chúng tôi. Việc bạn sử dụng <strong>Viqium</strong> là do bạn tự chịu rủi ro.
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">9. Giới hạn trách nhiệm</h3>
            <div className="text-base leading-relaxed">
              <strong>Viqium</strong> sẽ không chịu trách nhiệm đối với bất kỳ thiệt hại gián tiếp, ngẫu nhiên, đặc biệt hoặc thiệt hại do hậu quả phát sinh từ hoặc liên quan đến việc bạn sử dụng dịch vụ của chúng tôi, ngay cả khi chúng tôi đã được thông báo về khả năng xảy ra những thiệt hại đó.
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">10. Luật điều chỉnh</h3>
            <div className="text-base leading-relaxed">
              Các Điều khoản sử dụng này được quản lý và diễn giải theo luật pháp của [Khu vực pháp lý của bạn], mà không tính đến các nguyên tắc xung đột luật pháp của khu vực đó.
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">11. Liên hệ với chúng tôi</h3>
            <div className="text-base leading-relaxed">
              Nếu bạn có bất kỳ câu hỏi, mối quan tâm hoặc phản hồi nào liên quan đến Điều khoản sử dụng này hoặc các dịch vụ của chúng tôi, vui lòng liên hệ với chúng tôi theo địa chỉ <a href="mailto:cskh@viqium.ai" className="text-blue-600 hover:underline dark:text-blue-400">cskh@viqium.ai</a>.<br /><br />
              Bằng cách sử dụng <strong>Viqium</strong>, bạn thừa nhận rằng bạn đã đọc, hiểu và đồng ý với các Điều khoản sử dụng này. Chúng tôi hy vọng bạn thấy <strong>Viqium</strong> là một công cụ hữu ích để tăng cường sự tương tác với khách hàng và các nỗ lực hỗ trợ của bạn.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}