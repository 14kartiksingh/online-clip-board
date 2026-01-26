const { onDocumentDeleted } = require("firebase-functions/v2/firestore");
const admin = require("firebase-admin");

admin.initializeApp();

exports.deleteFileOnClipboardDelete = onDocumentDeleted(
  "clipboard/{code}",
  async (event) => {
    const data = event.data?.data();
    const code = event.params.code;

    if (!data || data.type !== "file" || !data.fileName) {
      return;
    }

    const bucket = admin.storage().bucket();
    const filePath = `files/${code}/${data.fileName}`;

    try {
      await bucket.file(filePath).delete();
      console.log("File deleted:", filePath);
    } catch (err) {
      console.error("Error deleting file:", err.message);
    }
  }
);
