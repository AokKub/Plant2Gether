const getFixedTime = async (reminderTime: string) => {
  const [hours, minutes] = reminderTime.split(":");
  const fixedDateTime = new Date(
    Date.UTC(1970, 0, 1, parseInt(hours), parseInt(minutes)),
  );
  return fixedDateTime;
};

export { getFixedTime };
