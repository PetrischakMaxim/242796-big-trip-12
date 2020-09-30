const ButtonName = {
  CANCEL: `Cancel`,
  DELETING: `Deleting...`,
  DELETE: `Delete`,
};

const getDeleteCaption = (isDeleting) => `${
  isDeleting ? ButtonName.DELETING : ButtonName.DELETE
}`;

export const createResetButtonTemplate = (isAddMode, isDeleting, isDisabled) => {
  return (
    `<button
      class="event__reset-btn"
      type="reset"
      ${isDisabled ? `disabled` : ``}
    >
      ${isAddMode ? ButtonName.CANCEL : getDeleteCaption(isDeleting)}
    </button>`
  );
};
