export const getUserInitials = (fullName?: string): string => {
    if (!fullName || fullName.trim() === "") return "U"
    return fullName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }
  