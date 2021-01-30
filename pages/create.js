import { useState } from "react"; // State management
import Post from "@components/Post"; // Post content
import Dropzone from "react-dropzone"; // React dropzone upload
import { useRouter } from "next/router"; // Router
import Layout from "@components/Layout"; // Layout wrapper
import { web3 } from "@containers/index"; // Web3 container
import styles from "@styles/pages/Create.module.scss"; // Page styles

export default function Create() {
  const router = useRouter(); // Router navigation
  const [name, setName] = useState(""); // Media name
  const [share, setShare] = useState(null); // Media fee share with past owner
  const [upload, setUpload] = useState(null); // Uploaded file
  const [loading, setLoading] = useState(false); // Global loading state
  const [uploadName, setUploadName] = useState(""); // Uploaded file name
  const [uploadText, setUploadText] = useState(null); // Text content
  const [description, setDescription] = useState(""); // Media description

  // Global state
  const { address, authenticate, mintMedia } = web3.useContainer();

  /**
   * Authenticate dApp with global loading
   */
  const authenticateWithLoading = async () => {
    setLoading(true); // Toggle loading
    await authenticate(); // Authenticate
    setLoading(false); // Toggle loading
  };

  /**
   * Mint media with global loading
   */
  const mintWithLoading = async () => {
    setLoading(true); // Toggle loading

    try {
      await mintMedia(upload, name, description, share); // Mint media
      router.push("/success"); // Redirect to success page
    } catch (e) {
      console.log("Error when executing: ", e);
    }

    setLoading(false); // Toggle loading
  };

  /**
   * File upload handler
   * @param {File} file media
   */
  const dropHandler = async (file) => {
    // Save file
    const [File] = file;
    setUpload(File);

    // Update upload name
    const fileName = File.name;
    setUploadName(fileName);

    // Update text content if text file
    if (File.type.startsWith("text")) {
      const textContent = await File.text();
      setUploadText(textContent);
    }
  };

  return (
    <Layout>
      {!address ? (
        // If not authenticated, display unauthenticated state
        <div className={styles.create__unauthenticated}>
          <h2>Please authenticate</h2>
          <p>You must authorize with your wallet to mint media.</p>

          {/* Authenticate dApp */}
          <button onClick={authenticateWithLoading} disabled={loading}>
            {loading ? "Connecting..." : "Connect"}
          </button>
        </div>
      ) : (
        // Else, if authenticated, display grid
        <div className={styles.create}>
          <div className={styles.create__grid}>
            {/* Creation form */}
            <div className={styles.create__grid_left}>
              <h2>Create Media</h2>

              <div className={styles.create__upload}>
                <div>
                  {/* Media upload */}
                  <div>
                    <label htmlFor="upload">
                      Upload Media{" "}
                      <span className={styles.create__upload_required}>
                        (required)
                      </span>
                    </label>
                    <span>
                      Supports common image, video, audio, and text formats.
                    </span>
                    <Dropzone
                      // Restrict to maximum 1 upload
                      maxFiles={1}
                      // Restrict drozone to specific mimetypes
                      accept={[
                        "image/png",
                        "image/jpeg",
                        "image/gif",
                        "video/mp4",
                        "video/quicktime",
                        "audio/mpeg",
                        "audio/wav",
                        "text/plain",
                      ]}
                      // On file drop, run storkDropHandler
                      onDrop={(acceptedFiles) => dropHandler(acceptedFiles)}
                    >
                      {({ getRootProps, getInputProps }) => (
                        <section>
                          <div
                            className={styles.upload__field}
                            {...getRootProps()}
                          >
                            <input {...getInputProps()} />
                            <span>
                              {uploadName
                                ? uploadName
                                : "You can drag and drop file here."}
                            </span>
                          </div>
                        </section>
                      )}
                    </Dropzone>
                  </div>

                  {/* Media name */}
                  <div>
                    <label htmlFor="name">
                      Name{" "}
                      <span className={styles.create__upload_required}>
                        (required)
                      </span>
                    </label>
                    <input
                      id="name"
                      type="text"
                      placeholder="Enter Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  {/* Media description */}
                  <div>
                    <label htmlFor="description">Description</label>
                    <textarea
                      id="description"
                      type="text"
                      placeholder="Enter Description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>

                  {/* Media fee share percentage */}
                  <div>
                    <label htmlFor="percentage">
                      Creator share percentage{" "}
                      <span className={styles.create__upload_required}>
                        (required)
                      </span>
                    </label>
                    <span>
                      A percentage fee that you receive for all future sales of
                      this piece.
                    </span>
                    <input
                      id="percentage"
                      type="number"
                      placeholder="Enter percentage"
                      min="0"
                      max="100"
                      value={share}
                      onChange={(e) => setShare(e.target.value)}
                    />
                    {share > 100 || share < 0 ? (
                      // If share is not 0...100%, show error
                      <span className={styles.create__error}>
                        Percentage fee must be between 0% - 100%.
                      </span>
                    ) : null}
                  </div>
                </div>

                {/* Media mint button */}
                <div>
                  <button
                    onClick={mintWithLoading}
                    disabled={
                      share > 100 || // Fee share above 100%
                      share < 0 || // Fee share below 0%
                      name === "" || // No name
                      !share || // No fee share provided
                      !upload || // No uploaded file
                      loading // Global loading state
                    }
                  >
                    {loading ? "Minting..." : "Mint Media"}
                  </button>
                </div>
              </div>
            </div>

            {/* Preview grid section */}
            <div className={styles.create__grid_right}>
              <h2>Preview</h2>
              <div className={styles.create__preview}>
                {/* Display post with dynamic content to preview */}
                <Post
                  creatorAddress={address}
                  ownerAddress={address}
                  createdAtTimestamp={Date.now() / 1000}
                  mimeType={upload ? upload.type : ""}
                  contentURI={
                    upload && upload.type
                      ? // If file type is of text
                        upload.type.startsWith("text")
                        ? // Send text content instead of
                          uploadText
                        : // URL to resource
                          URL.createObjectURL(upload)
                      : ""
                  }
                  name={name ? name : ""}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
