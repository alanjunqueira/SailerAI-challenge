export const getInitials = (name: string, size = 2) => {
  const initials = name
    .split(" ")
    .map((word) => word[0])
    .join("");
  if (initials.length > size) {
    return initials.slice(0, size);
  }
  return initials;
};

export const createAvatarTag = (name: string) => {
  const sName = name.split(" ");
  const avatarName =
    sName.length === 1
      ? `${sName[0][0]}${sName[0][1]}`.toUpperCase()
      : `${sName[0][0]}${sName[1][0]}`.toUpperCase();

  return avatarName;
};
