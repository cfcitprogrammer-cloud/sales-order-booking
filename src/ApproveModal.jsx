export default function ApproveModal({ message, onConfirm }) {
  const closeModal = () => {
    // Close the modal by calling the close method on the dialog element
    document.getElementById("my_modal").close();
  };

  return (
    <>
      <dialog
        id="my_modal"
        className="modal w-screen h-screen flex justify-center items-center"
      >
        <div className="modal-box">
          <h3 className="font-bold text-lg">Hold up!</h3>
          <div className="divider"></div>
          <p>{message}</p> {/* Display the dynamic message passed as prop */}
          <div className="modal-action">
            <button className="btn" onClick={closeModal}>
              Close
            </button>
            <button
              className="btn btn-primary"
              onClick={() => {
                onConfirm(); // Run the action passed from the parent component
                closeModal(); // Close the modal after confirming
              }}
            >
              Confirm
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
