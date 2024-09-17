export const emailChecker = (currEmail, oldEmail, meta) => {
  if (currEmail === oldEmail) {
    if (meta.touched || meta.error) {
      return true
    }
  }
}
