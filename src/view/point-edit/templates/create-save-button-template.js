const ButtonName = {
  SAVE: `Save`,
  SAVING: `Saving...`,
};

export const createSaveButtonTemplate = (isDisabledSaveButton, isSaving) => {
  return (
    `<button
      class="event__save-btn  btn  btn--blue"
      type="submit"
      ${isDisabledSaveButton ? `disabled` : ``}
    >
      ${isSaving ? ButtonName.SAVING : ButtonName.SAVE}
    </button>`
  );
};
