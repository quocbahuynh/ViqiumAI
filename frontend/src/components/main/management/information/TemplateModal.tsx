"use client"

import type React from "react"
import { Modal } from "@/components/ui/modal"
import Button from "@/components/ui/button/Button"

interface TemplateModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectTemplate: (template: string) => void
}

const BUSINESS_TEMPLATES = [
  {
    id: "small",
    title: "Doanh nghiệp nhỏ",
    content: `<p>Chúng tôi là một doanh nghiệp nhỏ chuyên về [lĩnh vực kinh doanh], được thành lập vào năm [năm thành lập]. Với đội ngũ nhân viên tận tâm và chuyên nghiệp, chúng tôi tự hào cung cấp [sản phẩm/dịch vụ] chất lượng cao cho khách hàng.</p>
<p>Sứ mệnh của chúng tôi là [mô tả sứ mệnh], và chúng tôi luôn nỗ lực để đáp ứng mọi nhu cầu của khách hàng với phương châm [phương châm kinh doanh].</p>
<p>Với [số năm] kinh nghiệm trong ngành, chúng tôi cam kết mang đến những giải pháp tối ưu và hiệu quả nhất cho khách hàng.</p>`,
  },
  {
    id: "medium",
    title: "Doanh nghiệp vừa",
    content: `<p>Công ty [Tên công ty] là doanh nghiệp hàng đầu trong lĩnh vực [lĩnh vực kinh doanh], được thành lập từ năm [năm thành lập]. Trải qua [số năm] năm phát triển, chúng tôi đã xây dựng được một thương hiệu uy tín với hơn [số lượng] khách hàng trên toàn quốc.</p>
<p>Sản phẩm/dịch vụ chính của chúng tôi bao gồm:</p>
<ul>
  <li>[Sản phẩm/dịch vụ 1]</li>
  <li>[Sản phẩm/dịch vụ 2]</li>
  <li>[Sản phẩm/dịch vụ 3]</li>
</ul>
<p>Với đội ngũ [số lượng] nhân viên chuyên nghiệp và tận tâm, chúng tôi cam kết mang đến những sản phẩm/dịch vụ chất lượng cao nhất cho khách hàng. Tầm nhìn của chúng tôi là [tầm nhìn công ty], và chúng tôi luôn nỗ lực không ngừng để đạt được mục tiêu này.</p>`,
  },
  {
    id: "large",
    title: "Doanh nghiệp lớn",
    content: `<p>[Tên công ty] là tập đoàn kinh tế đa ngành với lịch sử phát triển hơn [số năm] năm trong lĩnh vực [lĩnh vực kinh doanh chính]. Được thành lập vào năm [năm thành lập], chúng tôi đã phát triển thành một trong những doanh nghiệp hàng đầu tại Việt Nam và khu vực.</p>
<p>Hiện nay, [Tên công ty] hoạt động trong các lĩnh vực:</p>
<ul>
  <li>[Lĩnh vực 1]</li>
  <li>[Lĩnh vực 2]</li>
  <li>[Lĩnh vực 3]</li>
  <li>[Lĩnh vực 4]</li>
</ul>
<p>Với hơn [số lượng] nhân viên làm việc tại [số lượng] chi nhánh trên toàn quốc và quốc tế, chúng tôi tự hào là đối tác tin cậy của [số lượng] khách hàng và đối tác trên toàn cầu.</p>
<p>Tầm nhìn của chúng tôi là [tầm nhìn công ty], và sứ mệnh của chúng tôi là [sứ mệnh công ty]. Các giá trị cốt lõi mà chúng tôi luôn đề cao bao gồm [các giá trị cốt lõi].</p>
<p>Chúng tôi cam kết tiếp tục đổi mới và phát triển để mang lại giá trị bền vững cho khách hàng, đối tác, nhân viên và cộng đồng.</p>`,
  },
]

const TemplateModal: React.FC<TemplateModalProps> = ({ isOpen, onClose, onSelectTemplate }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[600px] m-4">
      <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-6">
        <div className="px-2 mb-4">
          <h4 className="mb-2 text-xl font-semibold text-gray-800 dark:text-white/90">Chọn mẫu văn bản</h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Chọn một mẫu văn bản để bắt đầu, sau đó bạn có thể chỉnh sửa để phù hợp với doanh nghiệp của mình.
          </p>
        </div>

        <div className="space-y-4">
          {BUSINESS_TEMPLATES.map((template) => (
            <div
              key={template.id}
              className="p-4 border border-gray-200 rounded-lg hover:border-green-300 dark:border-gray-700 dark:hover:border-green-700 cursor-pointer transition-all"
              onClick={() => {
                onSelectTemplate(template.content)
                onClose()
              }}
            >
              <h5 className="mb-2 font-medium text-gray-800 dark:text-white">{template.title}</h5>
              <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3">
                {template.content.replace(/<[^>]*>/g, " ").substring(0, 150)}...
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end mt-6">
          <Button variant="outline" size="sm" onClick={onClose}>
            Hủy
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default TemplateModal
