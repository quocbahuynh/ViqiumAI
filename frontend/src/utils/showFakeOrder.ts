// Họ phổ biến + mở rộng
const lastNames = [
  "Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Huỳnh", "Võ", "Đinh", "Đặng", "Bùi",
  "Đỗ", "Phan", "Trịnh", "Lâm", "Tạ", "Tô", "Dương", "Cao", "Mai", "La",
  "Châu", "Lý", "Quách", "Tăng", "Tống", "Triệu", "Hà", "Tưởng", "Thái", "Kiều"
];

// Tên đệm nam
const middleNamesMale = [
  "Văn", "Hữu", "Minh", "Gia", "Anh", "Quốc", "Trọng", "Đức", "Xuân", "Thành",
  "Chí", "Khắc", "Nhật", "Tiến", "Tuấn", "Tấn", "Việt", "Hoàng", "Thiện", "Phúc"
];

// Tên chính nam
const firstNamesMale = [
  "An", "Hiếu", "Tuấn", "Hưng", "Tùng", "Dũng", "Khánh", "Nam", "Long", "Kiệt",
  "Cường", "Bảo", "Vinh", "Huy", "Phong", "Hoàng", "Trung", "Đạt", "Duy", "Thiện",
  "Toàn", "Phát", "Quân", "Lộc", "Hải", "Sơn", "Hòa", "Khoa", "Hạnh", "Tâm"
];

// Tên đệm nữ
const middleNamesFemale = [
  "Thị", "Ngọc", "Thu", "Cẩm", "Mỹ", "Bích", "Diễm", "Hồng", "Minh", "Quỳnh",
  "Thúy", "Tuyết", "Hạ", "Xuân", "Như", "Thanh", "Phương", "Trúc", "Lan", "Mai"
];

// Tên chính nữ
const firstNamesFemale = [
  "Lan", "Mai", "Yến", "Hà", "Trang", "Kim", "Hương", "Nhung", "Huyền", "Trinh",
  "Hoa", "Tuyết", "Thảo", "Diệu", "Thắm", "Ánh", "Dung", "Diễm", "Vân", "Lệ",
  "Nga", "Loan", "Hạnh", "Oanh", "Châu", "Quỳnh", "Sen", "Huệ", "Ly", "Thư"
];


function getRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateFakeNames(count: number): string[] {
  const names: string[] = [];

  for (let i = 0; i < count / 2; i++) {
    const fullName = `${getRandom(lastNames)} ${getRandom(middleNamesMale)} ${getRandom(firstNamesMale)}`;
    names.push(fullName);
  }

  for (let i = 0; i < count / 2; i++) {
    const fullName = `${getRandom(lastNames)} ${getRandom(middleNamesFemale)} ${getRandom(firstNamesFemale)}`;
    names.push(fullName);
  }

  return names;
}

export const fakeNames = generateFakeNames(200);


export function maskName(name: string): string {
    if (name.length <= 2) return name[0] + '*';
    const first = name[0];
    const last = name[name.length - 1];
    const middle = '*'.repeat(name.length - 2);
    return `${first}${middle}${last}`;
}