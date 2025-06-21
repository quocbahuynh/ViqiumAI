export interface GuideStep {
  id?: string
  number?: number
  title?: string
  description?: string
  content: string[]
  subSteps?: {
    title: string
    items: string[]
  }[]
  image?: string
  tips?: string[]
}

export interface Guide {
  id: string
  title: string
  coverImage: string
  author: string
  date: string
  
  category: string
  slug: string
  steps: number
  duration: string
  tags: string[]
  steps_content: GuideStep[]
}

export const mockGuides: Guide[] = [
  {
    id: "1",
    title: "Hướng Dẫn Kết Nối AI với Facebook Fanpage",
    coverImage: "/images/chatbot/facebook-ai-setup.png",
    author: "Huỳnh Bá Quốc",
    date: "May 10, 2025",
    category: " Kết Nối AI với Facebook Fanpage",
    slug: "huong-dan-ket-noi-ai-voi-facebook-fanpage",
    steps: 6,
    duration: "5 phút đọc",
    tags: ["AI", "Chatbot", "Facebook", "Fanpage", "Automation"],
    steps_content: [
      {
        id: "step-0",
        number: 0,
        title: "Mô tả tính năng",
        content: ["Nền tảng của chúng tôi cho phép bạn tạo và quản lý nhiều dự án AI, mỗi dự án có thể kết nối với một Facebook Fanpage để AI tự động trả lời tin nhắn từ khách hàng, dựa trên dữ liệu sản phẩm, khuyến mãi, thông tin doanh nghiệp mà bạn đã soạn sẵn."],
      },
      {
        id: "step-1",
        number: 1,
        title: "Tạo Dự Án AI Mới",
        content: [],
        subSteps: [
          {
            title: "Các bước thực hiện:",
            items: [
              "Bỏ qua bước này nếu đã có dự án sẵn",
              "Vào mục 'Quản lý dự án' trên thanh menu",
              "Nhấn 'Tạo AI'",
              "Nhập tên dự án, chọn ngành nghề đang kinh doanh",
              "Sau khi tạo, bạn sẽ được chuyển đến giao diện quản lý chi tiết của dự án"
            ]
          }
        ],
      },
      {
        id: "step-2",
        number: 2,
        title: "Kết Nối Facebook Fanpage",
        content: [],
        subSteps: [
          {
            title: "Tại trang quản lý dự án:",
            items: [
              "Ở giao diện bên trái của trang quản lý dự án, bạn sẽ thấy một danh sách các mục",
              "Kéo xuống phía dưới, bạn sẽ thấy nút 'Kết nối Fanpage'",
              "Nhấn vào nút này để bắt đầu quá trình kết nối"
            ]
          }
        ]
      },
      {
        id: "step-3",
        number: 3,
        title: "Cấp Quyền Truy Cập Facebook",
        content: ["Hệ thống sẽ hiển thị các bước cấp quyền một cách chi tiết và dễ hiểu."],
        subSteps: [
          {
            title: "1. Chọn Trang bạn muốn kết nối với Viqium:",
            items: [
              "Tích chọn: 'Chọn áp dụng cho tất cả Trang hiện tại và tương lai'",
              "Nhấn 'Tiếp tục'"
            ]
          },
          {
            title: "2. Chọn Doanh nghiệp bạn muốn cấp quyền truy cập:",
            items: [
              "Tích chọn: 'Chọn áp dụng cho tất cả Doanh nghiệp hiện tại và tương lai'",
              "Nhấn 'Tiếp tục'"
            ]
          },
          {
            title: "3. Xác nhận quyền truy cập mà Viqium yêu cầu:",
            items: [
              "Nhấn 'Lưu' để hoàn tất"
            ]
          }
        ],
      },
      {
        id: "step-4",
        number: 4,
        title: "Chọn Fanpage Cần Kết Nối",
        content: [
          "Hệ thống sẽ hiển thị các bước cấp quyền như sau:"
        ],
        subSteps: [
          {
            title: "Các bước thực hiện:",
            items: [
              "Sau khi nhấn 'Đã hiểu', hệ thống sẽ hiển thị danh sách các fanpage bạn có quyền quản lý",
              "Nhấn nút 'Kết nối' tại fanpage mà bạn muốn liên kết với dự án AI hiện tại",
              "Chờ hệ thống xác nhận kết nối thành công"
            ]
          }
        ],
      },
      {
        id: "step-5",
        number: 5,
        title: "Chuẩn Bị Dữ Liệu Cho AI",
        content: [
          "Sau khi kết nối fanpage, bạn cần chuẩn bị các dữ liệu sau để AI có thể tự động trả lời khách hàng chính xác nhất. Hãy lần lượt truy cập vào từng mục và làm theo hướng dẫn:"
        ],
        subSteps: [
          {
            title: "Các loại dữ liệu cần chuẩn bị:",
            items: [
              "Tạo sản phẩm",
              "Tạo khuyến mãi ",
              "Huấn Luyện AI",
              "Tạo thông tin cửa hàng",
              "Tích hợp Website"
            ]
          }
        ],
        tips: [
          "Bắt đầu với dữ liệu cơ bản nhất trước, sau đó mở rộng dần",
          "Thường xuyên cập nhật và bổ sung dữ liệu mới",
          "Test chatbot với các câu hỏi thực tế từ khách hàng",
          "Theo dõi và phân tích hiệu quả phản hồi để cải thiện"
        ]
      }
    ]
  },
  {
    id: "2",
    title: "Hướng Dẫn Tạo Sản Phẩm",
    coverImage:  "/images/guide/product1.png",
    author: "Huỳnh Bá Quốc",
    date: "May 12, 2025",
    category: "Tạo dữ liệu sản phẩm cho AI",
    slug: "huong-dan-tao-san-pham",
    steps: 3,
    duration: "5 phút đọc",
    tags: ["AI", "Sản phẩm", "Automation", "Facebook", "Chatbot"],
    steps_content: [
      {
        id: "step-0",
        number: 0,
        title: "Mô tả tính năng",
        content: [
          "Việc thêm sản phẩm là bước quan trọng để AI có thể giới thiệu đúng sản phẩm cho khách hàng khi họ gửi tin nhắn vào fanpage."]
      },
      {
        id: "step-1",
        number: 1,
        title: "Chọn Mục 'Sản Phẩm'",
        content: [],
        image: "/images/guide/product1.png",

        subSteps: [
          {
            title: "",
            items: [
              "Truy cập vào dự án AI bạn muốn thêm sản phẩm.",
              "Ở cột bên trái, chọn mục 'Sản phẩm'.",
              "Sau đó nhấn 'Thêm sản phẩm'."
            ]
          }
        ]
      },
      {
        id: "step-2",
        number: 2,
        title: "Nhập Thông Tin Sản Phẩm",
        content: [],
                image: "/images/guide/product2.png",

        subSteps: [
          {
            title: "1. Hình ảnh sản phẩm (không bắt buộc nhưng nên có):",
            items: [
              "Tải lên hình ảnh đại diện của sản phẩm (hỗ trợ JPG, PNG...).",
              "Nếu có ảnh, AI có thể nhận diện sản phẩm khi khách gửi hình.",
              "Ảnh giúp fanpage hiển thị đẹp hơn khi AI giới thiệu sản phẩm.",
              "Mẹo: Dùng ảnh rõ nét, nền trắng, sản phẩm nằm trung tâm."
            ]
          },
          {
            title: "2. Tên sản phẩm:",
            items: [
              "Là tiêu đề giúp AI gọi đúng tên sản phẩm.",
              "Ví dụ: 'Áo sơ mi trắng tay dài', 'Balo học sinh Hami 2024'.",
              "Mẹo: Tên càng cụ thể, AI càng dễ nhận diện."
            ],
          },
          {
            title: "3. Mô tả sản phẩm:",
            items: [
              "Mô tả chi tiết đặc điểm sản phẩm: chất liệu, công dụng, hướng dẫn sử dụng.",
              "Có thể thêm tư vấn size như: 'Size M phù hợp chiều cao từ 1m55–1m65'.",
              "AI sử dụng mô tả này để tư vấn chính xác hơn khi khách hỏi."
            ]
          },
          {
            title: "4. Giá cơ bản:",
            items: [
              "Là giá chung nếu sản phẩm không có phân loại (size, màu...).",
              "Nếu có phân loại, cấu hình giá ở bảng phân loại riêng.",
              "Mẹo: Nếu chưa có giá cố định, bạn có thể nhập 'Liên hệ'."
            ]
          }
        ]
      },
      {
        id: "step-3",
        number: 3,
        title: "Thêm Sản Phẩm",
        content: [],
        subSteps: [
          {
            title: "",
            items: [
              "Sau khi nhập đầy đủ thông tin, nhấn nút 'Thêm sản phẩm'.",
              "Sản phẩm sẽ được lưu vào hệ thống và AI có thể giới thiệu khi khách hàng nhắn tin."
            ]
          }
        ]
      }
    ]
  },
  {
    id: "3",
    title: "Hướng Dẫn Tạo Phân Loại Sản Phẩm",
    coverImage:  "/images/guide/product3.png",
    author: "Huỳnh Bá Quốc",
    date: "May 13, 2025",
    category: "Tạo dữ liệu sản phẩm cho AI",
    slug: "huong-dan-tao-phan-loai-san-pham",
    steps: 5,
    duration: "5 phút đọc",
    tags: ["AI", "Sản phẩm", "Phân loại", "Automation", "Facebook"],
    steps_content: [
      {
        id: "step-0",
        number: 0,
        title: "Mô tả tính năng",
        content: [],
        subSteps: [
          {
            title: "Tính năng này dùng để:",
            items: [
              "Tạo ra các phiên bản khác nhau của sản phẩm như màu sắc, kích cỡ, giới tính,...",
              "Mỗi phân loại có thể có giá riêng, ảnh riêng và mô tả riêng.",
              "Giúp AI trả lời chính xác hơn dựa trên nhu cầu cụ thể của khách hàng."
            ]
          }
        ]
      },
      {
        id: "step-1",
        number: 1,
        title: "Hiểu về Phân Loại Sản Phẩm",
        content: [],
        subSteps: [
          {
            title: "Ví dụ về phân loại:",
            items: [
              "Áo thun màu đỏ, size XL",
              "Áo thun màu vàng, size L",
              "Áo thun màu xanh, size M"
            ]
          },
          {
            title: "Mỗi phân loại có thể:",
            items: [
              "Có giá bán khác nhau",
              "Có hình ảnh riêng biệt"
            ]
          },
          {
            title: "AI sử dụng phân loại để:",
            items: [
              "So sánh ảnh khách gửi với ảnh trong từng phân loại",
              "Phản hồi chính xác dựa trên mô tả như 'áo đỏ size XL'",
              "Tư vấn size dựa trên chiều cao/cân nặng của khách"
            ]
          }
        ]
      },
      {
        id: "step-2",
        number: 2,

        image: "/images/guide/product3.png",
        title: "Chọn Thuộc Tính Phân Loại",
        content: [],
        subSteps: [
          {
            title: "Bạn có thể chọn tối đa 2 thuộc tính:",
            items: [
              "Ví dụ: Màu sắc (Đỏ, Vàng, Xanh), Size (S, M, L, XL)",
              "Hoặc các thuộc tính khác: Giới tính (Nam, Nữ), Chiều dài (1m2, 1m6,...)",
              "Không bắt buộc phải là Size và Màu sắc — bạn tự do chọn thuộc tính phù hợp với sản phẩm của mình"
            ]
          },
          {
            title: "Nếu tên hoặc giá trị không có sẵn:",
            items: [
              "Nhập thủ công tên thuộc tính hoặc giá trị",
              "Gõ tên và nhấn Enter để thêm mới vào hệ thống"
            ]
          }
        ]
      },
      {
        id: "step-3",
        number: 3,
                image: "/images/guide/product4.png",

        title: "Điền Thông Tin Cho Từng Phân Loại",
        content: [],
        subSteps: [
          {
            title: "Sau khi chọn thuộc tính, hệ thống sẽ tạo bảng phân loại:",
            items: [
              "Bạn điền giá bán cho từng phiên bản",
              "Tải hình ảnh (nếu có)",
              "Thêm ghi chú để AI hiểu chi tiết hơn từng phiên bản"
            ]
          }
        ]
      },
      {
        id: "step-4",
        number: 4,
        title: "Lưu Phân Loại",
        content: [],
        subSteps: [
          {
            title: "Hoàn tất và lưu:",
            items: [
              "Nhấn 'Thêm sản phẩm' để lưu các phân loại vào hệ thống",
              "AI sẽ dùng phân loại để tư vấn chính xác cho khách khi cần thiết"
            ]
          }
        ]
      }
    ]
  },
  {
    id: "4",
    title: "Hướng Dẫn Huấn Luyện AI",
    coverImage: "/images/guide/ai.png",
    author: "Huỳnh Bá Quốc",
    date: "May 14, 2025",
    category: "Tạo dữ liệu AI",
    slug: "huong-dan-huan-luyen-ai",
    steps: 4,
    duration: "7 phút đọc",
    tags: ["AI", "Huấn luyện", "Tư vấn", "Fanpage", "Automation"],
    steps_content: [
      {
        id: "step-0",
        number: 0,
        title: "Mô tả tính năng",
        content: [],
        subSteps: [
          {
            title: "Chức năng này cho phép bạn:",
            items: [
              "Truyền đạt kiến thức và hướng dẫn cho AI thông qua hội thoại",
              "Dạy AI cách phản hồi khách hàng theo cách bán hàng của bạn",
              "Ghi nhớ thông tin sản phẩm, chương trình khuyến mãi, kiến thức ngành,..."
            ]
          }
        ]
      },
      {
        id: "step-1",
        number: 1,
        title: "Cách Truy Cập Tính Năng Huấn Luyện",
        content: [],
        subSteps: [
          {
            title: "Các bước thực hiện:",
            items: [
              "Ở cột bên trái trong trang quản lý dự án, chọn 'Huấn luyện AI'",
              "Bạn sẽ thấy một khung trò chuyện trực tiếp với AI",
              "Gõ các lời khuyên, kiến thức bạn muốn truyền đạt vào ô chat"
            ]
          },
          {
            title: "Lưu ý:",
            items: [
              "Lời khuyên sau khi được ghi nhận sẽ hiển thị trong mục 'Bộ nhớ AI'",
              "Bạn có thể xem lại, chỉnh sửa hoặc xóa lời huấn luyện bất kỳ lúc nào"
            ]
          }
        ]
      },
      {
        id: "step-2",
        number: 2,
        title: "Cách Truyền Đạt Lời Khuyên",
        content: [],
        subSteps: [
          {
            title: "Nên bắt đầu lời huấn luyện bằng:",
            items: [
              "'Bạn hãy...' – yêu cầu hành động",
              "'Bạn nên...' – gợi ý cách tư vấn",
              "'Bạn nhớ rằng...' – cung cấp thông tin cố định",
              "'Bạn cần biết rằng...' – thông tin quan trọng",
              "'Hãy luôn nhớ...' – nhấn mạnh điều cần thiết"
            ]
          },
          {
            title: "Lưu ý:",
            items: [
              "Nên huấn luyện từng ý ngắn, rõ ràng",
              "Tránh viết dài dòng hoặc mơ hồ",
              "Bạn có thể chia nhiều lời khuyên cho cùng một chủ đề"
            ]
          }
        ]
      },
      {
        id: "step-3",
        number: 3,
        title: "Ví Dụ Huấn Luyện Theo Từng Chủ Đề",
        content: [],
        subSteps: [
          {
            title: "Tư vấn size:",
            items: [
              "Bạn hãy gợi ý size M cho khách cao từ 1m55–1m65, nặng 48–54kg",
              "Bạn nên hỏi lại chiều cao – cân nặng nếu khách chưa cung cấp",
              "Bạn nhớ rằng form áo oversize thường rộng hơn 1–2 size so với áo thường"
            ]
          },
          {
            title: "Cách nói chuyện với khách:",
            items: [
              "Bạn nên luôn gọi khách là 'chị' hoặc 'anh' để tạo sự lịch sự",
              "Bạn hãy cảm ơn khách mỗi khi họ đồng ý mua hàng hoặc hỏi thêm",
              "Bạn hãy dùng ngôn từ thân thiện, ví dụ: 'Em giới thiệu chị mẫu này mới về nha!'"
            ]
          },
          {
            title: "Gợi ý sản phẩm:",
            items: [
              "Bạn hãy gợi ý quần jean form suông cho khách dáng tròn, thấp",
              "Bạn nên giới thiệu sản phẩm mới nhất trước nếu khách chưa biết chọn gì",
              "Bạn nhớ rằng váy dáng chữ A giúp tôn dáng cho người eo lớn"
            ]
          },
          {
            title: "Khuyến mãi – ưu đãi:",
            items: [
              "Bạn hãy thông báo chương trình 'Mua 2 tặng 1' đang diễn ra",
              "Bạn nhớ rằng đơn hàng trên 500.000đ được miễn phí vận chuyển",
              "Bạn nên đề xuất thêm phụ kiện nhỏ khi khách chọn áo"
            ]
          },
          {
            title: "Chất liệu – thời tiết:",
            items: [
              "Bạn hãy giới thiệu chất liệu cotton lạnh cho mùa hè",
              "Bạn nhớ rằng vải len phù hợp cho mùa đông và có thể co giãn nhẹ",
              "Bạn nên gợi ý vải lụa nếu khách cần trang phục đi tiệc"
            ]
          }
        ]
      }
    ]
  },
  {
    id: "5",
    title: "Hướng Dẫn Tạo Thông Tin Cửa Hàng",
    coverImage: "/images/guide/information.png",           
    author: "Huỳnh Bá Quốc",
    date: "May 15, 2025",
    category: "Tạo dữ liệu AI",
    slug: "huong-dan-tao-thong-tin-cua-hang",
    steps: 3,
    duration: "6 phút đọc",
    tags: ["AI", "Thông tin cửa hàng", "Thương hiệu", "Chatbot"],
    steps_content: [
      {
        id: "step-0",
        number: 0,
        title: "Mô tả tính năng",
        content: [],
        subSteps: [
          {
            title: "Tính năng này giúp bạn:",
            items: [
              "Giới thiệu thương hiệu một cách chuyên nghiệp",
              "Cung cấp thông tin cho AI để phản hồi các câu hỏi như: 'Shop ở đâu?', 'Thương hiệu này là gì?'",
              "Tăng độ tin cậy và hiểu biết của AI về phong cách, đối tượng khách hàng và sản phẩm của bạn"
            ]
          }
        ]
      },
      {
        id: "step-1",
        number: 1,
        title: "Truy Cập Trang Cửa Hàng",
        content: [],
        subSteps: [
          {
            title: "Các bước thực hiện:",
            items: [
              "Truy cập vào trang quản lý dự án",
              "Trong thanh menu bên trái, chọn mục 'Trang cửa hàng'",
              "Tại đây sẽ hiển thị khung soạn thảo có sẵn sườn nội dung mẫu"
            ]
          }
        ]
      },
      {
        id: "step-2",
        number: 2,
        title: "Chỉnh Sửa Nội Dung Mẫu",
        content: [],
        image: "/images/guide/information.png",
        subSteps: [
          {
            title: "Sườn bài mẫu gợi ý:",
            items: [
              "[Tên thương hiệu] được thành lập vào năm [năm thành lập], chuyên cung cấp sản phẩm thời trang [đối tượng khách hàng] theo phong cách [phong cách].",
              "Trụ sở tại [địa điểm], phục vụ khách hàng [miêu tả khách hàng mục tiêu].",
              "Danh mục sản phẩm chính: [liệt kê sản phẩm].",
              "Nguồn gốc sản phẩm: [thiết kế độc quyền / nhập khẩu], đảm bảo [chất lượng].",
              "Kênh bán hàng hiện tại: [Facebook, TikTok, Shopee,...], đang phát triển thêm [nếu có].",
              "Mục tiêu sắp tới: [mở rộng, ra mắt BST mới, xây dựng website,...] trong [thời gian]."
            ]
          },
          {
            title: "Mẹo chỉnh sửa:",
            items: [
              "Giữ nguyên cấu trúc để AI hiểu rõ mạch thông tin",
              "Nếu chưa có thông tin cụ thể, bạn có thể để trống và cập nhật sau",
              "Viết súc tích, đúng phong cách thương hiệu"
            ]
          },
          {
            title: "Lợi ích khi cập nhật đầy đủ:",
            items: [
              "AI hiểu rõ phong cách và sản phẩm → tư vấn chính xác hơn",
              "Thương hiệu trở nên chuyên nghiệp và nhất quán",
              "Khách hàng tin tưởng hơn khi tương tác với chatbot"
            ]
          }
        ]
      }
    ]
  },
  {
    id: "6",
    title: "Hướng Dẫn Kiểm Tra Đơn Hàng",
    coverImage: "/images/guide/bill.png",
    author: "Huỳnh Bá Quốc",
    date: "May 16, 2025",
    category: "Quản lý đơn hàng",
    slug: "huong-dan-kiem-tra-don-hang",
    steps: 3,
    duration: "3 phút đọc",
    tags: ["AI", "Đơn hàng", "Thông báo", "Quản lý", "Ecommerce"],
    steps_content: [
      {
        id: "step-0",
        number: 0,
        title: "Mô tả tính năng",
        content: [],
        subSteps: [
          {
            title: "Tính năng này cho phép bạn:",
            items: [
              "Nhận thông báo đơn hàng mới từ AI ngay sau khi chốt đơn",
              "Xem danh sách đơn hàng trong hệ thống quản lý",
              "Truy cập chi tiết từng đơn để xử lý nhanh chóng"
            ]
          }
        ]
      },
      {
        id: "step-1",
        number: 1,
        title: "Nhận Thông Báo Đơn Hàng Mới Qua Email",
        content: [],
        subSteps: [
          {
            title: "Thông tin trong email bao gồm:",
            items: [
              "Tên khách hàng",
              "Sản phẩm đã đặt",
              "Tổng tiền đơn hàng",
              "Ghi chú (nếu có)"
            ]
          },
          {
            title: "Gợi ý:",
            items: [
              "Kiểm tra hòm thư chính hoặc thư rác nếu không thấy email",
              "Email sẽ được gửi đến địa chỉ đã dùng khi đăng ký tài khoản"
            ]
          }
        ]
      },
      {
        id: "step-2",
        number: 2,
        title: "Xem Danh Sách & Chi Tiết Đơn Hàng Trên Hệ Thống",
        content: [],
        subSteps: [
          {
            title: "Các bước thực hiện:",
            items: [
              "Truy cập trang quản lý dự án",
              "Chọn mục 'Đơn hàng' từ thanh menu bên trái",
              "Danh sách các đơn hàng sẽ hiển thị theo thứ tự thời gian"
            ]
          },
          {
            title: "Xem chi tiết đơn hàng:",
            items: [
              "Nhấn vào một đơn hàng để xem chi tiết",
              "Thông tin hiển thị gồm: mã đơn, thời gian đặt, danh sách sản phẩm, tổng tiền, ghi chú"
            ]
          }
        ]
      }
    ]
  },
  {
    id: "7",
    title: "Hướng Dẫn Tạo Khuyến Mãi",
    coverImage: "/images/guide/voucher.png",
    author: "Huỳnh Bá Quốc",
    date: "May 17, 2025",
    category: "Khuyến mãi & Ưu đãi",
    slug: "huong-dan-tao-khuyen-mai",
    steps: 5,
    duration: "6 phút đọc",
    tags: ["AI", "Khuyến mãi", "Tăng đơn", "Marketing", "Tự động hóa"],
    steps_content: [
      {
        id: "step-0",
        number: 0,
        title: "Mô tả tính năng",
        image: "/images/guide/voucher.png",
        content: [],
        subSteps: [
          {
            title: "Tính năng này cho phép bạn:",
            items: [
              "Tạo nhiều loại khuyến mãi khác nhau để AI sử dụng khi tư vấn",
              "Áp dụng linh hoạt cho sản phẩm, phân loại, đơn hàng, combo",
              "Tăng tỉ lệ chốt đơn và giữ chân khách hiệu quả hơn"
            ]
          }
        ]
      },
      {
        id: "step-1",
        number: 1,
        title: "Giảm Giá Sản Phẩm",
        content: [],
        image: "/images/guide/voucher1.png",
        subSteps: [
          {
            title: "Hướng dẫn tạo khuyến mãi giảm giá:",
            items: [
              "Chọn sản phẩm cần giảm giá",
              "Chọn giảm theo phần trăm (%) hoặc số tiền cố định",
              "Cài đặt thời gian bắt đầu và kết thúc chương trình",
              "Có thể chọn áp dụng theo từng phân loại cụ thể (ví dụ: chỉ áp dụng cho size M)"
            ]
          },
          {
            title: "Ví dụ:",
            items: [
              "Giảm 20% cho tất cả áo sơ mi từ ngày 01/07 đến 07/07",
              "Giảm 50.000đ cho đầm ren trắng – size L"
            ]
          }
        ]
      },
      {
        id: "step-2",
        number: 2,
        image: "/images/guide/voucher2.png",
        title: "Quà Tặng Khi Mua Hàng",
        content: [],
        subSteps: [
          {
            title: "Hướng dẫn thiết lập quà tặng:",
            items: [
              "Chọn sản phẩm làm quà tặng",
              "Cài đặt điều kiện áp dụng (ví dụ: đơn từ 300.000đ trở lên hoặc khi mua sản phẩm A)",
              "Có thể tạo nhiều mức quà tặng theo giá trị đơn hàng"
            ]
          },
          {
            title: "Ví dụ:",
            items: [
              "Mua bất kỳ áo khoác nào, tặng ngay 1 túi tote",
              "Đơn hàng từ 500.000đ tặng 1 chai xịt thơm mini"
            ]
          }
        ]
      },
      {
        id: "step-3",
        number: 3,
        image: "/images/guide/voucher3.png",
        title: "Mua Sỉ Giá Hời",
        content: [],
        subSteps: [
          {
            title: "Cách tạo chương trình mua sỉ:",
            items: [
              "Chọn sản phẩm áp dụng",
              "Thiết lập số lượng tối thiểu",
              "Cài đặt mức giá hoặc phần trăm giảm cho từng mốc mua",
              "Có thể tạo nhiều mốc mua sỉ khác nhau"
            ]
          },
          {
            title: "Ví dụ:",
            items: [
              "Mua 2 áo giảm 10%, mua 3 áo giảm 20%",
              "Mua từ 4 váy maxi trở lên, giá còn 199.000đ mỗi chiếc"
            ]
          }
        ]
      },
      {
        id: "step-4",
        number: 4,
        title: "Ưu Đãi Combo Tiết Kiệm",
        content: [],
        image: "/images/guide/voucher4.png",
        subSteps: [
          {
            title: "Hướng dẫn tạo combo:",
            items: [
              "Chọn từ 2 sản phẩm trở lên tạo thành combo",
              "Thiết lập giá đặc biệt cho combo",
              "Có thể giới hạn số lượng combo mỗi ngày hoặc mỗi tuần"
            ]
          },
          {
            title: "Ví dụ:",
            items: [
              "Combo 1: Áo sơ mi + Quần jeans chỉ 399.000đ",
              "Combo mùa hè: 1 đầm + 1 túi xách + 1 kính mát giá ưu đãi 599.000đ"
            ]
          }
        ]
      },
      {
        id: "step-5",
        number: 5,
        title: "Lưu Ý Khi Tạo Khuyến Mãi",
        content: [],
        subSteps: [
          {
            title: "Ghi nhớ:",
            items: [
              "Tên chương trình nên ngắn gọn, dễ hiểu",
              "Ghi rõ điều kiện áp dụng để AI tư vấn chính xác",
              "Có thể chạy nhiều chương trình cùng lúc, hệ thống sẽ tự ưu tiên"
            ]
          }
        ]
      }
    ]
  }
]

// Helper function to get guide by slug
export function getGuideBySlug(slug: string): Guide | undefined {
  return mockGuides.find((guide) => guide.slug === slug)
}

// Helper function to get all guides
export function getAllGuides(): Guide[] {
  return mockGuides
}

// Helper function to get guides by category
export function getGuidesByCategory(category: string): Guide[] {
  return mockGuides.filter((guide) => guide.category === category)
}
